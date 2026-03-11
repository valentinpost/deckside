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

function renderItem(m: Matchup, props?: { onDelete?: () => void; onRename?: (n: string) => void }) {
  return render(
    <MemoryRouter>
      <MatchupListItem
        deckId="deck1"
        matchup={m}
        onDelete={props?.onDelete ?? vi.fn()}
        onRename={props?.onRename ?? vi.fn()}
      />
    </MemoryRouter>,
  );
}

describe('MatchupListItem', () => {
  it('renders matchup name', () => {
    renderItem(matchup());
    expect(screen.getByText('vs Burn')).toBeInTheDocument();
  });

  it('shows "No swaps configured" when out and in are empty', () => {
    renderItem(matchup());
    expect(screen.getByText('No swaps configured')).toBeInTheDocument();
  });

  it('shows swap counts when cards are configured', () => {
    renderItem(matchup({
      out: [{ name: 'A', quantity: 2 }],
      in: [{ name: 'B', quantity: 3 }],
    }));
    expect(screen.getByText('-2 / +3')).toBeInTheDocument();
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
    expect(screen.getByText(/2W/)).toBeInTheDocument();
  });

  it('hides win rate when no results', () => {
    renderItem(matchup());
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('links to the correct matchup page', () => {
    renderItem(matchup());
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/deck/deck1/vs-burn');
  });

  it('enters edit mode on edit button click', async () => {
    const user = userEvent.setup();
    renderItem(matchup());
    await user.click(screen.getByLabelText('Rename vs Burn'));
    expect(screen.getByDisplayValue('vs Burn')).toBeInTheDocument();
  });

  it('submits rename on Enter', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderItem(matchup(), { onRename });
    await user.click(screen.getByLabelText('Rename vs Burn'));
    const input = screen.getByDisplayValue('vs Burn');
    await user.clear(input);
    await user.type(input, 'vs Aggro{Enter}');
    expect(onRename).toHaveBeenCalledWith('vs Aggro');
  });

  it('cancels rename on Escape without calling onRename', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderItem(matchup(), { onRename });
    await user.click(screen.getByLabelText('Rename vs Burn'));
    await user.type(screen.getByDisplayValue('vs Burn'), '{Escape}');
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.getByText('vs Burn')).toBeInTheDocument();
  });

  it('does not rename if value unchanged', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderItem(matchup(), { onRename });
    await user.click(screen.getByLabelText('Rename vs Burn'));
    await user.type(screen.getByDisplayValue('vs Burn'), '{Enter}');
    expect(onRename).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderItem(matchup(), { onDelete });
    await user.click(screen.getByLabelText('Delete vs Burn'));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
