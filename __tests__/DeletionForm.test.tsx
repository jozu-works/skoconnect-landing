import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeletionForm from '@/components/DeletionForm';

const DELETION_URL =
  'https://us-central1-school-connect-enterprise.cloudfunctions.net/deletionRequests';

const baseProps = {
  type: 'account' as const,
  heading: 'Delete Account',
  description: 'Request account deletion',
  confirmLabel: 'I confirm I want to delete my account',
  successTimeline: 'Within 7 days',
};

function fillValidForm(email = '  Parent@School.Com  ') {
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: email },
  });
  fireEvent.click(screen.getByLabelText(baseProps.confirmLabel));
}

describe('DeletionForm', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    window.localStorage.clear();
  });

  describe('(a) no-op when validation fails', () => {
    it('does not submit when the email is empty', () => {
      render(<DeletionForm {...baseProps} />);
      fireEvent.click(screen.getByLabelText(baseProps.confirmLabel));

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      expect(fetchMock).not.toHaveBeenCalled();
      expect(screen.queryByText('Request Received')).not.toBeInTheDocument();
    });

    it('does not submit when the confirmation checkbox is unchecked', () => {
      render(<DeletionForm {...baseProps} />);
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'parent@school.com' },
      });

      const form = document.querySelector('form')!;
      fireEvent.submit(form);

      expect(fetchMock).not.toHaveBeenCalled();
      expect(screen.queryByText('Request Received')).not.toBeInTheDocument();
    });

    it('disables the submit button until email + confirmation are provided', () => {
      render(<DeletionForm {...baseProps} />);
      const button = screen.getByRole('button', { name: /submit request/i });
      expect(button).toBeDisabled();

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'parent@school.com' },
      });
      expect(button).toBeDisabled();

      fireEvent.click(screen.getByLabelText(baseProps.confirmLabel));
      expect(button).toBeEnabled();
    });
  });

  describe('(b) successful POST to the Cloud Function', () => {
    it('posts the payload and shows the success state', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });
      render(<DeletionForm {...baseProps} />);
      fillValidForm();

      fireEvent.submit(document.querySelector('form')!);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(1);
      });

      expect(fetchMock).toHaveBeenCalledWith(DELETION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      });

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.type).toBe('account');
      expect(body.email).toBe('parent@school.com'); // trimmed + lowercased
      expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(() => new Date(body.timestamp).toISOString()).not.toThrow();

      expect(await screen.findByText('Request Received')).toBeInTheDocument();
      // Success view echoes the user's email (as typed, whitespace collapsed)
      expect(
        screen.getByText(/a confirmation has been sent to/i).textContent,
      ).toMatch(/Parent@School\.Com/);
    });

    it('does not write a localStorage fallback entry on success', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });
      render(<DeletionForm {...baseProps} />);
      fillValidForm();
      fireEvent.submit(document.querySelector('form')!);

      await screen.findByText('Request Received');
      expect(
        window.localStorage.getItem('skoconnect_deletion_requests'),
      ).toBeNull();
    });
  });

  describe('(c) non-ok response falls back to localStorage', () => {
    it('stores the payload locally when the server returns an error status', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      render(<DeletionForm {...baseProps} />);
      fillValidForm();
      fireEvent.submit(document.querySelector('form')!);

      await screen.findByText('Request Received');

      const stored = JSON.parse(
        window.localStorage.getItem('skoconnect_deletion_requests') || '[]',
      );
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({
        type: 'account',
        email: 'parent@school.com',
      });
      expect(stored[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('stores the payload locally when fetch rejects (network failure)', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      render(<DeletionForm {...baseProps} />);
      fillValidForm();
      fireEvent.submit(document.querySelector('form')!);

      await screen.findByText('Request Received');

      const stored = JSON.parse(
        window.localStorage.getItem('skoconnect_deletion_requests') || '[]',
      );
      expect(stored).toHaveLength(1);
      expect(stored[0].email).toBe('parent@school.com');
    });

    it('appends to pre-existing localStorage entries', async () => {
      window.localStorage.setItem(
        'skoconnect_deletion_requests',
        JSON.stringify([{ type: 'data', email: 'earlier@school.com', timestamp: new Date().toISOString() }]),
      );
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
      render(<DeletionForm {...baseProps} />);
      fillValidForm();
      fireEvent.submit(document.querySelector('form')!);

      await screen.findByText('Request Received');

      const stored = JSON.parse(
        window.localStorage.getItem('skoconnect_deletion_requests') || '[]',
      );
      expect(stored).toHaveLength(2);
      expect(stored[1].email).toBe('parent@school.com');
    });
  });

  describe('(d) submitting state disables the form', () => {
    it('disables inputs and the button while the request is in flight', async () => {
      let resolveFetch!: (value: unknown) => void;
      fetchMock.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
      );
      render(<DeletionForm {...baseProps} />);
      fillValidForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const checkbox = screen.getByLabelText(baseProps.confirmLabel);
      const button = screen.getByRole('button', { name: /submit request/i });

      fireEvent.submit(document.querySelector('form')!);

      expect(await screen.findByText(/processing/i)).toBeInTheDocument();
      expect(emailInput).toBeDisabled();
      expect(checkbox).toBeDisabled();
      expect(button).toBeDisabled();

      resolveFetch({ ok: true, status: 200 });
      await screen.findByText('Request Received');
    });
  });

  it('renders the data-deletion variant icon/heading without submitting', () => {
    fetchMock.mockResolvedValue({ ok: true });
    render(
      <DeletionForm
        {...baseProps}
        type="data"
        heading="Delete Data"
      />,
    );
    expect(screen.getByText('Delete Data')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
