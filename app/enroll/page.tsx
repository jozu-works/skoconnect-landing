import type { Metadata } from 'next';
import EnrollFallback from '@/components/EnrollFallback';

export const metadata: Metadata = {
  title: 'Open SkoConnect | SkoConnect',
  description:
    'Open the SkoConnect app to complete enrollment. On a computer? Get the app and use your school code.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function EnrollPage() {
  return <EnrollFallback />;
}
