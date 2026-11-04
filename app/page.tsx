'use client';
/* eslint-disable @next/next/no-img-element, react/no-unescaped-entities */

import { useState, useEffect } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: '📢',
    title: 'Real-Time Announcements',
    description: 'Push critical updates instantly, or schedule them to the minute. Emergency alerts reach every parent, teacher, and student in seconds — not hours.',
    tag: 'Core',
    large: true,
  },
  {
    icon: '📋',
    title: 'Digital Forms & Submissions',
    description: 'Replace paper with smart digital forms. Track responses, send reminders, and export data automatically.',
    tag: 'Forms 2.0',
    large: false,
  },
  {
    icon: '⏱️',
    title: 'Precision-Scheduled Notices',
    tag: 'New',
    description: 'Draft tonight, land at 7:00 a.m. sharp. Schedule any notice down to the exact minute — with automatic event reminders — so the message arrives when parents actually read it.',
    large: false,
  },
  {
    icon: '🚨',
    title: 'Emergency Broadcast',
    description: 'One-click mass alert with mandatory acknowledgment tracking. Know exactly who has seen critical messages.',
    tag: 'Critical',
    large: true,
  },
  {
    icon: '🤖',
    title: 'AI Document Processing',
    description: 'Upload a PDF newsletter or timetable — Gemini AI extracts events, notices, and dates automatically. No manual data entry.',
    tag: 'AI',
    large: true,
  },
  {
    icon: '💡',
    title: 'AI Form-Field Help',
    tag: 'New',
    description: 'A "?" on every form field gives parents plain-language explanations instantly. Fewer confused calls to the office, more forms completed right the first time.',
    large: false,
  },
  {
    icon: '🔍',
    title: 'Anomaly Detection',
    description: 'AI flags suspicious entries before they reach parents — Christmas Day events, 3 AM start times, duplicates. Quality control built in.',
    large: false,
  },
  {
    icon: '📶',
    title: 'Offline-Tolerant App',
    description: 'Built for real connectivity. Notices and forms stay readable on weak or dropped connections — parents never miss critical updates.',
    tag: 'Jamaica-ready',
    large: false,
  },
  {
    icon: '📊',
    title: 'Engagement Analytics',
    description: 'See notice reach, form response rates, and engagement trends in one dashboard. Know what your community actually reads.',
    large: false,
  },
  {
    icon: '📱',
    title: 'Native Mobile App',
    description: 'Android app for parents and teachers, now available on Google Play. Push notifications keep everyone in the loop, always.',
    large: false,
  },
  {
    icon: '💬',
    title: 'Two-Way Messaging',
    large: false,
    description: 'Direct messages between parents, teachers, and front office — scoped to your school\'s verified roster, with teacher reply hours and built-in block and report.',
  },
  {
    icon: '✅',
    title: 'Verified School Community',
    tag: 'Trust',
    large: false,
    description: 'Every account is tied to your school\'s roster — one identity per real person. Enroll families by CSV, wizard, or QR scan, and messages can only come from who they say they are.',
  },
];

const personas = [
  {
    role: 'School Leaders',
    emoji: '🏫',
    tagline: 'Run school communication with control and proof',
    benefits: [
      'Reach the right families fast — from daily notices to emergency broadcasts.',
      'See who received, opened, and responded, so communication stops being guesswork.',
      'Replace scattered chats and paper trails with one school-owned system.',
      'Bring your whole school community onboard quickly and manage access by role.',
    ],
    accent: '#14B8A6',
    bg: '#F0FDFA',
  },
  {
    role: 'Teachers',
    emoji: '👨‍🏫',
    tagline: 'Spend less time chasing responses',
    benefits: [
      'Send class updates in seconds without managing side chats.',
      'Collect forms, RSVPs, and confirmations in one place instead of on paper.',
      'Keep parent communication structured, professional, and tied to the school.',
      'Get faster responses because families receive updates where school communication belongs.',
    ],
    accent: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    role: 'Parents',
    emoji: '👨‍👩‍👧',
    tagline: 'Know what matters without digging through chats',
    benefits: [
      'Get important school updates in one trusted place.',
      'Respond to forms, reminders, and event requests from your phone.',
      'Stay ahead of emergencies, deadlines, and school events before they are missed.',
      'Manage communication for more than one child from one account.',
    ],
    accent: '#8B5CF6',
    bg: '#F5F3FF',
  },
];

const testimonials = [
  {
    quote: 'I built SkoConnect because schools need reliable communication that actually works. WhatsApp groups are chaotic, email gets buried, and paper forms get lost. Join our pilot program and help us build the future of school engagement.',
    author: 'Andre Newsome',
    role: 'Founder',
    school: 'SkoConnect',
    initials: 'AN',
    color: '#14B8A6',
  },
];

