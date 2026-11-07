'use client';

import { useEffect, useState } from 'react';
import { redirect } from '@/lib/redirect';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.skoconnect.skoconnect';
const ANDROID_PACKAGE = 'com.skoconnect.skoconnect';

/**
 * Build an Android App Links intent URL for /enroll, preserving any query
 * string (e.g. ?school=CODE) so the app receives the same context the QR
 * handoff encoded. If the intent fails, Chrome falls back to the Play Store.
 */
export function buildAndroidIntentUrl(query: string): string {
  const qs = query && !query.startsWith('?') ? `?${query}` : query;
  const target = `https://skoconnect.com/enroll${qs}`;
  const fallback = encodeURIComponent(PLAY_STORE_URL);
  return `intent://skoconnect.com/enroll${qs}#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

type Device = 'android' | 'ios' | 'desktop';

function isAndroid(ua: string): boolean {
  return /android/i.test(ua);
}

function isAppleMobile(ua: string): boolean {
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && 'ontouchend' in document);
}

function detectDevice(ua: string): Device {
  if (isAndroid(ua)) return 'android';
  if (isAppleMobile(ua)) return 'ios';
  if (/mobile/i.test(ua)) return 'ios'; // other mobile — no app exists; same honest state
  return 'desktop';
}

export default function EnrollFallback() {
  const [device, setDevice] = useState<Device>('desktop');
  const [query, setQuery] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const qs = window.location.search;
    setQuery(qs);
    const code = new URLSearchParams(qs).get('school');
    if (code) setSchoolCode(code);

    const ua = window.navigator.userAgent;
    const detected = detectDevice(ua);
    setDevice(detected);

    if (detected === 'android') {
      // Attempt the verified App Links intent; Play Store is Chrome's
      // browser_fallback_url if the app is not installed.
      redirect(buildAndroidIntentUrl(qs));
      const t = setTimeout(() => setShowFallback(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <main className="min-h-screen bg-surface-50 flex flex-col">
      {/* ── Top bar ── */}
      <nav className="w-full border-b border-surface-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 text-ink-800 hover:text-brand-600 transition-colors"
            aria-label="Back to SkoConnect"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="7" fill="#0F766E" />
              <path d="M7 9h14M7 14h10M7 19h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-semibold text-sm tracking-tight">SkoConnect</span>
          </a>
          <a
            href="/"
            className="text-sm text-ink-400 hover:text-brand-600 transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </nav>

      {/* ── Card ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg bg-white border border-surface-200 rounded-card shadow-card p-8 md:p-10 text-center">
          {device === 'android' ? (
            <>
              <div
                className="mx-auto mb-6 h-12 w-12 rounded-full border-[3px] border-brand-100 border-t-brand-600 animate-spin"
                role="status"
                aria-label="Opening the SkoConnect app"
              />
              <h1 className="font-display text-display-sm text-ink-800 mb-3">
                Opening the SkoConnect app…
              </h1>
              {schoolCode && (
                <p className="text-body-md text-ink-600">
                  Your school code:{' '}
                  <span className="font-mono font-semibold text-brand-700 tracking-wider">
                    {schoolCode}
                  </span>
                </p>
              )}
              <p className="text-body-md text-ink-500 mt-3">
                If nothing happens, tap below — some browsers require a tap to
                open an app.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* User-activated launch: browsers can block app opens that
                    happen without a gesture, so always offer the tap path. */}
                <a
                  href={buildAndroidIntentUrl(query)}
                  className="inline-flex items-center justify-center rounded-button bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
                >
                  Open the app
                </a>
                {showFallback && (
                  <a
                    href={PLAY_STORE_URL}
                    className="inline-flex items-center justify-center rounded-button border border-surface-300 hover:border-brand-300 text-ink-600 hover:text-brand-700 text-sm font-semibold px-6 py-3 transition-colors"
                  >
                    Get SkoConnect on Google Play
                  </a>
                )}
              </div>
              {showFallback && schoolCode && (
                <p className="text-body-sm text-ink-400 mt-4">
                  After installing, open the app and enter your school code
                  above to continue enrollment.
                </p>
              )}
            </>
          ) : device === 'ios' ? (
            <>
              <h1 className="font-display text-display-sm text-ink-800 mb-3">
                SkoConnect is currently available on Android
              </h1>
              <p className="text-body-md text-ink-500">
                Enrollment is done in the SkoConnect mobile app using the school
                code your school gave you (or the QR code on your enrollment
                letter). Please use a school-provided enrollment channel or
                continue on an Android device.
              </p>
              {schoolCode && (
                <p className="mt-6 text-body-md text-ink-600">
                  Your school code:{' '}
                  <span className="font-mono font-semibold text-brand-700 tracking-wider">
                    {schoolCode}
                  </span>
                </p>
              )}
              <div className="mt-8">
                <a
                  href={PLAY_STORE_URL}
                  className="inline-flex items-center justify-center rounded-button bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
                >
                  SkoConnect on Google Play
                </a>
              </div>
            </>
          ) : (
            <>
              <svg
                className="mx-auto mb-6"
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                aria-hidden="true"
              >
                <rect width="56" height="56" rx="14" fill="#F0FDFA" />
                <rect x="14" y="18" width="28" height="20" rx="3" stroke="#0F766E" strokeWidth="2" />
                <path d="M20 25h16M20 30h10" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h1 className="font-display text-display-sm text-ink-800 mb-3">
                Enrollment happens in the SkoConnect app
              </h1>
              <p className="text-body-md text-ink-500">
                You opened this page on a computer. SkoConnect enrollment is done
                on a phone using the school code your school gave you (or the QR
                code on your enrollment letter).
              </p>
              {schoolCode && (
                <p className="mt-6 text-body-md text-ink-600">
                  Your school code:{' '}
                  <span className="font-mono font-semibold text-brand-700 tracking-wider">
                    {schoolCode}
                  </span>
                </p>
              )}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={PLAY_STORE_URL}
                  className="inline-flex items-center justify-center rounded-button bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
                >
                  Get the app on Google Play
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-button border border-surface-300 hover:border-brand-300 text-ink-600 hover:text-brand-700 text-sm font-semibold px-6 py-3 transition-colors"
                >
                  Learn about SkoConnect
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-body-sm text-ink-300">
            SkoConnect ·{' '}
            <a
              href="https://admin.skoconnect.com/privacy"
              className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            {' · '}
            <a
              href="https://admin.skoconnect.com/terms"
              className="text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
