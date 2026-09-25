'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createLead } from '../../lib/leads'
import { supabaseConfigured } from '../../lib/supabase'
import { navItems } from '../../lib/site'

const initial = { name: '', email: '', phone: '', company: '', website: '', service: 'Customer acquisition strategy', message: '', websiteTrap: '' }

export default function ContactPage() {
  const [menu, setMenu] = useState(false)
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('')
  const update = (key: keyof typeof initial, value: string) => setForm((v) => ({ ...v, [key]: value }))

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (form.websiteTrap) return
    setStatus('Sending…')
    const payload = { name: form.name, email: form.email, phone: form.phone, company: form.company, website: form.website, service: form.service, message: form.message, source: 'contact-page' }
    try {
      if (supabaseConfigured) { try { await createLead(payload) } catch {} }
      const r = await fetch('https://formsubmit.co/ajax/contact.auxuz@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...payload, _subject: `New AUXUZ enquiry — ${form.company || form.name}`, _replyto: form.email, _template: 'table', _captcha: 'false', _next: `${window.location.origin}/thanks/` }) })
      if (!r.ok) throw new Error()
      setStatus('Your details are in. We’ll be in touch.')
      setForm(initial)
    } catch { setStatus('Something went wrong. Email contact.auxuz@gmail.com directly and we’ll pick it up.') }
  }

  return <main className="page-shell"><nav className="nav shell"><Link className="brand" href="/"><img src="/auxuz-logo.png" alt="AUXUZ" /></Link><button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">☰</button><div className={`navlinks ${menu ? 'open' : ''}`}>{navItems.map(([l,h]) => <Link key={h} href={h}>{l}</Link>)}</div></nav><section className="inner-hero shell"><div className="eyebrow">CONTACT / START HERE</div><h1>Tell us what<br /><em>you want to change.</em></h1><p>Give us enough context to understand the opportunity. No payment is required to send an enquiry.</p></section><section className="section shell contact-layout"><div className="contact-side"><div className="eyebrow">WHAT HAPPENS NEXT</div><div className="next-list"><div><b>01</b><span>We receive your enquiry.</span></div><div><b>02</b><span>We review the information and current journey.</span></div><div><b>03</b><span>We reply with the practical next step.</span></div></div><div className="contact-note"><strong>Prefer email?</strong><a href="mailto:contact.auxuz@gmail.com">contact.auxuz@gmail.com</a></div></div><form className="form large-form" onSubmit={submit}><input className="honeypot" value={form.websiteTrap} onChange={(e) => update('websiteTrap', e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" /><div className="form-row"><label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Your name" /></label><label>Email<input type="email" name="email" value={form.email} onChange={(e) => update('email', e.target.value)} required placeholder="you@company.com" /></label></div><div className="form-row"><label>Phone / WhatsApp<input value={form.phone} onChange={(e) => update('phone', e.target.value)} required placeholder="+91 …" /></label><label>Company / brand<input value={form.company} onChange={(e) => update('company', e.target.value)} required placeholder="Your company" /></label></div><div className="form-row"><label>Website <span>(optional)</span><input value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://…" /></label><label>What do you need?<select value={form.service} onChange={(e) => update('service', e.target.value)}><option>Customer acquisition strategy</option><option>Website / landing page</option><option>Lead capture / CRM</option><option>AI / automation</option><option>Follow-up system</option><option>Booking / conversion</option><option>Analytics / optimization</option><option>Not sure yet</option></select></label></div><label>Tell us about the situation<textarea value={form.message} onChange={(e) => update('message', e.target.value)} required placeholder="What are you selling, how do people currently enquire, and what would you like to improve?" /></label><button className="button primary full" type="submit">Send enquiry <span>↗</span></button>{status && <p className="status">{status}</p>}<p className="formnote">Your details are used only to respond to your enquiry. By submitting, you agree to our <Link href="/privacy/">Privacy Policy</Link>.</p></form></section><footer className="footer"><div className="shell foot"><div><img src="/auxuz-logo.png" alt="AUXUZ" /><p>Customer Acquisition & Automation.</p></div><div className="footright"><div><Link href="/">Home</Link> · <Link href="/solutions/">Solutions</Link> · <Link href="/services/">Services</Link></div><small>© 2026 AUXUZ</small></div></div></footer></main>
}
