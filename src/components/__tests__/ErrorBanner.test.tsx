import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBanner } from '../shared/ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows retry button when onRetry provided', () => {
    render(<ErrorBanner message="Error" onRetry={vi.fn()} />);
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('hides retry button when onRetry not provided', () => {
    render(<ErrorBanner message="Error" />);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorBanner message="Error" onRetry={onRetry} />);
    await user.click(screen.getByText('Try again'));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
