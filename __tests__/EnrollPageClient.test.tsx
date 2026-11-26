import { render, screen } from '@testing-library/react';
import EnrollPageClient from '@/components/EnrollPageClient';

jest.mock('@/components/EnrollFallback', () => ({
  __esModule: true,
  default: () => <div data-testid="enroll-fallback">fallback</div>,
}));

jest.mock('@/components/EnrollMarketing', () => ({
  __esModule: true,
  default: () => <div data-testid="enroll-marketing">marketing</div>,
}));

function setUrl(search: string) {
  window.history.pushState({}, '', `/enroll${search}`);
}

describe('EnrollPageClient — dual mode', () => {
  beforeEach(() => {
    setUrl('');
  });

  it('renders the marketing page by default (no handoff params)', () => {
    render(<EnrollPageClient />);
    expect(screen.getByTestId('enroll-marketing')).toBeInTheDocument();
    expect(screen.queryByTestId('enroll-fallback')).not.toBeInTheDocument();
  });

  it('renders the app-handoff fallback for ?school=CODE (QR / enrolment codes)', () => {
    setUrl('?school=ABC123');
    render(<EnrollPageClient />);
    expect(screen.getByTestId('enroll-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('enroll-marketing')).not.toBeInTheDocument();
  });

  it('renders the app-handoff fallback for explicit ?app=1', () => {
    setUrl('?app=1');
    render(<EnrollPageClient />);
    expect(screen.getByTestId('enroll-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('enroll-marketing')).not.toBeInTheDocument();
  });

  it('stays on marketing for unrelated query params', () => {
    setUrl('?utm_source=facebook');
    render(<EnrollPageClient />);
    expect(screen.getByTestId('enroll-marketing')).toBeInTheDocument();
  });
});
