import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Zap, Bell, Search, Calendar, ChevronDown, Download, Upload, Plus,
  Filter, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Users, PieChart, DollarSign, Settings, LogOut,
  TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle,
  MessageSquare, Send, Bot, RefreshCw, Smartphone, Globe, Shield,
  Lock, Key, FileText, Share2, Mail, ExternalLink,
  Wifi, Target, Briefcase, Building2, Contact,
  ClipboardList, Users2, FileDown, UploadCloud, BarChart3,
  Palette, User, Database, BellRing, Sun, Moon, Sparkles, Mic2, ShieldAlert, Flame, BookOpen, Layers, ChevronRight, AlertTriangle,
  Cloud, UserPlus, Headset, X, Activity, MoreVertical, Eye, Edit3, Trash2,
  ThumbsUp, ThumbsDown, Copy, Edit2, Pin, MessageCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, Legend,
  ComposedChart, ScatterChart, Scatter, ZAxis
} from 'recharts'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'


// ──────────────────────────────────────────────────────────────
// OVERALL THEME COLORS (Picture 1 Palette)
// ──────────────────────────────────────────────────────────────
const COLORS = {
  primary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  surface: '#FFFFFF',
  background: '#FAFAF8',
  textHeader: '#0F172A',
  textSecondary: '#64748B'
}

// ──────────────────────────────────────────────────────────────
// MOCK DATA (Enriched for Picture 1 styling)
// ──────────────────────────────────────────────────────────────
const GAUGE_DATA = [
  { name: 'Achieved', value: 73, fill: '#4F46E5' },
  { name: 'Remaining', value: 27, fill: '#F1F5F9' },
]

const HEATMAP_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day, hour, value: Math.floor(Math.random() * 100)
  }))
).flat()

const BUBBLE_DATA = [
  { x: 45, y: 12000, z: 200, status: 'Hot', name: 'Global Tech' },
  { x: 30, y: 5000, z: 100, status: 'Warm', name: 'Lite Soft' },
  { x: 80, y: 45000, z: 400, status: 'Hot', name: 'Mega Corp' },
  { x: 60, y: 15000, z: 150, status: 'Cold', name: 'Small Biz' },
  { x: 20, y: 8000, z: 80, status: 'Warm', name: 'Quick Ship' },
  { x: 90, y: 35000, z: 300, status: 'Hot', name: 'Sky Net' },
  { x: 50, y: 22000, z: 250, status: 'Hot', name: 'Inno Lab' },
]

const WATERFALL_DATA = [
  { month: 'Jan', gain: 45000, loss: 0, total: 45000 },
  { month: 'Feb', gain: 12000, loss: -5000, total: 52000 },
  { month: 'Mar', gain: 25000, loss: -8000, total: 69000 },
  { month: 'Apr', gain: 0, loss: -15000, total: 54000 },
  { month: 'May', gain: 30000, loss: 0, total: 84000 },
  { month: 'Jun', gain: 15000, loss: -2000, total: 97000 },
]

const SCATTER_PLOT_DATA = Array.from({ length: 30 }, () => ({
  score: Math.floor(Math.random() * 100),
  revenue: Math.floor(Math.random() * 50000) + 5000,
  source: ['Web', 'Phone', 'Partner'][Math.floor(Math.random() * 3)]
}))

const DEFAULT_REVENUE_DATA = [
  { month: 'Jan', revenue: 0, benchmark: 100000 },
  { month: 'Feb', revenue: 0, benchmark: 200000 },
  { month: 'Mar', revenue: 0, benchmark: 300000 },
  { month: 'Apr', revenue: 0, benchmark: 400000 },
  { month: 'May', revenue: 0, benchmark: 500000 },
]

const getLeadValue = (l) => {
  const ratings = { 'Hot': 45000, 'Warm': 12000, 'Cold': 2500 };
  return ratings[l.Rating] || 5000;
};

// Legacy activity list removed to avoid confusion with live Salesforce data.

const aiHoverPills = ["What's our MRR growth?", "Which customers are...", "Show top acquisition..."]

