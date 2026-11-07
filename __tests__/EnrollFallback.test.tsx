import { render, screen, waitFor } from '@testing-library/react';
import EnrollFallback, { buildAndroidIntentUrl } from '@/components/EnrollFallback';
import { redirect } from '@/lib/redirect';

jest.mock('@/lib/redirect');
const mockRedirect = redirect as jest.Mock;

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.skoconnect.skoconnect';

function setLocation(search: string, userAgent: string) {
  window.history.pushState({}, '', `/enroll${search}`);
  jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(userAgent);
}

const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';
const IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

describe('buildAndroidIntentUrl', () => {
  it('preserves the ?school= query in the intent target', () => {
    const url = buildAndroidIntentUrl('?school=ABC123');
    expect(url).toContain('intent://skoconnect.com/enroll?school=ABC123#Intent;');
    expect(url).toContain('scheme=https');
    expect(url).toContain('package=com.skoconnect.skoconnect');
    expect(url).toContain(`S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)}`);
  });

  it('builds a clean intent when there is no query', () => {
    expect(buildAndroidIntentUrl('')).toBe(
      'intent://skoconnect.com/enroll#Intent;scheme=https;package=com.skoconnect.skoconnect;' +
        `S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`,
    );
  });
});

describe('EnrollFallback — desktop', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders school-code guidance and Play Store link', async () => {
    setLocation('', DESKTOP_UA);
    render(<EnrollFallback />);

    expect(
      await screen.findByText(/enrollment happens in the skoconnect app/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /get the app on google play/i }),
    ).toHaveAttribute('href', PLAY_STORE_URL);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('surfaces the school code from the legacy ?school= query', async () => {
    setLocation('?school=XYZ789', DESKTOP_UA);
    render(<EnrollFallback />);

    expect(await screen.findByText('XYZ789')).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

describe('EnrollFallback — mobile', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows the opening state and attempts the Android app link with the query preserved', async () => {
    setLocation('?school=ABC123', ANDROID_UA);
    render(<EnrollFallback />);

    expect(
      await screen.findByText(/opening the skoconnect app/i),
    ).toBeInTheDocument();
    await waitFor(() => expect(mockRedirect).toHaveBeenCalledTimes(1));
    expect(mockRedirect).toHaveBeenCalledWith(buildAndroidIntentUrl('?school=ABC123'));
  });

  it('shows the Android-only guidance with the school code on non-Android mobile (iOS)', async () => {
    setLocation('?school=ABC123', IOS_UA);
    render(<EnrollFallback />);

    expect(
      await screen.findByText(/skoconnect is currently available on android/i),
    ).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /skoconnect on google play/i }),
    ).toHaveAttribute('href', PLAY_STORE_URL);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
