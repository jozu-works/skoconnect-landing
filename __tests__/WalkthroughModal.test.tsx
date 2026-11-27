import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import WalkthroughModal from '@/components/WalkthroughModal';

const REQUEST_ACCESS_URL =
  'https://us-central1-school-connect-enterprise.cloudfunctions.net/requestAccess';

function getForm(): HTMLFormElement {
  return document.querySelector('form') as HTMLFormElement;
}

async function fillAndSubmit() {
  const form = getForm();
  fireEvent.change(within(form).getByLabelText(/your name/i), {
    target: { value: 'Jane Smith' },
  });
  fireEvent.change(within(form).getByLabelText(/school name/i), {
    target: { value: 'St. Mary Primary' },
  });
  fireEvent.change(within(form).getByLabelText(/your role/i), {
    target: { value: 'Principal / Head of School' },
  });
  fireEvent.change(within(form).getByLabelText(/work email/i), {
    target: { value: 'jane@stmary.edu.jm' },
  });
  fireEvent.click(within(form).getByRole('button', { name: /request walkthrough/i }));
}

describe('WalkthroughModal — submission', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('posts the walkthrough form to requestAccess and shows success on OK response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    render(<WalkthroughModal onClose={jest.fn()} />);
    await fillAndSubmit();

    await screen.findByText('Request Submitted!');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      REQUEST_ACCESS_URL,
      expect.objectContaining({ method: 'POST' }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({
      source: 'skoenroll-landing',
      intent: 'skoenroll-walkthrough',
      contact_name: 'Jane Smith',
      school_name: 'St. Mary Primary',
      role: 'Principal / Head of School',
      contact_email: 'jane@stmary.edu.jm',
      phone: '',
      message: '',
    });
  });

  it('shows the server error message on a non-OK response and stays open', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Backend exploded' }),
    });
    render(<WalkthroughModal onClose={jest.fn()} />);
    await fillAndSubmit();

    expect(await screen.findByText('Backend exploded')).toBeInTheDocument();
    expect(screen.queryByText('Request Submitted!')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('falls back to the network-error message when fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(<WalkthroughModal onClose={jest.fn()} />);
    await fillAndSubmit();

    expect(
      await screen.findByText(/network error\. please check your connection/i),
    ).toBeInTheDocument();
    expect(screen.queryByText('Request Submitted!')).not.toBeInTheDocument();
  });
});

describe('WalkthroughModal — a11y (focus trap, dialog semantics)', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  it('renders a modal dialog with aria-modal and a label', () => {
    render(<WalkthroughModal onClose={jest.fn()} />);
    const dialog = screen.getByRole('dialog', { name: /book a walkthrough/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into the dialog on mount and restores it to the trigger on unmount', () => {
    // Trigger rendered (and focused) first — the real open path: user clicks
    // the CTA, browser focuses it, then the dialog mounts.
    const triggerRender = render(<button>Trigger</button>);
    const trigger = screen.getByRole('button', { name: 'Trigger' });
    trigger.focus();

    const modalRender = render(<WalkthroughModal onClose={jest.fn()} />);
    const dialog = screen.getByRole('dialog');

    // On mount, focus moved into the dialog (not left on the trigger)
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(trigger);

    // On close/unmount, focus restored to the element focused before open
    modalRender.unmount();
    expect(document.activeElement).toBe(trigger);
    triggerRender.unmount();
  });

  it('traps Tab within the dialog (wraps from last back to first)', () => {
    render(<WalkthroughModal onClose={jest.fn()} />);
    const dialog = screen.getByRole('dialog');
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea',
      ),
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('closes on Escape', async () => {
    const onClose = jest.fn();
    render(<WalkthroughModal onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
