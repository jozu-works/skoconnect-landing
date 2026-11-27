import React from 'react';
import RootLayout, { metadata } from '@/app/layout';

jest.mock('@/components/StructuredData', () => function StructuredData() { return <div data-testid="structured-data" />; });
jest.mock('@/components/GoogleAnalytics', () => function GoogleAnalytics() { return <div data-testid="google-analytics" />; });

describe('RootLayout', () => {
  it('exports site metadata', () => {
    expect(metadata.title).toContain('SkoConnect');
    expect(metadata.description).toContain('Jamaican schools');
    expect(metadata.metadataBase?.toString()).toBe('https://skoconnect.com/');
    expect(metadata.openGraph?.url).toBe('https://skoconnect.com');
  });

  it('renders children with layout shell components', () => {
    const el = RootLayout({ children: <div>Child content</div> }) as React.ReactElement;
    expect(el.type).toBe('html');
    expect(el.props.lang).toBe('en');

    const body = React.Children.toArray(el.props.children).find(
      (c: any) => c?.type === 'body',
    ) as React.ReactElement;
    expect(body.props.className).toContain('font-body');

    const bodyChildren = React.Children.toArray(body.props.children);
    const child = bodyChildren.find((c: any) => c?.props?.children === 'Child content');
    expect(child).toBeTruthy();
  });
});
