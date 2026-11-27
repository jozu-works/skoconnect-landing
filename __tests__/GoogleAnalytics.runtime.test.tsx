describe('GoogleAnalytics runtime', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NEXT_PUBLIC_GA4_ID: 'G-TEST1234', NODE_ENV: 'production' };
    delete (window as any).dataLayer;
    delete (window as any).gtag;
    document.head.innerHTML = '';
  });

  afterEach(() => {
    process.env = originalEnv;
    delete (window as any).dataLayer;
    delete (window as any).gtag;
    document.head.innerHTML = '';
  });

  it('injects gtag script and initializes dataLayer in production when GA4 id is set', async () => {
    await new Promise<void>((resolve, reject) => {
      jest.isolateModules(() => {
        try {
          const React = require('react');
          const { createRoot } = require('react-dom/client');
          const GoogleAnalytics = require('@/components/GoogleAnalytics').default;
          const container = document.createElement('div');
          document.body.appendChild(container);
          const root = createRoot(container);
          root.render(React.createElement(GoogleAnalytics));
          setTimeout(() => {
            root.unmount();
            container.remove();
            resolve();
          }, 50);
        } catch (e) {
          reject(e);
        }
      });
    });

    const script = document.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-TEST1234"]') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script?.async).toBe(true);
    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(typeof window.gtag).toBe('function');
    window.gtag?.('event', 'test_event', { a: 1 });
    expect(window.dataLayer?.length).toBeGreaterThanOrEqual(3);
  });
});
