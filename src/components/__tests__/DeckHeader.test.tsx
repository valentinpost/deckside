import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckHeader } from '../deck/DeckHeader';
import type { StoredDeck } from '@/types/deck';

function baseDeck(overrides?: Partial<StoredDeck>): StoredDeck {
  return {
    deckId: 'test',
    deckName: 'Burn',
    format: 'modern',
    moxfieldUrl: 'https://moxfield.com/decks/test',
    lastFetchedFromMoxfield: Date.now(),
    mainboard: [{ name: 'Bolt', scryfallId: '1', imageUrl: '', quantity: 4 }],
    sideboard: [{ name: 'RIP', scryfallId: '2', imageUrl: '', quantity: 2 }],
    matchups: [],
    history: [],
    version: 1,
    ...overrides,
  };
}

describe('DeckHeader', () => {
  it('renders deck name and card counts', () => {
    render(<DeckHeader deck={baseDeck()} />);
    expect(screen.getByText('Burn')).toBeInTheDocument();
    expect(screen.getByText('4 main / 2 side')).toBeInTheDocument();
  });

  it('renders format badge when format exists', () => {
    render(<DeckHeader deck={baseDeck({ format: 'legacy' })} />);
    expect(screen.getByText('legacy')).toBeInTheDocument();
  });

  it('hides format badge when no format', () => {
    render(<DeckHeader deck={baseDeck({ format: undefined })} />);
    expect(screen.queryByText('modern')).not.toBeInTheDocument();
  });

  it('renders Moxfield link with correct href', () => {
    render(<DeckHeader deck={baseDeck()} />);
    const link = screen.getByText('Moxfield');
    expect(link).toHaveAttribute('href', 'https://moxfield.com/decks/test');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows refresh button when onRefreshMoxfield provided', () => {
    render(<DeckHeader deck={baseDeck()} onRefreshMoxfield={vi.fn()} />);
    expect(screen.getByTitle('Refresh from Moxfield')).toBeInTheDocument();
  });

  it('hides refresh button when onRefreshMoxfield not provided', () => {
    render(<DeckHeader deck={baseDeck()} />);
    expect(screen.queryByTitle('Refresh from Moxfield')).not.toBeInTheDocument();
  });

  it('disables refresh button when refreshing', () => {
    render(<DeckHeader deck={baseDeck()} onRefreshMoxfield={vi.fn()} refreshing />);
    expect(screen.getByTitle('Refresh from Moxfield')).toBeDisabled();
  });

  it('calls onRefreshMoxfield when refresh button clicked', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<DeckHeader deck={baseDeck()} onRefreshMoxfield={onRefresh} />);
    await user.click(screen.getByTitle('Refresh from Moxfield'));
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it('shows win rate when matchups have results', () => {
    const deck = baseDeck({
      matchups: [{
        id: '1', name: 'vs X', slug: 'vs-x', notes: '', out: [], in: [],
        results: [
          { id: 'r1', timestamp: 1, won: true, gamesWon: 2, gamesLost: 0 },
          { id: 'r2', timestamp: 2, won: false, gamesWon: 1, gamesLost: 2 },
        ],
      }],
    });
    render(<DeckHeader deck={deck} />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByText(/1W/)).toBeInTheDocument();
    expect(screen.getByText(/1L/)).toBeInTheDocument();
  });

  it('hides win rate when no results', () => {
    render(<DeckHeader deck={baseDeck()} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
