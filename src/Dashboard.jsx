import React, { useState, useEffect, useRef } from 'react'
import { 
  Zap, Bell, Search, Calendar, ChevronDown, Download, Upload, Plus, 
  Search as SearchIcon, Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Users, PieChart, DollarSign, Settings, LogOut,
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, 
  MessageSquare, Send, Bot, RefreshCw, Smartphone, Globe, Shield, 
  Lock, Key, FileText, Share2, Mail, ExternalLink, Calendar as CalendarIcon,
  Wifi, Target, Zap as ZapIcon, Briefcase, Building2, Contact, 
  ClipboardList, Users2, FileDown, UploadCloud, BarChart3, 
  Palette, User, Database, BellRing, Sun, Moon, Sparkles, Mic2, ShieldAlert, Flame, BookOpen, Layers, ChevronRight, AlertTriangle,
  Cloud, UserPlus
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, Legend,
  ComposedChart
} from 'recharts'

// ──────────────────────────────────────────────────────────────
// MOCK DATA & CONSTANTS
// ──────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 45000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 60000 },
  { month: 'Jun', revenue: 67000, target: 65000 },
]

const channelData = [
  { name: 'Direct', value: 35, color: '#4F46E5' },
  { name: 'Search', value: 25, color: '#10B981' },
  { name: 'Social', value: 20, color: '#F59E0B' },
  { name: 'Referral', value: 15, color: '#EC4899' },
  { name: 'Email', value: 5, color: '#06B6D4' },
]

const conversionData = [
  { stage: 'New', value: 2400 },
  { stage: 'Open', value: 1850 },
  { stage: 'Working', value: 1200 },
  { stage: 'Qualified', value: 900 },
  { stage: 'Converted', value: 450 },
]

const customerRows = [
  { name: 'Alex Rivera', company: 'TechFlow Inc.', plan: 'Enterprise', mrr: '$2,500', health: 'Healthy', joined: 'Mar 12, 2024' },
  { name: 'Sarah Miller', company: 'CloudScale', plan: 'Pro', mrr: '$1,200', health: 'At Risk', joined: 'Feb 28, 2024' },
  { name: 'James Chen', company: 'Innovate AI', plan: 'Enterprise', mrr: '$4,800', health: 'Healthy', joined: 'Apr 05, 2024' },
  { name: 'Emma Wilson', company: 'SwiftPay', plan: 'Basic', mrr: '$450', health: 'Healthy', joined: 'Jan 15, 2024' },
  { name: 'Michael Brown', company: 'Global Logistics', plan: 'Pro', mrr: '$1,200', health: 'Churned', joined: 'Dec 10, 2023' },
]

const navItems = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Zap, label: 'Opportunities' },
  { icon: Building2, label: 'Accounts' },
  { icon: Users, label: 'Customers' },
  { icon: Contact, label: 'Contacts' },
  { icon: PieChart, label: 'Analytics' },
  { icon: DollarSign, label: 'Revenue' },
  { icon: Target, label: 'Campaigns' },
  { icon: ClipboardList, label: 'Tasks' },
  { icon: CalendarIcon, label: 'Calendar' },
  { icon: Users2, label: 'Groups' },
  { icon: FileText, label: 'Files' },
  { icon: BarChart3, label: 'Reports' },
  { icon: Share2, label: 'Integrations' },
  { icon: Settings, label: 'Settings' },
]

const activityFeed = [
  { icon: CheckCircle, text: 'New enterprise deal closed by Sarah', time: '2 mins ago', color: '#10B981' },
  { icon: AlertCircle, text: 'Lead churn risk detected for CloudScale', time: '1 hour ago', color: '#F59E0B' },
  { icon: Plus, text: 'New lead "Invision Lab" added from Search', time: '3 hours ago', color: '#4F46E5' },
]

const kpis = [
  { label: 'Pipeline Value', value: '$1.2M', change: '+12.5%', positive: true, icon: DollarSign, color: '#4F46E5', bgColor: '#EEF2FF' },
  { label: 'Leads', value: '2,400', change: '+14.2%', positive: true, icon: Users, color: '#10B981', bgColor: '#ECFDF5' },
  { label: 'Avg Deal Size', value: '$18.5k', change: '-2.4%', positive: false, icon: TrendingUp, color: '#F59E0B', bgColor: '#FFFBEB' },
  { label: 'Conversion', value: '18.5%', change: '+4.8%', positive: true, icon: Zap, color: '#06B6D4', bgColor: '#ECFEFF' },
]

const aiResponses = {
  "how are my leads performing?": "Your leads are currently up **14.2%** this month. The highest quality leads are originating from **Direct** and **Search** channels, with an average conversion rate of **18.5%**. I recommend focusing on the 'Qualified' segment as it has grown by 8%.",
  "project revenue for next month": "Based on current pipeline acceleration (+12.5%) and historical conversion data, I project next month's revenue to be approximately **$72,400**, representing an 8% growth over this month's actuals.",
  "who are my top at-risk customers?": "I've identified **CloudScale** as your primary at-risk account. Their engagement velocity has dropped by 30% over the last 14 days, and their NPS score recently decreased to 6.2. I've scheduled a high-priority task for Sarah Miller to reach out.",
  "should i increase spend on social?": "While Social channels account for 20% of your leads, the customer acquisition cost (CAC) is 15% higher than Search. However, the lifetime value (LTV) of social leads is 22% higher. I recommend a **moderate 10% increase** in spend to test scaling.",
  "create a new lead": { type: 'leadForm' },
  "create a new opportunity": { type: 'opportunityForm' },
  "create a new task": { type: 'taskForm' },
  "create a new account": { type: 'accountForm' },
  "create a new contact": { type: 'contactForm' },
  "schedule a meeting": { type: 'eventForm' },
  "upload a file": { type: 'fileForm' },
  "create a new group": { type: 'groupForm' }
}

const fallbackLeads = [
  { Name: 'Mock John', Company: 'Mock Corp', Email: 'john@mock.com', Status: 'New', Rating: 'Hot' },
  { Name: 'Mock Jane', Company: 'Mock LLC', Email: 'jane@mock.com', Status: 'Working', Rating: 'Warm' },
]

// ──────────────────────────────────────────────────────────────
// UTILS & COMPONENTS
// ──────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-gray-50 rounded-2xl">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <p className="text-sm font-extrabold text-gray-900">{p.name}: {typeof p.value === 'number' ? `$${p.value.toLocaleString()}` : p.value}</p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const PlanBadge = ({ plan }) => (
  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
    plan === 'Enterprise' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
    plan === 'Pro' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
    'bg-gray-100 text-gray-600'
  }`}>
    {plan}
  </span>
)

const HealthBadge = ({ status }) => (
  <span className={`flex items-center gap-1.5 text-[11px] font-bold ${
    status === 'Healthy' ? 'text-emerald-600' :
    status === 'At Risk' ? 'text-amber-500' :
    status === 'Churned' ? 'text-gray-400' : 'text-red-500'
  }`}>
    <div className={`w-1.5 h-1.5 rounded-full ${
      status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
      status === 'At Risk' ? 'bg-amber-500' :
      status === 'Churned' ? 'bg-gray-300' : 'bg-red-500'
    }`} />
    {status}
  </span>
)

const StageBadge = ({ stage }) => {
  const colors = {
    'Qualification': 'bg-blue-50 text-blue-600 border-blue-100',
    'Needs Analysis': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'Proposal/Price Quote': 'bg-purple-50 text-purple-600 border-purple-100',
    'Negotiation/Review': 'bg-amber-50 text-amber-600 border-amber-100',
    'Closed Won': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Closed Lost': 'bg-red-50 text-red-600 border-red-100'
  }
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[stage] || 'bg-gray-50 text-gray-500'}`}>{stage}</span>
}

function getLeadValue(lead) {
  const r = (lead.Rating || lead.rating || '').toLowerCase()
  if (r === 'hot') return 5000 + (Math.random() * 15000)
  if (r === 'warm') return 1000 + (Math.random() * 4000)
  return 200 + (Math.random() * 800)
}

function buildDashboardData(leads, opps) {
  // KPIs
  const totalLeads = leads.length
  const hotLeads = leads.filter(l => (l.Rating || l.rating || '').toLowerCase() === 'hot').length
  const totalPipeline = opps.reduce((sum, o) => sum + (o.Amount || 0), 0)
  const convertedCount = leads.filter(l => (l.Status || '').includes('Converted')).length

  const dynKPIs = [
    { label: 'Pipeline Value', value: `$${(totalPipeline / 1000000).toFixed(1)}M`, change: '+8.2%', positive: true, icon: DollarSign, color: '#4F46E5', bgColor: '#EEF2FF', live: true },
    { label: 'Salesforce Leads', value: totalLeads.toLocaleString(), change: '+21.0%', positive: true, icon: Users, color: '#10B981', bgColor: '#ECFDF5', live: true },
    { label: 'Hot Leads', value: hotLeads, change: '+5.4%', positive: true, icon: Flame, color: '#F59E0B', bgColor: '#FFFBEB', live: true },
    { label: 'Converted', value: convertedCount, change: '+2.1%', positive: true, icon: Zap, color: '#06B6D4', bgColor: '#ECFEFF', live: true },
  ]

  // Revenue (Mock Trend based on real totals)
  const baseRevenue = [
    { month: 'Jan', revenue: 45000, target: 40000 },
    { month: 'Feb', revenue: 52000, target: 45000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: totalPipeline * 0.05, target: 55000 },
  ]

  // Customer Rows from Leads
  const customerRowsSF = leads.slice(0, 15).map(l => ({
    name: l.Name || 'Unknown Name',
    company: l.Company || 'N/A',
    plan: l.Rating === 'Hot' ? 'Enterprise' : 'Pro',
    mrr: `$${Math.floor(getLeadValue(l)).toLocaleString()}`,
    health: l.Rating === 'Hot' ? 'Healthy' : (l.Rating === 'Warm' ? 'Healthy' : 'At Risk'),
    joined: new Date(l.CreatedDate).toLocaleDateString()
  }))

  const conversionDataSF = [
    { stage: 'New', value: leads.length },
    { stage: 'Open', value: Math.floor(leads.length * 0.7) },
    { stage: 'Working', value: Math.floor(leads.length * 0.4) },
    { stage: 'Qualified', value: Math.floor(leads.length * 0.25) },
    { stage: 'Converted', value: convertedCount },
  ]

  const activitySF = leads.slice(0, 5).map(l => ({
    icon: User,
    text: `New lead sync: ${l.Name} from ${l.Company}`,
    time: 'Just now',
    color: '#4F46E5'
  }))

  return { dynKPIs, revenueDataSF: baseRevenue, customerRowsSF, conversionDataSF, activitySF }
}

