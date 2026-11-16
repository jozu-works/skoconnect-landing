import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import LandingPage from '@/app/page';

const REQUEST_ACCESS_URL =
  'https://us-central1-school-connect-enterprise.cloudfunctions.net/requestAccess';

async function openModal() {
  const ctas = screen.getAllByRole('button', {
    name: /start your free pilot/i,
  });
  fireEvent.click(ctas[0]);
  return screen.findByText("Start Your School's Pilot");
}

function getModalForm(): HTMLFormElement {
  return document.querySelector('form') as HTMLFormElement;
}

describe('LandingPage — RequestAccessModal', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    window.localStorage.clear();
  });

  it('renders the landing page shell', () => {
    render(<LandingPage />);
    expect(
      screen.getByText(/replace whatsapp chaos with accountable school communication/i),
    ).toBeInTheDocument();
  });

  it('opens the pilot modal from the hero CTA and closes on Escape', async () => {
    render(<LandingPage />);

    const heading = await openModal();
    expect(heading).toBeInTheDocument();
    expect(getModalForm()).toBeInTheDocument();

    // Oct 27 a11y fix: Escape closes the modal
    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText("Start Your School's Pilot")).not.toBeInTheDocument();
    });
    expect(document.querySelector('form')).toBeNull();
  });

  it('posts the completed form to the requestAccess Cloud Function and shows success', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    render(<LandingPage />);
    await openModal();

    const form = getModalForm();
    fireEvent.change(
      within(form).getByPlaceholderText("St. Mary's Primary School"),
      { target: { value: 'St. Mary Primary' } },
    );
    fireEvent.change(
      within(form).getByPlaceholderText('Principal Jane Smith'),
      { target: { value: 'Jane Smith' } },
    );
    fireEvent.change(
      within(form).getByPlaceholderText('principal@school.edu'),
      { target: { value: 'jane@stmary.edu.jm' } },
    );

    fireEvent.click(within(form).getByRole('button'));

    await screen.findByText('Request Submitted!');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      REQUEST_ACCESS_URL,
      expect.objectContaining({ method: 'POST' }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({
      school_name: 'St. Mary Primary',
      contact_name: 'Jane Smith',
      contact_email: 'jane@stmary.edu.jm',
      phone: '',
      message: '',
    });
  });

  it('shows the server error message on a non-ok response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'School domain not recognized' }),
    });
    render(<LandingPage />);
    await openModal();

    const form = getModalForm();
    fireEvent.change(
      within(form).getByPlaceholderText("St. Mary's Primary School"),
      { target: { value: 'Unknown School' } },
    );
    fireEvent.change(within(form).getByPlaceholderText('Principal Jane Smith'), {
      target: { value: 'Jane Smith' },
    });
    fireEvent.change(within(form).getByPlaceholderText('principal@school.edu'), {
      target: { value: 'jane@unknown.org' },
    });

    fireEvent.click(within(form).getByRole('button'));

    expect(await screen.findByText('School domain not recognized')).toBeInTheDocument();
    expect(screen.queryByText('Request Submitted!')).not.toBeInTheDocument();
  });

  it('falls back to the network-error message when fetch rejects', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(<LandingPage />);
    await openModal();

    const form = getModalForm();
    fireEvent.change(
      within(form).getByPlaceholderText("St. Mary's Primary School"),
      { target: { value: 'St. Mary Primary' } },
    );
    fireEvent.change(within(form).getByPlaceholderText('Principal Jane Smith'), {
      target: { value: 'Jane Smith' },
    });
    fireEvent.change(within(form).getByPlaceholderText('principal@school.edu'), {
      target: { value: 'jane@stmary.edu.jm' },
    });

    fireEvent.click(within(form).getByRole('button'));

    expect(
      await screen.findByText(/network error\. please check your connection/i),
    ).toBeInTheDocument();
    expect(screen.queryByText('Request Submitted!')).not.toBeInTheDocument();
  });

  it('blocks submission when required fields are empty (HTML constraint validation)', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    render(<LandingPage />);
    await openModal();

    const form = getModalForm();
    expect(form.checkValidity()).toBe(false);

    fireEvent.click(within(form).getByRole('button'));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText('Request Submitted!')).not.toBeInTheDocument();
    expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
    expect(screen.getByText("Start Your School's Pilot")).toBeInTheDocument();
  });
});
