'use client';

/**
 * Walkthrough contact form (Dre ruling: "Book a walkthrough" = contact form,
 * NOT mailto / scheduler). Posts structured JSON to the existing public
 * requestAccess Cloud Function with source/intent fields so the SkoConnect
 * side can fan out a notification email to anewsame@jozuworks.com +
 * support@skoconnect.com (companion change — see PR body).
 */

import { useEffect, useState } from 'react';

const FUNCTIONS_URL =
  'https://us-central1-school-connect-enterprise.cloudfunctions.net/requestAccess';

export interface WalkthroughForm {
  name: string;
  school: string;
  role: string;
  email: string;
  phone: string;
  message: string;
}

const ROLES = [
  'Principal / Head of School',
  'Registrar / Admissions',
  'Bursar / Office Administrator',
  'IT Coordinator',
  'Other',
];

export default function WalkthroughModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<WalkthroughForm>({
    name: '', school: '', role: ROLES[0], email: '', phone: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch(FUNCTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'skoenroll-landing',
          intent: 'skoenroll-walkthrough',
          contact_name: form.name,
          school_name: form.school,
          role: form.role,
          contact_email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Network error. Please check your connection and try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: 16, outline: 'none', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(4,47,46,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div
        role="presentation"
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(135deg, #042F2E 0%, #0a4a44 100%)', borderRadius: 20, padding: '32px 24px', maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', position: 'relative' }}
      >
        <button aria-label="Close dialog" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 24, color: '#fff', marginBottom: 12, fontWeight: 700 }}>Request Submitted!</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              We received your walkthrough request and will be in touch within 24 hours. Check your inbox for a confirmation email.
            </p>
            <button onClick={onClose} style={{ background: '#0D9488', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 24, color: '#fff', marginBottom: 6, fontWeight: 700 }}>Book a walkthrough</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>
              A founder-led walkthrough of SkoEnroll on your school&apos;s forms. We&apos;ll reply within one business day.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle} htmlFor="wk-name">Your Name *</label>
                <input id="wk-name" required autoComplete="name" enterKeyHint="next" style={inputStyle} placeholder="Principal Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="wk-school">School Name *</label>
                <input id="wk-school" required autoComplete="organization" enterKeyHint="next" style={inputStyle} placeholder="St. Mary's Primary School" value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="wk-role">Your Role *</label>
                <select id="wk-role" required style={{ ...inputStyle, appearance: 'auto' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r} value={r} style={{ color: '#1C1917' }}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="wk-email">Work Email *</label>
                <input id="wk-email" required type="email" autoComplete="email" inputMode="email" enterKeyHint="next" style={inputStyle} placeholder="principal@school.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="wk-phone">Phone (optional)</label>
                <input id="wk-phone" type="tel" autoComplete="tel" inputMode="tel" enterKeyHint="done" style={inputStyle} placeholder="+1 (876) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="wk-message">Message (optional)</label>
                <textarea id="wk-message" rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Intake size, timeline, anything we should know." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              {status === 'error' && (
                <p style={{ color: '#FCA5A5', fontSize: 13, padding: '10px 14px', background: 'rgba(220,38,38,0.15)', borderRadius: 8, border: '1px solid rgba(220,38,38,0.3)' }}>{errorMsg}</p>
              )}
              <button type="submit" disabled={status === 'submitting'} style={{ background: status === 'submitting' ? 'rgba(13,148,136,0.5)' : '#0D9488', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: status === 'submitting' ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {status === 'submitting' ? 'Submitting…' : 'Request Walkthrough →'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No credit card required. The pilot program is free.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