function generateAIReply(query, sfLeads) {
  const l = query.toLowerCase()
  
  // Create / Update / Delete detection
  if (l.includes('create') || l.includes('add') || l.includes('new')) {
    if (l.includes('lead')) return { role: 'ai', text: "Of course! Let's get that new record into Salesforce. Please fill out the lead profile below:", type: 'leadForm' }
    if (l.includes('opp')) return { role: 'ai', text: "Starting a new Opportunity block. What are the deal details?", type: 'opportunityForm' }
    if (l.includes('task')) return { role: 'ai', text: "Scheduling a new follow-up. Please set the priority and due date:", type: 'taskForm' }
    if (l.includes('account')) return { role: 'ai', text: "Creating a new Corporate Account. Please provide organization details:", type: 'accountForm' }
    if (l.includes('contact')) return { role: 'ai', text: "Adding a new Relationship contact. Who are we connecting with?", type: 'contactForm' }
    if (l.includes('event') || l.includes('meeting')) return { role: 'ai', text: "Blocking time for a new Event. Please set the agenda:", type: 'eventForm' }
    if (l.includes('group')) return { role: 'ai', text: "Initializing a new Chatter collaboration hub. Set the group parameters:", type: 'groupForm' }
    if (l.includes('file') || l.includes('upload')) return { role: 'ai', text: "Ready for document ingestion. Please select a file to push to Salesforce:", type: 'fileForm' }
  }

  // Update logic: "update john doe"
  if (l.includes('update') || l.includes('edit') || l.includes('change')) {
    const nameMatch = query.split(' ').slice(1).join(' ').trim()
    if (nameMatch && sfLeads) {
      const matches = sfLeads.filter(le => le.Name.toLowerCase().includes(nameMatch.toLowerCase()))
      if (matches.length === 1) return { role: 'ai', text: `Found ${matches[0].Name}. Opening the record editor...`, type: 'update', lead: matches[0] }
      if (matches.length > 1) return { role: 'ai', text: `I found multiple records for "${nameMatch}". Please select the correct one:`, type: 'selector', subType: 'update', leads: matches }
    }
    return { role: 'ai', text: "I can help you update records. Please specify the lead name, e.g., 'Update John Doe'." }
  }

  // Delete logic
  if (l.includes('delete') || l.includes('remove')) {
    const nameMatch = query.split(' ').slice(1).join(' ').trim()
    if (nameMatch && sfLeads) {
      const matches = sfLeads.filter(le => le.Name.toLowerCase().includes(nameMatch.toLowerCase()))
      if (matches.length === 1) return { role: 'ai', text: `Warning: Deleting ${matches[0].Name} is permanent.`, type: 'delete', lead: matches[0] }
      if (matches.length > 1) return { role: 'ai', text: `Multiple matches for "${nameMatch}". Which should I remove?`, type: 'selector', subType: 'delete', leads: matches }
    }
  }

  // Value query for Leads
  if (l.includes('value of') || l.includes('calculated revenue')) {
    const nameMatch = query.split(' ').slice(-2).join(' ')
    const match = sfLeads?.find(le => le.Name.toLowerCase().includes(nameMatch.toLowerCase()))
    if (match) {
      const val = getLeadValue(match)
      return { role: 'ai', text: `Calculated value for **${match.Name}** is approximately **$${Math.floor(val).toLocaleString()}** based on their **${match.Rating || 'Warm'}** rating.` }
    }
  }

  // Dynamic Q&A
  if (l.includes('total') || l.includes('how many')) {
    if (l.includes('lead')) return { role: 'ai', text: `You currently have **${sfLeads?.length || 0}** leads synced from Salesforce.` }
    if (l.includes('hot')) return { role: 'ai', text: `I've flagged **${sfLeads?.filter(le => (le.Rating || '').toLowerCase() === 'hot').length || 0}** leads as high-intent (Hot).` }
  }

  // Default Fallback
  const response = aiResponses[l]
  if (response) return typeof response === 'string' ? { role: 'ai', text: response } : { role: 'ai', text: "Setting that up for you...", ...response }

  return { role: 'ai', text: "I'm analyzing that data point now... Your workspace seems efficient, but I'd suggest investigating the drop-off in your conversion funnel." }
}

// ──────────────────────────────────────────────────────────────
// CUSTOM VIEWS & SUB-COMPONENTS
// ──────────────────────────────────────────────────────────────

