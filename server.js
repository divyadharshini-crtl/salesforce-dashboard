import express from 'express'
import cors from 'cors'
import jsforce from 'jsforce'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.get('/api/config', (req, res) => {
    res.json({
        clientId: process.env.SF_CLIENT_ID || 'Not Configured',
        clientSecret: process.env.SF_CLIENT_SECRET || 'Not Configured'
    })
})

const DASHBOARD_URL = 'http://localhost:9000'

// Create the unified OAuth2 client config
const clientId = process.env.SF_CLIENT_ID
const clientSecret = process.env.SF_CLIENT_SECRET
const redirectUri = `http://localhost:${PORT}/oauth2/callback`
const loginUrl = 'https://login.salesforce.com'

// Store tokens and PKCE verifier temporarily in memory
let globalConn = null;
let pkceVerifier = '';

// ==========================================
// DELETION DEPENDENCY MAPPING
// ==========================================
const DEPENDENCIES = {
    'Account': [
        { type: 'Case', field: 'AccountId' },
        { type: 'Opportunity', field: 'AccountId' },
        { type: 'Contact', field: 'AccountId' },
        { type: 'Task', field: 'WhatId' },
        { type: 'Event', field: 'WhatId' }
    ],
    'Contact': [
        { type: 'Case', field: 'ContactId' },
        { type: 'Task', field: 'WhoId' },
        { type: 'Event', field: 'WhoId' }
    ],
    'Lead': [
        { type: 'Task', field: 'WhoId' },
        { type: 'Event', field: 'WhoId' }
    ],
    'Opportunity': [
        { type: 'Task', field: 'WhatId' },
        { type: 'Event', field: 'WhatId' }
    ]
}

/**
 * Recursively cleans up blocking child records before deleting target records.
 * @param {jsforce.Connection} conn 
 * @param {string} sobject - The API Name of the parent object (e.g., 'Account')
 * @param {string|string[]} ids - Record ID or array of IDs to destroy
 */
async function smartDestroy(conn, sobject, ids) {
    const idArray = Array.isArray(ids) ? ids : [ids];
    if (idArray.length === 0) return { success: true };

    const children = DEPENDENCIES[sobject] || [];

    for (const id of idArray) {
        for (const child of children) {
            try {
                const records = await conn.sobject(child.type).find({ [child.field]: id }, 'Id').execute();
                if (records.length > 0) {
                    const childIds = records.map(r => r.Id);
                    console.log(`[SmartDestroy] 🧹 Cleaning up ${records.length} ${child.type} records for ${sobject}:${id}`);
                    // Recurse into children in case THEY have children (e.g. Contacts have Cases)
                    await smartDestroy(conn, child.type, childIds);
                }
            } catch (err) {
                console.warn(`[SmartDestroy] ⚠️ Cleanup warning for ${child.type}: ${err.message}`);
            }
        }
    }

    // Now destroy the actual target(s)
    return await conn.sobject(sobject).destroy(idArray);
}

function generatePKCE() {
    const verifier = crypto.randomBytes(32).toString('base64url')
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
    return { verifier, challenge }
}

// ==========================================
// 1. Redirect to Salesforce Login Page (With PKCE)
// ==========================================
app.get('/auth', (req, res) => {
    const pkce = generatePKCE()
    pkceVerifier = pkce.verifier

    console.log('[OAuth Web Flow] Redirecting to Salesforce for user login with PKCE...')

    const authUrl = `${loginUrl}/services/oauth2/authorize?` + new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'api refresh_token offline_access',
        code_challenge: pkce.challenge,
        code_challenge_method: 'S256'
    }).toString()

    res.redirect(authUrl)
})

