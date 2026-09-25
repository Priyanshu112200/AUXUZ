'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseConfigured } from '../../lib/supabase'
import type { LeadRecord, LeadStatus } from '../../lib/leads'

const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'APPOINTMENT', 'WON', 'LOST']

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [status, setStatus] = useState('')
  const [filter, setFilter] = useState<LeadStatus | 'ALL'>('ALL')

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUserEmail(data.session?.user.email ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? null))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return setStatus('Supabase is not configured. Copy .env.example to .env.local and add your project keys.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setStatus(error ? error.message : 'Signed in.')
  }

  async function loadLeads() {
    if (!supabase) return
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (error) setStatus(error.message)
    else setLeads((data || []) as LeadRecord[])
  }

  useEffect(() => { if (userEmail) loadLeads() }, [userEmail])

  async function updateLead(id: string, patch: Partial<LeadRecord>) {
    if (!supabase) return
    const { error } = await supabase.from('leads').update(patch).eq('id', id)
    if (error) setStatus(error.message)
    else setLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }

  async function logout() { await supabase?.auth.signOut() }

  const visible = useMemo(() => filter === 'ALL' ? leads : leads.filter(l => l.status === filter), [leads, filter])
  const counts = useMemo(() => statuses.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<string, number>), [leads])

  if (!supabaseConfigured || !userEmail) {
    return <main className="admin-page"><div className="admin-shell"><a className="admin-brand" href="/">AUXUZ</a><div className="admin-login"><div className="eyebrow">PRIVATE CRM</div><h1>Lead pipeline.</h1><p>Admin access is protected by Supabase Auth. No service-role key belongs in this frontend.</p>{!supabaseConfigured ? <div className="setup-box"><b>Setup required</b><p>Copy <code>.env.example</code> to <code>.env.local</code>, add the Supabase URL and anon key, then restart the dev server.</p><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase ↗</a></div> : <form onSubmit={login} className="admin-form"><input type="email" required placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} /><input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><button className="button primary" type="submit">Sign in ↗</button></form>}{status && <p className="formnote">{status}</p>}</div></div></main>
  }

  return <main className="admin-page"><div className="admin-shell"><header className="admin-top"><div><a className="admin-brand" href="/">AUXUZ</a><span> / CRM</span></div><div><button className="button ghost small" onClick={loadLeads}>Refresh</button><button className="button primary small" onClick={logout}>Sign out</button></div></header><section className="admin-head"><div><div className="eyebrow">CUSTOMER ACQUISITION SYSTEM</div><h1>Pipeline.</h1><p>{userEmail}</p></div><div className="stats"><div><b>{leads.length}</b><span>Total</span></div>{statuses.slice(0,5).map(s => <div key={s}><b>{counts[s] || 0}</b><span>{s}</span></div>)}</div></section><div className="filterbar"><button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>ALL</button>{statuses.map(s => <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>{s} <span>{counts[s] || 0}</span></button>)}</div><div className="lead-table"><div className="lead-row lead-head"><span>Lead</span><span>Contact</span><span>Score</span><span>Status</span><span>Next follow-up</span></div>{visible.map(lead => <div className="lead-row" key={lead.id}><div><b>{lead.name}</b><small>{lead.company}</small><small>{new Date(lead.created_at).toLocaleString()}</small></div><div><span>{lead.email}</span><small>{lead.phone}</small><small>{lead.message || 'No message'}</small></div><div><strong>{lead.score}</strong>/100</div><div><select value={lead.status} onChange={e => updateLead(lead.id, { status: e.target.value as LeadStatus })}>{statuses.map(s => <option key={s}>{s}</option>)}</select></div><div><input type="datetime-local" value={lead.next_followup_at ? lead.next_followup_at.slice(0,16) : ''} onChange={e => updateLead(lead.id, { next_followup_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /><textarea placeholder="Notes" defaultValue={lead.notes || ''} onBlur={e => updateLead(lead.id, { notes: e.target.value })} /></div></div>)}{visible.length === 0 && <div className="empty">No leads in this stage.</div>}</div></div></main>
}
