import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DeletionForm from '@/components/DeletionForm';

describe('DeletionForm local storage fallback edge', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('still shows success when localStorage write fails after fetch failure', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    render(
      <DeletionForm
        type="account"
        heading="Delete Your Account"
        description="desc"
        confirmLabel="I confirm"
        successTimeline="done soon"
      />,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByLabelText(/i confirm/i));
    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => expect(screen.getByText('Request Received')).toBeInTheDocument());
    expect(screen.getByText('done soon')).toBeInTheDocument();
  });
});
