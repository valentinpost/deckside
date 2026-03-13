import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MatchupListItem } from '../deck/MatchupListItem';
import type { Matchup } from '@/types/deck';

function matchup(overrides?: Partial<Matchup>): Matchup {
  return {
    id: 'm1',
    name: 'vs Burn',
    slug: 'vs-burn',
    notes: '',
    out: [],
    in: [],
    results: [],
    ...overrides,
  };
}

function renderItem(m: Matchup, expanded = false) {
  const onToggle = vi.fn();
  const onAddResult = vi.fn();
  const result = render(
    <MemoryRouter>
      <MatchupListItem deckId="deck1" matchup={m} expanded={expanded} onToggle={onToggle} onAddResult={onAddResult} />
    </MemoryRouter>,
  );
  return { ...result, onToggle, onAddResult };
}

describe('MatchupListItem', () => {
  it('renders matchup name', () => {
    renderItem(matchup());
    expect(screen.getByText('vs Burn')).toBeInTheDocument();
  });

  it('shows win rate when results exist', () => {
    renderItem(matchup({
      results: [
        { id: 'r1', timestamp: 1, won: true, gamesWon: 2, gamesLost: 0 },
        { id: 'r2', timestamp: 2, won: true, gamesWon: 2, gamesLost: 1 },
        { id: 'r3', timestamp: 3, won: false, gamesWon: 1, gamesLost: 2 },
      ],
    }));
    expect(screen.getByText(/67%/)).toBeInTheDocument();
    expect(screen.getByText(/3 matches/)).toBeInTheDocument();
  });

  it('hides win rate when no results', () => {
    renderItem(matchup());
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('calls onToggle when row clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderItem(matchup());
    await user.click(screen.getByRole('button', { name: /vs Burn/i }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows preview with sideboard plan when expanded', () => {
    renderItem(matchup({
      out: [{ name: 'Lightning Bolt', quantity: 2 }],
      in: [{ name: 'Leyline', quantity: 2 }],
    }), true);
    expect(screen.getByText(/Lightning Bolt/)).toBeInTheDocument();
    expect(screen.getByText('Log Result')).toBeInTheDocument();
  });

  it('hides preview when collapsed', () => {
    renderItem(matchup(), false);
    expect(screen.queryByText('Log Result')).not.toBeInTheDocument();
  });

  it('shows edit link pointing to matchup page', () => {
    renderItem(matchup());
    const link = screen.getByLabelText('Edit vs Burn');
    expect(link).toHaveAttribute('href', '/deck/deck1/vs-burn');
  });

  it('shows play/draw toggle in preview when draw plan exists', () => {
    renderItem(matchup({ outOnDraw: [{ name: 'A', quantity: 1 }] }), true);
    expect(screen.getByText('Play')).toBeInTheDocument();
    expect(screen.getByText('Draw')).toBeInTheDocument();
  });
});