// ==========================================
// 2. Handle the Callback from Salesforce
// ==========================================
app.get('/oauth2/callback', async (req, res) => {
    const code = req.query.code
    if (!code) return res.status(400).send('Authentication code missing.')

    console.log('[OAuth Web Flow] 🔐 Received Auth Code. Trading for token using PKCE Verifier...')

    try {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code_verifier: pkceVerifier
        })

        const tokenRes = await fetch(`${loginUrl}/services/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })

        const tokenData = await tokenRes.json()
        if (!tokenRes.ok) throw new Error(tokenData.error_description || tokenData.error || 'Token exchange failed')

        // Auth was successful! Init jsforce
        globalConn = new jsforce.Connection({
            instanceUrl: tokenData.instance_url,
            accessToken: tokenData.access_token
        })

        console.log(`[OAuth Web Flow] ✅ Successfully authenticated! Instance: ${tokenData.instance_url}`)
        res.redirect(`${DASHBOARD_URL}?oauth=success`)
    } catch (err) {
        console.error('OAuth Callback Error:', err)
        res.redirect(`${DASHBOARD_URL}?oauth=error&msg=${encodeURIComponent(err.message)}`)
    }
})

// ==========================================
// 3. API endpoint for React to fetch the Leads
// ==========================================
app.get('/api/leads', async (req, res) => {
    if (!globalConn) {
        return res.status(401).json({ success: false, error: 'Not authenticated. Please connect via Salesforce first.' })
    }

    try {
        console.log(`[OAuth API] 📊 Fetching leads...`)
        const query = `
      SELECT Id, FirstName, LastName, Company, Email, Status, Rating, LeadSource, Industry, CreatedDate 
      FROM Lead 
      ORDER BY CreatedDate DESC
      LIMIT 100
    `
        const result = await globalConn.query(query)

        const leads = result.records.map(r => ({
            ...r,
            Name: `${r.FirstName || ''} ${r.LastName || ''}`.trim() || r.Company || 'Unknown'
        }))

        console.log(`[OAuth API] ✅ Returned ${leads.length} leads.`)
        res.json({ success: true, totalSize: result.totalSize, leads: leads })

    } catch (error) {
        console.error('Lead Fetching Error:', error)
        res.status(500).json({ success: false, error: error.message })
    }
})

// ==========================================
// 4. API Endpoints for Write Access (Chatbot Agent)
// ==========================================

// Create Lead
app.post('/api/leads', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const lastName = body.LastName || body.lastName
        const company = body.Company || body.company

        if (!lastName || !company) throw new Error('LastName and Company are required.')

        const record = { ...body, LeadSource: body.LeadSource || body.leadSource || 'Chatbot AI' }
        // Remove lowercase keys to avoid confusion if both exist
        delete record.lastName; delete record.firstName; delete record.company; delete record.email; delete record.phone; delete record.leadSource;

        const result = await globalConn.sobject('Lead').create({
            ...record,
            LastName: lastName,
            Company: company
        })

        if (result.success) {
            console.log(`[OAuth API] 🟢 Created Lead: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Create Account
app.post('/api/accounts', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const name = body.Name || body.name
        if (!name) throw new Error('Account Name is required.')

        const record = { ...body }
        delete record.name; delete record.industry; delete record.website; delete record.phone;

        const result = await globalConn.sobject('Account').create({
            ...record,
            Name: name
        })
        if (result.success) {
            console.log(`[OAuth API] 🏢 Created Account: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Create Contact
app.post('/api/contacts', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const lastName = body.LastName || body.lastName
        if (!lastName) throw new Error('Last Name is required.')

        const record = { ...body }
        delete record.firstName; delete record.lastName; delete record.email; delete record.phone; delete record.accountId;

        const result = await globalConn.sobject('Contact').create({
            ...record,
            LastName: lastName
        })
        if (result.success) {
            console.log(`[OAuth API] 👥 Created Contact: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Create Event
app.post('/api/events', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const subject = body.Subject || body.subject
        const startDateTime = body.StartDateTime || body.startDateTime
        const endDateTime = body.EndDateTime || body.endDateTime
        const description = body.Description || body.description
        const location = body.Location || body.location

        if (!subject || !startDateTime || !endDateTime) throw new Error('Subject, Start Time, and End Time are required.')
        const result = await globalConn.sobject('Event').create({
            Subject: subject,
            StartDateTime: startDateTime,
            EndDateTime: endDateTime,
            Description: description || '',
            Location: location || ''
        })
        if (result.success) {
            console.log(`[OAuth API] 📅 Created Event: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Update Lead
app.put('/api/leads/:id', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const payload = { Id: req.params.id }
        
        // Handle both lowercase and ProperCase from frontend
        if (body.Status || body.status) payload.Status = body.Status || body.status
        if (body.Rating || body.rating) payload.Rating = body.Rating || body.rating
        if (body.Company || body.company) payload.Company = body.Company || body.company
        if (body.FirstName || body.firstName) payload.FirstName = body.FirstName || body.firstName
        if (body.LastName || body.lastName) payload.LastName = body.LastName || body.lastName
        if (body.Email || body.email) payload.Email = body.Email || body.email
        if (body.Phone || body.phone) payload.Phone = body.Phone || body.phone

        const result = await globalConn.sobject('Lead').update(payload)
        if (result.success) {
            console.log(`[OAuth API] 🔵 Updated Lead: ${result.id}`)
            res.json({ success: true })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Delete Lead
app.delete('/api/leads/:id', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.sobject('Lead').destroy(req.params.id)
        if (result.success) {
            console.log(`[OAuth API] 🔴 Deleted Lead: ${result.id}`)
            res.json({ success: true })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// == SALESFORCE OPPORTUNITY ENDPOINTS ==

// == SALESFORCE OPPORTUNITY ENDPOINTS ==

// Fetch Opportunities
app.get('/api/opportunities', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Amount, StageName, CloseDate, CreatedDate, IsClosed, IsWon, Probability FROM Opportunity ORDER BY CreatedDate DESC LIMIT 100")
        res.json({ success: true, opportunities: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Fetch Accounts
app.get('/api/accounts', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Industry, Type, Website, Phone, CreatedDate FROM Account ORDER BY CreatedDate DESC LIMIT 100")
        res.json({ success: true, accounts: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Fetch Contacts
app.get('/api/contacts', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Title, Account.Name, Email, Phone FROM Contact ORDER BY CreatedDate DESC LIMIT 100")
        res.json({ success: true, contacts: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Fetch Tasks
app.get('/api/tasks', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Subject, Status, Priority, ActivityDate FROM Task ORDER BY CreatedDate DESC LIMIT 100")
        res.json({ success: true, tasks: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Fetch Events (Calendar)
app.get('/api/events', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Subject, StartDateTime, EndDateTime, Location FROM Event ORDER BY StartDateTime ASC LIMIT 100")
        res.json({ success: true, events: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Create Task
app.post('/api/tasks', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const subject = body.Subject || body.subject
        if (!subject) throw new Error('Subject is required.')

        const record = { ...body }
        delete record.subject; delete record.status; delete record.priority; delete record.dueDate;

        const result = await globalConn.sobject('Task').create({
            ...record,
            Subject: subject,
            Status: body.Status || body.status || 'Not Started',
            Priority: body.Priority || body.priority || 'Normal'
        })
        if (result.success) res.json({ success: true, id: result.id })
        else throw new Error(result.errors.join(', '))
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Fetch Groups
app.get('/api/groups', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Description, CollaborationType FROM CollaborationGroup ORDER BY CreatedDate DESC LIMIT 20")
        res.json({ success: true, groups: result.records })
    } catch (error) { res.status(500).json({ success: false, error: error.message }) }
})

// Create Opportunity
app.post('/api/opportunities', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const body = req.body
        const name = body.Name || body.name
        const stage = body.StageName || body.stage
        const closeDate = body.CloseDate || body.closeDate

        if (!name || !stage || !closeDate) throw new Error('Name, Stage, and Close Date are required.')

        const record = { ...body }
        delete record.name; delete record.amount; delete record.stage; delete record.closeDate;

        const result = await globalConn.sobject('Opportunity').create({
            ...record,
            Name: name,
            StageName: stage,
            CloseDate: closeDate
        })

        if (result.success) {
            console.log(`[OAuth API] 💼 Created Opportunity: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// == NEW SALESFORCE CRM SUITE ENDPOINTS ==

// 1. Get List of Reports (Strictly filtering for User-owned custom reports)
app.get('/api/reports', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        // We filter for reports owned by Users (not system/folders) to ensure they are deletable and custom.
        const result = await globalConn.query("SELECT Id, Name, Format, LastRunDate FROM Report WHERE Owner.Type = 'User' ORDER BY LastRunDate DESC LIMIT 50")
        res.json({ success: true, reports: result.records })
    } catch (error) {
        // Fallback if the Owner.Type filter is not supported in this org's API version
        try {
            const fallback = await globalConn.query("SELECT Id, Name, Format, LastRunDate FROM Report WHERE NamespacePrefix = NULL ORDER BY LastRunDate DESC LIMIT 20")
            res.json({ success: true, reports: fallback.records })
        } catch (e) {
            res.status(500).json({ success: false, error: error.message })
        }
    }
})

// 2. Get List of Campaigns
app.get('/api/campaigns', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Status, Type, StartDate, EndDate FROM Campaign ORDER BY CreatedDate DESC LIMIT 50")
        res.json({ success: true, campaigns: result.records })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// 3. Get List of Files (ContentDocuments)
app.get('/api/files', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Title, FileExtension, ContentSize, LastModifiedDate FROM ContentDocument ORDER BY LastModifiedDate DESC LIMIT 50")
        res.json({ success: true, files: result.records })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// 4. Create Collaboration Group
app.post('/api/groups', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const { name, description, type } = req.body
        if (!name) throw new Error('Group Name is required.')
        const result = await globalConn.sobject('CollaborationGroup').create({
            Name: name,
            Description: description || '',
            CollaborationType: type || 'Public' // Public or Private
        })
        if (result.success) {
            console.log(`[OAuth API] 🏛️ Created Group: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// 3. Upload File (ContentVersion)
app.post('/api/files', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const { name, content, title } = req.body
        if (!name || !content) throw new Error('File name and base64 content are required.')

        // ContentVersion creation in Salesforce
        // VersionData is the base64 content
        const result = await globalConn.sobject('ContentVersion').create({
            PathOnClient: name,
            Title: title || name,
            VersionData: content
        })

        if (result.success) {
            console.log(`[OAuth API] 📄 Uploaded File: ${result.id}`)
            res.json({ success: true, id: result.id })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// == GENERIC CRUD ENDPOINTS ==

// Generic Update
app.put('/api/:object/:id', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        let { object, id } = req.params
        const mapping = {
            'leads': 'Lead', 'lead': 'Lead',
            'opportunities': 'Opportunity', 'opportunity': 'Opportunity',
            'accounts': 'Account', 'account': 'Account',
            'contacts': 'Contact', 'contact': 'Contact',
            'tasks': 'Task', 'task': 'Task',
            'events': 'Event', 'event': 'Event'
        }
        let properObject = mapping[object.toLowerCase()] || (object.charAt(0).toUpperCase() + object.slice(1))

        const payload = { ...req.body, Id: id }
        const result = await globalConn.sobject(properObject).update(payload)
        if (result.success) {
            console.log(`[OAuth API] 🔵 Updated ${properObject}: ${id}`)
            res.json({ success: true })
        } else throw new Error(result.errors.join(', '))
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// Generic Delete
// Bulk Delete
app.post('/api/:object/bulk-delete', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        let { object } = req.params
        const mapping = {
            'leads': 'Lead', 'lead': 'Lead',
            'opportunities': 'Opportunity', 'opportunity': 'Opportunity',
            'accounts': 'Account', 'account': 'Account',
            'contacts': 'Contact', 'contact': 'Contact',
            'reports': 'Report', 'report': 'Report',
            'tasks': 'Task', 'task': 'Task',
            'events': 'Event', 'event': 'Event',
            'campaigns': 'Campaign', 'campaign': 'Campaign',
            'groups': 'CollaborationGroup', 'group': 'CollaborationGroup',
            'files': 'ContentDocument', 'file': 'ContentDocument'
        }
        const properObject = mapping[object.toLowerCase()] || (object.charAt(0).toUpperCase() + object.slice(1))

        console.log(`[OAuth API] 🧨 Initiating Bulk Delete for: ${properObject}`)
        
        // Fetch existing records first to ensure we have something to delete and for better logging
        const records = await globalConn.sobject(properObject).find({}, 'Id').execute();
        console.log(`[OAuth API] 🔍 Found ${records.length} records to delete in ${properObject}.`)

        if (records.length === 0) {
            return res.json({ success: true, count: 0, message: 'No records found to delete.' });
        }

        // Use smartDestroy to handle dependencies (like cases on accounts)
        const ids = records.map(r => r.Id);
        const result = await smartDestroy(globalConn, properObject, ids);
        
        // Handle results which might be an array or a single object
        const resultsArray = Array.isArray(result) ? result : [result];
        const successCount = resultsArray.filter(r => r.success).length;
        const errorCount = resultsArray.length - successCount;

        console.log(`[OAuth API] 💥 Bulk Delete Complete for ${properObject}. Success: ${successCount}, Errors: ${errorCount}`)
        
        if (errorCount > 0) {
            const failedRecord = resultsArray.find(r => !r.success);
            const errorDetail = failedRecord?.errors ? JSON.stringify(failedRecord.errors) : 'Unknown error';
            console.error(`[OAuth API] ❌ Deletion partial failure for ${properObject}. Sample Error: ${errorDetail}`);
            
            // SPECIAL CASE: If all failures are due to read-only/system records, don't crash the UI with a scary error
            const isAllReadOnly = resultsArray.every(r => r.success || (r.errors && JSON.stringify(r.errors).includes('INSUFFICIENT_ACCESS_OR_READONLY')));
            
            if (isAllReadOnly) {
                return res.json({ 
                    success: true, 
                    count: successCount, 
                    totalAttempted: ids.length,
                    note: 'Some system-protected records were skipped.' 
                });
            }

            if (successCount === 0 && ids.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Failed to delete any ${properObject} records. Salesforce Error: ${errorDetail}`,
                    count: 0,
                    totalAttempted: ids.length
                });
            }
        }

        res.json({ success: true, count: successCount, totalAttempted: resultsArray.length })
    } catch (error) {
        console.error(`[OAuth API] ❌ Bulk Delete CRASH for ${req.params.object}:`, error)
        res.status(500).json({ success: false, error: error.message })
    }
})

app.post('/api/nuke-all', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const objectsToWipe = ['Lead', 'Opportunity', 'Account', 'Contact', 'Task', 'Event', 'Campaign', 'CollaborationGroup', 'ContentDocument']
        const results = {}

        console.log(`[OAuth API] ☢️ GLOBAL NUKE INITIATED ☢️`)

        for (const obj of objectsToWipe) {
            try {
                const records = await globalConn.sobject(obj).find({}, 'Id').execute()
                if (records.length > 0) {
                    const ids = records.map(r => r.Id)
                    console.log(`[SmartNuke] 🧨 Wiping ${ids.length} records for ${obj}`);
                    
                    // Split into chunks for REST API safety, but use smartDestroy for each chunk
                    for (let i = 0; i < ids.length; i += 200) {
                        const chunk = ids.slice(i, i + 200)
                        await smartDestroy(globalConn, obj, chunk)
                    }
                    results[obj] = records.length
                } else {
                    results[obj] = 0
                }
            } catch (err) {
                console.error(`Error wiping ${obj}:`, err.message)
                results[obj] = `Error: ${err.message}`
            }
        }

        console.log(`[OAuth API] ✅ Global Nuke Complete. Records cleared:`, results)
        res.json({ success: true, results })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.delete('/api/:object/:id', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        let { object, id } = req.params
        const mapping = {
            'leads': 'Lead', 'lead': 'Lead',
            'opportunities': 'Opportunity', 'opportunity': 'Opportunity',
            'accounts': 'Account', 'account': 'Account',
            'contacts': 'Contact', 'contact': 'Contact',
            'tasks': 'Task', 'task': 'Task',
            'events': 'Event', 'event': 'Event'
        }
        const properObject = mapping[object.toLowerCase()] || (object.charAt(0).toUpperCase() + object.slice(1))

        const result = await smartDestroy(globalConn, properObject, id)
        const resObj = Array.isArray(result) ? result[0] : result
        
        if (resObj.success) {
            console.log(`[OAuth API] 🔴 Deleted ${properObject}: ${id}`)
            res.json({ success: true })
        } else {
            const errMsg = resObj.errors?.join(', ') || 'Unknown Salesforce deletion error'
            throw new Error(errMsg)
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Salesforce Proxy Server running on all interfaces at port ${PORT}`)
    console.log(`🔗 Primary Link: http://localhost:${PORT}/auth`)
    console.log(`📡 Network Link: http://192.168.97.193:${PORT}/auth`)
})
