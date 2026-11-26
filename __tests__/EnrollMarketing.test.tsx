import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnrollMarketing from '@/components/EnrollMarketing';

describe('EnrollMarketing — CTA / walkthrough modal', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('renders the page with the confirmed-state copy (no overclaim, no placeholders)', () => {
    render(<EnrollMarketing />);
    expect(screen.getByText(/stop printing enrolment forms/i)).toBeInTheDocument();
    // Copy consistency: social proof locked at "First pilot school confirmed"
    expect(screen.getAllByText(/first pilot school confirmed/i).length).toBeGreaterThan(0);
    // Never overclaim: no "live in production" anywhere
    expect(screen.queryByText(/live in production/i)).not.toBeInTheDocument();
    // No internal placeholder scaffolding leaks to the public page
    expect(screen.queryByText(/placeholder stats/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/screenshot slot/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/filled after the first term/i)).not.toBeInTheDocument();
  });

  it('opens the walkthrough modal from the hero CTA and closes on Escape', async () => {
    render(<EnrollMarketing />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /book a walkthrough/i })[0]);
    expect(screen.getByRole('dialog', { name: /book a walkthrough/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('opens the walkthrough modal from the nav CTA and closes via the close button', async () => {
    render(<EnrollMarketing />);
    const navCta = screen.getAllByRole('button', { name: /book a walkthrough/i })[1];
    fireEvent.click(navCta);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('links the pilot CTA to /?pilot=1', () => {
    render(<EnrollMarketing />);
    const pilotLinks = screen.getAllByRole('link', { name: /start the free pilot/i });
    expect(pilotLinks.length).toBeGreaterThan(0);
    pilotLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/?pilot=1');
    });
  });
});
