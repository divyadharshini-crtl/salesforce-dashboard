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

const DASHBOARD_URL = 'http://localhost:9000'

// Create the unified OAuth2 client config
const clientId = process.env.SF_CLIENT_ID
const clientSecret = process.env.SF_CLIENT_SECRET
const redirectUri = `http://localhost:${PORT}/oauth2/callback`
const loginUrl = 'https://login.salesforce.com'

// Store tokens and PKCE verifier temporarily in memory
let globalConn = null;
let pkceVerifier = '';

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
        const { lastName, company, firstName, email, phone } = req.body
        if (!lastName || !company) throw new Error('LastName and Company are required.')

        const result = await globalConn.sobject('Lead').create({
            LastName: lastName,
            Company: company,
            FirstName: firstName || '',
            Email: email || '',
            Phone: phone || '',
            LeadSource: 'Chatbot AI'
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
        const { name, industry, website, phone } = req.body
        if (!name) throw new Error('Account Name is required.')
        const result = await globalConn.sobject('Account').create({
            Name: name,
            Industry: industry || '',
            Website: website || '',
            Phone: phone || ''
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
        const { firstName, lastName, email, phone, accountId } = req.body
        if (!lastName) throw new Error('Last Name is required.')
        const result = await globalConn.sobject('Contact').create({
            FirstName: firstName || '',
            LastName: lastName,
            Email: email || '',
            Phone: phone || '',
            AccountId: accountId || null
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
        const { subject, startDateTime, endDateTime, description, location } = req.body
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
        const { status, rating, company, firstName, lastName, email, phone } = req.body
        const payload = { Id: req.params.id }
        if (status) payload.Status = status
        if (rating) payload.Rating = rating
        if (company) payload.Company = company
        if (firstName) payload.FirstName = firstName
        if (lastName) payload.LastName = lastName
        if (email) payload.Email = email
        if (phone) payload.Phone = phone

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
        const result = await globalConn.query("SELECT Id, Name, Amount, StageName, CloseDate, CreatedDate, IsClosed, IsWon FROM Opportunity ORDER BY CreatedDate DESC LIMIT 100")
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
        const { subject, status, priority, dueDate } = req.body
        if (!subject) throw new Error('Subject is required.')
        const result = await globalConn.sobject('Task').create({
            Subject: subject,
            Status: status || 'Not Started',
            Priority: priority || 'Normal',
            ActivityDate: dueDate || null
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
        const { name, amount, stage, closeDate } = req.body
        if (!name || !stage || !closeDate) throw new Error('Name, Stage, and Close Date are required.')

        const result = await globalConn.sobject('Opportunity').create({
            Name: name,
            Amount: amount || 0,
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

// 1. Get List of Reports
app.get('/api/reports', async (req, res) => {
    if (!globalConn) return res.status(401).json({ success: false, error: 'Not authenticated' })
    try {
        const result = await globalConn.query("SELECT Id, Name, Format, LastRunDate FROM Report ORDER BY LastRunDate DESC LIMIT 20")
        res.json({ success: true, reports: result.records })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

// 2. Create Collaboration Group
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Salesforce Proxy Server running on all interfaces at port ${PORT}`)
    console.log(`🔗 Primary Link: http://localhost:${PORT}/auth`)
    console.log(`📡 Network Link: http://192.168.97.193:${PORT}/auth`)
})
