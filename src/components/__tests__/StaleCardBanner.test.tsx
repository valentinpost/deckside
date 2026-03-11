import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StaleCardBanner } from '../matchup/StaleCardBanner';

describe('StaleCardBanner', () => {
  it('returns null when no stale cards', () => {
    const { container } = render(<StaleCardBanner staleCards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading when stale cards exist', () => {
    render(<StaleCardBanner staleCards={['Old Card']} />);
    expect(screen.getByText('Stale cards detected')).toBeInTheDocument();
  });

  it('lists stale card names joined by commas', () => {
    render(<StaleCardBanner staleCards={['Card A', 'Card B', 'Card C']} />);
    expect(screen.getByText(/Card A, Card B, Card C/)).toBeInTheDocument();
  });
});
