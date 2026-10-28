import { render, screen } from '@testing-library/react';
import GoogleAnalytics, {
  trackEvent,
  trackFormSubmit,
  trackButtonClick,
  trackFeatureView,
  trackConversion,
  trackPageView,
} from '@/components/GoogleAnalytics';

describe('GoogleAnalytics', () => {
  it('renders null and injects no script when GA4 is not configured', () => {
    const { container } = render(<GoogleAnalytics />);
    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });
});

describe('gtag event helpers', () => {
  let gtag: jest.Mock;

  beforeEach(() => {
    gtag = jest.fn();
    (window as unknown as { gtag?: jest.Mock }).gtag = gtag;
  });

  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it('trackEvent forwards event name and parameters to gtag', () => {
    trackEvent('custom_event', { foo: 'bar' });
    expect(gtag).toHaveBeenCalledWith('event', 'custom_event', { foo: 'bar' });
  });

  it('trackEvent is a safe no-op when gtag is absent', () => {
    delete (window as unknown as { gtag?: unknown }).gtag;
    expect(() => trackEvent('custom_event')).not.toThrow();
  });

  it('trackFormSubmit emits a form_submit event with form metadata', () => {
    trackFormSubmit('request_access');
    expect(gtag).toHaveBeenCalledWith('event', 'form_submit', {
      event_category: 'form',
      form_type: 'request_access',
    });
  });

  it('trackButtonClick emits a button_click event with label and location', () => {
    trackButtonClick('Start Pilot', 'hero');
    expect(gtag).toHaveBeenCalledWith('event', 'button_click', {
      event_category: 'engagement',
      button_label: 'Start Pilot',
      button_location: 'hero',
    });
  });

  it('trackFeatureView emits a feature_view event', () => {
    trackFeatureView('two_way_messaging');
    expect(gtag).toHaveBeenCalledWith('event', 'feature_view', {
      event_category: 'engagement',
      feature_name: 'two_way_messaging',
    });
  });

  it('trackConversion emits a conversion event with value 1', () => {
    trackConversion('pilot_signup');
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      event_category: 'conversion',
      conversion_type: 'pilot_signup',
      value: 1,
    });
  });

  it('trackPageView emits a page_view event with default title fallback', () => {
    trackPageView('/pricing');
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/pricing',
      page_title: document.title,
    });
  });
});
