import { render } from '@testing-library/react';
import StructuredData from '@/components/StructuredData';

function parseScripts(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]'),
  ).map((el) => JSON.parse(el.textContent || '{}'));
}

describe('StructuredData', () => {
  it('renders three JSON-LD script blocks', () => {
    const { container } = render(<StructuredData />);
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts).toHaveLength(3);
    expect(() => parseScripts(container)).not.toThrow();
  });

  it('emits valid SoftwareApplication, EducationalOrganization and Organization schemas', () => {
    const { container } = render(<StructuredData />);
    const [softwareApp, eduOrg, org] = parseScripts(container);

    expect(softwareApp['@type']).toBe('SoftwareApplication');
    expect(softwareApp.name).toBe('SkoConnect');
    expect(softwareApp.offers.priceCurrency).toBe('JMD');

    expect(eduOrg['@type']).toBe('EducationalOrganization');
    expect(eduOrg.url).toBe('https://skoconnect.com');

    expect(org['@type']).toBe('Organization');
    expect(org.foundingDate).toBe('2025');
    expect(org.sameAs).toContain('https://twitter.com/skoconnect');
  });
});