const steps = [
  {
    num: '01',
    title: 'Set Up Your School',
    description: 'Create your school profile in minutes. Configure roles, invite staff, and customize your communication settings.',
    icon: '🏫',
  },
  {
    num: '02',
    title: 'Enroll Your Community',
    description: 'Import parents and students via CSV upload, or use the guided enrollment wizard. Everyone gets set up automatically.',
    icon: '👥',
  },
  {
    num: '03',
    title: 'Start Communicating',
    description: 'Send your first notice, create a digital form, schedule an event — your whole community is instantly connected.',
    icon: '🚀',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const FUNCTIONS_URL = 'https://us-central1-school-connect-enterprise.cloudfunctions.net/requestAccess';

function RequestAccessModal({ onClose, variant = 'pilot' }: { onClose: () => void; variant?: 'pilot' | 'demo' }) {
  const [form, setForm] = useState({ school_name: '', contact_name: '', contact_email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch(FUNCTIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };

  // Modal a11y: Escape closes; backdrop click also closes (presentation role keeps semantics clear)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: '#fff', marginBottom: 12 }}>Request Submitted!</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
              We received your request and will be in touch within 24 hours. Check your inbox for a confirmation email.
            </p>
            <button onClick={onClose} style={{ background: '#0D9488', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: '#fff', marginBottom: 6 }}>
              {variant === 'demo' ? 'Talk to the Founder — 15 min' : "Start Your School's Pilot"}
            </h3>
            {variant === 'demo' ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>A 15-minute call to understand your school, answer implementation questions, and see whether the pilot is a fit. We’ll reply within one business day.</p>
            ) : (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>Free during the pilot program — SkoConnect is live in production today. We'll be in touch within 24 hours.</p>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>School Name *</label>
                <input required style={inputStyle} placeholder="St. Mary's Primary School" value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input required style={inputStyle} placeholder="Principal Jane Smith" value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Work Email *</label>
                <input required type="email" style={inputStyle} placeholder="principal@school.edu" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input style={inputStyle} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>How did you hear about us? (optional)</label>
                <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Word of mouth, social media, etc." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              {status === 'error' && (
                <p style={{ color: '#FCA5A5', fontSize: 13, padding: '10px 14px', background: 'rgba(220,38,38,0.15)', borderRadius: 8, border: '1px solid rgba(220,38,38,0.3)' }}>{errorMsg}</p>
              )}
              <button type="submit" disabled={status === 'submitting'} style={{ background: status === 'submitting' ? 'rgba(13,148,136,0.5)' : '#0D9488', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontSize: 15, fontWeight: 700, cursor: status === 'submitting' ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {status === 'submitting' ? 'Submitting…' : 'Start Your Free Pilot →'}
              </button>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No credit card required. The pilot program is free.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activePersona, setActivePersona] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState<false | 'pilot' | 'demo'>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.id) {
            setVisibleSections(prev => new Set(Array.from(prev).concat(entry.target.id)));
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id: string) => visibleSections.has(id);
  const scrollToHowItWorks = () => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {showModal && <RequestAccessModal variant={showModal} onClose={() => setShowModal(false)} />}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp { font-family: Outfit, system-ui, sans-serif; color: #1C1917; overflow-x: hidden; }
        .lp .serif { font-family: DM Serif Display, Georgia, serif; }

        /* ── Hero gradient ── */
        .hero-bg {
          background: linear-gradient(145deg, #042F2E 0%, #0a4a44 35%, #0F766E 65%, #115E59 100%);
          background-size: 300% 300%;
          animation: bgShift 12s ease infinite;
        }
        @keyframes bgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Grid overlay ── */
        .grid-overlay {
          background-image:
            linear-gradient(rgba(20,184,166,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.07) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        /* ── Nav ── */
        .nav-dark {
          background: rgba(4,47,46,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(20,184,166,0.18);
        }

        /* ── Glow orbs ── */
        .orb {
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        /* ── Float animations ── */
        @keyframes floatA {
          0%,100% { transform: translateY(0) rotate(2deg); }
          50%      { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(-5px) rotate(-2.5deg); }
          50%      { transform: translateY(7px) rotate(-2.5deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0) rotate(1.5deg); }
          50%      { transform: translateY(-12px) rotate(1.5deg); }
        }
        @keyframes floatD {
          0%,100% { transform: translateY(-3px) rotate(-1deg); }
          50%      { transform: translateY(5px) rotate(-1deg); }
        }
        .fa { animation: floatA 4.2s ease-in-out infinite; }
        .fb { animation: floatB 5.1s ease-in-out infinite; }
        .fc { animation: floatC 6s ease-in-out 0.8s infinite; }
        .fd { animation: floatD 4.8s ease-in-out 0.4s infinite; }

        /* ── Hero reveal ── */
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .h-r0 { animation: heroReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .h-r1 { animation: heroReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .h-r2 { animation: heroReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .h-r3 { animation: heroReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .h-r4 { animation: heroReveal 0.8s cubic-bezier(0.22,1,0.36,1) 0.7s both; }

        /* ── Section reveal ── */
        .s-hide { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .s-show { opacity: 1 !important; transform: translateY(0) !important; }

        /* ── Notification cards ── */
        .notif {
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 18px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1);
          backdrop-filter: blur(12px);
          padding: 14px 16px;
        }

        /* ── Gradient text ── */
        .teal-text {
          background: linear-gradient(130deg, #2DD4BF 0%, #5EEAD4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gold-text {
          background: linear-gradient(130deg, #F59E0B 0%, #FDE68A 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Buttons ── */
        .btn-teal {
          background: linear-gradient(135deg, #14B8A6, #0D9488);
          position: relative; overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-teal::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #2DD4BF, #14B8A6);
          opacity: 0; transition: opacity 0.2s ease;
        }
        .btn-teal:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(20,184,166,0.4); }
        .btn-teal:hover::after { opacity: 1; }
        .btn-teal span { position: relative; z-index: 1; }

        .btn-ghost-white {
          border: 1.5px solid rgba(255,255,255,0.28);
          transition: all 0.2s ease;
        }
        .btn-ghost-white:hover {
          border-color: rgba(255,255,255,0.65);
          background: rgba(255,255,255,0.08);
        }

        /* ── Feature cards ── */
        .feat-card {
          background: #fff;
          border: 1px solid #E8E8E0;
          border-radius: 22px;
          padding: 30px;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative; overflow: hidden;
        }
        .feat-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #14B8A6, #5EEAD4);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s ease;
        }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(20,184,166,0.1), 0 4px 16px rgba(0,0,0,0.04); border-color: #99F6E4; }
        .feat-card:hover::before { transform: scaleX(1); }
        .feat-large { grid-column: span 2; }
        @media (max-width: 767px) { .feat-large { grid-column: span 1; } }

        /* ── Persona tab ── */
        .p-tab {
          padding: 9px 18px; border-radius: 100px;
          font-size: 14px; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          border: 1.5px solid transparent;
          transition: all 0.2s ease;
          font-family: Outfit, sans-serif;
        }
        .p-tab-on  { background: #042F2E; color: #fff; border-color: #042F2E; }
        .p-tab-off { background: #fff; color: #57534E; border-color: #E8E8E0; }
        .p-tab-off:hover { border-color: #14B8A6; color: #0F766E; }

        /* ── Testimonial cards ── */
        .t-card {
          background: #fff; border: 1px solid #E8E8E0; border-radius: 22px; padding: 32px;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .t-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(20,184,166,0.08); }

        /* ── Step number watermark ── */
        .step-wm {
          font-family: DM Serif Display, Georgia, serif;
          font-size: 100px; line-height: 1;
          color: rgba(20,184,166,0.1);
          position: absolute; top: -16px; left: -8px;
          pointer-events: none; user-select: none;
        }

        /* ── Pulse dot ── */
        @keyframes pulseDot {
          0%,100% { box-shadow: 0 0 0 0 rgba(20,184,166,0.4); }
          50%      { box-shadow: 0 0 0 6px rgba(20,184,166,0); }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        /* ── Scroll indicator ── */
        @keyframes scrollBob {
          0%,100% { transform: translateY(0); opacity: 0.8; }
          50%      { transform: translateY(6px); opacity: 0.4; }
        }
        .scroll-bob { animation: scrollBob 1.8s ease-in-out infinite; }

        /* ── Progress bar ── */
        .progress-bar { height: 6px; border-radius: 3px; background: #E8E8E0; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #14B8A6, #5EEAD4); border-radius: 3px; }

        .btn-teal,
        .btn-ghost-white,
        .p-tab {
          min-height: 44px;
        }

        /* M-5: nav link tap targets >= 24px */
        .lp-nav-link { display: inline-flex; align-items: center; min-height: 24px; padding: 4px 2px; }

        /* M-6: respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .lp *, .lp *::before, .lp *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ── Responsive layout ── */
        @media (max-width: 1023px) {
          .lp-nav-inner {
            height: 90px !important;
            padding: 0 16px !important;
          }
          .lp-logo-mark {
            width: 64px !important;
            height: 64px !important;
          }
          .lp-logo-word {
            font-size: 20px !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .hero-copy {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-sub {
            max-width: 620px !important;
          }
          .hero-scroll {
            display: none !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .persona-card-grid {
            grid-template-columns: 1fr !important;
          }
          .how-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .trust-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 28px !important;
          }
        }

        @media (max-width: 767px) {
          .lp-nav-inner {
            height: 82px !important;
          }
          .lp-logo-word {
            font-size: 18px !important;
          }
          .hero-bg {
            padding-top: 106px !important;
          }
          .hero-sub {
            font-size: 16px !important;
            line-height: 1.55 !important;
          }
          .hero-right {
            display: none !important;
          }
          .stats-grid,
          .features-grid,
          .trust-grid,
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .persona-shell {
            border-radius: 18px !important;
          }
          .final-cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          .final-cta-buttons > * {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 479px) {
          .lp-logo-word {
            display: none;
          }
          .lp .serif {
            text-wrap: balance;
          }
        }
      `}</style>

      <div className="lp">
        {/* M-3: main landmark for a11y/SEO */}
        <main>

        {/* ────────────────────── NAV ────────────────────────────── */}
        <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'nav-dark' : ''}`}>
          <div className="lp-nav-inner" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Logo — L-1: links to top instead of dead "#"; picture serves WebP with PNG fallback */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div className="lp-logo-mark" style={{
                width: 96, height: 96, borderRadius: '50%',
                overflow: 'hidden', flexShrink: 0,
                border: '2px solid rgba(45,212,191,0.35)',
                boxShadow: '0 0 0 4px rgba(45,212,191,0.1), 0 0 24px rgba(20,184,166,0.25)',
                background: '#042F2E',
              }}>
                <picture>
                  <source srcSet="/logo.webp" type="image/webp" />
                  <img src="/logo.png" alt="SkoConnect" style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }} />
                </picture>
              </div>
              <span className="lp-logo-word" style={{ color: '#fff', fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em' }}>SkoConnect</span>
            </a>

            {/* Links (desktop) */}
            <div style={{ display: 'flex', gap: 32 }} className="hidden md:flex">
              {['#features', '#for-schools', '#how-it-works', '#founder-vision'].map((href, i) => (
                <a key={href} href={href} className="lp-nav-link" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >{['Features', 'For Schools', 'How It Works', "Founder's Vision"][i]}</a>
              ))}
            </div>

            {/* CTA group */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="https://admin.skoconnect.com/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}
                className="hidden sm:block">Sign In</a>
              <button onClick={() => setShowModal('pilot')} className="btn-teal" style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', background: '#0D9488', border: 'none', cursor: 'pointer', display: 'inline-block' }}>
                <span>Start Your Free Pilot →</span>
              </button>
            </div>
          </div>
        </nav>

        {/* ────────────────────── HERO ───────────────────────────── */}
        <section className="hero-bg hero-min-height" style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingTop: 80, paddingBottom: 64, overflow: 'hidden' }}>

          {/* Grid overlay */}
          <div className="grid-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

          {/* Glow orbs */}
          <div className="orb" style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, background: 'rgba(20,184,166,0.12)' }} />
          <div className="orb" style={{ position: 'absolute', bottom: '5%', left: '-8%', width: 400, height: 400, background: 'rgba(245,158,11,0.07)' }} />
          <div className="orb" style={{ position: 'absolute', top: '40%', left: '30%', width: 300, height: 300, background: 'rgba(20,184,166,0.06)' }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
              className="hero-grid" >

              {/* LEFT: Copy */}
              <div className="hero-copy">
                {/* Pilot badge */}
                <div className="h-r0" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 100, padding: '7px 16px', marginBottom: 32 }}>
                  <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DD4BF', display: 'inline-block' }} />
                  <span style={{ color: '#99F6E4', fontSize: 13, fontWeight: 500 }}>Live in production · Free Pilot Program</span>
                </div>

                {/* Headline */}
                <h1 className="serif h-r1" style={{ fontSize: 'clamp(2.8rem,5vw,4.4rem)', lineHeight: 1.08, letterSpacing: '-0.025em', color: '#fff', marginBottom: 24 }}>
                  Replace WhatsApp chaos with accountable school communication in one day.
                </h1>

                {/* Sub */}
                <p className="h-r2 hero-sub" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, lineHeight: 1.65, maxWidth: 460, marginBottom: 36 }}>
                  Minute-perfect scheduled notices, two-way messaging with teacher reply hours, digital forms, emergency broadcasts, and AI document processing — one system built for Jamaican schools.
                </p>

                {/* CTAs */}
                <div className="h-r3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                  <button onClick={() => setShowModal('pilot')} className="btn-teal" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: '#0D9488', border: 'none', cursor: 'pointer', display: 'inline-block' }}>
                    <span>Start Your Free Pilot →</span>
                  </button>
                  <button onClick={scrollToHowItWorks} className="btn-ghost-white" style={{ padding: '14px 28px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: 'transparent', cursor: 'pointer' }}>
                    See How It Works
                  </button>
                </div>

                {/* Google Play badge */}
                <a href="https://play.google.com/store/apps/details?id=com.skoconnect.skoconnect"
                   target="_blank" rel="noopener noreferrer"
                   className="h-r3"
                   style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#000', borderRadius: 12, padding: '8px 16px 8px 12px', textDecoration: 'none', marginBottom: 36, transition: 'transform 0.15s ease', border: '1px solid rgba(255,255,255,0.15)' }}
                   onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <svg width="20" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M0.73 1.45C0.5 1.7 0.4 2.05 0.4 2.5V19.5C0.4 19.95 0.5 20.3 0.73 20.55L0.8 20.62L10.2 11.22V11.1V10.98L0.8 1.38L0.73 1.45Z" fill="#2196F3"/>
                    <path d="M13.3 14.3L10.2 11.22V11.1V10.98L13.3 7.9L13.37 7.97L17.05 10.06C18.1 10.65 18.1 11.55 17.05 12.14L13.37 14.23L13.3 14.3Z" fill="#FFC107"/>
                    <path d="M13.37 14.23L10.2 11.1L0.73 20.55C1.13 21 1.85 21.05 2.6 20.65L13.37 14.23Z" fill="#F44336"/>
                    <path d="M13.37 7.97L2.6 1.55C1.85 1.1 1.13 1.2 0.73 1.65L10.2 11.1L13.37 7.97Z" fill="#4CAF50"/>
                  </svg>
                  <span style={{ color: '#fff', lineHeight: 1.2 }}>
                    <span style={{ display: 'block', fontSize: 9, fontWeight: 400, opacity: 0.75, letterSpacing: '0.02em' }}>GET IT ON</span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>Google Play</span>
                  </span>
                </a>

                {/* Trust pills */}
                <div className="h-r4" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                  {['🔒 Secure by design on Google Cloud', '☁️ Built on Google Cloud infrastructure', '📲 Now on Google Play', '✓ Free Pilot Program'].map(p => (
                    <span key={p} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>{p}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT: Floating cards */}
              <div style={{ position: 'relative', height: 540 }} className="hero-right hidden lg:block">
                <div style={{ position: 'absolute', top: 20, right: 8, zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(232,232,224,0.9)', color: '#57534E', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 10px 30px rgba(28,25,23,0.08)' }}>
                  Demo Preview
                </div>

                {/* Decorative dot grid */}
                <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    {Array.from({ length: 25 }, (_, i) => (
                      <circle key={i} cx={(i % 5) * 24 + 8} cy={Math.floor(i / 5) * 24 + 8} r="2.5" fill="#2DD4BF"/>
                    ))}
                  </svg>
                </div>

                {/* Card 1: Announcement */}
                <div className="notif fa" style={{ position: 'absolute', top: 60, right: 24, width: 260 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📢</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New Notice</span>
                        <span style={{ fontSize: 10, color: '#A8A29E' }}>just now</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', marginBottom: 2 }}>Parent-Teacher Meetings</p>
                      <p style={{ fontSize: 12, color: '#78716C' }}>Tomorrow, 3:00 PM · All classrooms</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <div style={{ display: 'flex' }}>
                          {['#14B8A6','#F59E0B','#8B5CF6'].map((c,i) => (
                            <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -6 : 0 }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: '#A8A29E' }}>Sample parent confirmations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Form responses */}
                <div className="notif fb" style={{ position: 'absolute', top: 210, right: 0, width: 248 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📋</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Sample Form Responses</div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', marginBottom: 8 }}>Permission Slip 2026</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: '#78716C' }}>Sample progress: 47 of 52 submitted</span>
                        <span style={{ fontWeight: 700, color: '#14B8A6' }}>90%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Event */}
                <div className="notif fc" style={{ position: 'absolute', bottom: 80, right: 28, width: 252 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📅</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sample Event</span>
                        <span style={{ fontSize: 10, color: '#A8A29E' }}>3 days</span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1917', marginBottom: 2 }}>Annual Sports Day</p>
                      <p style={{ fontSize: 12, color: '#78716C', marginBottom: 6 }}>March 15 · School Grounds</p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F0FDF4', color: '#166534', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 100 }}>
                        ✓ Sample RSVP snapshot
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Emergency (accent) */}
                <div className="notif fd" style={{ position: 'absolute', top: 390, left: 20, width: 210, background: '#FFF1F2', borderColor: '#FECDD3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>🚨</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#BE123C' }}>Sample Emergency Broadcast</p>
                      <p style={{ fontSize: 11, color: '#E11D48', marginTop: 1 }}>Sample delivery summary</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero-scroll" style={{ position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.45 }}>
              <span style={{ color: '#fff', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
              <div className="scroll-bob" style={{ width: 22, height: 34, border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 11, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 5 }}>
                <div style={{ width: 4, height: 7, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────── STATS BAR ──────────────────────── */}
        <section id="stats" data-animate className={`s-hide ${vis('stats') ? 's-show' : ''}`}
          style={{ background: '#fff', borderTop: '1px solid #E8E8E0', borderBottom: '1px solid #E8E8E0', padding: '52px 24px' }}>
          <div className="stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
            {[
              { num: '☁️', label: 'Built on Google Cloud infrastructure', color: '#14B8A6' },
              { num: '🔒', label: 'Encrypted in transit and at rest', color: '#8B5CF6' },
              { num: '📱', label: 'Now on Google Play', color: '#14B8A6' },
              { num: '✓', label: 'Free Pilot Program', color: '#F59E0B' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2.8rem', lineHeight: 1, letterSpacing: '-0.04em', color: s.color, marginBottom: 6 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: '#78716C', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ────────────────────── FEATURES ───────────────────────── */}
        <section id="features" data-animate className={`s-hide ${vis('features') ? 's-show' : ''}`}
          style={{ padding: '96px 24px', background: '#FAFAF8' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: '#F0FDFA', border: '1px solid #CCFBF1', color: '#0F766E', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Everything You Need
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.18, letterSpacing: '-0.025em', color: '#1C1917', marginBottom: 16 }}>
                Built for modern schools
              </h2>
              <p style={{ color: '#78716C', fontSize: 17, lineHeight: 1.6, maxWidth: 580, margin: '0 auto' }}>
                Twelve core capabilities — including two-way messaging and AI-powered document processing — that replace fragmented tools, WhatsApp groups, and paper forms.
              </p>
            </div>

            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {features.map((f) => (
                <div key={f.title} className={`feat-card${f.large ? ' feat-large' : ''}`}>
                  {f.tag && (
                    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, color: '#0F766E', background: '#F0FDFA', padding: '3px 10px', borderRadius: 100, marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {f.tag}
                    </span>
                  )}
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, color: '#1C1917', marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.65 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────── PERSONAS ───────────────────────── */}
        <section id="for-schools" data-animate className={`s-hide ${vis('for-schools') ? 's-show' : ''}`}
          style={{ padding: '96px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: '#FFFBEB', border: '1px solid #FEF3C7', color: '#B45309', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                For Schools
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.18, letterSpacing: '-0.025em', color: '#1C1917', marginBottom: 16 }}>
                Different roles. One <em style={{ fontStyle: 'italic' }}>accountable</em> communication system.
              </h2>
              <p style={{ color: '#78716C', fontSize: 17, lineHeight: 1.6, maxWidth: 560, margin: '0 auto' }}>
                SkoConnect gives school leaders control, teachers speed, and families clarity — without the chaos of WhatsApp groups, paper forms, and scattered follow-up.
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
              {personas.map((p, i) => (
                <button key={p.role} className={`p-tab ${activePersona === i ? 'p-tab-on' : 'p-tab-off'}`}
                  onClick={() => setActivePersona(i)}>
                  {p.emoji} {p.role}
                </button>
              ))}
            </div>

            {/* Active card */}
            <div className="persona-shell" style={{ maxWidth: 860, margin: '0 auto', borderRadius: 24, overflow: 'hidden', border: `1.5px solid ${personas[activePersona].accent}35`, boxShadow: `0 8px 48px ${personas[activePersona].accent}20` }}>
              <div className="persona-card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ padding: '44px 40px', background: '#fff' }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>{personas[activePersona].emoji}</div>
                  <h3 className="serif" style={{ fontSize: 26, color: '#1C1917', marginBottom: 8 }}>{personas[activePersona].role}</h3>
                  <p style={{ fontSize: 15, color: '#78716C', marginBottom: 32 }}>{personas[activePersona].tagline}</p>
                  {activePersona === 0 ? (
                    <button onClick={() => setShowModal('pilot')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', background: personas[activePersona].accent, border: 'none', cursor: 'pointer' }}>
                      Start Your Free Pilot →
                    </button>
                  ) : (
                    <a href="https://admin.skoconnect.com/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: personas[activePersona].accent }}>
                      Sign In →
                    </a>
                  )}
                </div>
                <div style={{ padding: '44px 40px', background: `${personas[activePersona].bg}` }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Key Benefits</h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {personas[activePersona].benefits.map((b, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: personas[activePersona].accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span style={{ fontSize: 14, color: '#57534E', lineHeight: 1.55 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────────── HOW IT WORKS ───────────────────── */}
        <section id="how-it-works" data-animate className={`s-hide ${vis('how-it-works') ? 's-show' : ''}`}
          style={{ padding: '96px 24px', background: '#FAFAF8' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: '#F0FDFA', border: '1px solid #CCFBF1', color: '#0F766E', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Simple Setup
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.18, letterSpacing: '-0.025em', color: '#1C1917', marginBottom: 16 }}>
                Up and running in 3 steps
              </h2>
              <p style={{ color: '#78716C', fontSize: 17, lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
                No IT department required. Designed for same-day setup.
              </p>
            </div>

            <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, position: 'relative' }}>

              {/* Connecting line */}
              <div style={{ position: 'absolute', top: 52, left: '16.66%', right: '16.66%', height: 1, background: 'linear-gradient(90deg,#CCFBF1,#99F6E4,#CCFBF1)', zIndex: 0 }} className="hidden md:block" />

              {steps.map((step, i) => (
                <div key={step.num} style={{ position: 'relative', zIndex: 1 }}>
                  <div className="step-wm">{step.num}</div>
                  <div style={{ position: 'relative', paddingTop: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: i === 0 ? '#042F2E' : i === 1 ? '#0F766E' : '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 24, boxShadow: '0 4px 16px rgba(20,184,166,0.25)' }}>
                      {step.icon}
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: 20, color: '#1C1917', marginBottom: 12 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.65 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <button onClick={() => setShowModal('pilot')} className="btn-teal" style={{ display: 'inline-block', padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: '#0D9488', border: 'none', cursor: 'pointer' }}>
                <span>Start Your Free Pilot →</span>
              </button>
            </div>
          </div>
        </section>

        {/* ────────────────────── FROM THE FOUNDER ───────────────────── */}
        <section id="founder-vision" data-animate className={`s-hide ${vis('founder-vision') ? 's-show' : ''}`}
          style={{ padding: '96px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: '#F0FDFA', border: '1px solid #CCFBF1', color: '#0F766E', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Founder's Vision
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', lineHeight: 1.18, letterSpacing: '-0.025em', color: '#1C1917' }}>
                Why I built SkoConnect
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 720, margin: '0 auto' }}>
              {testimonials.map(t => (
                <div key={t.author} className="t-card">
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                    {[0,1,2,3,4].map(n => (
                      <svg key={n} width="16" height="16" viewBox="0 0 16 16" fill="#F59E0B">
                        <path d="M8 1.5l1.545 3.13 3.455.5-2.5 2.437.59 3.44L8 9.373l-3.09 1.634.59-3.44L3 4.13l3.455-.5L8 1.5z"/>
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: 14, color: '#57534E', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 24 }}>"{t.quote}"</p>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${t.color}88,${t.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{t.initials}</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#1C1917' }}>{t.author}</p>
                      <p style={{ fontSize: 12, color: '#A8A29E' }}>{t.role} · {t.school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────── TRUST SIGNALS ──────────────────── */}
        <section id="trust" data-animate className={`s-hide ${vis('trust') ? 's-show' : ''}`}
          style={{ padding: '64px 24px', background: '#FAFAF8', borderTop: '1px solid #E8E8E0', borderBottom: '1px solid #E8E8E0' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#D6D3D1', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 40 }}>
              Platform foundations
            </p>
            <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {[
                { icon: '☁️', title: 'Google Cloud infrastructure', sub: 'Built on Google Cloud services' },
                { icon: '🔒', title: 'Secure by design on Google Cloud',   sub: 'Encrypted in transit and at rest' },
                { icon: '📱', title: 'Android App',   sub: 'Now on Google Play' },
                { icon: '✓', title: 'Free Pilot Program',    sub: 'Live in production — free for schools during the pilot program' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: '1px solid #E8E8E0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, boxShadow: '0 1px 4px rgba(28,25,23,0.04)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: '#44403C' }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: '#A8A29E' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────────── FINAL CTA ──────────────────────── */}
        <section className="hero-bg" style={{ padding: '112px 24px', position: 'relative', overflow: 'hidden' }}>
          <div className="orb" style={{ position: 'absolute', top: '-20%', left: '20%', width: 480, height: 480, background: 'rgba(20,184,166,0.12)' }} />
          <div className="orb" style={{ position: 'absolute', bottom: '-10%', right: '15%', width: 400, height: 400, background: 'rgba(245,158,11,0.08)' }} />

          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 className="serif" style={{ fontSize: 'clamp(2.2rem,4vw,3.6rem)', lineHeight: 1.12, letterSpacing: '-0.025em', color: '#fff', marginBottom: 20 }}>
              Ready to transform your school?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, lineHeight: 1.6, marginBottom: 44, maxWidth: 480, margin: '0 auto 44px' }}>
              SkoConnect is live in production and on Google Play. The Free Pilot Program is available at no cost to participating schools during the pilot period. Pricing for full rollout will be shared before the pilot ends. No credit card required, and no school will be charged automatically. The mobile app is free to download, but access is activated through a school's subscription or pilot enrollment — families do not pay separately for the app.
            </p>
            <div className="final-cta-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 20 }}>
              <button onClick={() => setShowModal('pilot')} className="btn-teal" style={{ display: 'inline-block', padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: '#0D9488', border: 'none', cursor: 'pointer', boxShadow: '0 4px 32px rgba(20,184,166,0.4)' }}>
                <span>Start Your Free Pilot →</span>
              </button>
              <button onClick={() => setShowModal('demo')} className="btn-ghost-white" style={{ display: 'inline-block', padding: '15px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                Talk to the Founder — 15 min
              </button>
            </div>
            <div style={{ marginBottom: 28 }}>
              <a href="https://play.google.com/store/apps/details?id=com.skoconnect.skoconnect"
                 target="_blank" rel="noopener noreferrer"
                 style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#000', borderRadius: 12, padding: '8px 16px 8px 12px', textDecoration: 'none', transition: 'transform 0.15s ease', border: '1px solid rgba(255,255,255,0.15)' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <svg width="20" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M0.73 1.45C0.5 1.7 0.4 2.05 0.4 2.5V19.5C0.4 19.95 0.5 20.3 0.73 20.55L0.8 20.62L10.2 11.22V11.1V10.98L0.8 1.38L0.73 1.45Z" fill="#2196F3"/>
                  <path d="M13.3 14.3L10.2 11.22V11.1V10.98L13.3 7.9L13.37 7.97L17.05 10.06C18.1 10.65 18.1 11.55 17.05 12.14L13.37 14.23L13.3 14.3Z" fill="#FFC107"/>
                  <path d="M13.37 14.23L10.2 11.1L0.73 20.55C1.13 21 1.85 21.05 2.6 20.65L13.37 14.23Z" fill="#F44336"/>
                  <path d="M13.37 7.97L2.6 1.55C1.85 1.1 1.13 1.2 0.73 1.65L10.2 11.1L13.37 7.97Z" fill="#4CAF50"/>
                </svg>
                <span style={{ color: '#fff', lineHeight: 1.2 }}>
                  <span style={{ display: 'block', fontSize: 9, fontWeight: 400, opacity: 0.75, letterSpacing: '0.02em' }}>GET IT ON</span>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>Google Play</span>
                </span>
              </a>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              Questions?{' '}
              <a href="mailto:support@skoconnect.com" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'underline' }}>
                support@skoconnect.com
              </a>
            </p>
          </div>
        </section>

        </main>

        {/* ────────────────────── FOOTER ─────────────────────────── */}
        <footer style={{ background: '#0C0A09', padding: '56px 24px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <picture>
                    <source srcSet="/logo.webp" type="image/webp" />
                    <img src="/logo.png" alt="SkoConnect" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                  </picture>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>SkoConnect</span>
                </div>
                <p style={{ color: '#A8A29E', fontSize: 14, lineHeight: 1.65, maxWidth: 300 }}>
                  Transforming school communication with real-time announcements, digital forms, and smart notifications for the modern school community.
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 18 }}>Product</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Features', href: '#features' },
                    { label: 'For Schools', href: '#for-schools' },
                    { label: 'Download App', href: 'https://play.google.com/store/apps/details?id=com.skoconnect.skoconnect' },
                    { label: 'Security', href: 'https://admin.skoconnect.com/security' },
                    { label: 'Pricing & pilot details', href: 'mailto:info@skoconnect.com?subject=Pricing%20Inquiry', note: 'Pilot participation is free for participating schools. We’ll share full-rollout pricing before the pilot ends; no school is charged automatically.' },
                  ].map(l => (
                    <li key={l.label}><a href={l.href} style={{ color: '#A8A29E', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}
                    >{l.label}</a>
                    {l.note && <p style={{ color: '#78716C', fontSize: 12, lineHeight: 1.5, margin: '2px 0 0', maxWidth: 260 }}>{l.note}</p>}</li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 18 }}>Company</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'About', href: 'https://admin.skoconnect.com/about' },
                    { label: 'Blog', href: 'mailto:info@skoconnect.com?subject=Blog%20Inquiry' },
                    { label: 'Contact', href: 'mailto:support@skoconnect.com' },
                    { label: 'Privacy Policy', href: 'https://admin.skoconnect.com/privacy' },
                    { label: 'Terms', href: 'https://admin.skoconnect.com/terms' },
                  ].map(l => (
                    <li key={l.label}><a href={l.href} style={{ color: '#A8A29E', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#A8A29E')}
                    >{l.label}</a></li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #1C1917', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ color: '#A8A29E', fontSize: 13 }}>© 2026 SkoConnect. All rights reserved.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#A8A29E', fontSize: 12 }}>Hosted on Google Cloud Firebase infrastructure</span>
                <span style={{ color: '#A8A29E' }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#14B8A6' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14B8A6', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </footer>

      </div>

    </>
  );
}
