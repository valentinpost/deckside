import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MatchupList } from '../deck/MatchupList';
import type { Matchup } from '@/types/deck';

function matchup(name: string, out: number, inCount: number): Matchup {
  return {
    id: name,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    notes: '',
    out: out > 0 ? [{ name: 'Card', quantity: out }] : [],
    in: inCount > 0 ? [{ name: 'Other', quantity: inCount }] : [],
    results: [],
  };
}

function renderList(matchups: Matchup[]) {
  return render(
    <MemoryRouter>
      <MatchupList deckId="d1" matchups={matchups} onAddResult={vi.fn()} />
    </MemoryRouter>,
  );
}

describe('MatchupList', () => {
  it('shows empty state when no matchups', () => {
    renderList([]);
    expect(screen.getByText(/No matchups yet/)).toBeInTheDocument();
  });

  it('renders matchup items', () => {
    renderList([matchup('vs Burn', 0, 0), matchup('vs Control', 0, 0)]);
    expect(screen.getByText('vs Burn')).toBeInTheDocument();
    expect(screen.getByText('vs Control')).toBeInTheDocument();
  });

  it('sorts complete matchups before incomplete ones', () => {
    const incomplete = matchup('Incomplete', 2, 0);     // out !== in
    const complete = matchup('Complete', 3, 3);          // out === in
    const noSwaps = matchup('NoSwaps', 0, 0);            // no swaps

    renderList([incomplete, complete, noSwaps]);

    const items = screen.getAllByText(/Complete|Incomplete|NoSwaps/);
    expect(items[0]!.textContent).toBe('Complete');
  });
});
