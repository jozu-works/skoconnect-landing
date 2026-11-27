'use client';

import { useEffect, useState } from 'react';
import EnrollFallback from '@/components/EnrollFallback';
import EnrollMarketing from '@/components/EnrollMarketing';

/**
 * /enroll serves two duties:
 *  1. Default: the SkoEnroll marketing page (SEO, OG, schema — replaces the
 *     old noindex handoff-only page).
 *  2. App handoff: a URL with ?school=CODE (QR codes / enrolment codes) keeps
 *     the existing Android App Links deep-link behaviour via EnrollFallback.
 *     This preserves the QR handoff flow that shipped earlier on main.
 */
export default function EnrollPageClient() {
  const [isAppHandoff, setIsAppHandoff] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // QR / enrolment-code handoff: ?school=CODE (also honour explicit ?app=1)
    if (params.has('school') || params.has('app')) setIsAppHandoff(true);
  }, []);

  return isAppHandoff ? <EnrollFallback /> : <EnrollMarketing />;
}