function Integrations({ isConnected, onConnectSF }) {
  const integrations = [
    { name: 'Salesforce', icon: Cloud, desc: 'Sync leads, contacts & opportunities', status: isConnected ? 'Connected' : 'Disconnected', color: isConnected ? 'text-emerald-500' : 'text-indigo-500' },
    { name: 'Slack', icon: MessageSquare, desc: 'Receive real-time AI alerts', status: 'Coming Soon', color: 'text-gray-400' },
    { name: 'Zendesk', icon: CheckCircle, desc: 'Merge support tickets with CRM', status: 'Coming Soon', color: 'text-gray-400' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((app, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${app.color} group-hover:scale-110 transition-transform`}>
              <app.icon size={24} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${app.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
              {app.status}
            </span>
          </div>
          <h4 className="text-base font-bold text-gray-900 mb-1">{app.name}</h4>
          <p className="text-xs text-gray-500 mb-6">{app.desc}</p>
          {app.name === 'Salesforce' && !isConnected ? (
            <button onClick={onConnectSF} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Connect Instance</button>
          ) : (
            <button className="w-full py-2.5 bg-gray-50 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">Configure</button>
          )}
        </div>
      ))}
    </div>
  )
}

function Team() {
    const team = [
        { name: 'Divya Dharshini', role: 'Sales Lead', email: 'divya@corp.com', avatar: 'DD', color: '#4F46E5' },
        { name: 'Sarah Miller', role: 'Account Exec', email: 'sarah@corp.com', avatar: 'SM', color: '#10B981' },
        { name: 'James Chen', role: 'Operations', email: 'james@corp.com', avatar: 'JC', color: '#F59E0B' },
    ]
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-50 bg-[#FAFAFA]">
                <h3 className="text-lg font-bold text-gray-900 font-heading">Workspace Members</h3>
                <p className="text-xs text-gray-400 mt-0.5">Manage permissions and team access levels</p>
            </div>
            <div className="divide-y divide-gray-50">
                {team.map((m, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: m.color }}>{m.avatar}</div>
                            <div><div className="text-sm font-bold text-gray-900">{m.name}</div><div className="text-xs text-gray-400">{m.email}</div></div>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-tight">{m.role}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Campaigns({ isConnected, leads }) {
    const campaigns = [
        { name: 'Q2 Enterprise Outreach', status: 'Active', leads: leads.length, conv: '18.5%', color: '#4F46E5' },
        { name: 'SaaS Referral Program', status: 'On Hold', leads: 420, conv: '12.2%', color: '#10B981' },
        { name: 'Tech Conf 2024 Leads', status: 'Completed', leads: 850, conv: '24.8%', color: '#F59E0B' },
    ]
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {campaigns.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100" style={{ background: c.color }}>
                            <Target size={20} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                            {c.status.toUpperCase()}
                        </span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-4">{c.name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Impact</div>
                            <div className="text-sm font-extrabold text-gray-900">{c.leads} leads</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="text-[9px] font-bold text-gray-400 uppercase mb-1">Conv. Rate</div>
                            <div className="text-sm font-extrabold text-emerald-600">{c.conv}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function KPIModal({ kpi, onClose, channelData, onViewDetails }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
            <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-scale-up relative z-10 border border-white/20">
                <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${kpi.color}, #7C3AED)` }}>
                    <div className="absolute top-0 right-0 p-8 opacity-20"><ZapIcon size={120} color="#fff" /></div>
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors">
                        <Plus className="rotate-45" size={18} />
                    </button>
                    <div className="absolute bottom-6 left-8">
                        <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">{kpi.label} Summary</div>
                        <h2 className="text-3xl font-black text-white tracking-tight">{kpi.value}</h2>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Monthly Progression</div>
                            <div className="flex items-center gap-2">
                                <span className={`text-lg font-bold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>{kpi.change}</span>
                                <span className="text-xs text-gray-400 font-medium">vs Last Month</span>
                            </div>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kpi.bgColor}`}>
                            <kpi.icon size={22} style={{ color: kpi.color }} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Top Contributing Channels</h4>
                        <div className="space-y-3">
                            {channelData.slice(0, 3).map((c, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-1.5 px-1">
                                        <span className="text-xs font-bold text-gray-700">{c.name}</span>
                                        <span className="text-xs font-extrabold text-indigo-600">{c.value}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${c.value}%`, background: `linear-gradient(90deg, ${kpi.color}, #7C3AED)` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onViewDetails} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                            View Full Drill-down <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ConnectSalesforceModal({ onClose, onLoad }) {
  const [csvText, setCsvText] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  const handleOAuth = () => {
    window.location.href = 'http://localhost:3001/auth'
  }

  const handleCsvSync = () => {
    if (!csvText.trim()) return alert("Please paste CSV data first!")
    setIsSyncing(true)
    setTimeout(() => {
      const rows = csvText.split('\n').slice(1).filter(r => r.length > 5)
      const leads = rows.map(r => {
        const cols = r.split(',')
        return { Name: cols[0], Company: cols[1], Email: cols[2], Status: cols[3], Rating: cols[4] }
      })
      onLoad(leads, 'csv')
      setIsSyncing(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-lg animate-fade-in" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-slide-up border border-white/20">
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-[30px] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner relative">
              <Cloud size={32} />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] text-white">✓</div>
            </div>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 font-heading mb-3 tracking-tight">Salesforce Hub</h2>
            <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">Connect your life production environment for real-time AI analytics extraction.</p>
          </div>

          <div className="space-y-4">
            <button onClick={handleOAuth} className="w-full p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center gap-6 group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <div className="text-base font-bold mb-0.5">Secure OAuth 2.0 PKCE Sync</div>
                <div className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Recommended · Enterprise Grade</div>
              </div>
              <ChevronRight className="ml-auto opacity-40" />
            </button>

            <div className="relative py-4 flex items-center">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">OR MANUAL INGESTION</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
               <textarea value={csvText} onChange={e => setCsvText(e.target.value)} 
                 placeholder="Paste CSV: Name,Company,Email,Status,Rating..." 
                 className="w-full h-24 bg-transparent outline-none text-xs text-gray-600 font-mono resize-none" />
               <button onClick={handleCsvSync} disabled={isSyncing} className="w-full mt-4 py-3 bg-white border border-gray-200 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                 {isSyncing ? <><RefreshCw className="animate-spin" size={14} /> Analyzing Data...</> : <><Database size={14} /> Parse & Sync CSV</>}
               </button>
            </div>
          </div>

          <button onClick={onClose} className="w-full mt-8 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">Maybe Later</button>
        </div>
      </div>
    </div>
  )
}

function LeadChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.lastName || !form.company) { setError('Last Name and Company are required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`🎉 Successfully created lead **${form.firstName} ${form.lastName}** from **${form.company}**! Sync complete.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-indigo-600">
      <div className="flex items-center gap-2 mb-1">
        <UserPlus size={14} className="text-indigo-600" />
        <span className="text-[10px] font-bold text-indigo-600 uppercase">New Lead Entry</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">First Name</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
            value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Last Name *</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
            value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Company *</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
          value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">
          {loading ? 'Saving...' : 'Save Lead'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  )
}

function AccountChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ name: '', industry: '', website: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name) { setError('Account Name is required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`🏢 Created Account **${form.name}**! It's now live in Salesforce.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-emerald-500">
      <div className="flex items-center gap-2 mb-1">
        <Building2 size={14} className="text-emerald-600" />
        <span className="text-[10px] font-bold text-emerald-600 uppercase">New Account Record</span>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Account Name *</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Industry</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} placeholder="Technology" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1..." />
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
          {loading ? 'Saving...' : 'Create Account'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function ContactChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.lastName) { setError('Last Name is required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`👥 Created Contact **${form.firstName} ${form.lastName}**! Successfully synced.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-amber-500">
      <div className="flex items-center gap-2 mb-1">
        <Contact size={14} className="text-amber-600" />
        <span className="text-[10px] font-bold text-amber-600 uppercase">New Contact Record</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">First Name</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-400"
            value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Last Name *</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-400"
            value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-400"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
          {loading ? 'Saving...' : 'Create Contact'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function EventChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ subject: '', startDateTime: '', endDateTime: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.subject || !form.startDateTime || !form.endDateTime) { setError('Subject and Times are required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`📅 Scheduled **${form.subject}**! Meeting added to Salesforce calendar.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-indigo-500">
      <div className="flex items-center gap-2 mb-1">
        <CalendarIcon size={14} className="text-indigo-600" />
        <span className="text-[10px] font-bold text-indigo-600 uppercase">Schedule New Event</span>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Subject *</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Client Strategy Meeting" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Start Date/Time *</label>
          <input type="datetime-local" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
            value={form.startDateTime} onChange={e => setForm({ ...form, startDateTime: e.target.value })} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">End Date/Time *</label>
          <input type="datetime-local" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
            value={form.endDateTime} onChange={e => setForm({ ...form, endDateTime: e.target.value })} />
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
          {loading ? 'Scheduling...' : 'Confirm Schedule'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function FileChatForm({ onComplete, onCancel }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        setError('File too large (> 5MB). Please select a smaller file.')
        return
      }
      setFile(f)
      setName(f.name)
      setError('')
    }
  }

  const submit = async () => {
    if (!file) { setError('Please select a file first.'); return }
    setLoading(true); setError('')

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Content = reader.result.split(',')[1]
        const res = await fetch('http://localhost:3001/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, content: base64Content })
        })
        const data = await res.json()
        if (data.success) {
          onComplete(`📄 Uploaded **${name}**! It's now available in your Salesforce Files.`)
        } else { setError(data.error); setLoading(false) }
      }
      reader.readAsDataURL(file)
    } catch (e) { setError('Upload failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-blue-400">
      <div className="flex items-center gap-2 mb-1">
        <UploadCloud size={14} className="text-blue-500" />
        <span className="text-[10px] font-bold text-blue-500 uppercase">Upload Salesforce File</span>
      </div>
      <div className="border-2 border-dashed border-blue-50/50 rounded-xl p-6 bg-blue-50/10 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-blue-50/30 relative">
        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Bot size={24} className="text-blue-400 opacity-50" />
        <span className="text-xs font-bold text-blue-600">{file ? file.name : 'Click or Drag to Upload'}</span>
        <span className="text-[9px] text-gray-400 uppercase font-bold">Max Size: 5MB</span>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading || !file} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Uploading...' : 'Upload to Salesforce'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  )
}

function TaskChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ subject: '', priority: 'Normal', status: 'Not Started', dueDate: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const priorities = ['High', 'Normal', 'Low']

  const submit = async () => {
    if (!form.subject) { setError('Subject is required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`📝 Task **${form.subject}** created! Priority: **${form.priority}**. Successfully synced with your Salesforce Task list.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-amber-500">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={14} className="text-amber-600" />
        <span className="text-[10px] font-bold text-amber-600 uppercase">Create Salesforce Task</span>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Subject *</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-400"
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Follow up on Q2 Proposal" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Priority</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none"
            value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Due Date</label>
          <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none"
            value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}


function OpportunityChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ name: '', amount: '', stage: 'Qualification', closeDate: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stages = ['Qualification', 'Needs Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost']

  const submit = async () => {
    if (!form.name || !form.stage || !form.closeDate) { setError('Name, Stage, and Close Date are required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`💼 Created Opportunity **${form.name}**! Amount: **$${parseFloat(form.amount || 0).toLocaleString()}**. Live sync confirmed.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-emerald-500">
      <div className="flex items-center gap-2 mb-1">
        <Briefcase size={14} className="text-emerald-600" />
        <span className="text-[10px] font-bold text-emerald-600 uppercase">Create Salesforce Opportunity</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Opportunity Name *</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Q2 Enterprise Deal" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Amount ($)</label>
          <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="50000" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase">Close Date *</label>
          <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.closeDate} onChange={e => setForm({ ...form, closeDate: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Sales Stage *</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">
          {loading ? 'Creating...' : 'Create Opportunity'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}


function GroupChatForm({ onComplete, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', type: 'Public' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name) { setError('Group Name is required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('http://localhost:3001/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`🏛️ Created Group **${form.name}**! Successfully synced with Salesforce.`)
      } else { setError(data.error); setLoading(false) }
    } catch (e) { setError('Connection failed.'); setLoading(false) }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3 my-2 border-l-4 border-purple-500">
      <div className="flex items-center gap-2 mb-1">
        <Users2 size={14} className="text-purple-600" />
        <span className="text-[10px] font-bold text-purple-600 uppercase">Create Salesforce Group</span>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Group Name *</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-purple-400"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Sales Strategy Team" />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
        <textarea className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-purple-400 h-16 resize-none"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Purpose of this group..." />
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase">Access Level</label>
        <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs outline-none"
          value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="Public">Public (Anyone can join)</option>
          <option value="Private">Private (Invite only)</option>
        </select>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={submit} disabled={loading} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">
          {loading ? 'Creating...' : 'Create Group'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 border border-gray-100 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
      </div>
    </div>
  )
}


function LeadUpdateForm({ lead, onComplete, onCancel }) {
  const [form, setForm] = useState({
    firstName: lead.FirstName || '',
    lastName: lead.LastName || '',
    company: lead.Company || '',
    email: lead.Email || '',
    phone: lead.Phone || '',
    status: lead.Status || 'Open - Not Contacted',
    rating: lead.Rating || 'Warm'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:3001/api/leads/${lead.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        onComplete(`✅ Successfully updated **${form.firstName} ${form.lastName}**! Current status: **${form.status}**.`)
      } else {
        setError(data.error)
        setLoading(false)
      }
    } catch (e) {
      setError('Update failed.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3 my-2 border-l-4 border-l-blue-500">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Update Lead Record</span>
        <span className="text-[10px] text-gray-400 font-mono">ID: {lead.Id?.substring(0, 8)}...</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase">First Name</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
            value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase">Last Name</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
            value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <div className="col-span-2">
          <label className="text-[9px] font-bold text-gray-400 uppercase">Company</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-400"
            value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
        </div>
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase">Status</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs outline-none"
            value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['Open - Not Contacted', 'Working - Contacted', 'Closed - Converted', 'Closed - Not Converted'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[9px] font-bold text-gray-400 uppercase">Rating</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs outline-none"
            value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}>
            {['Hot', 'Warm', 'Cold'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={submit} disabled={loading}
          className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50">
          Save Changes
        </button>
        <button onClick={onCancel} className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg text-xs font-bold">Cancel</button>
      </div>
    </div>
  )
}

function LeadDeleteConfirm({ lead, onComplete, onCancel }) {
  const [loading, setLoading] = useState(false)

  const confirmDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/api/leads/${lead.Id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        onComplete(`🗑️ Lead **${lead.Name}** from **${lead.Company}** has been removed from your Salesforce database.`)
      }
    } catch (e) { console.error(e); setLoading(false) }
  }

  return (
    <div className="bg-red-50 rounded-xl border border-red-100 p-4 space-y-3 my-2">
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle size={16} />
        <span className="text-xs font-bold uppercase tracking-wide">Confirm Deletion</span>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">
        Are you sure you want to permanently delete **{lead.Name}**? This action cannot be undone and will affect your live Salesforce data.
      </p>
      <div className="flex gap-2">
        <button onClick={confirmDelete} disabled={loading}
          className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50">
          {loading ? 'Deleting...' : 'Yes, Delete Lead'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-bold">
          Cancel
        </button>
      </div>
    </div>
  )
}

function LeadSelector({ leads, type, onSelect, onCancel }) {
  return (
    <div className="bg-indigo-50/30 rounded-xl border border-indigo-100 p-4 space-y-3 my-2">
      <p className="text-xs font-bold text-indigo-700">Multiple matches found. Select record to {type}:</p>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {leads.map(l => (
          <button key={l.Id} onClick={() => onSelect(l)}
            className="w-full text-left p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-gray-800 group-hover:text-indigo-600">{l.Name}</div>
                <div className="text-[10px] text-gray-400">{l.Company}</div>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400" />
            </div>
          </button>
        ))}
      </div>
      <button onClick={onCancel} className="w-full py-1.5 text-[10px] font-bold text-gray-400 uppercase hover:text-gray-600">Cancel Selection</button>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [showDateDD, setShowDateDD] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: "👋 Hi! I'm your analytics AI. Ask me about revenue, churn, campaigns, or customers!" }
  ])
  const [inputVal, setInputVal] = useState('')
  const [typing, setTyping] = useState(false)
  const [sortCol, setSortCol] = useState('mrr')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showNotif, setShowNotif] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [sfLeads, setSfLeads] = useState(null)
  const [sfOpportunities, setSfOpportunities] = useState([])
  const [sfAccounts, setSfAccounts] = useState([])
  const [sfContacts, setSfContacts] = useState([])
  const [sfTasks, setSfTasks] = useState([])
  const [sfEvents, setSfEvents] = useState([])
  const [sfGroups, setSfGroups] = useState([])
  const [oppsLoading, setOppsLoading] = useState(false)
  const [accLoading, setAccLoading] = useState(false)
  const [contLoading, setContLoading] = useState(false)
  const [taskLoading, setTaskLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(false)
  const [groupLoading, setGroupLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [selectedKPI, setSelectedKPI] = useState('Pipeline Value')
  const [showKPIModal, setShowKPIModal] = useState(false)
  const [asideWidth, setAsideWidth] = useState(380)
  const [isResizing, setIsResizing] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [sfReports, setSfReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [settingsTab, setSettingsTab] = useState('Profile')
  const [syncIntensity, setSyncIntensity] = useState(30)
  const [darkMode, setDarkMode] = useState(false)
  const chatRef = useRef(null)
  const kpiSectionRef = useRef(null)

  // Sidebar Resizing Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth > 320 && newWidth < 800) {
        setAsideWidth(newWidth)
      }
    }
    const handleMouseUp = () => setIsResizing(false)
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowKPIModal(false)
        setShowQuickActions(false)
      }
    }
    const handleClickOutside = (e) => {
      if (showQuickActions && !e.target.closest('.quick-action-trigger')) {
        setShowQuickActions(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQuickActions])

  const fetchLiveLeads = (isSilent = true) => {
    return fetch('http://localhost:3001/api/leads')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.leads) {
          setSfLeads(data.leads)
          setConnected(true)
          setLastSync(new Date().toLocaleTimeString())
          setShowModal(false)
          return data.leads
        } else if (!isSilent) {
          alert('Failed to load leads: ' + data.error)
        }
        return null
      })
      .catch(err => {
        console.error(err)
        if (!isSilent) alert('Could not reach backend proxy server.')
        return null
      })
  }

  const fetchReports = () => {
    setReportsLoading(true)
    fetch('http://localhost:3001/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSfReports(data.reports)
        }
        setReportsLoading(false)
      })
      .catch(() => setReportsLoading(false))
  }

  const fetchOpportunities = () => {
    setOppsLoading(true)
    fetch('http://localhost:3001/api/opportunities')
      .then(res => res.json())
      .then(data => { if (data.success) setSfOpportunities(data.opportunities); setOppsLoading(false) })
      .catch(() => setOppsLoading(false))
  }

  const fetchAccounts = () => {
    setAccLoading(true)
    fetch('http://localhost:3001/api/accounts')
      .then(res => res.json())
      .then(data => { if (data.success) setSfAccounts(data.accounts); setAccLoading(false) })
      .catch(() => setAccLoading(false))
  }

  const fetchContacts = () => {
    setContLoading(true)
    fetch('http://localhost:3001/api/contacts')
      .then(res => res.json())
      .then(data => { if (data.success) setSfContacts(data.contacts); setContLoading(false) })
      .catch(() => setContLoading(false))
  }

  const fetchTasks = () => {
    setTaskLoading(true)
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => { if (data.success) setSfTasks(data.tasks); setTaskLoading(false) })
      .catch(() => setTaskLoading(false))
  }

  const fetchEvents = () => {
    setEventLoading(true)
    fetch('http://localhost:3001/api/events')
      .then(res => res.json())
      .then(data => { if (data.success) setSfEvents(data.events); setEventLoading(false) })
      .catch(() => setEventLoading(false))
  }

  const fetchGroups = () => {
    setGroupLoading(true)
    fetch('http://localhost:3001/api/groups')
      .then(res => res.json())
      .then(data => { if (data.success) setSfGroups(data.groups); setGroupLoading(false) })
      .catch(() => setGroupLoading(false))
  }

  const refreshAllSFData = (isSilent = true) => {
    setIsSyncing(true)
    const p = [
      fetchLiveLeads(isSilent),
      fetchOpportunities(),
      fetchAccounts(),
      fetchContacts(),
      fetchTasks(),
      fetchEvents(),
      fetchGroups()
    ]
    if (activeNav === 'Reports') p.push(fetchReports())

    Promise.allSettled(p).then(() => {
      setIsSyncing(false)
    })
  }

  // Live Heartbeat Sync (Dynamic Interval)
  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        refreshAllSFData(true)
      }, syncIntensity * 1000)
      return () => clearInterval(interval)
    }
  }, [connected, syncIntensity])

  useEffect(() => {
    if (connected) {
      if (activeNav === 'Reports') fetchReports()
      if (activeNav === 'Opportunities') fetchOpportunities()
      if (activeNav === 'Accounts') fetchAccounts()
      if (activeNav === 'Contacts') fetchContacts()
      if (activeNav === 'Tasks') fetchTasks()
      if (activeNav === 'Calendar') fetchEvents()
      if (activeNav === 'Groups') fetchGroups()
    }
  }, [activeNav, connected])

  // ──────────────────────────────────────────────────────────────
  // CHECK FOR OAUTH SUCCESS RETURN & AUTO-FETCH
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const oauthStatus = query.get('oauth')

    if (oauthStatus === 'success') {
      window.history.replaceState({}, document.title, "/")
      refreshAllSFData(false)
    } else if (oauthStatus === 'error') {
      const msg = query.get('msg')
      alert("Salesforce Connection Failed: " + msg)
      window.history.replaceState({}, document.title, "/")
    } else {
      refreshAllSFData(true)
    }
  }, [])

  // Build live data if connected, else use mock defaults
  const sfData = (sfLeads || sfOpportunities.length > 0) ? buildDashboardData(sfLeads || [], sfOpportunities) : null
  const activeKPIs = sfData?.dynKPIs || kpis
  const activeRevenue = sfData?.revenueDataSF || revenueData
  const activeChannels = sfData?.channelDataSF || channelData
  const activeConversion = sfData?.conversionDataSF || conversionData
  const activeCustomerRows = sfData?.customerRowsSF || customerRows
  const activeActivity = sfData?.activitySF || activityFeed
  const leadsToUse = sfLeads || fallbackLeads

  function handleSFLoad(leads, mode) {
    setSfLeads(leads)
    setConnected(true)
    setLastSync(new Date().toLocaleTimeString())
    setShowModal(false)
    setMessages(m => [...m, { role: 'ai', text: `✅ Loaded ${leads.length} leads from Salesforce ${mode === 'oauth' ? 'via OAuth API' : 'via CSV export'}! I can now answer questions based on your real data.` }])
  }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  const dateOptions = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last Quarter', 'This Year']

  async function sendMessage(text) {
    const q = text || inputVal.trim()
    if (!q) return
    setInputVal('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setTyping(true)

    const l = q.toLowerCase()

    // ── AI ENGINE DELEGATION ──
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    setTyping(false)
    const reply = generateAIReply(q, sfLeads)
    setMessages(prev => [...prev, reply])
  }

  const rowsPerPage = 5
  const filteredRows = activeCustomerRows.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))
  const pageRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FAFAF8', fontFamily: 'Nunito, sans-serif' }}>
      {showModal && <ConnectSalesforceModal onClose={() => setShowModal(false)} onLoad={handleSFLoad} />}

      {/* ── SIDEBAR ── */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-white border-r border-gray-100 shadow-sm" style={{ minHeight: '100vh' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <Zap size={15} color="#fff" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 font-heading radiant-text">Pulsar AI</div>
              <div className="text-[10px] text-gray-400 font-medium">Analytics Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto sidebar-scrollbar">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">Main Menu</p>
          {navItems.map(({ icon: Icon, label }) => (
            <button key={label} onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group nav-item-modern ${activeNav === label ? 'nav-pill-active' : 'text-gray-500 hover:text-gray-900 font-semibold'}`}>
              <Icon size={18} className={`transition-colors ${activeNav === label ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span>{label}</span>
              {activeNav === label && <div className="ml-auto w-1 h-4 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.3)]" />}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer Padding */}
        <div className="flex-shrink-0 p-4 border-t border-gray-50 bg-gray-50/20">
          {/* Status Badge */}
          <button onClick={() => setShowModal(true)}
            className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border shadow-sm mb-4 ${connected ? 'bg-white border-emerald-100 text-emerald-600' : 'bg-white border-indigo-100 text-indigo-600'}`}>
            {connected
              ? (isSyncing
                ? <><RefreshCw size={13} className="animate-spin text-emerald-400" />Syncing...</>
                : <><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-ring" />Connected</>)
              : <><Cloud size={13} />Connect CRM</>}
          </button>

          {/* User Card */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md transition-transform hover:scale-110 cursor-pointer" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>DD</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Divya Dharshini</p>
              <p className="text-[10px] text-gray-500 font-medium truncate">Workspace Owner</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP NAVBAR ── */}
        <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-lg font-extrabold text-gray-900 font-heading radiant-text tracking-tight">{activeNav}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {connected
                ? <><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-ring" /><span className="text-xs text-emerald-600 font-semibold">Salesforce Live · {sfLeads?.length} leads · synced {lastSync}</span></>
                : <><span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /><span className="text-xs text-amber-600">Demo data</span>
                  <button onClick={() => setShowModal(true)} className="text-xs text-indigo-600 font-semibold hover:underline ml-1">Connect Salesforce →</button></>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-56 border border-gray-100 focus-within:border-indigo-300 transition-colors">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                placeholder="Search..." />
            </div>

            {/* Date Picker */}
            <div className="relative">
              <button onClick={() => setShowDateDD(d => !d)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors">
                <Calendar size={14} className="text-gray-500" />
                {dateRange}
                <ChevronDown size={13} className="text-gray-400" />
              </button>
              {showDateDD && (
                <div className="absolute right-0 top-full mt-1.5 <EPHEMERAL_MESSAGE>
w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1">
                  {dateOptions.map(o => (
                    <button key={o} onClick={() => { setDateRange(o); setShowDateDD(false) }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-indigo-50 ${dateRange === o ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Connect / Sync */}
            <button onClick={() => connected ? refreshAllSFData(false) : setShowModal(true)}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all border group"
              style={{ background: connected ? '#F0FDF4' : 'white', border: `1px solid ${connected ? '#86EFAC' : '#E5E7EB'}`, color: connected ? '#166534' : '#374151' }}>
              {connected ? (
                isSyncing ? (
                  <><RefreshCw size={14} className="animate-spin text-emerald-500" />Syncing Hub...</>
                ) : (
                  <><Wifi size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />Live Hub</>
                )
              ) : <><Upload size={14} />Import SF</>}
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <Download size={14} />
              Export
            </button>

            {/* Notif */}
            <div className="relative">
              <button onClick={() => setShowNotif(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-700 relative transition-colors">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              {showNotif && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-3">
                  <p className="text-xs font-bold text-gray-700 mb-2 px-1">Notifications</p>
                  {activityFeed.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${a.color}18` }}>
                        <a.icon size={11} style={{ color: a.color }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-700">{a.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>SA</div>
          </div>
        </header>

        {/* ── BODY WRAPPER ── */}
        <div className="flex-1 flex overflow-hidden relative">
          <main className="flex-1 overflow-y-auto grid-bg p-6 space-y-6 pb-12">

            {activeNav === 'Overview' && (
              <>
                {/* ── KPI CARDS ── */}
                <div ref={kpiSectionRef} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {activeKPIs.map((kpi, i) => (
                    <div key={i}
                      onClick={() => { setSelectedKPI(kpi.label); setShowKPIModal(true) }}
                      className={`premium-card rounded-2xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer fade-up-${i + 1} relative overflow-hidden kpi-card-lift ${selectedKPI === kpi.label ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                      {kpi.live && (
                        <span className="absolute top-4 right-4 flex items-center gap-1.5">
                          {isSyncing ? (
                            <RefreshCw size={10} className="text-emerald-500 animate-spin" />
                          ) : (
                            <span className="w-2 h-2 rounded-full pulse-ring inline-block" style={{ background: '#10B981' }} />
                          )}
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{isSyncing ? 'Syncing' : 'Live'}</span>
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: kpi.bgColor }}>
                          <kpi.icon size={17} style={{ color: kpi.color }} />
                        </div>
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${kpi.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {kpi.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{kpi.change}
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold font-heading mb-0.5 radiant-text">{kpi.value}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{kpi.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── DYNAMIC ANALYTICS DRILL-DOWN ── */}
                <div id="drilldown-analysis" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fade-up-3">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 font-heading capitalize">{selectedKPI} Analysis</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Deep-dive insights from live Salesforce metadata</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-tight">
                        {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-ring" />}
                        {isSyncing ? 'Syncing...' : `Salesforce Live Engine · ${lastSync}`}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold shadow-sm shadow-indigo-200">Default</button>
                        <button className="px-2.5 py-1 rounded hover:bg-gray-50 text-gray-400 text-[10px] font-bold border border-transparent hover:border-gray-100">Trend</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Graph Area */}
                    <div className="lg:col-span-2">
                      {selectedKPI === 'Pipeline Value' && (
                        <ResponsiveContainer width="100%" height={320}>
                          <AreaChart data={activeRevenue}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={v => `$${v / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                      {(selectedKPI === 'Salesforce Leads' || selectedKPI === 'Leads') && (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={activeRevenue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {selectedKPI === 'Converted' && (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={activeConversion} layout="vertical" barSize={24}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {selectedKPI === 'Hot Leads' && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">High Priority Summary</h4>
                          {sfLeads?.filter(l => (l.Rating || l.rating || '').toLowerCase() === 'hot').slice(0, 5).map((l, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                  {l.Name?.[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-gray-800">{l.Name}</div>
                                  <div className="text-[10px] text-gray-400">{l.Company}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-bold text-indigo-600">${getLeadValue(l).toLocaleString()}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold tracking-wide uppercase">Priority</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Contextual Info */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Metric Context</h4>
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {selectedKPI === 'Pipeline Value' && "Total estimated value of your Salesforce funnel based on hot/warm ratings."}
                            {selectedKPI === 'Hot Leads' && "High-intent records that are currently in 'New' status and require immediate outbound."}
                            {selectedKPI === 'Converted' && "Success rate of leads moving through the Open-Working-Qualified lifecycle."}
                            {selectedKPI === 'Salesforce Leads' && "Monthly ingestion volume of new lead data from your live CRM connection."}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Benchmark</span>
                            <span className="text-[11px] font-bold text-emerald-600">+12% vs LY</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full w-[65%]" />
                          </div>
                        </div>
                        <button onClick={() => sendMessage(`Run a full report on ${selectedKPI}`)}
                          className="w-full py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                          Ask AI for deep-dive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ── RECENT ACTIVITY TILE ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 fade-up-4 mt-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 font-heading">Recent Activity</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Automated event stream from your connected workspace</p>
                    </div>
                    <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">View All Activities</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeActivity.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-50 bg-gray-50/20 hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: a.color }}>
                          <a.icon size={15} color="#fff" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{a.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── CUSTOMERS TABLE ── */}
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden fade-up-5" style={{ border: '1px solid #F3F4F6' }}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 font-heading">{connected ? 'Salesforce Leads' : 'Customers'}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{filteredRows.length} {connected ? 'leads from Salesforce' : 'total customers'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                        <SearchIcon size={12} className="text-gray-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                          placeholder="Search customers…" className="bg-transparent outline-none text-xs text-gray-700 placeholder-gray-400 w-40" />
                      </div>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Filter size={12} />Filter
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#4F46E5' }}>
                        <Plus size={12} />Add Customer
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50" style={{ background: '#FAFAFA' }}>
                          {[['Name/Company', ''], ['Plan', 'plan'], ['MRR', 'mrr'], ['Status', 'health'], ['Joined', 'joined'], ['']].map(([label, col], i) => (
                            <th key={i} onClick={() => label && col && (setSortCol(col), setSortDir(d => d === 'asc' ? 'desc' : 'asc'))}
                              className={`px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap ${col ? 'cursor-pointer hover:text-indigo-500 transition-colors' : ''}`}>
                              {label} {col && sortCol === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.length === 0
                          ? <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No customers found.</td></tr>
                          : pageRows.map((r, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                    style={{ background: `hsl(${(i * 47 + 200) % 360}, 70%, 55%)` }}>
                                    {r.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-800 whitespace-nowrap">{r.name}</div>
                                    <div className="text-[11px] text-gray-400">{r.company}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5"><PlanBadge plan={r.plan} /></td>
                              <td className="px-5 py-3.5 font-bold text-gray-800">{r.mrr}</td>
                              <td className="px-5 py-3.5"><HealthBadge status={r.health} /></td>
                              <td className="px-5 py-3.5 text-xs text-gray-500">{r.joined}</td>
                              <td className="px-5 py-3.5">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={15} /></button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">Page {page} of {totalPages} · {filteredRows.length} customers</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-100 disabled:opacity-30 transition-colors">← Prev</button>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-100 disabled:opacity-30 transition-colors">Next →</button>
                    </div>
                  </div>
                </div>
              </>)}

            {activeNav === 'Analytics' && (
              <div className="fade-up-1 space-y-6">
                {/* ── AUTOMATIC EXECUTIVE SUMMARY ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                    <Bot size={24} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-1.5 flex items-center gap-2">
                      Dynamic Executive Summary
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider">Auto-Updating</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
                      {(() => {
                        const topChannel = [...activeChannels].sort((a, b) => b.value - a.value)[0]
                        const totalFunnel = activeConversion.reduce((s, a) => s + a.value, 0)
                        const convRate = ((activeConversion.find(c => c.stage === 'Converted')?.value || 0) / (activeConversion.find(c => c.stage === 'New')?.value || 1) * 100).toFixed(1)
                        const dropPoint = activeConversion.reduce((prev, curr, i, arr) => {
                          if (i === 0) return prev
                          const drop = arr[i - 1].value - curr.value
                          return drop > prev.drop ? { stage: arr[i - 1].stage, drop } : prev
                        }, { stage: '', drop: 0 })

                        return (
                          <>
                            Analysis of your current workspace indicates that <strong className="text-indigo-600">{topChannel.name}</strong> remains your strongest acquisition channel, accounting for **{topChannel.value}%** of total lead volume.
                            Your current conversion efficiency from New to Converted is sitting at <strong className="text-emerald-600">{convRate}%</strong>.
                            Data indicates a notable drop-off at the <strong className="text-amber-600">{dropPoint.stage}</strong> stage—optimizing this touchpoint could potentially increase overall conversion by up to 15%.
                          </>
                        )
                      })()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-gray-900 font-heading">Acquisition Channels</h3>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Mix</div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RePieChart>
                        <Pie data={activeChannels} cx="50%" cy="50%" innerRadius={80} outerRadius={110} dataKey="value" paddingAngle={4}>
                          {activeChannels.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                        </Pie>
                        <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                          <div className="bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 text-xs">
                            <p className="font-bold text-gray-800 mb-1">{payload[0].name}</p>
                            <p className="font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].value}% Share</p>
                          </div>
                        ) : null} />
                        <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 'bold', paddingTop: 20 }} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-gray-900 font-heading">Conversion Funnel</h3>
                      <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Efficiency View</div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={activeConversion} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" opacity={0.6} />
                        <XAxis dataKey="stage" tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={4} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'Revenue' && (
              <div className="fade-up-1 space-y-6">
                {/* ── DYNAMIC REVENUE SUMMARY ── */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <DollarSign size={24} color="#fff" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 font-heading mb-1.5 flex items-center gap-2">
                      Financial Performance Summary
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase tracking-wider">Live Analysis</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
                      {(() => {
                        if (!activeRevenue?.length) return "Awaiting deeper financial synchronization..."
                        const totalRev = activeRevenue.reduce((s, a) => s + (a.revenue || 0), 0)
                        const totalTgt = activeRevenue.reduce((s, a) => s + (a.target || 0), 0)
                        const variance = totalTgt > 0 ? (((totalRev - totalTgt) / totalTgt) * 100).toFixed(1) : "0.0"
                        const lastMonth = activeRevenue[activeRevenue.length - 1]
                        const prevMonth = activeRevenue[activeRevenue.length - 2]
                        const growth = (prevMonth && prevMonth.revenue > 0) ? (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1) : "0.0"

                        return (
                          <>
                            Your live dashboard indicates a total accrued pipeline of <strong className="text-indigo-600">${totalRev.toLocaleString()}</strong> over the active period.
                            Performance is currently pacing <strong className={parseFloat(variance) >= 0 ? 'text-emerald-600' : 'text-red-500'}>{Math.abs(parseFloat(variance))}% {parseFloat(variance) >= 0 ? 'above' : 'below'}</strong> your set targets.
                            The most recent month showed a <strong className="text-indigo-600">{growth}%</strong> {parseFloat(growth) >= 0 ? 'increase' : 'decrease'} in revenue generation—continuing this trend would place you at approximately **${(lastMonth.revenue * (1 + (parseFloat(growth) / 100))).toLocaleString(undefined, { maximumFractionDigits: 0 })}** by next month.
                          </>
                        )
                      })()}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-heading">Revenue & Target Overview</h3>
                      <p className="text-xs text-gray-400 mt-1">Comparative analysis of actuals vs goals</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: '#4F46E5' }} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actual Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Path</span>
                      </div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={activeRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGradBig" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} opacity={0.6} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12, fontBold: 600 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 12, fontBold: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} dx={-10} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="Actual" stroke="#4F46E5" strokeWidth={4} fill="url(#revGradBig)" />
                      <Line type="monotone" dataKey="target" name="Target" stroke="#10B981" strokeWidth={2} strokeDasharray="6 6" dot={{ r: 4, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeNav === 'Customers' && (
              <div className="fade-up-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-heading">{connected ? 'Salesforce Leads Directory' : 'Customer Directory'}</h3>
                      <p className="text-xs text-gray-500 mt-1">Viewing all {filteredRows.length} records</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-200">
                        <SearchIcon size={16} className="text-gray-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or company..." className="bg-transparent outline-none text-sm text-gray-700 w-56" />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-white">
                          {[['Name & Company', ''], ['Plan/Status', 'plan'], ['Value', 'mrr'], ['Health', 'health'], ['Date Joined', 'joined']].map(([label, col], i) => (
                            <th key={i} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">{label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {pageRows.map((r, i) => (
                          <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: `hsl(${(i * 47 + 200) % 360}, 70%, 55%)` }}>{r.name.split(' ').map(n => n[0]).join('')}</div>
                                <div><div className="text-sm font-bold text-gray-900">{r.name}</div><div className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">{r.company}</div></div>
                              </div>
                            </td>
                            <td className="px-6 py-4"><PlanBadge plan={r.plan} /></td>
                            <td className="px-6 py-4 font-bold text-gray-800">{r.mrr}</td>
                            <td className="px-6 py-4"><HealthBadge status={r.health} /></td>
                            <td className="px-6 py-4 text-xs text-gray-500 font-medium">{r.joined}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4 bg-[#FAFAFA] border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-semibold tracking-wide">PAGE {page} OF {totalPages}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 hover:bg-gray-100 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors disabled:opacity-30">Previous</button>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 hover:bg-gray-100 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors disabled:opacity-30">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeNav === 'Campaigns' && <Campaigns isConnected={connected} leads={leadsToUse} />}
            {activeNav === 'Integrations' && <Integrations isConnected={connected} onConnectSF={() => setShowModal(true)} />}
            {activeNav === 'Team' && <Team />}

            {/* Salesforce Cloud Placeholders & Live Views */}
            {['Opportunities', 'Accounts', 'Contacts', 'Calendar', 'Tasks', 'Files', 'Groups', 'Reports', 'Settings'].includes(activeNav) && (
              <div className="h-full flex flex-col fade-up-1">
                {activeNav === 'Reports' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <BarChart3 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Salesforce Reports</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Live from your Salesforce Analytics engine</p>
                        </div>
                      </div>
                      <button onClick={fetchReports} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100">
                        <RefreshCw size={14} className={reportsLoading ? 'animate-spin' : ''} />
                        Refresh List
                      </button>
                    </div>
                    <div className="overflow-x-auto min-h-[400px]">
                      {reportsLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-indigo-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Report Metadata...</p>
                        </div>
                      ) : sfReports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <PieChart size={40} className="text-gray-200" />
                          <p className="text-sm font-bold text-gray-400">No recent reports found.</p>
                        </div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-white">
                              {['Report Name', 'Format', 'Last Run Date'].map((label, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {sfReports.map((r, i) => (
                              <tr key={i} className="hover:bg-indigo-50/20 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                      <PieChart size={14} />
                                    </div>
                                    <span className="font-bold text-gray-900">{r.Name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">{r.Format}</td>
                                <td className="px-6 py-4 text-xs text-gray-400">{new Date(r.LastRunDate).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Opportunities' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <Briefcase size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Salesforce Opportunities</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Your live sales pipeline from Salesforce CRM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-tight">
                          {oppsLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                          {oppsLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchOpportunities} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100">
                          <RefreshCw size={14} className={oppsLoading ? 'animate-spin' : ''} />
                          Sync Pipeline
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto min-h-[400px]">
                      {oppsLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-emerald-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Hydrating Opportunities...</p>
                        </div>
                      ) : sfOpportunities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <Briefcase size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">No active opportunities found.</p>
                          <p className="text-xs text-gray-400">Try creating one using the AI chatbot or "Quick Actions"!</p>
                        </div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-white">
                              {['Opportunity Name', 'Amount', 'Stage', 'Close Date'].map((label, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {sfOpportunities.map((opp, i) => (
                              <tr key={opp.Id} className="hover:bg-emerald-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                      <TrendingUp size={14} />
                                    </div>
                                    <span className="font-bold text-gray-900">{opp.Name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-bold text-gray-800">${(opp.Amount || 0).toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <StageBadge stage={opp.StageName} />
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                  {new Date(opp.CloseDate).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Accounts' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-600 shadow-lg shadow-sky-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Corporate Accounts</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Global enterprise and partner organizations</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 uppercase tracking-tight">
                          {accLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-sky-400 rounded-full" />}
                          {accLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchAccounts} className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl text-xs font-bold hover:bg-sky-100 transition-all border border-sky-100">
                          <RefreshCw size={14} className={accLoading ? 'animate-spin' : ''} />
                          Sync Accounts
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      {accLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-sky-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Querying Account Metadata...</p>
                        </div>
                      ) : sfAccounts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <Building2 size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">No Accounts found.</p>
                          <p className="text-xs text-gray-400">Try creating one using the AI agent!</p>
                        </div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-white sticky top-0 z-10">
                              {['Account Name', 'Industry', 'Website', 'Phone'].map((label, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {sfAccounts.map((acc, i) => (
                              <tr key={acc.Id} className="hover:bg-sky-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 group-hover:rotate-12 transition-transform">
                                      <Building2 size={14} />
                                    </div>
                                    <span className="font-bold text-gray-900">{acc.Name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4"><span className="text-xs font-semibold text-gray-500 uppercase">{acc.Industry || '—'}</span></td>
                                <td className="px-6 py-4"><a href={acc.Website} target="_blank" className="text-xs font-medium text-sky-600 hover:underline">{acc.Website || '—'}</a></td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-500">{acc.Phone || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Contacts' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 shadow-lg shadow-rose-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <Contact size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Professional Contacts</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Managing your key stakeholder relationships</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 uppercase tracking-tight">
                          {contLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />}
                          {contLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchContacts} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100">
                          <RefreshCw size={14} className={contLoading ? 'animate-spin' : ''} />
                          Sync Contacts
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      {contLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-rose-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Hydrating Relationship Data...</p>
                        </div>
                      ) : sfContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <Contact size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">No contacts found.</p>
                        </div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-white sticky top-0 z-10">
                              {['Contact Name', 'Account', 'Email', 'Phone'].map((label, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{label}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {sfContacts.map((c, i) => (
                              <tr key={c.Id} className="hover:bg-rose-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                                      <Contact size={14} />
                                    </div>
                                    <span className="font-bold text-gray-900">{c.Name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-700">{c.Account?.Name || '—'}</td>
                                <td className="px-6 py-4 text-xs font-medium text-rose-600 hover:scale-105 transition-transform">{c.Email || '—'}</td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-500">{c.Phone || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Tasks' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-600 shadow-lg shadow-amber-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <ClipboardList size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Daily Tasks</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Critical items requiring your attention</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 uppercase tracking-tight">
                          {taskLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                          {taskLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchTasks} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100">
                          <RefreshCw size={14} className={taskLoading ? 'animate-spin' : ''} />
                          Sync Tasks
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1 p-6 space-y-4">
                      {taskLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-amber-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Task Queue...</p>
                        </div>
                      ) : sfTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <ClipboardList size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">Clear schedule! No tasks found.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {sfTasks.map(task => (
                            <div key={task.Id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-lg hover:shadow-amber-100/50 transition-all group">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.Priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {task.Status === 'Completed' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="text-sm font-bold text-gray-900">{task.Subject}</div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{task.Status}</span>
                                    <span className="text-[10px] text-gray-300">•</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${task.Priority === 'High' ? 'text-red-500' : 'text-amber-600'}`}>{task.Priority} Priority</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Due Date</div>
                                <div className="text-xs font-bold text-gray-700">{task.ActivityDate ? new Date(task.ActivityDate).toLocaleDateString() : 'No Date'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Calendar' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <CalendarIcon size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Corporate Agenda</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Synchronized Salesforce Events & Meetings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-tight">
                          {eventLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />}
                          {eventLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchEvents} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all border border-blue-100">
                          <RefreshCw size={14} className={eventLoading ? 'animate-spin' : ''} />
                          Sync Agenda
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto flex-1 p-6">
                      {eventLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-blue-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Polling Calendar Service...</p>
                        </div>
                      ) : sfEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <CalendarIcon size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">No upcoming events scheduled.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {sfEvents.map(ev => (
                            <div key={ev.Id} className="flex gap-4 group">
                              <div className="w-16 text-right pt-1">
                                <div className="text-xs font-bold text-gray-900">{new Date(ev.StartDateTime).toLocaleDateString('en', { day: '2-digit', month: 'short' })}</div>
                                <div className="text-[10px] text-gray-400 font-medium">{new Date(ev.StartDateTime).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                              <div className="w-0.5 bg-blue-100 relative group-hover:bg-blue-400 transition-colors">
                                <div className="absolute top-2 -left-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                              </div>
                              <div className="flex-1 pb-6 border-b border-gray-50 last:border-0">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50 group-hover:border-blue-100 transition-all">
                                  <div className="text-sm font-bold text-gray-900 mb-1">{ev.Subject}</div>
                                  <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium">
                                    <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(ev.StartDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(ev.EndDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    {ev.Location && <div className="flex items-center gap-1.5"><Globe size={12} /> {ev.Location}</div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Groups' ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 shadow-lg shadow-purple-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <Users2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Chatter Groups</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Salesforce collaboration & department hubs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 uppercase tracking-tight">
                          {groupLoading ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />}
                          {groupLoading ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={fetchGroups} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-all border border-purple-100">
                          <RefreshCw size={14} className={groupLoading ? 'animate-spin' : ''} />
                          Sync Groups
                        </button>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                      {groupLoading ? (
                        <div className="col-span-2 flex flex-col items-center justify-center p-20 gap-3">
                          <Bot size={40} className="text-purple-400 animate-bounce" />
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fetching Collaboration Spaces...</p>
                        </div>
                      ) : sfGroups.length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center p-20 gap-3 text-center">
                          <Users2 size={40} className="text-gray-200 mb-2" />
                          <p className="text-sm font-bold text-gray-500 mb-1">No Groups found.</p>
                        </div>
                      ) : (
                        sfGroups.map(g => (
                          <div key={g.Id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Users2 size={20} />
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${g.CollaborationType === 'Public' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{g.CollaborationType}</span>
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{g.Name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-4">{g.Description || 'No description provided for this collaboration group.'}</p>
                            <button className="w-full py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-600 hover:bg-purple-600 hover:text-white transition-all">View Group Feed</button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : activeNav === 'Settings' ? (
                  <div className="flex-1 flex flex-col m-6 overflow-hidden">
                    <div className="mb-6">
                      <h2 className="text-3xl font-extrabold text-gray-900 font-heading radiant-text">Platform Settings</h2>
                      <p className="text-sm text-gray-500 font-medium">Manage your Pulsar AI workspace and Salesforce synchronization</p>
                    </div>

                    <div className="flex-1 bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 overflow-hidden flex">
                      {/* Sub-sidebar */}
                      <div className="w-64 bg-indigo-50/10 border-r border-indigo-50/50 p-6 flex flex-col gap-2">
                        {[
                          { id: 'Profile', icon: User, label: 'Profile' },
                          { id: 'Salesforce', icon: Database, label: 'Salesforce Hub' },
                          { id: 'Appearance', icon: Palette, label: 'Appearance' },
                          { id: 'Notifications', icon: BellRing, label: 'Notifications' },
                        ].map(tab => (
                          <button key={tab.id} onClick={() => setSettingsTab(tab.id)}
                            className={`settings-tab-btn ${settingsTab === tab.id ? 'settings-tab-active' : ''}`}>
                            <tab.icon size={18} strokeWidth={2.5} />
                            {tab.label}
                          </button>
                        ))}
                        <div className="mt-auto p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl border border-indigo-400/30 shadow-lg shadow-indigo-200/50">
                          <p className="text-[10px] font-bold text-indigo-100 uppercase mb-1 tracking-widest">Pulsar AI Pro</p>
                          <p className="text-[9px] text-white/80 font-bold">Session Active: {connected ? 'PRO' : 'GUEST'}</p>
                          <div className="mt-3 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 overflow-y-auto p-12 bg-white/40 backdrop-blur-sm">
                        {settingsTab === 'Profile' && (
                          <div className="animate-fade-in max-w-2xl">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 font-heading">User Profile</h3>
                            <div className="flex items-center gap-8 mb-12">
                                <div className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative group cursor-pointer border-4 border-white ring-1 ring-indigo-50">
                                  DD
                                  <div className="absolute inset-0 bg-indigo-600/40 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-xs font-bold backdrop-blur-sm">Change</div>
                                </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">Divya Dharshini</h4>
                                <p className="text-sm text-indigo-500 font-semibold mb-3">Workspace Owner · Pulsar Enterprise</p>
                                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm">Change Profile Picture</button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <label className="modern-label">First Name</label>
                                <input className="modern-input" defaultValue="Divya" />
                              </div>
                              <div className="space-y-2">
                                <label className="modern-label">Last Name</label>
                                <input className="modern-input" defaultValue="Dharshini" />
                              </div>
                              <div className="col-span-2 space-y-2">
                                <label className="modern-label">Email Address</label>
                                <input className="modern-input" defaultValue="divya@pulsar.ai" />
                              </div>
                              <div className="col-span-2 pt-4">
                                <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all">Save Changes</button>
                              </div>
                            </div>
                          </div>
                        )}

                        {settingsTab === 'Salesforce' && (
                          <div className="animate-fade-in max-w-2xl">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 font-heading">Salesforce Infrastructure</h3>
                            <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-800 to-violet-900 rounded-[32px] text-white mb-12 relative overflow-hidden shadow-2xl border border-white/10">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px]" />
                              <div className="flex justify-between items-start relative z-10">
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400 pulse-ring' : 'bg-red-400'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">{connected ? 'System Online' : 'System Offline'}</span>
                                  </div>
                                  <h4 className="text-3xl font-black tracking-tight mb-2">Salesforce Production</h4>
                                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full w-fit">
                                    <Globe size={10} className="text-indigo-400" />
                                    <p className="text-[10px] text-indigo-100/60 font-bold uppercase tracking-widest">Instance.na214.salesforce.com</p>
                                  </div>
                                </div>
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                  <Cloud size={32} className="text-indigo-400" />
                                </div>
                              </div>
                              <div className="mt-8 flex gap-4 relative z-10">
                                <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-white text-indigo-950 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all shadow-lg active:scale-95">Re-Authenticate Hub</button>
                                <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition-all active:scale-95">Download Integration Logs</button>
                              </div>
                            </div>

                            <div className="space-y-10">
                              <div className="glass-settings-card border-indigo-100/50">
                                <div className="flex justify-between items-end mb-6">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">Background Sync Heartbeat</h4>
                                    <p className="text-xs text-gray-500 mt-1">Adjust how often Pulsar AI polls your Salesforce CRM.</p>
                                  </div>
                                  <div className="text-2xl font-black text-indigo-600 font-heading">{syncIntensity}s</div>
                                </div>
                                <input type="range" min="10" max="300" step="10"
                                  value={syncIntensity} onChange={e => setSyncIntensity(parseInt(e.target.value))}
                                  className="w-full h-2 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-indigo-600 mb-3" />
                                <div className="flex justify-between text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                  <span>Fast (Real-time)</span>
                                  <span>Steady (Optimized)</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-8 bg-indigo-50/30 rounded-[28px] border border-indigo-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100/20">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                                    <Zap size={20} />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">Auto-Detect High Value Leads</h4>
                                    <p className="text-xs text-gray-500 mt-1">Automatically prioritize hot leads in the overview.</p>
                                  </div>
                                </div>
                                <label className="premium-switch">
                                  <input type="checkbox" defaultChecked />
                                  <span className="switch-slider"></span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {settingsTab === 'Appearance' && (
                          <div className="animate-fade-in max-w-2xl">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 font-heading">System Appearance</h3>

                            <div className="mb-12 glass-settings-card">
                              <label className="modern-label mb-6">Color Mode Experience</label>
                              <div className="segmented-control max-w-sm">
                                <button onClick={() => setDarkMode(false)} className={`segmented-btn ${!darkMode ? 'segmented-btn-active' : ''}`}>
                                  <div className="flex items-center justify-center gap-2">
                                    <Sun size={14} /> Light Hub
                                  </div>
                                </button>
                                <button onClick={() => setDarkMode(true)} className={`segmented-btn ${darkMode ? 'segmented-btn-active' : ''}`}>
                                  <div className="flex items-center justify-center gap-2">
                                    <Moon size={14} /> Dark Radiant
                                  </div>
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mt-4 text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl w-fit font-bold uppercase tracking-widest">
                                <Sparkles size={12} /> Dark mode is a visual simulation in this version
                              </div>
                            </div>

                            <div className="glass-settings-card">
                              <label className="modern-label mb-6">Accent Palette Selection</label>
                              <div className="flex flex-wrap gap-5">
                                {[
                                  { color: '#4F46E5', name: 'Pulsar Indigo' },
                                  { color: '#10B981', name: 'Emerald' },
                                  { color: '#F59E0B', name: 'Amber' },
                                  { color: '#EF4444', name: 'Ruby' },
                                  { color: '#EC4899', name: 'Pink' },
                                  { color: '#06B6D4', name: 'Cyan' }
                                ].map(item => (
                                  <div key={item.color} className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <button className="w-14 h-14 rounded-[20px] shadow-lg border-4 border-white ring-1 ring-indigo-50 transition-all group-hover:scale-110 active:scale-95 group-hover:shadow-indigo-200" style={{ background: item.color }} />
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{item.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {settingsTab === 'Notifications' && (
                          <div className="animate-fade-in max-w-2xl">
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-8 font-heading">Connectivity & Sync Alerts</h3>
                            <div className="space-y-5">
                              {[
                                { title: 'AI Operational Updates', desc: 'Allow the AI agent to speak important sync statuses.', icon: Mic2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                { title: 'Critical Session Failures', desc: 'Immediate alerts if Salesforce OAuth session expires.', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
                                { title: 'Hot Lead Acquisition', desc: 'Notification when AI scores a lead above 90.', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
                                { title: 'Executive Summary Emails', desc: 'Weekly PDF reports sent to your primary inbox.', icon: Mail, color: 'text-sky-600', bg: 'bg-sky-50' },
                              ].map((n, i) => (
                                <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[32px] border border-gray-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/20 transition-all group">
                                  <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 ${n.bg} rounded-2xl flex items-center justify-center ${n.color} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                      <n.icon size={24} />
                                    </div>
                                    <div>
                                      <h4 className="text-base font-bold text-gray-900">{n.title}</h4>
                                      <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
                                    </div>
                                  </div>
                                  <label className="premium-switch shadow-sm scale-110">
                                    <input type="checkbox" defaultChecked={i < 2} />
                                    <span className="switch-slider"></span>
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="mt-10 p-6 bg-indigo-900 rounded-[32px] text-white flex items-center justify-between shadow-2xl shadow-indigo-200">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                    <BellRing size={20} className="text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold">Push Notifications Active</h4>
                                    <p className="text-xs text-white/60">System-wide operational tracking is live.</p>
                                  </div>
                               </div>
                               <button className="px-5 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all">Test Notification</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden m-6 flex-1 flex flex-col">
                    <div className="px-6 py-6 border-b border-gray-50 flex justify-between items-center bg-[#FAFAFA]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white transition-transform hover:scale-110">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 font-heading radiant-text">Cloud Resource Vault</h3>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Synchronized Salesforce Documents & Assets</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100 uppercase tracking-tight">
                          {isSyncing ? <RefreshCw size={10} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
                          {isSyncing ? 'SYNCING...' : `LAST SYNCED ${lastSync}`}
                        </div>
                        <button onClick={() => sendMessage('upload a file')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all border border-indigo-700 shadow-md">
                          <Upload size={14} />
                          Upload New
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center group">
                      <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                        <FileText size={40} className="text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vault Operational</h2>
                      <p className="text-gray-500 max-w-sm mb-8">Securely managing your Salesforce document infrastructure. You can view, download, and upload assets directly from this console.</p>

                      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left hover:bg-white hover:shadow-xl transition-all">
                          <BookOpen size={20} className="text-blue-500 mb-3" />
                          <div className="text-sm font-bold text-gray-900">Contracts & NDAs</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">42 Synchronized</div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left hover:bg-white hover:shadow-xl transition-all">
                          <Layers size={20} className="text-purple-500 mb-3" />
                          <div className="text-sm font-bold text-gray-900">Marketing Assets</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">128 Synchronized</div>
                        </div>
                      </div>

                      <button onClick={() => setActiveNav('Overview')} className="mt-10 px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-2xl hover:bg-black transition-all">
                        Return to Command Center
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* ── DRAG HANDLE FOR RESIZING ── */}
          <div onMouseDown={() => setIsResizing(true)}
            className="w-1.5 h-full cursor-col-resize absolute right-0 items-center justify-center group z-50 transition-colors hover:bg-indigo-400"
            style={{ right: asideWidth }}>
            <div className="w-1 h-8 bg-gray-200 rounded-full group-hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 -left-px" />
          </div>

          <aside className="border-l border-gray-100 flex-shrink-0 flex flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden xl:flex"
            style={{ width: asideWidth }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-50" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                <Bot size={18} color="#fff" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 font-heading">Analytics AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-ring" />
                  <span className="text-[10px] text-emerald-600 font-semibold tracking-wide">ONLINE — LIVE DATA</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FAFAF8]" style={{ scrollBehavior: 'smooth' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'text-gray-700 bg-gray-50 rounded-bl-sm border border-gray-100 shadow-sm'
                    }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}>
                    {msg.type === 'leadForm' || msg.type === 'form' ? (
                      <LeadChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchLiveLeads(true)
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Lead creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'opportunityForm' ? (
                      <OpportunityChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchOpportunities()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Opportunity creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'taskForm' ? (
                      <TaskChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchTasks()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Task creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'accountForm' ? (
                      <AccountChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchAccounts()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Account creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'contactForm' ? (
                      <ContactChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchContacts()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Contact creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'eventForm' ? (
                      <EventChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchEvents()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Event scheduling canceled.' } : m))
                      }} />
                    ) : msg.type === 'fileForm' ? (
                      <FileChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        refreshAllSFData(true)
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'File upload canceled.' } : m))
                      }} />
                    ) : msg.type === 'groupForm' ? (
                      <GroupChatForm onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchGroups()
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Group creation canceled.' } : m))
                      }} />
                    ) : msg.type === 'update' ? (
                      <LeadUpdateForm lead={msg.lead} onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchLiveLeads(true)
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Update aborted.' } : m))
                      }} />
                    ) : msg.type === 'delete' ? (
                      <LeadDeleteConfirm lead={msg.lead} onComplete={(resMsg) => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: resMsg } : m))
                        fetchLiveLeads(true)
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Deletion canceled.' } : m))
                      }} />
                    ) : msg.type === 'selector' ? (
                      <LeadSelector leads={msg.leads} type={msg.subType} onSelect={(lead) => {
                        setMessages(prev => [...prev, { role: 'ai', text: `Got it. Opening the ${msg.subType} dialogue for **${lead.Name}**.` },
                        generateAIReply(`${msg.subType} ${lead.Name}`, sfLeads)])
                      }} onCancel={() => {
                        setMessages(prev => prev.map((m, idx) => idx === i ? { ...m, type: 'done', text: 'Selection canceled.' } : m))
                      }} />
                    ) : (
                      msg.text?.split('**').map((part, index) => index % 2 === 1 ? <strong key={index} className="font-bold text-gray-900">{part}</strong> : part)
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 dot1 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 dot2 inline-block" />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 dot3 inline-block" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips & Input */}
            <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.keys(aiResponses).map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-[10px] px-2.5 py-1.5 rounded-full border border-indigo-100 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition-colors font-semibold whitespace-nowrap">
                    {q.substring(0, 20)}...
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-indigo-400 transition-colors bg-gray-50 shadow-inner relative">
                <div className="relative quick-action-trigger">
                  <button onClick={() => setShowQuickActions(!showQuickActions)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all quick-action-trigger ${showQuickActions ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm border border-gray-100'}`}>
                    <Plus size={14} className={`transition-transform duration-300 ${showQuickActions ? 'rotate-45' : ''}`} />
                  </button>

                  {/* Floating Action Menu */}
                  {showQuickActions && (
                    <div className="absolute bottom-full left-0 mb-3 w-48 glass-menu rounded-2xl p-2 animate-slide-up z-50 overflow-hidden">
                      <div className="text-[9px] font-bold text-gray-400 uppercase px-3 py-2 border-b border-gray-100 mb-1">Sales Operations</div>
                      {[
                        { icon: UserPlus, label: 'Add New Lead', color: 'text-emerald-600', cmd: 'create a new lead' },
                        { icon: Briefcase, label: 'Add Opportunity', color: 'text-indigo-600', cmd: 'create a new opportunity' },
                        { icon: ClipboardList, label: 'Create Task', color: 'text-amber-600', cmd: 'create a new task' },
                        { icon: Building2, label: 'Add Account', color: 'text-sky-600', cmd: 'create a new account' },
                        { icon: Contact, label: 'Add Contact', color: 'text-rose-600', cmd: 'create a new contact' },
                        { icon: Users2, label: 'Create Group', color: 'text-purple-600', cmd: 'create a new group' },
                        { icon: CalendarIcon, label: 'Schedule Event', color: 'text-blue-600', cmd: 'schedule a meeting' },
                        { icon: FileDown, label: 'Upload File', color: 'text-blue-600', cmd: 'upload a file' },
                        { icon: Users2, label: 'New Group', color: 'text-orange-600', cmd: 'create a new group' },
                      ].map((action, i) => (
                        <button key={i} onClick={() => { sendMessage(action.cmd); setShowQuickActions(false) }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition-colors group text-left">
                          <div className={`w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                            <action.icon size={13} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input value={inputVal} onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400" />
                <button onClick={() => sendMessage()} disabled={typing}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                  <Send size={13} color="#fff" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {/* ── KPI SUMMARY MODAL ── */}
      {showKPIModal && (
        <KPIModal
          kpi={activeKPIs.find(k => k.label === selectedKPI)}
          onClose={() => setShowKPIModal(false)}
          channelData={activeChannels}
          onViewDetails={() => {
            setShowKPIModal(false)
            setTimeout(() => {
              const el = document.getElementById('drilldown-analysis')
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 300)
          }}
        />
      )}
    </div>
  )
}
export default Dashboard
