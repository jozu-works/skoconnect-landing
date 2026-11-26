'use client';

import { useState } from 'react';
import WalkthroughModal from '@/components/WalkthroughModal';

/**
 * SkoEnroll marketing page — /enroll.
 * Copy: LEXI proposal 2026-11-26 §2 (verbatim) + Dre's locked overrides:
 *  - PGA Academy never named; social proof = "First pilot school confirmed"
 *  - "Book a walkthrough" = contact form → requestAccess Cloud Function
 *  - SkoConnect teal/gold frame; Jozu navy/gold (#0055BF/#062A5E/#FFB300)
 *    accents for the SkoEnroll lockup + section eyebrows only.
 */

const NAVY = '#062A5E';
const BLUE = '#0055BF';
const GOLD = '#FFB300';

const valueProps = [
  {
    icon: '🏫',
    title: 'School-branded forms',
    body: 'Your crest, your colours, your required fields. Parents see your school, not a generic form builder.',
  },
  {
    icon: '✉️',
    title: 'Verified parent emails',
    body: 'Every application is confirmed with a secure email code, so you know the applicant\u2019s contact is real before you reply.',
  },
  {
    icon: '📊',
    title: 'Real-time tracking',
    body: 'Watch applications move from Submitted → Under Review → Approved, live. No register, no chasing.',
  },
  {
    icon: '📨',
    title: 'Decision emails',
    body: 'Approve or decline and SkoEnroll sends the family an official email automatically. Your office never types another status message.',
  },
];

const parentJourney = [
  { n: '01', title: 'The school shares a code', body: 'Admissions sends the family an enrolment code for the intake year.' },
  { n: '02', title: 'Parent completes the branded form', body: 'Guided fields, document upload, school branding throughout.' },
  { n: '03', title: 'Email verification', body: 'A one-time code confirms the parent\u2019s email before submission is accepted.' },
  { n: '04', title: 'Submit and track', body: 'The parent sees their application status in real time; no calls to the office asking \u201Cdid you get it?\u201D' },
  { n: '05', title: 'The school decides', body: 'Admin reviews, approves or declines seats, and SkoEnroll emails the decision automatically.' },
];

const faqs = [
  { q: 'Does parents pay for SkoEnroll?', a: 'No. Access comes through the school\u2019s subscription or pilot enrolment. Families never pay separately.' },
  { q: 'What does the free pilot include?', a: 'Full enrolment functionality for one intake cycle at no cost. We share pricing before the pilot ends — no card required, no automatic charge.' },
  { q: 'How long does setup take?', a: 'Your forms and branding are configured with our team — most schools are ready within a day, same as SkoConnect.' },
  { q: 'Is parent data safe?', a: 'SkoEnroll runs on Google Cloud infrastructure, the same foundation as SkoConnect. Application data belongs to your school.' },
  { q: 'Do we need an IT department?', a: 'No. Setup and configuration are handled with our team directly.' },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: 'rgba(0,85,191,0.08)', border: `1px solid ${BLUE}33`, color: NAVY, fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '0.02em' }}>
      {children}
    </div>
  );
}

