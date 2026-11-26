import { render } from '@testing-library/react';
import EnrollPage, { metadata } from '@/app/enroll/page';

const md = metadata as import('next').Metadata & {
  robots: { index: boolean; follow: boolean; googleBot: { index: boolean; follow: boolean } };
  openGraph: { images: { url: string }[] };
  twitter: { card: string };
};

describe('/enroll page metadata', () => {
  it('is indexable: robots index,follow on the /enroll build (noindex→indexable behavioral flip)', () => {
    expect(md.robots).toMatchObject({ index: true, follow: true });
    expect(md.robots.googleBot).toMatchObject({ index: true, follow: true });
  });

  it('keeps the canonical URL and OG/Twitter metadata', () => {
    expect(metadata.alternates?.canonical).toBe('/enroll');
    expect(metadata.title).toMatch(/SkoEnroll/i);
    expect(md.openGraph.images[0].url).toBe('/og-enroll.png');
    expect(md.twitter.card).toBe('summary_large_image');
  });

  it('does not overclaim production status in public metadata copy', () => {
    const description = metadata.description ?? '';
    expect(description).not.toMatch(/live in (production|jamaica)/i);
    expect(description).toMatch(/first pilot school confirmed/i);
  });
});

describe('/enroll page render', () => {
  it('renders the structured-data scripts (SoftwareApplication + FAQPage)', () => {
    const { container } = render(<EnrollPage />);
    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    );
    expect(scripts).toHaveLength(2);
    const types = scripts.map(s => JSON.parse(s.textContent ?? '')['@type']);
    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('FAQPage');

    const app = scripts.map(s => JSON.parse(s.textContent ?? '')).find(
      s => s['@type'] === 'SoftwareApplication',
    );
    expect(app.name).toBe('SkoEnroll');
    expect(app.offers.price).toBe('0');
  });

  it('scopes the Inter font stylesheet to the enroll route (not global)', () => {
    const { container } = render(<EnrollPage />);
    const fontLink = Array.from(container.querySelectorAll('link[rel="stylesheet"]')).find(
      l => (l as HTMLLinkElement).href.includes('fonts.googleapis.com'),
    );
    expect(fontLink).toBeTruthy();
    expect((fontLink as HTMLLinkElement).href).toContain('family=Inter');
  });
});
