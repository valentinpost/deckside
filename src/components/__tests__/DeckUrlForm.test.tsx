import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckUrlForm } from '../home/DeckUrlForm';

describe('DeckUrlForm', () => {
  it('renders input with current url value', () => {
    render(<DeckUrlForm url="https://moxfield.com/decks/abc" error="" onUrlChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue('https://moxfield.com/decks/abc')).toBeInTheDocument();
  });

  it('calls onUrlChange when typing', async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    render(<DeckUrlForm url="" error="" onUrlChange={onUrlChange} onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText('Moxfield Deck URL'), 'x');
    expect(onUrlChange).toHaveBeenCalledWith('x');
  });

  it('calls onSubmit on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(<DeckUrlForm url="https://moxfield.com/decks/abc" error="" onUrlChange={vi.fn()} onSubmit={onSubmit} />);
    await user.click(screen.getByText('Load'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('shows error when error prop is set', () => {
    render(<DeckUrlForm url="" error="Invalid URL" onUrlChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  it('hides error when error prop is empty', () => {
    render(<DeckUrlForm url="" error="" onUrlChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.queryByText('Invalid URL')).not.toBeInTheDocument();
  });

  it('has placeholder text', () => {
    render(<DeckUrlForm url="" error="" onUrlChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/moxfield.com/)).toBeInTheDocument();
  });
});