// ── FORM FIELD CONFIGURATIONS ──
const FORMS = {
  Opportunity: [
    { name: 'Name', label: 'Opportunity Name', type: 'text', required: true, placeholder: 'Enter opportunity name *', full: true },
    { name: 'Amount', label: 'Amount ($)', type: 'number', placeholder: 'Enter expected amount' },
    { name: 'StageName', label: 'Stage', type: 'select', required: true, options: ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Id. Decision Makers', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'] },
    { name: 'CloseDate', label: 'Close Date', type: 'date', required: true },
    { name: 'Probability', label: 'Probability (%)', type: 'number', placeholder: '0-100' },
    { name: 'LeadSource', label: 'Lead Source', type: 'select', options: ['Web', 'Phone', 'Partner', 'Referral', 'Chatbot AI'] },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Lead: [
    { name: 'FirstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
    { name: 'LastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name *' },
    { name: 'Company', label: 'Company', type: 'text', required: true, placeholder: 'Enter company name *' },
    { name: 'Email', label: 'Email', type: 'email', placeholder: 'Enter email address' },
    { name: 'Phone', label: 'Phone', type: 'tel', placeholder: 'Enter phone number' },
    { name: 'Status', label: 'Status', type: 'select', options: ['New', 'Working', 'Nurturing', 'Unqualified', 'Converted'] },
    { name: 'Rating', label: 'Rating', type: 'select', options: ['Hot', 'Warm', 'Cold'] },
    { name: 'LeadSource', label: 'Lead Source', type: 'select', options: ['Web', 'Phone', 'Email', 'Referral', 'Chatbot AI'] },
    { name: 'Industry', label: 'Industry', type: 'select', options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'] },
    { name: 'AnnualRevenue', label: 'Annual Revenue', type: 'number', placeholder: 'Enter revenue' },
    { name: 'Description', label: 'Description', type: 'textarea', placeholder: 'Enter details', full: true }
  ],
  Account: [
    { name: 'Name', label: 'Account Name', type: 'text', required: true, placeholder: 'Enter account name *', full: true },
    { name: 'Industry', label: 'Industry', type: 'select', options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'] },
    { name: 'Type', label: 'Account Type', type: 'select', options: ['Prospect', 'Customer', 'Partner', 'Competitor'] },
    { name: 'Website', label: 'Website', type: 'url', placeholder: 'https://...' },
    { name: 'Phone', label: 'Phone', type: 'tel' },
    { name: 'BillingStreet', label: 'Billing Address', type: 'textarea', full: true },
    { name: 'AnnualRevenue', label: 'Annual Revenue', type: 'number' },
    { name: 'NumberOfEmployees', label: 'Employees', type: 'number' },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Contact: [
    { name: 'FirstName', label: 'First Name', type: 'text' },
    { name: 'LastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name *' },
    { name: 'Title', label: 'Job Title', type: 'text' },
    { name: 'Email', label: 'Email', type: 'email', full: true },
    { name: 'Phone', label: 'Phone', type: 'tel' },
    { name: 'MobilePhone', label: 'Mobile', type: 'tel' },
    { name: 'Department', label: 'Department', type: 'text' },
    { name: 'MailingStreet', label: 'Mailing Address', type: 'textarea', full: true },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Task: [
    { name: 'Subject', label: 'Subject', type: 'text', required: true, placeholder: 'What needs to be done? *', full: true },
    { name: 'Status', label: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Completed', 'Waiting', 'Deferred'] },
    { name: 'Priority', label: 'Priority', type: 'select', options: ['High', 'Normal', 'Low'] },
    { name: 'ActivityDate', label: 'Due Date', type: 'date' },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Event: [
    { name: 'Subject', label: 'Subject', type: 'text', required: true, placeholder: 'Meeting title *', full: true },
    { name: 'StartDateTime', label: 'Start Time', type: 'datetime-local', required: true },
    { name: 'EndDateTime', label: 'End Time', type: 'datetime-local', required: true },
    { name: 'Location', label: 'Location', type: 'text' },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Campaign: [
    { name: 'Name', label: 'Campaign Name', type: 'text', required: true, placeholder: 'Enter campaign name *', full: true },
    { name: 'Status', label: 'Status', type: 'select', options: ['Planned', 'In Progress', 'Completed', 'Aborted'] },
    { name: 'Type', label: 'Type', type: 'select', options: ['Conference', 'Webinar', 'Trade Show', 'Public Relations', 'Partners', 'Referral Program', 'Other'] },
    { name: 'StartDate', label: 'Start Date', type: 'date' },
    { name: 'EndDate', label: 'End Date', type: 'date' }
  ],
  Report: [
    { name: 'Name', label: 'Report Name', type: 'text', required: true, placeholder: 'Enter report name *', full: true },
    { name: 'Format', label: 'Format', type: 'select', options: ['Tabular', 'Summary', 'Matrix', 'Joined'] },
    { name: 'Description', label: 'Description', type: 'textarea', full: true }
  ],
  Group: [
    { name: 'Name', label: 'Group Name', type: 'text', required: true, placeholder: 'Enter group name *', full: true },
    { name: 'Description', label: 'Description', type: 'textarea', full: true },
    { name: 'CollaborationType', label: 'Access', type: 'select', options: ['Public', 'Private', 'Unlisted'] }
  ]
}

// ──────────────────────────────────────────────────────────────
// COMPONENTS
// ──────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-gray-100 rounded-2xl ring-4 ring-indigo-50/50">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-3 mb-1.5 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <p className="text-xs font-black text-slate-900">{p.name}: ${p.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const HealthBadge = ({ status }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${status === 'Healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
    <span className="text-xs font-bold text-slate-600">{status}</span>
  </div>
)


// ── KPI DETAIL MODAL ──
function KPIDetailModal({ label, value, change, icon: Icon, color, positive, onClose }) {
  const trendData = React.useMemo(() => [
    { m: 'Oct', v: 34 }, { m: 'Nov', v: 42 }, { m: 'Dec', v: 51 },
    { m: 'Jan', v: 58 }, { m: 'Feb', v: 62 }, { m: 'Mar', v: 71 },
  ], [])
  const sources = [
    { name: 'Direct', pct: 60 },
    { name: 'Organic', pct: 25 },
    { name: 'Paid', pct: 15 },
  ]

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-[360px] rounded-[28px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(79,70,229,0.35)]"
        onClick={e => e.stopPropagation()}
      >
        {/* ── GRADIENT HEADER ── */}
        <div
          className="relative px-7 pt-7 pb-14 overflow-hidden"
          style={{ background: 'linear-gradient(140deg, #4F46E5 0%, #7C3AED 55%, #818CF8 100%)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={15} />
          </button>
          {/* Watermark */}
          <div className="absolute right-5 top-4 opacity-[0.08] pointer-events-none">
            <Icon size={90} color="white" />
          </div>
          {/* Label */}
          <p className="text-[9px] font-black text-white/55 uppercase tracking-[0.22em] mb-3 leading-none">
            {label} Summary
          </p>
          {/* Value */}
          <h2 className="text-[42px] font-black text-white leading-none tracking-tight">{value}</h2>
        </div>

        {/* ── WHITE BODY ── */}
        <div className="bg-white">

          {/* Trend chart card — overlapping the header */}
          <div className="mx-5 -mt-7 relative z-10 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] border border-slate-50 overflow-hidden">
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kpiModalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone" dataKey="v"
                    stroke="#4F46E5" strokeWidth={2.5}
                    fill="url(#kpiModalGrad)" dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Chart footer labels */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-50">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">30 Day Trend</span>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">↑ Growth Identified</span>
            </div>
          </div>

          {/* ── IMPACT + STATUS ROW ── */}
          <div className="grid grid-cols-2 gap-3 mx-5 mt-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2 leading-none">Impact Velocity</p>
              <div className={`flex items-center gap-1.5 text-[17px] font-black leading-none ${positive ? 'text-emerald-500' : 'text-amber-500'}`}>
                {change || '+4.8%'}
                {positive ? <TrendingUp size={15} strokeWidth={3} /> : <TrendingDown size={15} strokeWidth={3} />}
              </div>
            </div>
            <div className="p-4 bg-slate-50/70 rounded-2xl">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2 leading-none">Status Intelligence</p>
              <div className="flex items-center gap-1.5 text-[13px] font-black text-emerald-600 leading-none">
                Healthy Flow
                <CheckCircle size={13} strokeWidth={2.5} className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* ── ENGAGEMENT SOURCE DISTRIBUTION ── */}
          <div className="mx-5 mt-5">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3 leading-none">Engagement Source Distribution</p>
            <div className="space-y-3">
              {sources.map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-bold text-slate-600">{s.name}</span>
                    <span className="text-[12px] font-black text-indigo-600">{s.pct}%</span>
                  </div>
                  <div className="h-[5px] bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.pct}%`, background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA BUTTON ── */}
          <div className="mx-5 mt-5 mb-5">
            <button
              onClick={onClose}
              className="w-full py-[14px] rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
            >
              Access Full Operational Intelligence
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </div>{/* end white body */}
      </div>
    </div>
  )
}


function KPICard({ label, value, change, icon: Icon, color, secondaryLabel, positive }) {
  const [showDetail, setShowDetail] = React.useState(false)
  return (
    <>
      <div
        className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden active:scale-[0.98]"
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: color + '10' }}>
            <Icon size={22} style={{ color: color }} />
          </div>
          {secondaryLabel && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{secondaryLabel}</span>
            </div>
          )}
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
          {change && <span className={`text-[10px] font-black ${positive ? 'text-emerald-500' : 'text-amber-500'}`}>{change}</span>}
        </div>
        {/* Tap hint */}
        <div className="absolute bottom-3 right-4 text-[8px] font-black text-slate-200 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Tap for details</div>
      </div>
      {showDetail && (
        <KPIDetailModal
          label={label} value={value} change={change} icon={Icon} color={color} positive={positive}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  )
}


function ConnectSalesforceModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-[40px] p-10 relative z-10 text-center shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Cloud size={120} /></div>
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6"><Shield size={32} /></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Connect Salesforce</h2>
        <p className="text-sm text-slate-500 mb-8 px-4">Authorize Pulsar AI to access your CRM metadata for live intelligence streams.</p>
        <button onClick={() => window.location.href = 'http://localhost:3001/auth'} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">Secure OAuth Login</button>
        <button onClick={onClose} className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-400 transition-colors">Maybe Later</button>
      </div>
    </div>
  )
}


const LANGUAGE_MAP = {
  en: {
    welcome: "👋 Hi! I'm your analytics AI. Ask me about revenue, churn, or CRM operations!",
    creating: "Initiating high-fidelity creation flow for {object}...",
    updating: "Please select the {object} you wish to modify:",
    deleting: "Select a {object} for secure deletion:",
    error: "❌ Failed: {message}",
    success: "✅ {record} created successfully!",
    deleted: "🗑️ Record Deleted: {name} removed from Salesforce.",
    noMatch: "I'm standing by for CRM operations. Use the '+' menu for creation or updates."
  },
  ta: {
    welcome: "👋 வணக்கம்! நான் உங்கள் பகுப்பாய்வு AI. வருவாய் அல்லது CRM செயல்பாடுகள் பற்றி கேளுங்கள்!",
    creating: "{object} உருவாக்கத் தொடங்குகிறது...",
    updating: "நீங்கள் மாற்ற விரும்பும் {object}-ஐத் தேர்ந்தெடுக்கவும்:",
    deleting: "பாதுகாப்பாக நீக்க ஒரு {object}-ஐத் தேர்ந்தெடுக்கவும்:",
    error: "❌ தோல்வி: {message}",
    success: "✅ {record} வெற்றிகரமாக உருவாக்கப்பட்டது!",
    deleted: "🗑️ பதிவு நீக்கப்பட்டது: {name} விற்பனையகத்திலிருந்து அகற்றப்பட்டது.",
    noMatch: "CRM செயல்பாடுகளுக்காக நான் காத்திருக்கிறேன். புதியவைகளுக்கு '+' மெனுவைப் பயன்படுத்தவும்."
  },
  hi: {
    welcome: "👋 नमस्ते! मैं आपका एनालिटिक्स एआई हूं। मुझसे राजस्व या सीआरएम संचालन के बारे में पूछें!",
    creating: "{object} बनाने की प्रक्रिया शुरू हो रही है...",
    updating: "कृपया वह {object} चुनें जिसे आप बदलना चाहते हैं:",
    deleting: "सुरक्षित रूप से हटाने के लिए एक {object} चुनें:",
    error: "❌ विफल: {message}",
    success: "✅ {record} सफलतापूर्वक बनाया गया!",
    deleted: "🗑️ रिकॉर्ड हटा दिया गया: {name} को सेल्सफोर्स से हटा दिया गया है।",
    noMatch: "मैं CRM संचालन के लिए तैयार हूं। नई चीज़ों के लिए '+' मेनू का उपयोग करें।"
  }
}

function ChatTable({ data, title, object }) {
  if (!data || data.length === 0) return <div className="text-[10px] font-bold text-slate-400 uppercase p-4 italic">No results found in ${object}s.</div>
  const cols = Object.keys(data[0]).filter(k => k !== 'Id' && k !== 'attributes' && typeof data[0][k] !== 'object').slice(0, 4)
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] shadow-xl overflow-hidden w-full max-w-lg mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{title}</h5>
        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{data.length} RECORDS</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/20">
              {cols.map(c => <th key={c} className="px-6 py-3 font-black text-slate-400 uppercase tracking-tighter">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-0">
                {cols.map(c => <td key={c} className="px-6 py-4 font-bold text-slate-600 truncate max-w-[120px]">{row[c] || '-'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 5 && <div className="p-3 text-center border-t border-gray-50 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-slate-50 cursor-pointer">View full report on Dashboard</div>}
    </div>
  )
}

function FileUpload({ onComplete, onCancel }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const res = await fetch('http://localhost:3001/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, content: base64 })
        })
        if (res.ok) onComplete(`✅ **File Uploaded:** ${file.name} attached to Salesforce successfully.`)
      }
      reader.readAsDataURL(file)
    } catch (e) { }
  }

  return (
    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-2xl space-y-6 w-full max-w-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FileText size={24} /></div>
        <div>
          <h4 className="font-black text-slate-800 uppercase text-[11px] tracking-widest">Chatbot File Sync</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Secure Salesforce Upload</p>
        </div>
      </div>
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-[32px] text-center hover:border-indigo-200 transition-colors cursor-pointer relative group">
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
        <Upload size={32} className="mx-auto text-slate-200 group-hover:text-indigo-400 transition-all mb-2" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file ? file.name : "Drop file or Click to Browse"}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={handleUpload} disabled={!file || uploading} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-100 disabled:opacity-30">{uploading ? 'Uploading...' : 'Confirm Upload'}</button>
        <button onClick={onCancel} className="px-6 bg-slate-50 text-slate-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest">Cancel</button>
      </div>
    </div>
  )
}

function DetailedForm({ title, fields, initialData, onComplete, onCancel, icon: Icon, object, method = 'POST', refresh }) {
  const [form, setForm] = useState(initialData || {})
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      const url = method === 'PUT' ? `http://localhost:3001/api/${object.toLowerCase()}s/${form.Id}` : `http://localhost:3001/api/${object.toLowerCase()}s`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        onComplete(`✅ **Success:** ${title} ${method === 'PUT' ? 'Updated' : 'Created'} successfully. 📋 ID: ${data.id || form.Id || 'NEW'}`)
        if (refresh) refresh()
      } else {
        throw new Error(data.error || `Server returned ${res.status}`)
      }
    } catch (e) {
      console.error(e)
      onComplete(`❌ **Operation Failed:** ${e.message}. Ensure you are connected to Salesforce and the fields are valid.`)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-2xl space-y-6 w-full max-w-md animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 uppercase text-[11px] tracking-[0.2em]">{title}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Standard Object Interface</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
        {fields.map(f => (
          <div key={f.name} className={f.full ? 'col-span-2' : ''}>
            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-1 mb-1 block">{f.label}{f.required ? '*' : ''}</label>
            {f.type === 'select' ? (
              <select className="w-full bg-slate-50 p-4 text-xs rounded-2xl border-none outline-none focus:ring-4 ring-indigo-50 font-black tracking-tight transition-all" value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}>
                <option value="">--None--</option>
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="w-full bg-slate-50 p-4 text-xs rounded-2xl border-none outline-none focus:ring-4 ring-indigo-50 font-bold min-h-[80px]" value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} />
            ) : (
              <input
                type={f.type || 'text'}
                className="w-full bg-slate-50 p-4 text-xs rounded-2xl border-none outline-none focus:ring-4 ring-indigo-50 font-black tracking-tight transition-all placeholder-slate-200"
                placeholder={f.placeholder}
                value={form[f.name] || ''}
                onChange={e => setForm({ ...form, [f.name]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-50">
        <button onClick={submit} disabled={loading} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
          {loading ? 'Processing...' : method === 'PUT' ? 'Confirm Update' : 'Create Record'}
        </button>
        <button onClick={onCancel} className="px-6 bg-slate-50 text-slate-400 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Cancel</button>
      </div>
    </div>
  )
}

function RecordSelector({ type, onSelect, onCancel, title }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  const search = async () => {
    setSearching(true)
    try {
      const endpoint = type === 'Lead' ? 'leads' : type === 'Account' ? 'accounts' : type === 'Opportunity' ? 'opportunities' : type === 'Contact' ? 'contacts' : type === 'Task' ? 'tasks' : 'events'
      const res = await fetch(`http://localhost:3001/api/${endpoint}`)
      const data = await res.json()
      if (data.success) {
        const records = data.leads || data.accounts || data.opportunities || data.contacts || data.tasks || data.events || []
        setResults(records.filter(r => (r.Name || r.LastName || r.Subject || '').toLowerCase().includes(query.toLowerCase())))
      }
    } catch (e) { }
    setSearching(false)
  }

  return (
    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-2xl space-y-6 w-full max-w-xl animate-in zoom-in duration-300">
      <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2 px-1">{title}</div>
      <div className="flex gap-2">
        <input className="flex-1 bg-slate-50 p-4 text-xs rounded-2xl outline-none focus:ring-4 ring-indigo-50 font-black tracking-tight" placeholder={`Search ${type}...`} value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={search} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 active:scale-90 transition-all"><Search size={18} /></button>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-2">
        {results.map(r => (
          <button key={r.Id} onClick={() => onSelect(r)} className="w-full text-left p-4 rounded-2xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group flex items-center justify-between">
            <div>
              <div className="font-black text-slate-800 text-[13px]">{r.Name || r.LastName || r.Subject}</div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{r.Company || r.Industry || r.StageName || r.Status || 'CRM Record'}</div>
            </div>
            <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-600 translate-x-0 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
        {results.length === 0 && !searching && <div className="text-center py-8 text-[10px] font-black text-slate-200 uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-[32px]">No records found</div>}
      </div>
      <button onClick={onCancel} className="w-full py-4 text-[11px] font-black text-slate-300 uppercase tracking-widest hover:text-rose-500 transition-colors">Abort Operation</button>
    </div>
  )
}

// ── NEW: MAIN REGISTRY TABLE FOR ALL OBJECTS ──

const MainRegistryTable = ({ title, data, columns, onSearch, icon: Icon, onAdd, onWipeAll, onActionClick }) => (
  <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-sm shadow-slate-200/10 animate-in fade-in duration-700">
    <div className="px-10 py-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
      <h3 className="font-black text-xl tracking-tight flex items-center gap-3">
        {Icon && <Icon size={24} className="text-indigo-600" />} {title}
      </h3>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-1 md:flex-none relative flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-slate-200 shadow-inner">
          <Search size={14} className="text-slate-300" />
          <input
            className="bg-transparent text-xs px-2 outline-none w-full md:w-48 font-bold"
            placeholder={`Search ${title.toLowerCase()}...`}
            onChange={e => onSearch && onSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-600">
          <Filter size={16} /> Filter
        </button>
        {onAdd && (
          <button
            onClick={(e) => onAdd(e)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={16} /> New Entry
          </button>
        )}
        {onWipeAll && data.length > 0 && (
          <button
            onClick={onWipeAll}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-rose-50 text-rose-600 text-xs font-black border border-rose-100 hover:bg-rose-100 transition-all ml-2"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
            {columns.map(col => <th key={col.key} className="px-10 py-5">{col.label}</th>)}
            <th className="px-10 py-5 text-right pr-14">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? data.map((row, i) => (
            <tr key={i} className="hover:bg-indigo-50/10 transition-colors group">
              {columns.map(col => (
                <td key={col.key} className="px-10 py-6">
                  {col.render ? col.render(row) : (
                    <div className="font-bold text-[13px] text-slate-600 italic">
                      {String(row[col.key] || '-')}
                    </div>
                  )}
                </td>
              ))}
              <td className="px-10 py-6 text-right pr-14">
                <button 
                  onClick={(e) => onActionClick && onActionClick(e, row)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${row._menuOpen ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-indigo-600 hover:bg-slate-50'}`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-10 py-32 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-200">
                     <Database size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching Salesforce records discovered</p>
                    <p className="text-[11px] font-bold text-slate-300 mt-1">Try refreshing the connection or check your Salesforce Org</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {data.length > 0 && (
      <div className="px-10 py-6 border-t border-gray-50 flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
        <span>Displaying {data.length} records</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-gray-50 disabled:opacity-30" disabled>Previous</button>
          <button className="px-4 py-2 rounded-xl bg-gray-100 text-slate-900">Next</button>
        </div>
      </div>
    )}
  </div>
)

// ── CONTEXTUAL ACTION MENU ──
function ContextualMenu({ x, y, record, type, onClose, onEdit, onDelete, onStageChange, onSync }) {
  const containerRef = useRef(null)
  const [showStageSubmenu, setShowStageSubmenu] = useState(false)

  const stages = ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Id. Decision Makers', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost']

  return (
    <div
      className="fixed z-[500] min-w-[180px] bg-white rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-150"
      style={{ left: Math.min(x, window.innerWidth - 200), top: y + 8 }}
      onClick={e => e.stopPropagation()}
    >
      <button onClick={() => onEdit(record, type)} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-sky-50 text-slate-700 transition-colors group">
        <Edit3 size={15} className="text-slate-400 group-hover:text-sky-600" />
        <span className="text-[13px] font-bold">Edit</span>
      </button>

      {type === 'Opportunity' && (
        <div className="relative group/sub" onMouseEnter={() => setShowStageSubmenu(true)} onMouseLeave={() => setShowStageSubmenu(false)}>
          <button className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-sky-50 text-slate-700 transition-colors group">
            <div className="flex items-center gap-3">
              <RefreshCw size={15} className="text-slate-400 group-hover:text-sky-600" />
              <span className="text-[13px] font-bold">Change Stage</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
          {showStageSubmenu && (
            <div className="absolute left-full top-0 ml-1 min-w-[200px] bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-left-2 duration-150">
              {stages.map(s => (
                <button
                  key={s}
                  onClick={() => onStageChange(record, s)}
                  className={`w-full px-4 py-2 text-left text-[11px] font-black uppercase tracking-widest hover:bg-sky-50 transition-colors ${record.StageName === s ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={() => onSync(type)} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-sky-50 text-slate-700 transition-colors group">
        <UploadCloud size={15} className="text-slate-400 group-hover:text-sky-600" />
        <span className="text-[13px] font-bold">Sync to Salesforce</span>
      </button>

      <div className="my-1 border-t border-slate-50" />

      <button onClick={() => onDelete(record, type)} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-rose-50 text-rose-600 transition-colors group">
        <Trash2 size={15} className="text-rose-400 group-hover:text-rose-600" />
        <span className="text-[13px] font-bold">Delete</span>
      </button>
    </div>
  )
}

// ── TOAST NOTIFICATION ──
function ToastNotification({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-[28px] shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' :
      type === 'error' ? 'bg-rose-600 text-white' :
        'bg-slate-900 text-white'
      }`}>
      {type === 'success' && <CheckCircle size={18} />}
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'info' && <Sparkles size={18} />}
      <span className="text-[13px] font-black">{message}</span>
    </div>
  )
}

// ── CONNECT APP MODAL ──
function ConnectAppModal({ onClose, onConnect }) {
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState(null)
  const apps = [
    { name: 'Stripe', icon: '💳', desc: 'Payment & subscription intelligence', auth: 'API Key' },
    { name: 'Zapier', icon: '⚡', desc: 'Workflow automation & triggers', auth: 'OAuth' },
    { name: 'Mailchimp', icon: '📧', desc: 'Email marketing campaigns', auth: 'API Key' },
    { name: 'Twilio', icon: '📱', desc: 'SMS & voice notifications', auth: 'API Key' },
    { name: 'Notion', icon: '📄', desc: 'Knowledge base & documentation', auth: 'OAuth' },
    { name: 'Jira', icon: '🛠️', desc: 'Project & issue tracking', auth: 'OAuth' },
  ]
  const [apiKey, setApiKey] = useState('')
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">{step === 1 ? 'Connect New App' : `Authorize ${selected?.name}`}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        {step === 1 ? (
          <div className="p-8">
            <div className="grid grid-cols-2 gap-3">
              {apps.map(app => (
                <button key={app.name} onClick={() => { setSelected(app); setStep(2) }}
                  className="flex items-center gap-4 p-4 rounded-[24px] border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <div className="font-black text-[13px] text-slate-800 group-hover:text-indigo-700">{app.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{app.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[24px]">
              <span className="text-3xl">{selected?.icon}</span>
              <div>
                <div className="font-black text-[15px] text-slate-800">{selected?.name}</div>
                <div className="text-[10px] font-bold text-slate-400">{selected?.auth} Authorization</div>
              </div>
            </div>
            {selected?.auth === 'API Key' ? (
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{selected?.name} API Key</label>
                <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste your API key here..." className="w-full bg-slate-50 px-4 py-4 rounded-2xl text-xs font-mono font-bold text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 transition-all" />
              </div>
            ) : (
              <div className="p-5 bg-indigo-50/50 rounded-[24px] border border-indigo-100 text-[12px] font-bold text-indigo-700">
                You will be redirected to {selected?.name} to authorize Pulsar AI. Click Connect to continue.
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { onConnect(selected); onClose() }} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">Connect {selected?.name}</button>
              <button onClick={() => setStep(1)} className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ADD WEBHOOK MODAL ──
function AddWebhookModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ event: '', url: '', method: 'POST' })
  const events = ['lead.created', 'lead.updated', 'opportunity.won', 'opportunity.lost', 'contact.created', 'contact.updated', 'task.completed', 'account.created']
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900">Add Webhook</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="p-8 space-y-5">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event Trigger</label>
            <select value={form.event} onChange={e => setForm({ ...form, event: e.target.value })} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50">
              <option value="">-- Select an event --</option>
              {events.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Endpoint URL</label>
            <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://your-endpoint.com/webhook" className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[12px] font-mono font-bold text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 transition-all" />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">HTTP Method</label>
            <div className="flex gap-2">
              {['POST', 'PUT', 'PATCH'].map(m => (
                <button key={m} onClick={() => setForm({ ...form, method: m })} className={`px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all ${form.method === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { if (form.event && form.url) { onAdd(form); onClose() } }} disabled={!form.event || !form.url}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40">Register Webhook</button>
            <button onClick={onClose} className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── NEW: CHART INTERACTIVE COMPONENTS ──

const ChartIntelligencePanel = ({ name, explanation, insight, action }) => (
  <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-500 overflow-y-auto">
    <div className="flex items-center gap-2 mb-6">
      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6C5CE7]">
        <Sparkles size={16} />
      </div>
      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{name} Insight</h4>
    </div>

    <div className="space-y-6">
      <div>
        <div className="text-[8px] font-black text-[#6C5CE7] uppercase tracking-[0.2em] mb-2 opacity-60">Intelligence Overview</div>
        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">{explanation}</p>
      </div>

      <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50/50">
        <div className="text-[8px] font-black text-[#6C5CE7] uppercase tracking-[0.2em] mb-2">Live CRM Signal</div>
        <p className="text-[12px] font-black text-slate-800 leading-snug">{insight}</p>
      </div>

      <div>
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Recommended Action</div>
        <div className="flex items-center gap-3 group/act cursor-pointer">
          <div className="flex-1 text-[11px] font-black text-slate-500 group-hover/act:text-indigo-600 transition-colors uppercase tracking-tighter line-clamp-2">{action}</div>
          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover/act:bg-indigo-600 group-hover/act:text-white transition-all"><ArrowUpRight size={12} /></div>
        </div>
      </div>
    </div>
  </div>
)

// ── FLASHCARD WRAPPER — shared shell for every chart card ──
const ChartFlashcard = ({ title, subtitle, kpis, badge, badgeColor = 'indigo', gradientFrom = '#4F46E5', gradientTo = '#7C3AED', children, footer }) => (
  <div className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/60 hover:shadow-2xl hover:shadow-indigo-100/30 hover:-translate-y-0.5 transition-all duration-500 group">
    {/* ── GRADIENT HEADER ── */}
    <div className="relative px-8 pt-7 pb-5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] mb-1">{subtitle}</p>
          <h3 className="text-[17px] font-black text-white leading-tight tracking-tight">{title}</h3>
        </div>
        {badge && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{badge}</span>
          </div>
        )}
      </div>
      {/* KPI strip */}
      {kpis && (
        <div className="flex items-center gap-6">
          {kpis.map((k, i) => (
            <div key={i}>
              <div className="text-[19px] font-black text-white leading-none">{k.value}</div>
              <div className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-0.5">{k.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* ── CHART BODY ── */}
    <div className="px-8 pt-6 pb-4">
      {children}
    </div>
    {/* ── FOOTER INSIGHT ── */}
    {footer && (
      <div className="mx-8 mb-6 px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
        <p className="text-[11px] font-black text-slate-600 leading-snug">{footer.text}</p>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${footer.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
            footer.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
          }`}>{footer.label}</span>
      </div>
    )}
  </div>
)

// ── CHART SUMMARY GRID — reusable detail summary row ──
const ChartSummaryGrid = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-50">
    {stats.map((s, i) => (
      <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/60 transition-colors">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg || '#EEF2FF', color: s.color || '#4F46E5' }}>
          <s.icon size={15} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-black text-slate-900 leading-tight tracking-tight">{s.value}</div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 leading-none">{s.label}</div>
          {s.trend && (
            <div className={`inline-flex items-center gap-0.5 mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : s.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
              }`}>{s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→'} {s.trendLabel}</div>
          )}
        </div>
      </div>
    ))}
  </div>
)

const LeadsIntelligenceSummary = ({ leads }) => {
  const stats = [
    { label: 'Total Intake', value: leads.length, icon: Activity, color: 'indigo' },
    { label: 'High Priority', value: leads.filter(l => (l.Rating || '').includes('Hot')).length, icon: Flame, color: 'rose' },
    { label: 'Outreach Pace', value: leads.filter(l => (l.Status || '').includes('Working')).length, icon: TrendingUp, color: 'emerald' },
    { label: 'Pipe Potential', value: `$${(leads.filter(l => (l.Rating || '').includes('Hot')).length * 15500).toLocaleString()}`, icon: DollarSign, color: 'amber' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {stats.map((s, i) => (
        <div key={i} className="premium-card p-6 flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-default overflow-hidden relative border-none shadow-sm shadow-slate-100 bg-white rounded-[32px]">
          <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] bg-current group-hover:scale-150 transition-transform duration-700`} style={{ color: `var(--${s.color}-500)` }} />
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm`} style={{ backgroundColor: s.color === 'indigo' ? '#EEF2FF' : s.color === 'rose' ? '#FFF1F2' : s.color === 'emerald' ? '#ECFDF5' : '#FFFBEB', color: s.color === 'indigo' ? '#4F46E5' : s.color === 'rose' ? '#F43F5E' : s.color === 'emerald' ? '#10B981' : '#F59E0B' }}><s.icon size={20} /></div>
          <div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{s.label}</div>
            <div className="text-2xl font-black text-slate-900 leading-none">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ──────────────────────────────────────────────────────────────

// ── ADVANCED ANALYTICS COMPONENTS ──

// ── QUOTA ATTAINMENT — Flashcard ──
const QuotaAttainmentGauge = ({ data }) => {
  const achievedPercent = data ? Math.floor((data[0].value / (data[0].value + data[1].value)) * 100) : 73
  const remainPct = 100 - achievedPercent
  return (
    <ChartFlashcard
      title="Quota Attainment"
      subtitle="Sales Performance"
      badge="Live Target"
      gradientFrom="#4F46E5" gradientTo="#7C3AED"
      kpis={[
        { value: `${achievedPercent}%`, label: 'Achieved' },
        { value: `${remainPct}%`, label: 'Remaining' },
        { value: 'On Track', label: 'Status' },
      ]}
      footer={{ text: 'Quota target at pace for Q close. Review pipeline velocity.', label: '↑ Healthy', trend: 'up' }}
    >
      <div className="h-[220px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <defs>
              <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            <Pie
              data={data || GAUGE_DATA}
              cx="50%" cy="80%"
              startAngle={180} endAngle={0}
              innerRadius={75} outerRadius={110}
              paddingAngle={0} dataKey="value" stroke="none"
            >
              <Cell fill="url(#gaugeGrad)" />
              <Cell fill="#F1F5F9" />
            </Pie>
          </RePieChart>
        </ResponsiveContainer>
        <div className="absolute top-[64%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-5xl font-black text-slate-900 leading-none">{achievedPercent}%</div>
          <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 bg-emerald-50 px-3 py-1 rounded-full">✓ On Track</div>
        </div>
      </div>
      {/* Progress bar breakdown */}
      <div className="space-y-2.5 mt-1">
        <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
          <span>Quota Progress</span><span className="text-indigo-600">{achievedPercent}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${achievedPercent}%`, background: 'linear-gradient(90deg,#4F46E5,#818CF8)' }} />
        </div>
      </div>
      <ChartSummaryGrid stats={[
        { icon: TrendingUp, value: `${achievedPercent}%`, label: 'Current Attainment', bg: '#EEF2FF', color: '#4F46E5', trend: 'up', trendLabel: `+${achievedPercent - 65}% vs last Q` },
        { icon: DollarSign, value: '$732k', label: 'Revenue Booked', bg: '#ECFDF5', color: '#10B981', trend: 'up', trendLabel: 'Above Pace' },
        { icon: Target, value: '$1.0M', label: 'Annual Target', bg: '#FFF7ED', color: '#F59E0B', trend: 'neutral', trendLabel: 'Q2 Target' },
        { icon: Clock, value: `${remainPct}%`, label: 'Gap to Close', bg: '#FFF1F2', color: '#F43F5E', trend: remainPct < 30 ? 'up' : 'down', trendLabel: remainPct < 30 ? 'Low gap' : 'Needs focus' },
      ]} />
    </ChartFlashcard>
  )
}

// ── LEAD ACTIVITY HEATMAP — Flashcard ──
const LeadActivityHeatMap = ({ data }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const totalEvents = (data || HEATMAP_DATA).reduce((s, d) => s + d.value, 0)
  const peakHour = (data || HEATMAP_DATA).reduce((best, d) => d.value > best.value ? d : best, { value: 0 })
  const avgPerDay = Math.round(totalEvents / 7)
  const peakDay = days[peakHour.day] || 'Wed'
  return (
    <ChartFlashcard
      title="Lead Activity Heatmap"
      subtitle="Engagement Intelligence"
      badge="7-Day Analysis"
      gradientFrom="#7C3AED" gradientTo="#0EA5E9"
      kpis={[
        { value: totalEvents, label: 'Total Signals' },
        { value: `${peakHour.hour}:00`, label: 'Peak Hour' },
        { value: '7 Days', label: 'Window' },
      ]}
      footer={{ text: 'Highest engagement detected in mid-morning business hours across all leads.', label: 'Schedule Outreach', trend: 'neutral' }}
    >
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[32px_1fr] gap-3 items-start">
          <div className="flex flex-col justify-between pt-0.5" style={{ gap: '5px' }}>
            {days.map(d => <span key={d} className="text-[8px] font-black text-slate-300 uppercase leading-none" style={{ height: '14px', display: 'flex', alignItems: 'center' }}>{d}</span>)}
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(24, 1fr)' }}>
            {(data || HEATMAP_DATA).map((d, i) => (
              <div
                key={i}
                className="rounded-[3px] transition-all hover:scale-150 hover:z-10 cursor-pointer"
                style={{ aspectRatio: '1', backgroundColor: `rgba(79,70,229,${0.07 + (d.value / 100) * 0.93})` }}
                title={`${days[d.day]} ${d.hour}:00 — ${d.value} events`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black text-slate-300 uppercase">00:00</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-black text-slate-300 uppercase">Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => <div key={o} className="w-3 h-2 rounded-sm" style={{ background: `rgba(79,70,229,${o})` }} />)}
            <span className="text-[8px] font-black text-slate-300 uppercase">High</span>
          </div>
          <span className="text-[8px] font-black text-slate-300 uppercase">23:00</span>
        </div>
      </div>
      <ChartSummaryGrid stats={[
        { icon: Activity, value: totalEvents, label: 'Total Signals', bg: '#F3F4FF', color: '#6366F1', trend: 'up', trendLabel: '+12% vs last week' },
        { icon: Clock, value: `${peakHour.hour}:00`, label: 'Peak Activity Hour', bg: '#F0FDF4', color: '#10B981', trend: 'neutral', trendLabel: 'Mid-morning slot' },
        { icon: TrendingUp, value: avgPerDay, label: 'Avg Events / Day', bg: '#FFF7ED', color: '#F59E0B', trend: 'up', trendLabel: 'Consistent pace' },
        { icon: Users, value: peakDay, label: 'Most Active Day', bg: '#EEF2FF', color: '#4F46E5', trend: 'neutral', trendLabel: 'Best outreach day' },
      ]} />
    </ChartFlashcard>
  )
}

// ── DEAL SIZE BUBBLE CHART — Flashcard ──
const DealSizeBubbleChart = ({ data }) => {
  const d = data || BUBBLE_DATA
  const hotCount = d.filter(x => x.status === 'Hot').length
  const warmCount = d.filter(x => x.status === 'Warm').length
  const coldCount = d.filter(x => x.status === 'Cold').length
  const totalRevPotential = d.reduce((s, x) => s + x.y, 0)
  const avgScore = Math.round(d.reduce((s, x) => s + x.x, 0) / d.length)
  return (
    <ChartFlashcard
      title="Deal Size Intelligence"
      subtitle="Revenue vs Lead Score"
      badge="Opportunity Map"
      gradientFrom="#0F172A" gradientTo="#1E293B"
      kpis={[
        { value: `${hotCount}`, label: 'Hot Deals' },
        { value: `$${(totalRevPotential / 1000).toFixed(0)}k`, label: 'Pipeline' },
        { value: `${d.length}`, label: 'Tracked' },
      ]}
      footer={{ text: 'High-score leads with $35k+ potential identified in top-right quadrant.', label: '↑ Focus Zone', trend: 'up' }}
    >
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
            <XAxis type="number" dataKey="x" name="Lead Score" unit="%" axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#CBD5E1' }} tickCount={5} />
            <YAxis type="number" dataKey="y" name="Revenue" axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#CBD5E1' }} tickFormatter={v => `$${v / 1000}k`} />
            <ZAxis type="number" dataKey="z" range={[40, 320]} />
            <Tooltip cursor={false} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '12px 16px', fontWeight: 900, fontSize: '11px', background: '#fff' }}
              formatter={(v, name) => name === 'Revenue' ? [`$${v.toLocaleString()}`, name] : [v, name]} />
            <Scatter name="Hot" data={d.filter(x => x.status === 'Hot')} fill="#4F46E5" fillOpacity={0.85} />
            <Scatter name="Warm" data={d.filter(x => x.status === 'Warm')} fill="#818CF8" fillOpacity={0.7} />
            <Scatter name="Cold" data={d.filter(x => x.status === 'Cold')} fill="#CBD5E1" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-2">
        {[{ c: '#4F46E5', l: 'Hot' }, { c: '#818CF8', l: 'Warm' }, { c: '#CBD5E1', l: 'Cold' }].map(s => (
          <div key={s.l} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
            <span className="text-[10px] font-black text-slate-400 uppercase">{s.l}</span>
          </div>
        ))}
      </div>
    </ChartFlashcard>
  )
}

// ── MONTHLY WATERFALL CHART — Flashcard ──
const MonthlyWaterfallChart = ({ data }) => {
  const d = data || WATERFALL_DATA
  const totalGain = d.reduce((s, r) => s + (r.gain || 0), 0)
  const totalLoss = d.reduce((s, r) => s + Math.abs(r.loss || 0), 0)
  const netMRR = d[d.length - 1].total
  const bestMonth = d.reduce((best, r) => r.gain > best.gain ? r : best, d[0])
  const netGrowthPct = Math.round(((netMRR - d[0].total) / d[0].total) * 100)
  return (
    <ChartFlashcard
      title="Monthly Growth Stream"
      subtitle="MRR Gain / Loss Analysis"
      badge="Waterfall View"
      gradientFrom="#10B981" gradientTo="#0F766E"
      kpis={[
        { value: `$${(totalGain / 1000).toFixed(0)}k`, label: 'Total Gains' },
        { value: `$${(totalLoss / 1000).toFixed(0)}k`, label: 'Total Losses' },
        { value: `$${(netMRR / 1000).toFixed(0)}k`, label: 'Net MRR' },
      ]}
      footer={{ text: 'Cumulative MRR growing consistently. Feb recorded highest single-month loss event.', label: '+114% Net', trend: 'up' }}
    >
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={d} margin={{ top: 10, right: 10, bottom: 5, left: -10 }} barGap={2}>
            <defs>
              <linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} tickFormatter={v => `$${v / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)', padding: '12px 16px', fontWeight: 900, fontSize: '11px' }}
              formatter={(v, name) => [`$${Math.abs(v).toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]} />
            <Bar dataKey="gain" fill="url(#gainGrad)" radius={[6, 6, 0, 0]} barSize={20} name="gain" />
            <Bar dataKey="loss" fill="url(#lossGrad)" radius={[0, 0, 6, 6]} barSize={20} name="loss" />
            <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5}
              dot={{ r: 4, fill: '#fff', stroke: '#4F46E5', strokeWidth: 2.5 }}
              activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <ChartSummaryGrid stats={[
        { icon: TrendingUp, value: `$${(totalGain / 1000).toFixed(0)}k`, label: 'Total Revenue Gained', bg: '#ECFDF5', color: '#10B981', trend: 'up', trendLabel: `${d.length}-month sum` },
        { icon: TrendingDown, value: `$${(totalLoss / 1000).toFixed(0)}k`, label: 'Total Revenue Lost', bg: '#FFF1F2', color: '#F43F5E', trend: 'down', trendLabel: 'Churn events' },
        { icon: DollarSign, value: `$${(netMRR / 1000).toFixed(0)}k`, label: 'Ending MRR', bg: '#EEF2FF', color: '#4F46E5', trend: 'up', trendLabel: `+${netGrowthPct}% growth` },
        { icon: CheckCircle, value: bestMonth.month, label: 'Best Growth Month', bg: '#FFF7ED', color: '#F59E0B', trend: 'up', trendLabel: `$${(bestMonth.gain / 1000).toFixed(0)}k gained` },
      ]} />
    </ChartFlashcard>
  )
}

// ── LEAD SCORE SCATTER PLOT — Flashcard ──
const LeadScoreScatterPlot = () => {
  const avgScore = Math.round(SCATTER_PLOT_DATA.reduce((s, d) => s + d.score, 0) / SCATTER_PLOT_DATA.length)
  const avgRevenue = Math.round(SCATTER_PLOT_DATA.reduce((s, d) => s + d.revenue, 0) / SCATTER_PLOT_DATA.length)
  const highScoreLeads = SCATTER_PLOT_DATA.filter(d => d.score >= 75).length
  const maxRevLead = SCATTER_PLOT_DATA.reduce((best, d) => d.revenue > best.revenue ? d : best, SCATTER_PLOT_DATA[0])
  return (
    <ChartFlashcard
      title="Lead Score Distribution"
      subtitle="Score-to-Revenue Correlation"
      badge="30 Leads Tracked"
      gradientFrom="#F59E0B" gradientTo="#D97706"
      kpis={[
        { value: avgScore, label: 'Avg Score' },
        { value: `$${(avgRevenue / 1000).toFixed(1)}k`, label: 'Avg Revenue' },
        { value: '30', label: 'Data Points' },
      ]}
      footer={{ text: 'High-score leads (80+) consistently map to >$35k revenue potential. Prioritize accordingly.', label: 'Positive Corr.', trend: 'up' }}
    >
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
            <defs>
              <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </radialGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
            <XAxis type="number" dataKey="score" name="Score" axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#CBD5E1' }} domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]} />
            <YAxis type="number" dataKey="revenue" name="Revenue" axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fontWeight: 900, fill: '#CBD5E1' }} tickFormatter={v => `$${v / 1000}k`} />
            <Tooltip cursor={false}
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.12)', padding: '12px 16px', fontWeight: 900, fontSize: '11px' }}
              formatter={(v, name) => name === 'Revenue' ? [`$${v.toLocaleString()}`, name] : [v, name]} />
            <Scatter name="Leads" data={SCATTER_PLOT_DATA} fill="url(#dotGrad)" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ChartSummaryGrid stats={[
        { icon: TrendingUp, value: avgScore, label: 'Average Lead Score', bg: '#FFF7ED', color: '#F59E0B', trend: avgScore > 50 ? 'up' : 'neutral', trendLabel: 'Out of 100' },
        { icon: DollarSign, value: `$${(avgRevenue / 1000).toFixed(1)}k`, label: 'Avg Revenue / Lead', bg: '#EEF2FF', color: '#4F46E5', trend: 'up', trendLabel: 'Mean value' },
        { icon: Sparkles, value: highScoreLeads, label: 'High-Score Leads (75+)', bg: '#ECFDF5', color: '#10B981', trend: 'up', trendLabel: `${Math.round(highScoreLeads / 30 * 100)}% of dataset` },
        { icon: ArrowUpRight, value: `$${(maxRevLead.revenue / 1000).toFixed(1)}k`, label: 'Peak Revenue Lead', bg: '#FFF1F2', color: '#F43F5E', trend: 'up', trendLabel: `Score: ${maxRevLead.score}` },
      ]} />
    </ChartFlashcard>
  )
}

// ── CHAT SUGGESTIONS DATA ──
const SUGGESTIONS_BANK = {
  create: ['create a new lead', 'create a new opportunity', 'create a new account', 'create a new contact', 'create a new task', 'create a new group', 'create a new event'],
  show: ['show all leads', 'show hot leads', 'show recent opportunities', 'show active accounts', 'show pending tasks', 'show upcoming events'],
  update: ['update lead status', 'update opportunity stage', 'update account details', 'update contact info', 'update task priority'],
  delete: ['delete a lead', 'delete an opportunity', 'delete a contact', 'delete a task'],
  how: ['how many leads do I have', 'how many hot leads', 'how is my pipeline value', 'how many deals won this month', 'how many tasks pending'],
  what: ['what is my MRR', 'what is conversion rate', 'what are top leads', 'what is pipeline value', 'what campaigns are active'],
}

const CONTEXT_SUGGESTIONS = {
  'Overview': ['show pipeline summary', 'how many active leads', 'what is today\'s revenue'],
  'Leads': ['create a new lead', 'show hot leads', 'update lead status'],
  'Opportunities': ['create a new opportunity', 'show closed won deals', 'update opportunity stage'],
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebarCollapsed') === 'true' } catch { return false }
  })
  const toggleSidebar = () => setSidebarCollapsed(v => {
    const next = !v
    try { localStorage.setItem('sidebarCollapsed', String(next)) } catch { }
    return next
  })
  const [messages, setMessages] = useState([{ role: 'ai', text: "👋 Hi! I'm your analytics AI. Ask me about revenue, churn, campaigns, or customers!" }])
  const [inputVal, setInputVal] = useState('')
  const [typing, setTyping] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [chatLanguage, setChatLanguage] = useState('en')
  const [ollamaConnected, setOllamaConnected] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeModel, setActiveModel] = useState('llama3')
  const abortControllerRef = useRef(null)

  const checkOllamaHealth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:11434/api/tags")
      if (res.ok) {
        const data = await res.json()
        const hasLlama = data.models?.some(m => m.name.includes('llama3'))
        setOllamaConnected(true)
      } else {
        setOllamaConnected(false)
      }
    } catch (e) {
      setOllamaConnected(false)
    }
  }, [])

  useEffect(() => {
    checkOllamaHealth()
    const interval = setInterval(checkOllamaHealth, 10000)
    return () => clearInterval(interval)
  }, [checkOllamaHealth])

  // Chat Sessions State Data
  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('pulsar_chat_sessions')
      if (stored) return JSON.parse(stored)
    } catch (e) {}
    return []
  })
  
  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const stored = localStorage.getItem('pulsar_chat_sessions')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed[0].id
      }
    } catch (e) {}
    return null
  })

  const [editingSessionId, setEditingSessionId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")

  // Sync activeSessionId with its messages
  useEffect(() => {
    if (activeSessionId) {
      const session = chatSessions.find(s => s.id === activeSessionId)
      if (session && session.messages) {
        setMessages(session.messages)
      } else {
        setMessages([{ role: 'ai', text: "👋 Hi! I'm your analytics AI. Ask me about revenue, churn, campaigns, or customers!" }])
      }
    } else {
      setMessages([])
    }
  }, [activeSessionId]) // Only depend on ID so we don't trigger recursively

  // Persist sessions and sync live messages into active session
  useEffect(() => {
    if (!activeSessionId) return
    setChatSessions(prev => {
      const exists = prev.find(s => s.id === activeSessionId)
      if (!exists) return prev
      // Only update if array is different length or last message is different to avoid unnecessary saves
      if (JSON.stringify(exists.messages) === JSON.stringify(messages)) return prev
      return prev.map(s => s.id === activeSessionId ? { ...s, messages, updatedAt: Date.now() } : s)
    })
  }, [messages])

  useEffect(() => {
    try {
      if (chatSessions.length > 0) {
        localStorage.setItem('pulsar_chat_sessions', JSON.stringify(chatSessions))
      } else {
        localStorage.removeItem('pulsar_chat_sessions')
      }
    } catch (e) {}
  }, [chatSessions])

  const createNewChat = () => {
    const newId = Date.now()
    setChatSessions(prev => [
      { id: newId, name: 'New Conversation', messages: [], date: new Date().toISOString(), updatedAt: Date.now() },
      ...prev
    ])
    setActiveSessionId(newId)
  }

  const deleteSession = (e, id) => {
    e.stopPropagation()
    setChatSessions(prev => {
      const next = prev.filter(s => s.id !== id)
      if (activeSessionId === id) {
        setActiveSessionId(next.length > 0 ? next[0].id : null)
      }
      return next
    })
    showToast('Conversation deleted', 'info')
  }

  const groupSessionsByTime = (sessions) => {
    const groups = { 'Today': [], 'Yesterday': [], 'Last 7 Days': [], 'Last 30 Days': [], 'Older': [] }
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterday = today - 86400000
    const last7 = today - 86400000 * 7
    const last30 = today - 86400000 * 30

    sessions.forEach(s => {
      const t = new Date(s.date || s.createdAt || s.updatedAt || Date.now()).getTime()
      if (t >= today) groups['Today'].push(s)
      else if (t >= yesterday) groups['Yesterday'].push(s)
      else if (t >= last7) groups['Last 7 Days'].push(s)
      else if (t >= last30) groups['Last 30 Days'].push(s)
      else groups['Older'].push(s)
    })
    return groups
  }

  // AI Chat Suggestions State
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentCommands, setRecentCommands] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ai_recent_commands') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('ai_recent_commands', JSON.stringify(recentCommands))
  }, [recentCommands])

  const chatInputRef = useRef(null)

  // / shortcut
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsChatOpen(true)
        setIsChatMinimized(false)
        setTimeout(() => chatInputRef.current?.focus(), 100)
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [])


  // Filtering Logic
  useEffect(() => {
    if (!inputVal.trim()) {
      setSuggestions(CONTEXT_SUGGESTIONS[activeNav] || [])
      setSelectedIndex(-1)
      return
    }

    const val = inputVal.toLowerCase()
    let matches = []

    // Check categories
    Object.keys(SUGGESTIONS_BANK).forEach(cat => {
      if (val.startsWith(cat) || cat.startsWith(val)) {
        matches = [...matches, ...SUGGESTIONS_BANK[cat].filter(s => s.toLowerCase().includes(val))]
      }
    })

    // General matching if no prefix matched
    if (matches.length === 0) {
      Object.values(SUGGESTIONS_BANK).flat().forEach(s => {
        if (s.toLowerCase().includes(val)) matches.push(s)
      })
    }

    setSuggestions([...new Set(matches)].slice(0, 5))
    setSelectedIndex(0)
  }, [inputVal, activeNav])

  const highlightMatch = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase()
        ? <strong key={i} className="text-indigo-600 font-black">{p}</strong>
        : p
    )
  }

  const getSuggestionIcon = (s) => {
    const l = s.toLowerCase()
    if (l.includes('create') || l.includes('add') || l.includes('உருவாக்கு') || l.includes('बनाएं')) return <UserPlus size={14} className="text-emerald-500" />
    if (l.includes('show') || l.includes('list') || l.includes('காட்டு') || l.includes('दिखाएं')) return <Eye size={14} className="text-indigo-500" />
    if (l.includes('update') || l.includes('edit') || l.includes('மாற்று') || l.includes('बदलें')) return <Edit3 size={14} className="text-amber-500" />
    if (l.includes('delete') || l.includes('remove') || l.includes('நீக்கு') || l.includes('हटाएं')) return <Trash2 size={14} className="text-rose-500" />
    if (l.includes('how') || l.includes('what') || l.includes('ஏன்') || l.includes('क्या')) return <Bot size={14} className="text-purple-500" />
    return <Clock size={14} className="text-slate-400" />
  }



  const [sidebarWidth, setSidebarWidth] = useState(480)
  const [isResizing, setIsResizing] = useState(false)
  const [opMenuOpen, setOpMenuOpen] = useState(false)
  const [activeForm, setActiveForm] = useState(null)
  const [connected, setConnected] = useState(false)
  const [sfLeads, setSfLeads] = useState([])
  const [sfOpportunities, setSfOpportunities] = useState([])
  const [sfAccounts, setSfAccounts] = useState([])
  const [sfContacts, setSfContacts] = useState([])
  const [sfTasks, setSfTasks] = useState([])
  const [sfEvents, setSfEvents] = useState([])
  const [sfGroups, setSfGroups] = useState([])
  const [sfReports, setSfReports] = useState([])
  const [showCreateMenu, setShowCreateMenu] = useState(null)
  const [sfCampaigns, setSfCampaigns] = useState([])
  const [sfFiles, setSfFiles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [search, setSearch] = useState('')

  // ── ACTION MENU & MODAL STATE ──
  const [menuData, setMenuData] = useState(null) // { x, y, record, type, fields }
  const [editModal, setEditModal] = useState(null) // { record, type, fields }

  // ── INTEGRATIONS STATE ──
  const [showConnectAppModal, setShowConnectAppModal] = useState(false)
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false)
  const [appStatuses, setAppStatuses] = useState({
    'Salesforce CRM': 'Connected', 'Slack': 'Connected', 'Google Analytics': 'Connected',
    'HubSpot': 'Connected', 'Zapier': 'Inactive', 'Stripe': 'Pending'
  })
  const [webhooks, setWebhooks] = useState([
    { id: 1, event: 'lead.created', url: 'https://hooks.zapier.com/leads/new', method: 'POST', calls: 142, success: 99.3 },
    { id: 2, event: 'opportunity.won', url: 'https://api.slack.com/webhooks/deals', method: 'POST', calls: 28, success: 100 },
    { id: 3, event: 'contact.updated', url: 'https://api.hubspot.com/crm/sync', method: 'PUT', calls: 317, success: 97.8 },
    { id: 4, event: 'task.completed', url: 'https://hooks.internal.co/tasks', method: 'POST', calls: 94, success: 100 },
  ])
  const [apiTokens, setApiTokens] = useState([
    { id: 1, name: 'Production API Key', key: 'pls_live_••••••••••••••••••••••••••••••••', fullKey: 'pls_live_4f46e5a3b8c2d1e9f7a6b5c4d3e2f1a0', scope: 'Full Access', expires: 'Dec 31, 2026', active: true, revealed: false },
    { id: 2, name: 'Analytics Read Key', key: 'pls_anl_••••••••••••••••••••••••••••••••', fullKey: 'pls_anl_7c3aed818cf84f46e5a3b8c2d1e9f7a6', scope: 'Read Only', expires: 'Jun 15, 2026', active: true, revealed: false },
  ])

  // ── SETTINGS STATE ──
  const [profile, setProfile] = useState({ name: 'Divya Dharshini', role: 'Workspace Owner', email: 'divya@salesforce.org', phone: '+91 98765 43210', org: 'Pulsar AI Workspace', region: 'Asia Pacific (IN)' })
  const [profileDirty, setProfileDirty] = useState(false)
  const [savedProfile, setSavedProfile] = useState(null)
  const [notifPrefs, setNotifPrefs] = useState([
    { title: 'New Lead Assigned', desc: 'Triggered when a new lead is routed to your workspace', email: true, push: true, slack: false },
    { title: 'Deal Stage Change', desc: 'Notify when an opportunity moves to a new stage', email: true, push: false, slack: true },
    { title: 'Quota Alert', desc: 'Weekly digest of quota attainment vs target', email: true, push: false, slack: true },
    { title: 'CRM Sync Failure', desc: 'Immediate alert if Salesforce sync encounters an error', email: true, push: true, slack: true },
    { title: 'New Contact Added', desc: 'Summary when contacts are bulk imported or created', email: false, push: false, slack: false },
    { title: 'Campaign Performance', desc: 'Daily marketing campaign performance digest', email: true, push: false, slack: false },
  ])
  const [syncConfig, setSyncConfig] = useState({ frequency: 'Every 15 min', retention: '90 Days', timezone: 'Asia/Kolkata' })
  const [securitySettings, setSecuritySettings] = useState([
    { title: 'Two-Factor Authentication', desc: 'Require a verification code on every login', enabled: true, badge: 'Recommended' },
    { title: 'OAuth Token Auto-Refresh', desc: 'Automatically renew Salesforce session tokens silently', enabled: true, badge: null },
    { title: 'IP Allowlist Enforcement', desc: 'Restrict access to specific IP ranges only', enabled: false, badge: 'Enterprise' },
    { title: 'Audit Log Export', desc: 'Enable export of all user actions to external SIEM', enabled: false, badge: null },
  ])
  const [toast, setToast] = useState(null)
  const [sfConfig, setSfConfig] = useState({ clientId: 'Loading...', clientSecret: 'Loading...' })

  useEffect(() => {
    fetch('http://localhost:3001/api/config')
      .then(r => r.json())
      .then(d => setSfConfig(d))
      .catch(e => setSfConfig({ clientId: 'Error fetching Config', clientSecret: 'Error fetching Config' }))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, typing])

  const fetchLiveLeads = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/leads')
      const data = await res.json()
      if (data.success) {
        setSfLeads(data.leads); setConnected(true); setLastSync(new Date().toLocaleTimeString())
      }
    } catch (e) { }
  }

  // Click away listener for menu
  useEffect(() => {
    const handleOutside = () => closeActionMenu()
    if (menuData) window.addEventListener('click', handleOutside)
    return () => window.removeEventListener('click', handleOutside)
  }, [menuData])

  const fetchLiveOpps = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/opportunities')
      const data = await res.json()
      if (data.success) setSfOpportunities(data.opportunities)
    } catch (e) { }
  }

  const fetchAllData = useCallback(async () => {
    try {
      const endpoints = [
        { key: 'leads', url: 'leads', setter: setSfLeads },
        { key: 'opportunities', url: 'opportunities', setter: setSfOpportunities },
        { key: 'accounts', url: 'accounts', setter: setSfAccounts },
        { key: 'contacts', url: 'contacts', setter: setSfContacts },
        { key: 'tasks', url: 'tasks', setter: setSfTasks },
        { key: 'events', url: 'events', setter: setSfEvents },
        { key: 'groups', url: 'groups', setter: setSfGroups },
        { key: 'reports', url: 'reports', setter: setSfReports },
        { key: 'campaigns', url: 'campaigns', setter: setSfCampaigns },
        { key: 'files', url: 'files', setter: setSfFiles },
      ]

      await Promise.all(endpoints.map(async ({ url, setter, key }) => {
        const res = await fetch(`http://localhost:3001/api/${url}`)
        const data = await res.json()
        if (data.success) {
          setter(data[key] || data[url] || [])
          if (url === 'leads') {
            setConnected(true)
            setLastSync(new Date().toLocaleTimeString())
          }
        }
      }))
    } catch (e) {
      console.error("Sync Error:", e)
    }
  }, [])

  // Simulated Real-time Alerts

  useEffect(() => {
    const timer = setInterval(() => {
      const lucky = Math.random() > 0.95
      if (lucky && connected) {
        const alertMsg = "🚨 ALERT: High-value Lead assigned to you just now!"
        setMessages(m => [...m, { role: 'ai', text: alertMsg }].slice(-10))
        setUnreadCount(prev => isChatOpen ? 0 : prev + 1)
        showToast("New Intelligent Alert Received", "info")
        fetchAllData() // Refresh dashboard stats
      }
    }, 45000) // Every 45s check for simulated events
    return () => clearInterval(timer)
  }, [connected, isChatOpen, fetchAllData, showToast])


  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const totalPipeline = sfOpportunities.reduce((sum, o) => sum + (o.Amount || 0), 0)
  const hotLeads = sfLeads.filter(l => (l.Rating || '').toLowerCase() === 'hot').length
  const convertedLeads = sfLeads.filter(l => (l.Status || '').includes('Converted')).length

  const startResizing = useCallback((e) => {
    setIsResizing(true)
    const onMouseMove = (e) => {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth > 360 && newWidth < 800) setSidebarWidth(newWidth)
    }
    const onMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  const detectIntent = (text) => {
    const lq = text.toLowerCase()

    // Language detection
    if (lq.includes('உருவாக்கு') || lq.includes('காட்டு') || lq.includes('நீக்கு') || lq.includes('மாற்று')) setChatLanguage('ta')
    else if (lq.includes('बनाएं') || lq.includes('दिखाएं') || lq.includes('हटाएं') || lq.includes('बदलें')) setChatLanguage('hi')
    else if (/[A-Za-z]/.test(text)) setChatLanguage('en')

    const objects = ['lead', 'opportunity', 'account', 'contact', 'task', 'event', 'group', 'file']
    const obj = objects.find(o => lq.includes(o)) || 'Lead'
    const properObj = obj.charAt(0).toUpperCase() + obj.slice(1)

    // Export Intent
    if (lq.includes('export') || lq.includes('download') || lq.includes('excel') || lq.includes('pdf')) {
      return { intent: 'export', object: properObj, format: lq.includes('excel') ? 'excel' : 'pdf' }
    }

    if (lq.includes('create') || lq.includes('add') || lq.includes('new') || lq.includes('உருவாக்கு') || lq.includes('बनाएं')) return { intent: 'create', object: properObj }
    if (lq.includes('show all') || lq.includes('list') || lq.includes('காட்டு') || lq.includes('दिखाएं')) return { intent: 'list', object: properObj }
    if (lq.includes('update') || lq.includes('edit') || lq.includes('change') || lq.includes('மாற்று') || lq.includes('बदलें')) return { intent: 'update', object: properObj }
    if (lq.includes('delete') || lq.includes('remove') || lq.includes('நீக்கு') || lq.includes('हटाएं')) return { intent: 'delete', object: properObj }
    if (lq.includes('hot leads')) return { intent: 'analytics', type: 'hot' }
    if (lq.includes('pipeline') || lq.includes('revenue')) return { intent: 'analytics', type: 'revenue' }
    if (lq.includes('upload') || lq.includes('attach')) return { intent: 'upload' }
    return null
  }


  const exportToExcel = (data, name) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    XLSX.writeFile(wb, `${name}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const exportToPDF = (data, title) => {
    const doc = new jsPDF()
    doc.text(title, 20, 10)
    const columns = Object.keys(data[0] || {}).slice(0, 5)
    const rows = data.map(item => columns.map(c => item[c] || '-'))
    doc.autoTable({ head: [columns], body: rows, startY: 20 })
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`)
  }

  // ── ACTION HANDLERS ──

  const openActionMenu = (e, record, type) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuData({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY,
      record,
      type
    })
  }

  const closeActionMenu = () => setMenuData(null)

  const handleEditRecord = (record, type) => {
    closeActionMenu()
    setEditModal({ record, type, fields: FORMS[type] })
  }

  const handleDeleteRecord = async (record, type) => {
    closeActionMenu()
    if (!window.confirm(`⚠️ Permanently delete ${record.Name || record.LastName || 'this record'} from Salesforce?`)) return
    
    try {
      showToast(`Deleting ${type}...`, 'info')
      const ep = type.toLowerCase() === 'event' ? 'events' : type.toLowerCase() + 's'
      const res = await fetch(`http://localhost:3001/api/${ep}/${record.Id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast(`${type} deleted successfully`, 'success')
        fetchAllData()
      } else {
        const d = await res.json()
        showToast(`Deletion failed: ${d.error}`, 'error')
      }
    } catch (e) {
      showToast(`Error: ${e.message}`, 'error')
    }
  }

  const handleUpdateStage = async (record, newStage) => {
    closeActionMenu()
    try {
      showToast(`Updating stage to ${newStage}...`, 'info')
      const res = await fetch(`http://localhost:3001/api/opportunities/${record.Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ StageName: newStage })
      })
      if (res.ok) {
        showToast('Stage updated successfully', 'success')
        fetchAllData()
      }
    } catch (e) {
      showToast(`Update failed: ${e.message}`, 'error')
    }
  }

  const handleSyncRecord = async (type) => {
    closeActionMenu()
    showToast('Synchronizing with Salesforce...', 'info')
    await fetchAllData()
    showToast('Workspace synchronized', 'success')
  }

  const sendMessage = async (text, type = null, meta = {}) => {
    const q = text || inputVal.trim()
    if (!q && !type) return

    if (abortControllerRef.current) abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()

    if (q) {
      setChatSessions(prev => prev.map(s => {
        if (s.id === activeSessionId && s.name === 'New Conversation') {
          return { ...s, name: q.split(' ').slice(0, 5).join(' ') + (q.split(' ').length > 5 ? '...' : '') }
        }
        return s
      }))

      setMessages(m => [...m, { role: 'user', text: q }])
      setRecentCommands(prev => [q, ...prev.filter(c => c !== q)].slice(0, 10))
    }

    setInputVal(''); setTyping(true); setIsStreaming(true); setShowSuggestions(false); setSelectedIndex(-1); setUnreadCount(0)

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }))

      if (q) conversationHistory.push({ role: 'user', content: q })

      const dataContext = `
        Current Salesforce State:
        - Total Leads: ${sfLeads.length}
        - Total Opportunities: ${sfOpportunities.length}
        - Total Accounts: ${sfAccounts.length}
        - Pipeline Value: $${sfOpportunities.reduce((acc, o) => acc + (o.Amount || 0), 0).toLocaleString()}
        - Top 3 Opportunities: ${sfOpportunities.sort((a,b) => (b.Amount||0) - (a.Amount||0)).slice(0,3).map(o => `${o.Name} ($${(o.Amount||0).toLocaleString()})`).join(', ')}
        - Active Users: ${sfContacts.length}
      `

      const systemPrompt = {
        role: "system",
        content: `You are an intelligent sales assistant for Antigravity. Help with lead analysis, pipeline forecasting, deal tracking, and Salesforce data.
        ${dataContext}
        Always use the data provided above to answer specific questions about the dashboard. Be concise and professional.`
      }

      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          model: activeModel,
          stream: true,
          messages: [systemPrompt, ...conversationHistory]
        })
      })

      if (!response.ok) throw new Error('Ollama not responding')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""
      
      setTyping(false)
      // Initialize an empty AI message
      setMessages(prev => [...prev, { role: 'ai', text: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const json = JSON.parse(line)
            if (json.message?.content) {
              assistantText += json.message.content
              setMessages(prev => {
                const next = [...prev]
                const last = next[next.length - 1]
                if (last && last.role === 'ai') {
                  last.text = assistantText
                }
                return next
              })
            }
          } catch (e) {
            console.error("Error parsing Ollama chunk", e)
          }
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('Stream aborted')
      } else {
        showToast("Ollama is not running. Please run 'ollama serve' in your terminal.", "error")
        setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Error: Connection to Ollama failed. Please ensure Ollama is running with 'llama3' model." }])
      }
    } finally {
      setTyping(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }



  const handleBulkWipe = async (object) => {
    // Confirmation prompt removed per user request: "clear all things dont ask me"
    
    try {
      showToast(`Clearing all ${object}...`, 'info')
      const mapping = {
        'Opportunity': 'opportunities',
        'Account': 'accounts',
        'Lead': 'leads',
        'Contact': 'contacts',
        'Report': 'reports',
        'Event': 'events',
        'Task': 'tasks'
      }
      const ep = mapping[object] || object.toLowerCase() + 's'
      const res = await fetch(`http://localhost:3001/api/${ep}/bulk-delete`, { method: 'POST' })
      let d = {}
      try {
        d = await res.json()
      } catch (jsonErr) {
        console.error('Failed to parse server response as JSON:', jsonErr)
        throw new Error(`Server returned non-JSON response (Status: ${res.status})`)
      }

      if (d.success) {
        if (d.count === 0 && d.totalAttempted > 0 && !d.note) {
            showToast(`Clear failed: 0/${d.totalAttempted} ${object} were deleted. (Check logs)`, 'error')
        } else if (d.note) {
            showToast(`Task Complete: ${d.count} ${object}s removed. ${d.note}`, 'success')
        } else {
            showToast(`Successfully deleted ${d.count} ${object}s`, 'success')
        }
        fetchAllData()
      } else {
        console.error(`Bulk wipe error for ${object}:`, d.error)
        showToast(`Error: ${d.error || 'Failed to wipe records'}`, 'error')
      }
    } catch (e) {
      console.error('Wipe operation exception:', e)
      showToast(`Wipe command failed: ${e.message}`, 'error')
    }
  }

  const handleGlobalNuke = async () => {
    // Zero friction mode: "clear all things dont ask me"
    try {
      showToast('☢️ INITIATING GLOBAL NUKE: Clearing ALL core Salesforce data...', 'info')
      const res = await fetch('http://localhost:3001/api/nuke-all', { method: 'POST' })
      const d = await res.json()
      if (d.success) {
        showToast('✅ GLOBAL NUKE COMPLETE: Salesforce environment sanitized.', 'success')
        fetchAllData()
      } else {
        showToast(`Global Nuke Failed: ${d.error}`, 'error')
      }
    } catch (e) {
      showToast(`Global Nuke operation failed: ${e.message}`, 'error')
    }
  }

  const handleDelete = async (object, record) => {
    // Confirmation dialog removed per user request
    try {
      const ep = object.toLowerCase() === 'event' ? 'events' : object.toLowerCase() + 's'
      const res = await fetch(`http://localhost:3001/api/${ep}/${record.Id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: `🗑️ **Record Deleted:** ${record.Name || record.LastName} has been removed from Salesforce.` }])
        fetchAllData()
      }
    } catch (e) { }
  }

  // ── LIVE DATA TRANSFORMATIONS ──

  const quotaData = useMemo(() => {
    const quota = 1000000
    const achieved = sfOpportunities.filter(o => o.IsWon).reduce((sum, o) => sum + (o.Amount || 0), 0)
    return [
      { name: 'Achieved', value: achieved, fill: '#4F46E5' },
      { name: 'Remaining', value: Math.max(0, quota - achieved), fill: '#F1F5F9' },
    ]
  }, [sfOpportunities])

  const heatMapData = useMemo(() => {
    const counts = Array.from({ length: 7 }, () => Array(24).fill(0))
    sfLeads.forEach(l => {
      if (l.CreatedDate) {
        const d = new Date(l.CreatedDate)
        counts[d.getDay()][d.getHours()]++
      }
    })
    return Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day, hour, value: counts[day][hour]
      }))
    ).flat()
  }, [sfLeads])

  const bubbleData = useMemo(() => {
    return sfOpportunities.filter(o => o.Amount > 0).slice(0, 15).map(o => ({
      x: o.Probability || 0,
      y: (o.Amount || 0) / 1000,
      z: (o.Amount || 0) / 500,
      status: o.IsWon ? 'Hot' : o.IsClosed ? 'Cold' : 'Warm',
      name: o.Name
    }))
  }, [sfOpportunities])

  const waterfallData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = months.map(m => ({ month: m, gain: 0, loss: 0, total: 0 }))
    let runningTotal = 0

    sfOpportunities.forEach(o => {
      if (o.CloseDate) {
        const mIdx = new Date(o.CloseDate).getMonth()
        if (o.IsWon) data[mIdx].gain += (o.Amount || 0)
        else if (o.IsClosed) data[mIdx].loss -= (o.Amount || 0)
      }
    })

    data.forEach(d => {
      runningTotal += (d.gain + d.loss)
      d.total = runningTotal
    })
    return data
  }, [sfOpportunities])

  const activeRevenue = useMemo(() => {
    if (sfOpportunities.length === 0) return DEFAULT_REVENUE_DATA
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const data = months.map(m => ({ month: m, revenue: 0, benchmark: 150000 }))
    sfOpportunities.forEach(o => {
      if (o.CloseDate && o.IsWon) {
        const mIdx = new Date(o.CloseDate).getMonth()
        data[mIdx].revenue += (o.Amount || 0)
      }
    })
    return data
  }, [sfOpportunities])

  const recentSalesforceActivities = useMemo(() => {
    const leads = sfLeads.slice(0, 5).map(l => ({ id: `l-${l.Id}`, text: `New Lead: ${l.Name} from ${l.Company}`, time: 'Recent', type: 'lead' }))
    const opps = sfOpportunities.slice(0, 5).map(o => ({ id: `o-${o.Id}`, text: `Opp: ${o.Name} moved to ${o.StageName}`, time: 'Recent', type: 'opp' }))
    return [...leads, ...opps].sort(() => Math.random() - 0.5).slice(0, 6)
  }, [sfLeads, sfOpportunities])

  const conversionRate = useMemo(() => {
    const closed = sfOpportunities.filter(o => o.IsClosed).length
    const won = sfOpportunities.filter(o => o.IsWon).length
    return closed > 0 ? ((won / closed) * 100).toFixed(1) : "0.0"
  }, [sfOpportunities])

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8] text-slate-900 font-sans tracking-tight">

      {/* ── SIDEBAR (LEFT) ── */}
      <aside
        className="flex-shrink-0 flex flex-col bg-white border-r border-gray-100 shadow-xl z-50 relative"
        style={{ width: sidebarCollapsed ? '68px' : '220px', transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Toggle button — sits on the right edge, vertically centred */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight size={12} strokeWidth={3} style={{ transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </button>

        {/* Logo */}
        <div className={`flex items-center border-b border-gray-50 overflow-hidden flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0 py-6' : 'px-6 py-7 gap-3'}`}
          style={{ transition: 'padding 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 flex-shrink-0">
            <Zap size={18} />
          </div>
          <div
            className="flex flex-col overflow-hidden"
            style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', transition: 'opacity 200ms, width 300ms cubic-bezier(0.16, 1, 0.3, 1)', whiteSpace: 'nowrap' }}
          >
            <div className="font-black text-indigo-900 text-[15px] tracking-tighter leading-none">Pulsar AI</div>
            <div className="text-[8px] uppercase font-black text-slate-300 tracking-[0.2em] mt-0.5">Analytics Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-[9px] uppercase font-black text-slate-300 tracking-widest">Main Menu</div>
          )}
          {[
            { icon: LayoutDashboard, label: 'Overview' },
            { icon: PieChart, label: 'Analytics' },
            { icon: Zap, label: 'Opportunities' },
            { icon: Building2, label: 'Accounts' },
            { icon: UserPlus, label: 'Leads' },
            { icon: Contact, label: 'Contacts' },
            { icon: Calendar, label: 'Calendar' },
            { icon: FileText, label: 'Files' },
            { icon: BarChart3, label: 'Reports' },
            { icon: Users2, label: 'Groups' },
            { icon: ClipboardList, label: 'Tasks' },
            { icon: Target, label: 'Campaigns' },
            { icon: Share2, label: 'Integrations' },
            { icon: Settings, label: 'Settings' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="relative group">
              <button
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center py-3 rounded-2xl text-[13px] font-black transition-all ${sidebarCollapsed ? 'justify-center px-0' : 'gap-4 px-4'
                  } ${activeNav === label
                    ? sidebarCollapsed
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-50/30'
                  }`}
              >
                <Icon size={18} strokeWidth={activeNav === label ? 3 : 2} className="flex-shrink-0" />
                <span
                  style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 200ms, width 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >{label}</span>
              </button>
              {/* Tooltip in collapsed mode */}
              {sidebarCollapsed && (
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[200] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <div className="bg-indigo-600 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-indigo-600" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className={`border-t border-gray-50 flex flex-col gap-3 ${sidebarCollapsed ? 'px-2 py-3 items-center' : 'p-5'}`}
          style={{ transition: 'padding 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {/* Connected indicator */}
          <div
            className={`rounded-2xl flex items-center justify-center border-[1.5px] transition-all cursor-pointer ${connected ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : 'border-indigo-100 text-indigo-600 bg-indigo-50'
              } ${sidebarCollapsed ? 'w-9 h-9' : 'px-3 py-2.5 gap-2'}`}
            onClick={() => !connected && setShowModal(true)}
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-400'}`} />
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 200ms, width 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            >{connected ? 'Connected' : 'Connect CRM'}</span>
          </div>

          {/* User row */}
          <div className={`flex items-center overflow-hidden ${sidebarCollapsed ? 'justify-center' : 'gap-3 px-1'}`}>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center font-black text-emerald-600 text-xs flex-shrink-0">DD</div>
            <div
              className="flex flex-col"
              style={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: 'opacity 200ms, width 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <span className="text-[13px] font-black text-slate-800 leading-none">Divya Dharshini</span>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Workspace Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN DASHBOARD (CENTER) ── */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-500`}>
        <header className="h-20 flex items-center justify-between px-10 bg-white/60 backdrop-blur-xl border-b border-gray-50 z-40 sticky top-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeNav}</h1>
            {connected && <div className="text-[10px] font-black text-emerald-500 flex items-center gap-1.5 uppercase tracking-widest"><span className="w-1 h-1 bg-emerald-500 rounded-full" /> Salesforce Live — {sfLeads.length} leads — synced {lastSync}</div>}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden xl:flex items-center bg-gray-100/50 rounded-2xl px-5 py-2.5 border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-all shadow-inner">
              <Search size={16} className="text-slate-300" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-[13px] px-3 font-bold outline-none w-64" placeholder="Quick search data streams..." />
            </div>

            <div className="h-10 w-px bg-gray-100 mx-2" />

            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-slate-600 shadow-sm hover:shadow-md transition-all">
              <Calendar size={16} /> Last 30 Days <ChevronDown size={14} />
            </button>

            <button
              onClick={() => { fetchAllData(); showToast('Salesforce data synchronized', 'success') }}
              className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl text-[11px] font-black flex items-center gap-2 hover:bg-indigo-100 transition-all"
            >
              <RefreshCw size={16} className={typing ? 'animate-spin' : ''} /> Sync Salesforce
            </button>

            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-xl hover:scale-[1.02] transition-all">
              <FileDown size={16} /> Export
            </button>

            <div className="flex items-center gap-2 ml-4">
              <button className="w-10 h-10 rounded-2xl bg-white border border-gray-100 text-slate-400 flex items-center justify-center relative hover:bg-gray-50 transition-colors"><BellRing size={18} /><span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm shadow-rose-200" /></button>
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-lg">SA</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar pb-32">
          {activeNav === 'Overview' && (
            <>
              {/* KPI SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <KPICard label="Pipeline Value" value={`$${(totalPipeline / 1000).toFixed(1)}K`} change="+28.4%" positive={true} icon={DollarSign} color="#4F46E5" secondaryLabel="Current Potential" />
                <KPICard label="Conversion Rate" value={`${conversionRate}%`} change="+4.2%" positive={true} icon={RefreshCw} color="#F59E0B" secondaryLabel="Deals Won" />
                <KPICard label="Active Leads" value={connected ? sfLeads.length : "0"} change="+21.0%" positive={true} icon={Users} color="#10B981" secondaryLabel="Source: Salesforce" />
                <KPICard label="Active Deals" value={sfOpportunities.length} icon={Layers} color="#818CF8" secondaryLabel={`${sfOpportunities.filter(o => o.IsWon).length} Won`} />
              </div>

              {/* PIPELINE VALUE ANALYSIS — Flashcard */}
              <div className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/60 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-500">
                {/* Gradient header */}
                <div className="relative px-10 pt-8 pb-7 overflow-hidden" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #818CF8 100%)' }}>
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.25em] mb-1">Revenue Intelligence</p>
                      <h3 className="text-[20px] font-black text-white leading-tight tracking-tight">Pipeline Value Analysis</h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Engine</span>
                    </div>
                  </div>
                  {/* KPI strip */}
                  <div className="flex items-center gap-8">
                    <div>
                      <div className="text-[28px] font-black text-white leading-none">${(totalPipeline / 1000).toFixed(1)}k</div>
                      <div className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">Total Pipeline</div>
                    </div>
                    <div>
                      <div className="text-[20px] font-black text-white leading-none">+28.4%</div>
                      <div className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">Growth vs LM</div>
                    </div>
                    <div>
                      <div className="text-[20px] font-black text-emerald-300 leading-none">On Track</div>
                      <div className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">vs Benchmark</div>
                    </div>
                  </div>
                </div>

                {/* Chart body */}
                <div className="px-10 pt-8 pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actual Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-[2px] bg-emerald-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#10B981 0,#10B981 6px,transparent 6px,transparent 12px)' }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benchmark</span>
                      </div>
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                      <button className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black">Default</button>
                      <button className="px-4 py-1.5 text-slate-400 rounded-lg text-[10px] font-black hover:text-indigo-600 transition-colors">Trend</button>
                    </div>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={activeRevenue} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="pipelineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.18} />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.01} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#CBD5E1' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#CBD5E1' }} tickFormatter={v => `$${v / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#818CF8', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                        <Area type="monotone" dataKey="revenue" name="Actual" stroke="#4F46E5" strokeWidth={3} fill="url(#pipelineGrad)" dot={false} activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 3 }} />
                        <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#10B981" strokeWidth={2} strokeDasharray="8 5" dot={false} activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Footer insight strip */}
                <div className="mx-10 mb-8 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] font-black text-slate-600">Pipeline growing steadily. Jan–Feb performance exceeded benchmark by 9.4%. Maintain deal velocity.</p>
                  <div className="flex items-center gap-3 ml-6 flex-shrink-0">
                    <button onClick={() => setIsChatOpen(true)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black hover:bg-indigo-700 transition-colors whitespace-nowrap">Ask AI</button>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full whitespace-nowrap">↑ +28.4%</span>
                  </div>
                </div>
              </div>

              {/* RECENT ACTIVITY SECTION */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-3"><Activity size={20} className="text-indigo-600" /> Recent Activity</h3>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Activities</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentSalesforceActivities.map(act => (
                    <div key={act.id} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all group cursor-pointer">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform"><Briefcase size={18} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-black text-slate-800 line-clamp-1">{act.text}</div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TABLE SECTION */}
              <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-sm shadow-slate-200/10">
                <div className="px-10 py-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <h3 className="font-black text-xl tracking-tight">Salesforce Leads</h3>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none relative flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-slate-200 shadow-inner">
                      <Search size={14} className="text-slate-300" />
                      <input className="bg-transparent text-xs px-2 outline-none w-full md:w-48 font-bold" placeholder="Search customers..." />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-600"><Filter size={16} /> Filter</button>
                    <button onClick={() => sendMessage("create a new lead")} className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"><Plus size={16} /> Add Customer</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]"><th className="px-10 py-5">Client</th><th className="px-10 py-5">Status</th><th className="px-10 py-5">Est. Pipeline</th><th className="px-10 py-5 text-right pr-14">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">{(sfLeads || []).slice(0, 5).map((l, i) => (
                      <tr key={i} className="hover:bg-indigo-50/10 transition-colors group">
                        <td className="px-10 py-6 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm">{l.Name ? l.Name[0] : 'U'}</div>
                          <div>
                            <div className="font-black text-[15px] text-slate-800">{l.Name}</div>
                            <div className="text-[11px] font-bold text-slate-400">{l.Company}</div>
                          </div>
                        </td>
                        <td className="px-10 py-6"><HealthBadge status={l.Rating === 'Hot' ? 'Healthy' : 'At Risk'} /></td>
                        <td className="px-10 py-6 font-black text-slate-900 text-[15px]">${Math.floor(getLeadValue(l)).toLocaleString()}</td>
                        <td className="px-10 py-6 text-right pr-14"><button onClick={(e) => openActionMenu(e, l, 'Lead')} className="text-slate-300 hover:text-indigo-600"><MoreHorizontal size={20} /></button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>

            </>
          )}

          {activeNav === 'Leads' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[20px] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Leads Intelligence</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Showing {sfLeads.length} live CRM prospects synced</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => sendMessage("create a new lead")} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 flex items-center gap-2"><Plus size={16} /> New Lead</button>
                </div>
              </div>

              <LeadsIntelligenceSummary leads={sfLeads} />

              <MainRegistryTable
                title="Lead Registry"
                icon={Activity}
                data={sfLeads}
                columns={[
                  {
                    label: 'Lead Identity', key: 'Name', render: (r) => (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 border border-slate-100">{r.Name ? r.Name[0] : 'L'}</div>
                        <div className="flex flex-col">
                          <div className="font-black text-slate-800">{r.Name}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{r.Email || 'no-email@sf.com'}</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    label: 'Company', key: 'Company', render: (r) => (
                      <div className="font-bold text-slate-500">{r.Company}</div>
                    )
                  },
                  {
                    label: 'Status', key: 'Status', render: (r) => (
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${r.Status === 'Working - Contacted' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <div className="text-[11px] font-black text-slate-700">{r.Status}</div>
                      </div>
                    )
                  },
                  {
                    label: 'Quality Score', key: 'Rating', render: (r) => (
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${r.Rating === 'Hot' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{r.Rating || 'Neutral'}</div>
                    )
                  }
                ]}
                onActionClick={(e, row) => openActionMenu(e, row, 'Lead')}
                onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
                onWipeAll={() => handleBulkWipe('Lead')}
              />
            </div>
          )}

          {activeNav === 'Opportunities' && (
            <MainRegistryTable
              title="Salesforce Opportunities"
              icon={Zap}
              data={sfOpportunities}
              columns={[
                {
                  label: 'Deal Name', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                {
                  label: 'Amount', key: 'Amount', render: (r) => (
                    <div className="font-black text-slate-900">${(r.Amount || 0).toLocaleString()}</div>
                  )
                },
                {
                  label: 'Stage', key: 'StageName', render: (r) => (
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block ${r.IsWon ? 'bg-emerald-50 text-emerald-600' : r.IsClosed ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{r.StageName}</div>
                  )
                },
                { label: 'Close Date', key: 'CloseDate' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Opportunity')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
              onWipeAll={() => handleBulkWipe('Opportunity')}
            />
          )}

          {activeNav === 'Accounts' && (
            <MainRegistryTable
              title="Salesforce Accounts"
              icon={Building2}
              data={sfAccounts}
              columns={[
                {
                  label: 'Organization', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                { label: 'Industry', key: 'Industry' },
                { label: 'Type', key: 'Type' },
                {
                  label: 'Website', key: 'Website', render: (r) => (
                    <a href={r.Website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold text-xs">{r.Website}</a>
                  )
                }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Account')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
              onWipeAll={() => handleBulkWipe('Account')}
            />
          )}

          {activeNav === 'Contacts' && (
            <MainRegistryTable
              title="Salesforce Contacts"
              icon={Contact}
              data={sfContacts}
              columns={[
                {
                  label: 'Member', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                { label: 'Position', key: 'Title' },
                {
                  label: 'Account', key: 'Account', render: (r) => (
                    <div className="text-slate-500 font-bold">{r.Account?.Name || '-'}</div>
                  )
                },
                { label: 'Email', key: 'Email' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Contact')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
              onWipeAll={() => handleBulkWipe('Contact')}
            />
          )}

          {activeNav === 'Calendar' && (
            <MainRegistryTable
              title="Salesforce Events"
              icon={Calendar}
              data={sfEvents}
              columns={[
                {
                  label: 'Event', key: 'Subject', render: (r) => (
                    <div className="font-black text-slate-800">{r.Subject}</div>
                  )
                },
                {
                  label: 'Start', key: 'StartDateTime', render: (r) => (
                    <div className="text-[11px] font-bold">{new Date(r.StartDateTime).toLocaleString()}</div>
                  )
                },
                {
                  label: 'End', key: 'EndDateTime', render: (r) => (
                    <div className="text-[11px] font-bold">{new Date(r.EndDateTime).toLocaleString()}</div>
                  )
                },
                { label: 'Location', key: 'Location' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Event')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
            />
          )}

          {activeNav === 'Files' && (
            <MainRegistryTable
              title="Salesforce Files"
              icon={FileText}
              data={sfFiles}
              columns={[
                {
                  label: 'Title', key: 'Title', render: (r) => (
                    <div className="font-black text-slate-800 flex items-center gap-2"><FileText size={14} className="text-slate-300" /> {r.Title}</div>
                  )
                },
                {
                  label: 'Type', key: 'FileExtension', render: (r) => (
                    <div className="uppercase font-black text-slate-400 text-[10px]">{r.FileExtension}</div>
                  )
                },
                {
                  label: 'Size', key: 'ContentSize', render: (r) => (
                    <div className="text-[10px] font-bold text-slate-400">{(r.ContentSize / 1024).toFixed(1)} KB</div>
                  )
                },
                {
                  label: 'Modified', key: 'LastModifiedDate', render: (r) => (
                    <div className="text-[10px] font-bold">{new Date(r.LastModifiedDate).toLocaleDateString()}</div>
                  )
                }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'File')}
              onAdd={() => sendMessage("upload a file")}
            />
          )}

          {activeNav === 'Reports' && (
            <MainRegistryTable
              title="Salesforce Reports"
              icon={BarChart3}
              data={sfReports}
              columns={[
                {
                  label: 'Report Name', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                { label: 'Format', key: 'Format' },
                {
                  label: 'Last Run', key: 'LastRunDate', render: (r) => (
                    <div className="text-[10px] font-bold">{r.LastRunDate ? new Date(r.LastRunDate).toLocaleString() : 'Never'}</div>
                  )
                }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Report')}
              onWipeAll={() => handleBulkWipe('Report')}
            />
          )}

          {activeNav === 'Groups' && (
            <MainRegistryTable
              title="Collaboration Groups"
              icon={Users2}
              data={sfGroups}
              columns={[
                {
                  label: 'Group Name', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                {
                  label: 'Description', key: 'Description', render: (r) => (
                    <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{r.Description || '-'}</div>
                  )
                },
                { label: 'Type', key: 'CollaborationType' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Group')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
            />
          )}

          {activeNav === 'Tasks' && (
            <MainRegistryTable
              title="Open Tasks"
              icon={ClipboardList}
              data={sfTasks}
              columns={[
                {
                  label: 'Task', key: 'Subject', render: (r) => (
                    <div className="font-black text-slate-800">{r.Subject}</div>
                  )
                },
                {
                  label: 'Status', key: 'Status', render: (r) => (
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${r.Status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>{r.Status}</div>
                  )
                },
                {
                  label: 'Priority', key: 'Priority', render: (r) => (
                    <div className={`font-black text-[10px] ${r.Priority === 'High' ? 'text-rose-500' : 'text-slate-400'}`}>{r.Priority}</div>
                  )
                },
                { label: 'Due Date', key: 'ActivityDate' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Task')}
              onAdd={(e) => setShowCreateMenu({ x: e.clientX, y: e.clientY })}
            />
          )}

          {activeNav === 'Analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3"><TrendingUp size={24} className="text-primary" /> Intelligence Hub</h3>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black">AI Optimized</button>
                  <button className="px-4 py-2 text-slate-400 rounded-xl text-[10px] font-black hover:text-indigo-600 transition-colors">Raw Stream</button>
                </div>
              </div>

              {/* 2x2 CHART GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
                <div className="lg:col-span-1">
                  <QuotaAttainmentGauge data={quotaData} />
                </div>
                <div className="lg:col-span-1">
                  <LeadActivityHeatMap data={heatMapData} />
                </div>
                <div className="lg:col-span-1">
                  <DealSizeBubbleChart data={bubbleData} />
                </div>
                <div className="lg:col-span-1">
                  <MonthlyWaterfallChart data={waterfallData} />
                </div>
              </div>
            </div>
          )}

          {activeNav === 'Campaigns' && (
            <MainRegistryTable
              title="Marketing Campaigns"
              icon={Target}
              data={sfCampaigns}
              columns={[
                {
                  label: 'Campaign', key: 'Name', render: (r) => (
                    <div className="font-black text-slate-800">{r.Name}</div>
                  )
                },
                {
                  label: 'Status', key: 'Status', render: (r) => (
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${r.Status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      r.Status === 'Planned' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>{r.Status || 'Draft'}</div>
                  )
                },
                { label: 'Type', key: 'Type' },
                { label: 'Start Date', key: 'StartDate' }
              ]}
              onActionClick={(e, row) => openActionMenu(e, row, 'Campaign')}
            />
          )}

          {activeNav === 'Integrations' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Integrations Hub</h2>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your connected apps, webhooks, and data streams</p>
                </div>
                <button onClick={() => setShowConnectAppModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 hover:scale-[1.02] active:scale-95">
                  <Plus size={16} /> Connect App
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Connections', value: Object.values(appStatuses).filter(s => s === 'Connected').length, icon: Wifi, color: '#10B981', bg: '#ECFDF5' },
                  { label: 'Webhooks Live', value: webhooks.length, icon: Zap, color: '#4F46E5', bg: '#EEF2FF' },
                  { label: 'Data Synced Today', value: '2.4 GB', icon: Cloud, color: '#F59E0B', bg: '#FFFBEB' },
                  { label: 'Sync Errors', value: '0', icon: ShieldAlert, color: '#10B981', bg: '#ECFDF5' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-lg transition-all cursor-default">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
                      <s.icon size={20} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900">{s.value}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connected Apps */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Globe size={22} className="text-indigo-600" /> Connected Applications</h3>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">{Object.values(appStatuses).filter(s => s === 'Connected').length} ACTIVE</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { name: 'Salesforce CRM', desc: 'Primary data source — live bi-directional sync', icon: '☁️', lastSync: lastSync || 'Just now', records: `${sfLeads.length + sfOpportunities.length + sfAccounts.length} records`, canDisconnect: false },
                    { name: 'Slack', desc: 'Sales alert notifications and deal closure pings', icon: '💬', lastSync: '3 mins ago', records: '12 channels', canDisconnect: true },
                    { name: 'Google Analytics', desc: 'Website traffic and lead source attribution', icon: '📊', lastSync: '15 mins ago', records: '8.2K sessions', canDisconnect: true },
                    { name: 'HubSpot', desc: 'Marketing funnel and campaign performance data', icon: '🚀', lastSync: '1 hr ago', records: '342 contacts', canDisconnect: true },
                    { name: 'Zapier', desc: 'Automated workflows and cross-platform triggers', icon: '⚡', lastSync: 'Never', records: '—', canDisconnect: true },
                    { name: 'Stripe', desc: 'Payment and subscription revenue intelligence', icon: '💳', lastSync: 'Authorization required', records: '—', canDisconnect: false },
                  ].map((app, i) => {
                    const status = appStatuses[app.name] || 'Inactive'
                    return (
                      <div key={i} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50/40 transition-colors group">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm">{app.icon}</div>
                          <div>
                            <div className="font-black text-[15px] text-slate-800">{app.name}</div>
                            <div className="text-[11px] font-bold text-slate-400 mt-0.5">{app.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden md:block">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync</div>
                            <div className="text-[12px] font-black text-slate-600 mt-0.5">{status === 'Connected' ? app.lastSync : '—'}</div>
                          </div>
                          <div className="text-right hidden lg:block">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume</div>
                            <div className="text-[12px] font-black text-slate-600 mt-0.5">{status === 'Connected' ? app.records : '—'}</div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                            {status === 'Connected' && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />}
                            {status}
                          </div>
                          {app.canDisconnect && (
                            <button
                              onClick={() => {
                                const newStatus = status === 'Connected' ? 'Inactive' : 'Connected'
                                setAppStatuses(prev => ({ ...prev, [app.name]: newStatus }))
                                showToast(`${app.name} ${newStatus === 'Connected' ? 'reconnected' : 'disconnected'} successfully`, newStatus === 'Connected' ? 'success' : 'info')
                              }}
                              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${status === 'Connected'
                                ? 'bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600'
                                : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                                }`}
                              title={status === 'Connected' ? 'Disconnect' : 'Reconnect'}
                            >
                              {status === 'Connected' ? <X size={14} /> : <Wifi size={14} />}
                            </button>
                          )}
                          {!app.canDisconnect && status === 'Pending' && (
                            <button
                              onClick={() => { setAppStatuses(prev => ({ ...prev, [app.name]: 'Connected' })); showToast(`${app.name} authorization initiated`, 'info') }}
                              className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 bg-amber-50 text-amber-500 hover:bg-amber-100"
                              title="Authorize"
                            >
                              <Key size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Webhooks */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Zap size={22} className="text-indigo-600" /> Active Webhooks</h3>
                  <button onClick={() => setShowAddWebhookModal(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95">
                    <Plus size={14} /> Add Webhook
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {webhooks.length === 0 && (
                    <div className="px-10 py-16 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest">No webhooks configured yet</div>
                  )}
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="px-10 py-5 flex items-center justify-between hover:bg-slate-50/30 transition-colors group">
                      <div className="flex items-center gap-5">
                        <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black">{wh.method}</div>
                        <div>
                          <div className="font-black text-[13px] text-slate-800">{wh.event}</div>
                          <div className="text-[10px] font-bold text-slate-400 font-mono mt-0.5 truncate max-w-xs">{wh.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Calls</div>
                          <div className="text-[13px] font-black text-slate-700">{wh.calls.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</div>
                          <div className={`text-[13px] font-black ${wh.success >= 99 ? 'text-emerald-600' : 'text-amber-500'}`}>{wh.success}%</div>
                        </div>
                        <button
                          onClick={() => {
                            setWebhooks(prev => prev.filter(w => w.id !== wh.id))
                            showToast(`Webhook '${wh.event}' removed`, 'info')
                          }}
                          className="w-8 h-8 rounded-xl bg-slate-50 text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salesforce Configuration */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Shield size={22} className="text-indigo-600" /> Salesforce Configuration</h3>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">OAuth 2.0 Credentials</div>
                </div>
                <div className="px-10 py-8 grid grid-cols-1 gap-6">
                  {[
                    { label: 'Client ID', value: sfConfig.clientId },
                    { label: 'Client Secret', value: sfConfig.clientSecret }
                  ].map((cred, idx) => (
                    <div key={idx} className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{cred.label}</span>
                        <button 
                          onClick={() => { navigator.clipboard.writeText(cred.value); showToast(`${cred.label} copied!`, 'success') }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <div className="font-mono text-[12px] text-slate-500 bg-white px-4 py-3 rounded-2xl border border-slate-100 tracking-tight break-all">
                        {cred.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Access Tokens */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Key size={22} className="text-indigo-600" /> API Access Tokens</h3>
                  <button onClick={() => showToast('New API key generated!', 'success')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2">
                    <Plus size={14} /> Generate Key
                  </button>
                </div>
                <div className="px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {apiTokens.map((tk) => (
                    <div key={tk.id} className="p-6 bg-slate-50/50 rounded-[28px] border border-slate-100 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-700">{tk.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border ${tk.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{tk.active ? 'Active' : 'Revoked'}</span>
                          <button
                            onClick={() => { setApiTokens(prev => prev.map(t => t.id === tk.id ? { ...t, active: !t.active } : t)); showToast(tk.active ? 'Token revoked' : 'Token reactivated', tk.active ? 'info' : 'success') }}
                            className="text-[8px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-rose-50 transition-all"
                          >{tk.active ? 'Revoke' : 'Activate'}</button>
                        </div>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 bg-slate-100 px-4 py-3 rounded-2xl tracking-wider flex items-center justify-between gap-2">
                        <span className="truncate">{tk.revealed ? tk.fullKey : tk.key}</span>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setApiTokens(prev => prev.map(t => t.id === tk.id ? { ...t, revealed: !t.revealed } : t))}
                            className="p-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                            title={tk.revealed ? 'Hide' : 'Reveal'}
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={() => { navigator.clipboard.writeText(tk.fullKey); showToast('API key copied to clipboard!', 'success') }}
                            className="p-1.5 rounded-lg bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
                            title="Copy"
                          >
                            <FileText size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Scope: {tk.scope}</span>
                        <span>Expires: {tk.expires}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DANGER ZONE: GLOBAL NUKE */}
              <div className="bg-rose-50/30 rounded-[48px] border border-rose-100/50 shadow-sm overflow-hidden mt-10">
                <div className="px-10 py-8 border-b border-rose-100/50 flex items-center justify-between bg-rose-50/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                      <ShieldAlert size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight text-rose-900">Danger Zone</h3>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-0.5">Critical Workspace Actions</p>
                    </div>
                  </div>
                </div>
                <div className="px-10 py-10 flex items-center justify-between gap-10">
                  <div className="flex-1">
                    <p className="text-[15px] font-black text-slate-800 tracking-tight">Global Data Sanitation (Nuke All Records)</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 lines-clamp-2">This command will iterate through all core Salesforce objects (Leads, Opps, Accounts, Contacts, Tasks, Events) and permanently delete every record. This action is instantaneous and irreversible.</p>
                  </div>
                  <button 
                    onClick={handleGlobalNuke}
                    className="flex-shrink-0 px-8 py-4 bg-rose-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.15em] hover:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-200 flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Nuke All Salesforce Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'Settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Account Settings</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your workspace, preferences, and security</p>
              </div>

              {/* Profile Section */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><User size={22} className="text-indigo-600" /> Profile & Identity</h3>
                </div>
                <div className="px-10 py-8 flex flex-col md:flex-row items-start gap-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-3xl shadow-xl shadow-indigo-100">{profile.name?.[0] || 'D'}</div>
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={() => showToast('Avatar updated!', 'success')} />
                      Change Avatar
                    </label>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Full Name', key: 'name' },
                      { label: 'Role', key: 'role', readonly: true },
                      { label: 'Email Address', key: 'email', type: 'email' },
                      { label: 'Phone', key: 'phone', type: 'tel' },
                      { label: 'Organization', key: 'org' },
                      { label: 'Region', key: 'region' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{f.label}</label>
                        {f.readonly ? (
                          <div className="bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-400 border border-slate-100">{profile[f.key]}</div>
                        ) : (
                          <input
                            type={f.type || 'text'}
                            value={profile[f.key]}
                            onChange={e => { setProfile(p => ({ ...p, [f.key]: e.target.value })); setProfileDirty(true) }}
                            className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-10 pb-8 flex items-center gap-3">
                  <button
                    onClick={() => { setSavedProfile({ ...profile }); setProfileDirty(false); showToast('Profile saved successfully!', 'success') }}
                    disabled={!profileDirty}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 disabled:scale-100"
                  >Save Changes</button>
                  <button
                    onClick={() => { if (savedProfile) { setProfile({ ...savedProfile }); setProfileDirty(false) } else { setProfile({ name: 'Divya Dharshini', role: 'Workspace Owner', email: 'divya@salesforce.org', phone: '+91 98765 43210', org: 'Pulsar AI Workspace', region: 'Asia Pacific (IN)' }); setProfileDirty(false) }; showToast('Changes discarded', 'info') }}
                    className="px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >Discard</button>
                  {profileDirty && <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">● Unsaved changes</span>}
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><BellRing size={22} className="text-indigo-600" /> Notification Preferences</h3>
                  <button onClick={() => { setNotifPrefs(prev => prev.map(n => ({ ...n, email: true, push: true, slack: true }))); showToast('All notifications enabled', 'success') }} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Enable All</button>
                </div>
                <div className="px-10 py-8 divide-y divide-gray-50">
                  {notifPrefs.map((n, i) => (
                    <div key={i} className="py-5 flex items-center justify-between">
                      <div>
                        <div className="font-black text-[14px] text-slate-800">{n.title}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">{n.desc}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        {([['Email', 'email'], ['Push', 'push'], ['Slack', 'slack']]).map(([label, key]) => (
                          <div key={key} className="flex flex-col items-center gap-1.5">
                            <button
                              onClick={() => {
                                setNotifPrefs(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: !item[key] } : item))
                                showToast(`${n.title} ${label} ${!n[key] ? 'enabled' : 'disabled'}`, 'info')
                              }}
                              className={`w-10 h-5 rounded-full border transition-all relative ${n[key] ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-100 border-slate-200'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${n[key] ? 'left-5' : 'left-0.5'}`} />
                            </button>
                            <span className="text-[8px] font-black text-slate-300 uppercase">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Sync Settings */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Database size={22} className="text-indigo-600" /> Data Sync Configuration</h3>
                </div>
                <div className="px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Sync Frequency</label>
                    <select value={syncConfig.frequency} onChange={e => setSyncConfig(p => ({ ...p, frequency: e.target.value }))} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 transition-all">
                      {['Real-time', 'Every 5 min', 'Every 15 min', 'Hourly', 'Daily'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Salesforce Org</label>
                    <div className="bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-500 border border-slate-100 font-mono truncate">orgfarm-0bacf61b3e-dev-ed.develop</div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Data Retention</label>
                    <select value={syncConfig.retention} onChange={e => setSyncConfig(p => ({ ...p, retention: e.target.value }))} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 transition-all">
                      {['30 Days', '60 Days', '90 Days', '1 Year', 'Forever'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Time Zone</label>
                    <select value={syncConfig.timezone} onChange={e => setSyncConfig(p => ({ ...p, timezone: e.target.value }))} className="w-full bg-slate-50 px-4 py-3.5 rounded-2xl text-[13px] font-black text-slate-700 border border-slate-100 outline-none focus:ring-4 ring-indigo-50 transition-all">
                      {['UTC', 'US/Eastern', 'Asia/Kolkata', 'Europe/London'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="px-10 pb-8">
                  <button onClick={() => showToast(`Sync settings saved — ${syncConfig.frequency} refresh, ${syncConfig.retention} retention`, 'success')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                    <RefreshCw size={14} /> Save Sync Settings
                  </button>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3"><Lock size={22} className="text-indigo-600" /> Security & Access</h3>
                </div>
                <div className="px-10 py-8 space-y-6">
                  {securitySettings.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/60 rounded-[28px] border border-slate-100 hover:border-indigo-100 transition-all">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-[14px] text-slate-800">{s.title}</span>
                          {s.badge && <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[8px] font-black uppercase tracking-widest">{s.badge}</span>}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">{s.desc}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSecuritySettings(prev => prev.map((item, idx) => idx === i ? { ...item, enabled: !item.enabled } : item))
                          showToast(`${s.title} ${!s.enabled ? 'enabled' : 'disabled'}`, !s.enabled ? 'success' : 'info')
                        }}
                        className={`w-12 h-6 rounded-full border-2 cursor-pointer transition-all flex-shrink-0 relative ${s.enabled ? 'bg-indigo-600 border-indigo-600' : 'bg-slate-200 border-slate-200'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md absolute top-0.5 transition-all ${s.enabled ? 'left-[26px]' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-10 pb-8">
                  <button
                    onClick={() => { if (window.confirm('Sign out of all active sessions? You will need to log in again.')) { showToast('All sessions terminated. Redirecting...', 'info'); setTimeout(() => window.location.href = '/', 2000) } }}
                    className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign Out of All Sessions
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-[48px] border border-rose-100 shadow-sm overflow-hidden">
                <div className="px-10 py-8 border-b border-rose-50 bg-rose-50/30">
                  <h3 className="font-black text-xl tracking-tight flex items-center gap-3 text-rose-600"><AlertTriangle size={22} /> Danger Zone</h3>
                  <p className="text-[11px] font-bold text-rose-400 uppercase tracking-widest mt-1">Irreversible actions — proceed with caution</p>
                </div>
                <div className="px-10 py-8 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => { if (window.confirm('⚠️ This will permanently erase all analytics data. This cannot be undone. Continue?')) showToast('All analytics data has been reset', 'info') }}
                    className="flex-1 py-4 border-2 border-dashed border-rose-100 text-rose-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/30 transition-all"
                  >Reset All Analytics Data</button>
                  <button
                    onClick={() => { if (window.confirm('⚠️ Revoking Salesforce access will disconnect all live data streams. Continue?')) { setConnected(false); showToast('Salesforce access revoked. Reconnect to restore data.', 'error') } }}
                    className="flex-1 py-4 border-2 border-dashed border-rose-100 text-rose-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/30 transition-all"
                  >Revoke Salesforce Access</button>
                  <button
                    onClick={() => { if (window.confirm('⚠️ DELETE WORKSPACE: This will permanently delete your entire Pulsar AI workspace including all data, integrations, and settings. Type DELETE to confirm.')) { showToast('Workspace deletion initiated. You will be logged out.', 'error'); setTimeout(() => window.location.href = '/', 3000) } }}
                    className="flex-1 py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-400 transition-all"
                  >Delete Workspace</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── AI CHAT PANEL (RIGHT) ── */}
      {/* ── NEW FLOATING AI CHATBOT ── */}
      {/* ── AI CHAT PANEL (FULL SCREEN OVERLAY) ── */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[2000] bg-white flex overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* ── LEFT SIDEBAR ── */}
          <div className="w-72 bg-slate-50 border-r border-slate-100 flex flex-col flex-shrink-0">
            {/* Top Branding & New Chat */}
            <div className="p-5 pb-2">
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Zap size={14} fill="white" />
                </div>
                <span className="text-[15px] font-black tracking-tight text-slate-800">Antigravity</span>
              </div>
              <button 
                onClick={createNewChat}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2 text-[12px] font-bold">
                  <Plus size={14} /> New Chat
                </div>
                <Search size={14} className="text-indigo-200" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
              <div className="flex items-center justify-between px-3 mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Conversations</span>
                <button 
                  onClick={() => {
                    setChatSessions([])
                    setActiveSessionId(null)
                    showToast('All conversations cleared', 'info')
                  }} 
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {chatSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center opacity-70 px-4 mt-8">
                  <MessageCircle size={28} className="text-slate-300 mb-3" />
                  <span className="text-[11px] font-bold text-slate-400 text-center leading-relaxed">No conversations yet.<br/>Click + New Chat to begin.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupSessionsByTime(chatSessions)).map(([groupName, sessions]) => (
                    sessions.length > 0 && (
                      <div key={groupName} className="space-y-0.5">
                        <div className="px-3 py-1 mb-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">{groupName}</div>
                        {sessions.map((session) => (
                          <div 
                            key={session.id}
                            onClick={() => { if (editingSessionId !== session.id) setActiveSessionId(session.id) }}
                            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${activeSessionId === session.id ? 'bg-indigo-50/80 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                              <MessageCircle size={14} className={`flex-shrink-0 ${activeSessionId === session.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                              {editingSessionId === session.id ? (
                                <input 
                                  autoFocus
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onBlur={() => {
                                    setChatSessions(prev => prev.map(s => s.id === session.id ? { ...s, name: editingTitle || 'Unnamed Chat' } : s))
                                    setEditingSessionId(null)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') e.target.blur()
                                    if (e.key === 'Escape') setEditingSessionId(null)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex-1 bg-white border border-indigo-200 outline-none rounded px-1.5 py-[1px] text-[12px] font-bold text-slate-800 shadow-sm min-w-0 w-full"
                                />
                              ) : (
                                <span className="text-[12px] font-bold truncate">{session.name}</span>
                              )}
                            </div>
                            {/* Session Actions (Visible on Hover/Touch) */}
                            {editingSessionId !== session.id && (
                              <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="hover:text-indigo-600 transition-colors p-1" title="Pin Chat"><Pin size={13} /></button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingTitle(session.name); setEditingSessionId(session.id); }} 
                                  className="hover:text-indigo-600 transition-colors p-1"
                                  title="Edit Title"
                                ><Edit2 size={13} /></button>
                                <button 
                                  onClick={(e) => deleteSession(e, session.id)} 
                                  className="hover:text-rose-600 transition-colors p-1"
                                  title="Delete Conversation"
                                ><Trash2 size={13} /></button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Footer Profile & Settings */}
            <div className="p-4 border-t border-slate-100 space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors text-[12px] font-bold">
                <Settings size={14} className="text-slate-400" /> Settings
              </button>
              <div className="w-full flex items-center justify-between gap-3 px-3 py-2.5 mt-2 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">DD</div>
                  <span className="text-[12px] font-bold text-slate-700 truncate">Divya Dharshini</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MAIN CHAT CANVAS ── */}
          <div className="flex-1 flex flex-col relative bg-white">
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-black text-slate-800">
                  {chatSessions.find(s => s.id === activeSessionId)?.name || 'New Chat'}
                </span>
                   <div className="relative group">
                     {activeModel === 'llama3' ? <Sparkles size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" /> : <Bot size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" />}
                     <select 
                       value={activeModel} 
                       onChange={(e) => setActiveModel(e.target.value)}
                       className={`pl-5 pr-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest outline-none border-none cursor-pointer transition-all ${activeModel === 'llama3' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                     >
                       <option value="llama3">llama3</option>
                       <option value="claude">claude</option>
                     </select>
                   </div>
                   <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${ollamaConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${ollamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                     {ollamaConnected ? 'Connected' : 'Offline'}
                   </span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold transition-colors"
              >
                <X size={14} /> Close Chat
              </button>
            </div>

            {/* Chat Message Scroll Area */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar scroll-smooth">
              <div className="max-w-4xl mx-auto space-y-8 pb-32">
                {messages.map((m, i) => (
                  <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* User Message */}
                    {m.role === 'user' && (
                      <div className="flex items-center gap-3 max-w-[80%] group">
                        <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-600 p-1.5 rounded-lg transition-all"><Edit2 size={14} /></button>
                        <div className="px-5 py-3.5 bg-indigo-600 text-white rounded-[24px] rounded-br-sm shadow-md text-[14px] font-medium leading-relaxed">
                          {m.text}
                        </div>
                      </div>
                    )}

                    {/* AI Message */}
                    {m.role === 'ai' && (
                      <div className="flex gap-4 max-w-[90%] w-full">
                        {/* Bot Avatar */}
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex flex-shrink-0 items-center justify-center text-white shadow-sm mt-1">
                          <Bot size={16} />
                        </div>
                        
                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                          {/* Bot Name Label */}
                          <div className="text-[12px] font-black text-indigo-600 tracking-tight">Antigravity</div>
                          
                          {/* Text/Widgets */}
                          <div className="text-[14px] text-slate-700 leading-relaxed space-y-3 font-medium">
                            {!m.type && (
                              <div className="whitespace-pre-wrap">
                                {m.text}
                                {isStreaming && i === messages.length - 1 && (
                                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
                                )}
                              </div>
                            )}

                            {/* Render AI Dynamic Widgets directly in line */}
                            {m.type === 'form' && (
                              <div className="max-w-2xl bg-white rounded-[24px] border border-slate-100 shadow-sm p-2 mb-2">
                                <DetailedForm
                                  title={`${m.meta.object}`} object={m.meta.object} refresh={fetchAllData}
                                  icon={m.meta.object === 'Lead' ? Users : m.meta.object === 'Account' ? Building2 : Zap}
                                  fields={FORMS[m.meta.object]}
                                  onComplete={res => sendMessage(null, 'reply', { text: res })}
                                  onCancel={() => setMessages(prev => prev.slice(0, -1))}
                                />
                              </div>
                            )}

                            {m.type === 'updateForm' && (
                              <div className="max-w-2xl bg-white rounded-[24px] border border-slate-100 shadow-sm p-2 mb-2">
                                <DetailedForm
                                  title={`Update ${m.meta.object}`} object={m.meta.object} method="PUT" refresh={fetchAllData}
                                  initialData={m.meta.record} icon={Settings} fields={FORMS[m.meta.object]}
                                  onComplete={res => sendMessage(null, 'reply', { text: res })}
                                  onCancel={() => setMessages(prev => prev.slice(0, -1))}
                                />
                              </div>
                            )}

                            {m.type === 'selector' && (
                              <div className="max-w-2xl bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 mb-2">
                                <RecordSelector
                                  type={m.meta.object} title={`Search ${m.meta.object} to ${m.meta.mode}`}
                                  onSelect={(rec) => {
                                    if (m.meta.mode === 'delete') handleDelete(m.meta.object, rec)
                                    else setMessages(prev => [...prev, { role: 'ai', text: `Selected: ${rec.Name || rec.LastName || rec.Subject}. Opening edit pane...`, type: 'updateForm', meta: { ...m.meta, record: rec } }])
                                  }}
                                  onCancel={() => setMessages(prev => prev.slice(0, -1))}
                                />
                              </div>
                            )}

                            {m.type === 'table' && (
                              <div className="w-full bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-2">
                                <ChatTable data={m.meta.data} title={m.meta.title} object={m.meta.object} />
                              </div>
                            )}

                            {m.type === 'upload' && (
                              <div className="max-w-2xl bg-white rounded-[24px] border border-slate-100 shadow-sm p-2 mb-2">
                                <FileUpload onCancel={() => setMessages(prev => prev.slice(0, -1))} onComplete={res => sendMessage(null, 'reply', { text: res })} />
                              </div>
                            )}
                          </div>

                          {/* AI Action Toolstrip */}
                          <div className="flex items-center justify-between mt-2 max-w-2xl">
                            <div className="flex items-center gap-1">
                              <button onClick={() => showToast('Thanks for your feedback!', 'success')} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><ThumbsUp size={14} /></button>
                              <button onClick={() => showToast('We will improve this.', 'info')} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><ThumbsDown size={14} /></button>
                              <div className="w-px h-3 bg-slate-200 mx-1" />
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(m.text)
                                  showToast('Response copied to clipboard', 'success')
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Copy size={14} />
                              </button>
                              <button onClick={() => showToast('Advanced options coming soon', 'info')} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><MoreHorizontal size={14} /></button>
                            </div>
                            <button 
                              onClick={() => {
                                // Regenerate: Find last user message, or resend prompt if empty
                                const lastUserMsg = [...messages.slice(0, i)].reverse().find(m => m.role === 'user')
                                if (lastUserMsg) {
                                  setMessages(prev => prev.slice(0, i))
                                  sendMessage(lastUserMsg.text)
                                }
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <RefreshCw size={12} /> Regenerate
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-4 w-full">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex flex-shrink-0 items-center justify-center text-white shadow-sm mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="text-[12px] font-black text-indigo-600 tracking-tight">Antigravity</div>
                      <div className="flex gap-1.5 pt-2">
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expansive Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-10">
              <div className="max-w-4xl mx-auto relative">
                
                {/* Suggestions Tooltip Overlay */}
                {showSuggestions && (suggestions.length > 0 || recentCommands.length > 0) && (
                  <div className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-150 z-[1200] max-h-[280px] overflow-y-auto">
                    {suggestions.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggestions</div>
                        {suggestions.map((s, idx) => (
                          <button key={s} onMouseEnter={() => setSelectedIndex(idx)} onClick={() => sendMessage(s)} className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-700 transition-all ${selectedIndex === idx ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2 truncate">
                              {getSuggestionIcon(s)}
                              <span className="truncate">{highlightMatch(s, inputVal)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="relative flex items-end gap-2 bg-slate-50 p-2 pl-4 rounded-3xl border border-slate-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-sm">
                  <button onClick={() => setOpMenuOpen(!opMenuOpen)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors mb-1"><Plus size={20} /></button>
                  <textarea
                    ref={chatInputRef}
                    value={inputVal}
                    rows={1}
                    onFocus={() => { setShowSuggestions(true); setUnreadCount(0) }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onChange={e => { 
                      setInputVal(e.target.value); 
                      setShowSuggestions(true);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') setSelectedIndex(p => (p + 1) % (suggestions.length + (!inputVal ? 3 : 0)))
                      else if (e.key === 'ArrowUp') setSelectedIndex(p => (p - 1 + (suggestions.length + (!inputVal ? 3 : 0))) % (suggestions.length + (!inputVal ? 3 : 0)))
                      else if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                          sendMessage(suggestions[selectedIndex])
                        } else {
                          sendMessage()
                        }
                      }
                      else if (e.key === 'Escape') setShowSuggestions(false)
                    }}
                    placeholder={ollamaConnected ? "Message Antigravity..." : "Ollama offline..."}
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 placeholder-slate-400 resize-none py-3 min-h-[44px] custom-scrollbar"
                  />
                  <div className="flex items-center gap-1 mb-1 pr-1">
                    {isStreaming ? (
                      <button 
                        onClick={() => abortControllerRef.current?.abort()}
                        className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-all"
                      >
                        <div className="w-3 h-3 bg-rose-600 rounded-sm" />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => showToast('Web search capability integrated', 'info')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Globe size={18} /></button>
                        <button onClick={() => showToast('Voice search ready', 'info')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Mic2 size={18} /></button>
                        <button 
                          onClick={() => sendMessage()} 
                          disabled={(!inputVal.trim() && selectedIndex < 0) || !ollamaConnected}
                          className="ml-1 w-10 h-10 rounded-2xl bg-indigo-600 disabled:bg-slate-300 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          <Send size={18} className={inputVal.trim() ? "translate-x-0.5" : ""} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-center mt-3">
                  <span className="text-[10px] font-medium text-slate-400">Pulsar AI can make mistakes. Consider verifying important data metrics.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button (Only visible if chat is not open) */}
      {!isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end gap-4 pointer-events-none">
          <button
            onClick={() => { setIsChatOpen(true); setIsChatMinimized(false); setUnreadCount(0) }}
            className="w-16 h-16 rounded-[24px] bg-indigo-600 text-white shadow-2xl flex items-center justify-center pointer-events-auto hover:scale-110 active:scale-95 transition-all group relative animate-in fade-in zoom-in duration-500"
            style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
          >
            <div className="absolute inset-0 rounded-[24px] animate-ping bg-indigo-400 opacity-20 scale-110" />
            <Bot size={28} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
            
            {!isChatOpen && (
              <div className="absolute right-full mr-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap hidden md:block">
                Press <span className="bg-white/20 px-1.5 py-0.5 rounded ml-1">/</span> to chat
              </div>
            )}
          </button>
        </div>
      )}

      {showModal && <ConnectSalesforceModal onClose={() => setShowModal(false)} />}

      {/* Global Modals & Menu */}
      {menuData && (
        <ContextualMenu
          {...menuData}
          onClose={closeActionMenu}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onStageChange={handleUpdateStage}
          onSync={handleSyncRecord}
        />
      )}

      {editModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <DetailedForm
            title={`Edit ${editModal.type}`}
            fields={editModal.fields}
            initialData={editModal.record}
            object={editModal.type}
            method="PUT"
            icon={editModal.type === 'Opportunity' ? Briefcase : UserPlus}
            onComplete={(msg) => { alert(msg); setEditModal(null); fetchAllData() }}
            onCancel={() => setEditModal(null)}
          />
        </div>
      )}

      {showConnectAppModal && (
        <ConnectAppModal
          onClose={() => setShowConnectAppModal(false)}
          onConnect={(app) => {
            setAppStatuses(prev => ({ ...prev, [app.name]: 'Connected' }));
            showToast(`${app.name} connected successfully!`, 'success');
          }}
        />
      )}

      {showAddWebhookModal && (
        <AddWebhookModal
          onClose={() => setShowAddWebhookModal(false)}
          onAdd={(hook) => {
            setWebhooks(prev => [...prev, { ...hook, id: Date.now(), calls: 0, success: 100 }]);
            showToast(`Webhook for ${hook.event} registered!`, 'success');
          }}
        />
      )}

      {toast && <ToastNotification {...toast} onClose={() => setToast(null)} />}
      {showCreateMenu && (
        <>
          <div className="fixed inset-0 z-[2999]" onClick={() => setShowCreateMenu(null)} />
          <div 
            className="fixed z-[3000] bg-white rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.18)] border border-slate-100 p-2 min-w-[240px] animate-in zoom-in-95 duration-150 overflow-hidden"
            style={{ 
              left: Math.min(showCreateMenu.x, window.innerWidth - 260), 
              top: Math.min(showCreateMenu.y, window.innerHeight - 420) 
            }}
          >
            <div className="px-5 py-4 mb-2">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations Registry</div>
              <div className="text-[13px] font-black text-slate-800 mt-1">Select Entry Type</div>
            </div>
            <div className="space-y-0.5">
              {[
                { label: 'Lead', icon: Users, cmd: "create a new lead", color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Opportunity', icon: Zap, cmd: "create a new opportunity", color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Account', icon: Building2, cmd: "create a new account", color: 'text-sky-500', bg: 'bg-sky-50' },
                { label: 'Contact', icon: Contact, cmd: "create a new contact", color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Task', icon: ClipboardList, cmd: "create a new task", color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Event', icon: Calendar, cmd: "create a new event", color: 'text-violet-500', bg: 'bg-violet-50' },
                { label: 'Group', icon: Users2, cmd: "create a new group", color: 'text-slate-500', bg: 'bg-slate-50' },
              ].map(item => (
                <button 
                  key={item.label}
                  onClick={() => { 
                    setShowCreateMenu(null); 
                    setIsChatOpen(true);
                    setMessages(prev => [...prev, { 
                      role: 'ai', 
                      text: `✨ Opening manual entry form for new **${item.label}**. Please provide the details below:`, 
                      type: 'form', 
                      meta: { object: item.label } 
                    }]);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-slate-50 text-[14px] font-bold text-slate-700 transition-all group text-left"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span>New {item.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Create via AI Assistant</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
