import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('renders 404 message and home link', () => {
    render(<NotFound />);
    expect(screen.getByText('Error 404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to skoconnect\.com/i })).toHaveAttribute('href', '/');
  });
});
