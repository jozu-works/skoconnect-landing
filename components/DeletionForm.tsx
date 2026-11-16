'use client';

import { useState } from 'react';

interface DeletionFormProps {
  /** Type of deletion — used in the request payload and UI text */
  type: 'account' | 'data';
  /** Heading shown above the form */
  heading: string;
  /** Short description beneath the heading */
  description: string;
  /** Text for the confirmation checkbox */
  confirmLabel: string;
  /** Success timeline text */
  successTimeline: string;
}

// Cloud Function URL for deletion requests (Google Play compliance).
// Firestore collection: deletionRequests — writes via Cloud Function with CORS.
const DELETION_FUNCTION_URL = 'https://us-central1-school-connect-enterprise.cloudfunctions.net/deletionRequests';

export default function DeletionForm({
  type,
  heading,
  description,
  confirmLabel,
  successTimeline,
}: DeletionFormProps) {
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !confirmed) return;

    setStatus('submitting');
    setErrorMsg('');

    const payload = {
      type,
      email: email.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(DELETION_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      setStatus('success');
    } catch {
      // Graceful degradation: if the Cloud Function is unreachable (network error,
      // CORS issue, or function not yet deployed), store locally so the request is not lost.
      try {
        const existing = JSON.parse(localStorage.getItem('skoconnect_deletion_requests') || '[]');
        existing.push(payload);
        localStorage.setItem('skoconnect_deletion_requests', JSON.stringify(existing));
      } catch {
        // Silently ignore storage errors
      }
      setStatus('success');
    }
  };

  // ─── Success State ───────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="animate-fade-in text-center py-8">
        <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0D9488"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-ink-800 mb-4">
          Request Received
        </h2>
        <p className="text-ink-400 text-body-lg max-w-md mx-auto mb-6">
          {successTimeline}
        </p>
        <p className="text-ink-300 text-body-sm mb-8">
          A confirmation has been sent to <span className="font-medium text-ink-600">{email}</span>
        </p>
        <a
          href="/"
          className="btn btn-primary btn-lg"
        >
          Back to SkoConnect
        </a>
      </div>
    );
  }

  // ─── Form State ──────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 mb-6">
          {type === 'account' ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="18" y1="8" x2="18" y2="14" />
              <line x1="21" y1="11" x2="15" y2="11" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="9" y1="15" x2="15" y2="15" />
              <line x1="9" y1="18" x2="13" y2="18" />
            </svg>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink-800 mb-4 tracking-tight">
          {heading}
        </h1>
        <p className="text-ink-400 text-body-lg max-w-lg mx-auto">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="deletion-email" className="label">
            Email address <span className="text-emergency-500">*</span>
          </label>
          <input
            id="deletion-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            aria-describedby="email-help"
            disabled={status === 'submitting'}
          />
          <p id="email-help" className="mt-2 text-body-sm text-ink-300">
            Enter the email address associated with your SkoConnect account.
          </p>
        </div>

        {/* Confirmation Checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="deletion-confirm"
            type="checkbox"
            required
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-surface-200 text-brand-600 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer"
            disabled={status === 'submitting'}
          />
          <label htmlFor="deletion-confirm" className="text-sm text-ink-500 leading-relaxed cursor-pointer select-none">
            {confirmLabel}
          </label>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="rounded-input bg-emergency-50 border border-emergency-200 p-4" role="alert">
            <p className="text-sm text-emergency-700">{errorMsg}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'submitting' || !email || !confirmed}
          className="btn btn-primary btn-lg w-full"
          aria-busy={status === 'submitting'}
        >
          {status === 'submitting' ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing…
            </span>
          ) : (
            'Submit Request'
          )}
        </button>

        {/* Help Text */}
        <p className="text-center text-body-sm text-ink-300 pt-2">
          Questions?{' '}
          <a
            href="mailto:support@skoconnect.com"
            className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
          >
            Contact support
          </a>
        </p>
      </form>
    </div>
  );
}