export default function EnrollMarketing() {
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const ctaPrimary = (
    <button onClick={() => setShowWalkthrough(true)} style={{ display: 'inline-block', padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: '#0D9488', border: 'none', cursor: 'pointer', boxShadow: '0 4px 32px rgba(20,184,166,0.35)' }}>
      Book a walkthrough
    </button>
  );
  const ctaSecondary = (
    <a href="/?pilot=1" className="ej-ghost" style={{ display: 'inline-block', padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', textDecoration: 'none' }}>
      Start the free pilot
    </a>
  );

  return (
    <div className="ej" style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#1C1917', overflowX: 'hidden', background: '#fff' }}>
      {showWalkthrough && <WalkthroughModal onClose={() => setShowWalkthrough(false)} />}

      {/* ── Sub-nav (minimal, per proposal §1) ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(4,47,46,0.97)', backdropFilter: 'blur(8px)', borderBottom: `2px solid ${GOLD}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>SkoConnect</span>
            <span style={{ color: GOLD, fontSize: 13, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: NAVY, border: `1px solid ${BLUE}` }}>SkoEnroll</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>← skoconnect.com</a>
            <button onClick={() => setShowWalkthrough(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 10, padding: '8px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Book a walkthrough</button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Section 1 — Hero ── */}
        <header style={{ background: 'linear-gradient(145deg, #042F2E 0%, #0a4a44 35%, #0F766E 65%, #115E59 100%)', padding: '96px 24px 88px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15%', left: '55%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,179,0,0.08)', filter: 'blur(8px)' }} aria-hidden="true" />
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 100, background: NAVY, border: `1px solid ${BLUE}`, marginBottom: 24 }}>
              <span style={{ color: GOLD, fontSize: 14, fontWeight: 700, letterSpacing: '0.03em' }}>SkoEnroll · A SkoConnect product</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.1rem,4.5vw,3.4rem)', lineHeight: 1.14, letterSpacing: '-0.025em', color: '#fff', marginBottom: 20, fontWeight: 800 }}>
              Stop printing enrolment forms. Start approving them from your phone.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 18, lineHeight: 1.6, maxWidth: 640, margin: '0 auto 40px' }}>
              SkoEnroll moves your school&apos;s student enrolment fully online — branded application forms, verified parent emails, and real-time tracking from first submission to final approval. Live in production with schools in Jamaica.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 24 }}>
              {ctaPrimary}
              {ctaSecondary}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
              Powered by SkoConnect · Built on Google Cloud · No credit card required for pilots
            </p>
          </div>
        </header>

        {/* ── Section 2 — The problem ── */}
        <section style={{ padding: '88px 24px', background: '#FAFAF8' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Eyebrow>The problem</Eyebrow>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1C1917', marginBottom: 16, fontWeight: 800 }}>
                Paper enrolment is costing your office more than you think.
              </h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 16, maxWidth: 680, margin: '0 auto 32px' }}>
              {[
                'Stacked paper forms that can\u2019t be searched, sorted, or audited',
                'Parents waiting in lines to submit — and resubmitting missing documents',
                'No way to confirm an application actually reached the school office',
                'Ad-hoc WhatsApp intake that puts student data in personal phones',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', border: '1px solid #E8E8E0', borderRadius: 12, padding: '16px 20px' }}>
                  <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>✕</span>
                  <span style={{ fontSize: 15, color: '#44403C', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, color: '#0F766E', maxWidth: 680, margin: '0 auto' }}>
              SkoEnroll replaces all of it with one branded online pipeline your office controls.
            </p>
          </div>
        </section>

        {/* ── Section 3 — Value props ── */}
        <section style={{ padding: '88px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Eyebrow>What you get</Eyebrow>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1C1917', fontWeight: 800 }}>
                Everything your office needs, nothing it doesn&apos;t.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {valueProps.map(v => (
                <div key={v.title} style={{ background: '#FAFAF8', border: '1px solid #E8E8E0', borderTop: `3px solid ${GOLD}`, borderRadius: 14, padding: '28px 24px' }}>
                  <div style={{ fontSize: 30, marginBottom: 16 }} aria-hidden="true">{v.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1C1917', marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.65 }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4 — Parent journey (5 steps) ── */}
        <section id="how-it-works" style={{ padding: '88px 24px', background: '#FAFAF8' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <Eyebrow>How it works</Eyebrow>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1C1917', fontWeight: 800 }}>
                How a parent applies — and how your office approves.
              </h2>
            </div>
            <ol style={{ listStyle: 'none', display: 'grid', gap: 16 }}>
              {parentJourney.map(step => (
                <li key={step.n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', background: '#fff', border: '1px solid #E8E8E0', borderRadius: 14, padding: '22px 26px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }} aria-hidden="true">{step.n}</div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1C1917', marginBottom: 6 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.65 }}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Section 5 — Admin-side proof ── */}
        <section style={{ padding: '88px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <Eyebrow>For the office</Eyebrow>
            <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1C1917', marginBottom: 20, fontWeight: 800 }}>
              Built for the school office, not just the parent.
            </h2>
            <p style={{ fontSize: 17, color: '#57534E', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 40px' }}>
              The admin console gives your team seat controls, per-intake application queues, and one-click decision emails. Superadmin accounts manage multiple intakes and set approval limits per staff member.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              {[
                { icon: '🗂️', label: 'Admin application queue' },
                { icon: '🪑', label: 'Seat approval panel' },
                { icon: '🏫', label: 'Superadmin intake dashboard' },
              ].map(s => (
                <div key={s.label} style={{ border: `2px dashed #CCFBF1`, borderRadius: 14, padding: '32px 20px', background: '#F0FDFA' }}>
                  <div style={{ fontSize: 34, marginBottom: 12 }} aria-hidden="true">{s.icon}</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0F766E' }}>{s.label}</p>
                  <p style={{ fontSize: 12, color: '#78716C', marginTop: 6 }}>Screenshot slot — captured from production at review</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 6 — Social proof ── */}
        <section style={{ padding: '72px 24px', background: NAVY, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,179,0,0.1)', filter: 'blur(6px)' }} aria-hidden="true" />
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem,2.8vw,2.2rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: 24, fontWeight: 800 }}>
              Running in production today.
            </h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.08)', border: `1px solid ${BLUE}`, borderRadius: 100, padding: '14px 28px', marginBottom: 32 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: GOLD, display: 'inline-block' }} aria-hidden="true" />
              <span style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>First pilot school confirmed — case study coming</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7 }}>
              Placeholder stats — filled after the first term of data: Applications processed · Average time-to-decision · Hours saved per intake
            </p>
          </div>
        </section>

        {/* ── Section 7 — FAQ ── */}
        <section id="faq" style={{ padding: '88px 24px', background: '#FAFAF8' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Eyebrow>FAQ</Eyebrow>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#1C1917', fontWeight: 800 }}>
                Questions school leaders ask.
              </h2>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {faqs.map(f => (
                <details key={f.q} style={{ background: '#fff', border: '1px solid #E8E8E0', borderRadius: 12, padding: '18px 22px' }}>
                  <summary style={{ fontSize: 16, fontWeight: 600, color: '#1C1917', cursor: 'pointer' }}>{f.q}</summary>
                  <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.65, marginTop: 12 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 8 — CTA ladder ── */}
        <section style={{ background: 'linear-gradient(145deg, #042F2E 0%, #0F766E 100%)', padding: '96px 24px', textAlign: 'center', borderTop: `3px solid ${GOLD}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: 16, fontWeight: 800 }}>
              See SkoEnroll on your school&apos;s forms.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
              Founder-led walkthrough, or start the free pilot — every path starts with a conversation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {ctaPrimary}
              {ctaSecondary}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: '#0C0A09', padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ color: '#A8A29E', fontSize: 13, marginBottom: 8 }}>
          SkoEnroll — Digital Enrolment · A SkoConnect product
        </p>
        <p style={{ color: '#78716C', fontSize: 13 }}>
          <a href="/" style={{ color: '#A8A29E', textDecoration: 'underline' }}>skoconnect.com</a>
          {' · '}
          <a href="mailto:support@skoconnect.com" style={{ color: '#A8A29E', textDecoration: 'underline' }}>support@skoconnect.com</a>
        </p>
        <p style={{ color: '#57534E', fontSize: 12, marginTop: 12 }}>© 2026 SkoConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
