import { render, screen } from '@testing-library/react';
import AccountDeletionPage, { metadata as accountMetadata } from '@/app/account-deletion/page';
import DataDeletionPage, { metadata as dataMetadata } from '@/app/data-deletion/page';

describe('Account deletion page', () => {
  it('exports noindex metadata and renders deletion form', () => {
    expect(accountMetadata.title).toContain('Delete Your Account');
    expect(accountMetadata.robots).toEqual(
      expect.objectContaining({ index: false, follow: false }),
    );

    render(<AccountDeletionPage />);
    expect(screen.getByRole('heading', { name: /delete your account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to skoconnect/i })).toHaveAttribute('href', '/');
  });
});

describe('Data deletion page', () => {
  it('exports noindex metadata and renders deletion form', () => {
    expect(dataMetadata.title).toContain('Request Data Deletion');
    expect(dataMetadata.robots).toEqual(
      expect.objectContaining({ index: false, follow: false }),
    );

    render(<DataDeletionPage />);
    expect(screen.getByRole('heading', { name: /request data deletion/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to skoconnect/i })).toHaveAttribute('href', '/');
  });
});
