import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDeckStore } from '../deckStore';
import type { StoredDeck } from '@/types/deck';

// Mock IndexedDB persistence — we don't want real DB writes in tests
vi.mock('@/db/indexeddb', () => ({
  cacheDeck: vi.fn().mockResolvedValue(undefined),
}));

function baseDeck(): StoredDeck {
  return {
    deckId: 'test-deck',
    deckName: 'Test Deck',
    format: 'modern',
    moxfieldUrl: 'https://moxfield.com/decks/test-deck',
    lastFetchedFromMoxfield: Date.now(),
    mainboard: [{ name: 'Lightning Bolt', scryfallId: 'bolt', imageUrl: '', quantity: 4 }],
    sideboard: [{ name: 'Rest in Peace', scryfallId: 'rip', imageUrl: '', quantity: 2 }],
    matchups: [],
    history: [],
    version: 1,
  };
}

beforeEach(() => {
  useDeckStore.setState({ deck: null, dirty: false });
});

describe('setDeck', () => {
  it('loads a deck and marks clean', () => {
    const deck = baseDeck();
    useDeckStore.getState().setDeck(deck);
    expect(useDeckStore.getState().deck?.deckId).toBe('test-deck');
    expect(useDeckStore.getState().dirty).toBe(false);
  });
});

describe('addMatchup', () => {
  it('adds a matchup with empty results array', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const { deck } = useDeckStore.getState();
    expect(deck!.matchups).toHaveLength(1);
    expect(deck!.matchups[0].name).toBe('vs Burn');
    expect(deck!.matchups[0].slug).toBe('vs-burn');
    expect(deck!.matchups[0].results).toEqual([]);
    expect(deck!.matchups[0].out).toEqual([]);
    expect(deck!.matchups[0].in).toEqual([]);
  });

  it('increments version and sets dirty', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Control');
    const { deck, dirty } = useDeckStore.getState();
    expect(deck!.version).toBe(2);
    expect(dirty).toBe(true);
  });

  it('does nothing when no deck is loaded', () => {
    useDeckStore.getState().addMatchup('vs Nothing');
    expect(useDeckStore.getState().deck).toBeNull();
  });
});

describe('removeMatchup', () => {
  it('removes a matchup by id', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().removeMatchup(matchupId);
    expect(useDeckStore.getState().deck!.matchups).toHaveLength(0);
  });

  it('leaves other matchups untouched', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchup('vs Control');
    const burnId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().removeMatchup(burnId);
    const remaining = useDeckStore.getState().deck!.matchups;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('vs Control');
  });
});

describe('updateMatchupCards', () => {
  it('updates out and in arrays for a matchup', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;

    const out = [{ name: 'Lightning Bolt', quantity: 2 }];
    const inCards = [{ name: 'Rest in Peace', quantity: 2 }];
    useDeckStore.getState().updateMatchupCards(matchupId, out, inCards);

    const matchup = useDeckStore.getState().deck!.matchups[0];
    expect(matchup.out).toEqual(out);
    expect(matchup.in).toEqual(inCards);
  });
});

describe('renameMatchup', () => {
  it('updates name and slug', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().renameMatchup(matchupId, 'vs Aggro');

    const matchup = useDeckStore.getState().deck!.matchups[0];
    expect(matchup.name).toBe('vs Aggro');
    expect(matchup.slug).toBe('vs-aggro');
  });
});

describe('addMatchResult', () => {
  it('appends a result to the correct matchup', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;

    useDeckStore.getState().addMatchResult(matchupId, {
      won: true, gamesWon: 2, gamesLost: 1, onPlay: true,
    });

    const results = useDeckStore.getState().deck!.matchups[0].results;
    expect(results).toHaveLength(1);
    expect(results[0].won).toBe(true);
    expect(results[0].gamesWon).toBe(2);
    expect(results[0].gamesLost).toBe(1);
    expect(results[0].onPlay).toBe(true);
    expect(results[0].id).toBeTruthy();
    expect(results[0].timestamp).toBeGreaterThan(0);
  });

  it('accumulates multiple results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;

    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().addMatchResult(matchupId, { won: false, gamesWon: 1, gamesLost: 2 });
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 1 });

    const results = useDeckStore.getState().deck!.matchups[0].results;
    expect(results).toHaveLength(3);
    expect(results.filter((r) => r.won)).toHaveLength(2);
  });

  it('does not affect other matchups', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchup('vs Control');
    const burnId = useDeckStore.getState().deck!.matchups[0].id;

    useDeckStore.getState().addMatchResult(burnId, { won: true, gamesWon: 2, gamesLost: 0 });

    expect(useDeckStore.getState().deck!.matchups[0].results).toHaveLength(1);
    expect(useDeckStore.getState().deck!.matchups[1].results).toHaveLength(0);
  });

  it('increments version and sets dirty', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const vBefore = useDeckStore.getState().deck!.version;
    useDeckStore.getState().markClean();

    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });

    expect(useDeckStore.getState().deck!.version).toBe(vBefore + 1);
    expect(useDeckStore.getState().dirty).toBe(true);
  });
});

describe('removeMatchResult', () => {
  it('removes a result by id', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;

    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().addMatchResult(matchupId, { won: false, gamesWon: 0, gamesLost: 2 });

    const resultId = useDeckStore.getState().deck!.matchups[0].results[0].id;
    useDeckStore.getState().removeMatchResult(matchupId, resultId);

    const results = useDeckStore.getState().deck!.matchups[0].results;
    expect(results).toHaveLength(1);
    expect(results[0].won).toBe(false);
  });

  it('does nothing for non-existent result id', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });

    useDeckStore.getState().removeMatchResult(matchupId, 'nonexistent');
    expect(useDeckStore.getState().deck!.matchups[0].results).toHaveLength(1);
  });
});

describe('snapshotHistory', () => {
  it('captures matchup state including results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });

    useDeckStore.getState().snapshotHistory('testuser', 'test snapshot');

    const entry = useDeckStore.getState().deck!.history[0];
    expect(entry.matchups[0].results).toHaveLength(1);
    expect(entry.matchups[0].results[0].won).toBe(true);
  });

  it('creates a deep clone (mutations do not affect snapshot)', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().snapshotHistory('testuser', 'snapshot before changes');

    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });

    const snapshot = useDeckStore.getState().deck!.history[0];
    expect(snapshot.matchups[0].results).toHaveLength(0);
    expect(useDeckStore.getState().deck!.matchups[0].results).toHaveLength(1);
  });
});

describe('refreshFromMoxfield', () => {
  it('updates cards without touching matchups or results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const matchupId = useDeckStore.getState().deck!.matchups[0].id;
    useDeckStore.getState().addMatchResult(matchupId, { won: true, gamesWon: 2, gamesLost: 0 });

    const newMain = [{ name: 'New Card', scryfallId: 'new', imageUrl: '', quantity: 4 }];
    useDeckStore.getState().refreshFromMoxfield(newMain, [], 'legacy');

    const deck = useDeckStore.getState().deck!;
    expect(deck.mainboard[0].name).toBe('New Card');
    expect(deck.format).toBe('legacy');
    expect(deck.matchups[0].results).toHaveLength(1);
    expect(deck.matchups[0].name).toBe('vs Burn');
  });
});
