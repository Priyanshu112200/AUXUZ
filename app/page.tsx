'use client'

import Link from 'next/link'
import { useState } from 'react'
import ThreeHero from '../components/ThreeHero'
import { navItems } from '../lib/site'
import { createLead } from '../lib/leads'
import { supabaseConfigured } from '../lib/supabase'

const initialForm = { name: '', email: '', phone: '', company: '', website: '', service: 'Customer acquisition', message: '', websiteTrap: '' }

export default function Home() {
  const [menu, setMenu] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.websiteTrap) return
    setStatus('Sending…')
    const payload = { name: form.name, email: form.email, phone: form.phone, company: form.company, website: form.website, service: form.service, message: form.message, source: 'homepage' }
    try {
      if (supabaseConfigured) {
        try { await createLead(payload) } catch { /* email delivery remains the source of truth */ }
      }
      const response = await fetch('https://formsubmit.co/ajax/contact.auxuz@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _subject: `New AUXUZ enquiry — ${form.company || form.name}`, _replyto: form.email, _template: 'table', _captcha: 'false', _next: `${window.location.origin}/thanks/` }),
      })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('Sent. We’ll get back to you shortly.')
      setForm(initialForm)
    } catch {
      setStatus('Could not send right now. Please email contact.auxuz@gmail.com directly.')
    }
  }

  return <main>
    <nav className="nav shell">
      <Link className="brand" href="/" aria-label="AUXUZ home"><img src="/auxuz-logo.png" alt="AUXUZ" /></Link>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">☰</button>
      <div className={`navlinks ${menu ? 'open' : ''}`}>
        {navItems.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}</Link>)}
        <Link className="navcta" href="/contact/">Start a conversation ↗</Link>
      </div>
    </nav>

    <section className="hero shell">
      <div className="hero-copy">
        <div className="eyebrow"><span /> CUSTOMER ACQUISITION + AUTOMATION</div>
        <h1>Make every<br /><em>enquiry count.</em></h1>
        <p className="lead">AUXUZ designs and manages the digital systems that attract attention, capture demand, qualify prospects, automate follow-up and move opportunities toward revenue.</p>
        <div className="actions"><Link className="button primary" href="/contact/">Start a project <span>↗</span></Link><Link className="button ghost" href="/solutions/">Explore solutions <span>→</span></Link></div>
        <div className="micro"><span className="dot" /> Built for modern businesses · India + global delivery</div>
      </div>
      <div className="hero-visual"><ThreeHero /><div className="float-label label-one">DEMAND <b>CAPTURED</b></div><div className="float-label label-two">SIGNAL <b>QUALIFIED</b></div><div className="float-label label-three">NEXT STEP <b>READY</b></div><div className="hero-center">A<span>×</span>U</div></div>
    </section>

    <section className="marquee"><div>ATTRACT <i>✦</i> CAPTURE <i>✦</i> QUALIFY <i>✦</i> FOLLOW UP <i>✦</i> BOOK <i>✦</i> CONVERT <i>✦</i> RETAIN <i>✦</i></div></section>

    <section className="section shell intro-grid"><div><div className="eyebrow">THE IDEA</div><h2>Growth is not<br /><em>one channel.</em></h2></div><div className="large-copy"><p>Traffic without capture leaks. Leads without follow-up decay. Follow-up without context feels generic. AUXUZ connects the pieces into one measurable customer journey.</p><Link className="textlink" href="/solutions/">See how the pieces connect <span>↗</span></Link></div></section>

    <section className="darksection"><div className="shell dark-grid"><div><div className="eyebrow light">ONE CONNECTED ENGINE</div><h2>Less friction.<br /><em>More movement.</em></h2></div><div className="dark-list"><div><b>01</b><span>Attract the right attention</span></div><div><b>02</b><span>Give interest a clear next step</span></div><div><b>03</b><span>Capture context instead of fragments</span></div><div><b>04</b><span>Follow up before intent disappears</span></div><div><b>05</b><span>Measure the journey and improve it</span></div></div></div></section>

    <section className="section shell cards-section"><div className="sectionhead"><div><div className="eyebrow">CAPABILITIES</div><h2>Everything around<br />the enquiry.</h2></div><Link className="textlink" href="/services/">View all services <span>↗</span></Link></div><div className="cap-grid">{['Strategy', 'Web experiences', 'Lead capture', 'CRM', 'AI workflows', 'Follow-up', 'Booking', 'Analytics'].map((x, i) => <Link className="cap-card" href="/services/" key={x}><small>0{i + 1}</small><strong>{x}</strong><span>↗</span></Link>)}</div></section>

    <section className="section shell statement"><div className="eyebrow">BUILT TO SCALE</div><h2>Start simple.<br /><em>Build intelligently.</em></h2><div className="statement-bottom"><p>We can start with the highest-impact piece and expand as the business proves what works. No bloated stack required on day one.</p><Link className="button dark" href="/how-it-works/">See how we work <span>→</span></Link></div></section>

    <section className="section shell contact-band"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Have demand.<br /><em>Let’s build the path.</em></h2></div><Link className="button primary" href="/contact/">Tell us what you need <span>↗</span></Link></section>

    <footer className="footer"><div className="shell foot"><div><img src="/auxuz-logo.png" alt="AUXUZ" /><p>Customer Acquisition & Automation.</p></div><div className="footright"><div><Link href="/solutions/">Solutions</Link> · <Link href="/services/">Services</Link> · <Link href="/about/">About</Link> · <Link href="/contact/">Contact</Link></div><div><Link href="/privacy/">Privacy</Link> · <Link href="/terms/">Terms</Link></div><small>© 2026 AUXUZ</small></div></div></footer>
  </main>
}
