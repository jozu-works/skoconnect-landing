import type { Metadata } from 'next';
import EnrollPageClient from '@/components/EnrollPageClient';

/**
 * /enroll — SkoEnroll marketing page (real page; replaces the old noindex
 * handoff-only route). URLs with ?school=CODE keep the QR/app handoff via
 * EnrollPageClient -> EnrollFallback.
 *
 * SEO per LEXI proposal §3; copy per §2 with Dre's locked overrides.
 */

export const metadata: Metadata = {
  title: 'SkoEnroll — Digital Student Enrolment for Jamaican Schools | SkoConnect',
  description:
    'Replace paper enrolment with branded online forms, verified parent emails, seat approvals and real-time application tracking. Built for Jamaican schools — first pilot school confirmed, free pilot available.',
  keywords:
    'online student enrolment system Jamaica, school registration software Jamaica, digital enrolment forms school, SkoEnroll, SkoConnect',
  alternates: {
    canonical: '/enroll',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skoconnect.com/enroll',
    title: 'SkoEnroll — Digital Student Enrolment for Jamaican Schools | SkoConnect',
    description:
      'Replace paper enrolment with branded online forms, verified parent emails, seat approvals and real-time application tracking. Built for Jamaican schools — first pilot school confirmed, free pilot available.',
    siteName: 'SkoConnect',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SkoEnroll — digital student enrolment by SkoConnect' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkoEnroll — Digital Student Enrolment for Jamaican Schools | SkoConnect',
    description:
      'Replace paper enrolment with branded online forms, verified parent emails, seat approvals and real-time application tracking. Built for Jamaican schools — first pilot school confirmed, free pilot available.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

// FAQ copy — mirrored in components/EnrollMarketing.tsx. Static strings only;
// JSON.stringify of these literals is safe for ld+json (no user input).
const faqs = [
  {
    q: 'Does parents pay for SkoEnroll?',
    a: 'No. Access comes through the school\u2019s subscription or pilot enrolment. Families never pay separately.',
  },
  {
    q: 'What does the free pilot include?',
    a: 'Full enrolment functionality for one intake cycle at no cost. We share pricing before the pilot ends \u2014 no card required, no automatic charge.',
  },
  {
    q: 'How long does setup take?',
    a: 'Your forms and branding are configured with our team \u2014 most schools are ready within a day, same as SkoConnect.',
  },
  {
    q: 'Is parent data safe?',
    a: 'SkoEnroll runs on Google Cloud infrastructure, the same foundation as SkoConnect. Application data belongs to your school.',
  },
  {
    q: 'Do we need an IT department?',
    a: 'No. Setup and configuration are handled with our team directly.',
  },
];

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SkoEnroll',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  description:
    'Digital student enrolment for Jamaican schools — branded online application forms, verified parent emails, seat approvals and real-time application tracking.',
  url: 'https://skoconnect.com/enroll',
  image: 'https://skoconnect.com/og-image.png',
  publisher: {
    '@type': 'Organization',
    name: 'SkoConnect',
    url: 'https://skoconnect.com',
  },
  offers: {
    '@type': 'Offer',
    name: 'Free pilot — one full intake cycle',
    price: '0',
    priceCurrency: 'USD',
    description:
      'Free pilot for participating schools: full enrolment functionality for one intake cycle. Pricing shared before the pilot ends; no credit card required, no automatic charge.',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function EnrollPage() {
  return (
    <>
      {/* Inter — SkoEnroll page font, scoped here (was global in layout.tsx) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <EnrollPageClient />
    </>
  );
}
