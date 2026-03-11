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

/** Helper to get current deck state with non-null assertion */
function deck() {
  return useDeckStore.getState().deck!;
}

/** Helper to get matchup at index */
function matchupAt(i: number) {
  return deck().matchups[i]!;
}

beforeEach(() => {
  useDeckStore.setState({ deck: null, dirty: false });
});

describe('setDeck', () => {
  it('loads a deck and marks clean', () => {
    useDeckStore.getState().setDeck(baseDeck());
    expect(deck().deckId).toBe('test-deck');
    expect(useDeckStore.getState().dirty).toBe(false);
  });
});

describe('addMatchup', () => {
  it('adds a matchup with empty results array', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    expect(deck().matchups).toHaveLength(1);
    expect(matchupAt(0).name).toBe('vs Burn');
    expect(matchupAt(0).slug).toBe('vs-burn');
    expect(matchupAt(0).results).toEqual([]);
    expect(matchupAt(0).out).toEqual([]);
    expect(matchupAt(0).in).toEqual([]);
  });

  it('increments version and sets dirty', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Control');
    expect(deck().version).toBe(2);
    expect(useDeckStore.getState().dirty).toBe(true);
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
    useDeckStore.getState().removeMatchup(matchupAt(0).id);
    expect(deck().matchups).toHaveLength(0);
  });

  it('leaves other matchups untouched', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchup('vs Control');
    useDeckStore.getState().removeMatchup(matchupAt(0).id);
    expect(deck().matchups).toHaveLength(1);
    expect(matchupAt(0).name).toBe('vs Control');
  });
});

describe('updateMatchupCards', () => {
  it('updates out and in arrays for a matchup', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const out = [{ name: 'Lightning Bolt', quantity: 2 }];
    const inCards = [{ name: 'Rest in Peace', quantity: 2 }];
    useDeckStore.getState().updateMatchupCards(matchupAt(0).id, out, inCards);
    expect(matchupAt(0).out).toEqual(out);
    expect(matchupAt(0).in).toEqual(inCards);
  });
});

describe('renameMatchup', () => {
  it('updates name and slug', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().renameMatchup(matchupAt(0).id, 'vs Aggro');
    expect(matchupAt(0).name).toBe('vs Aggro');
    expect(matchupAt(0).slug).toBe('vs-aggro');
  });
});

describe('addMatchResult', () => {
  it('appends a result to the correct matchup', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, {
      won: true, gamesWon: 2, gamesLost: 1, onPlay: true,
    });
    const r = matchupAt(0).results[0]!;
    expect(matchupAt(0).results).toHaveLength(1);
    expect(r.won).toBe(true);
    expect(r.gamesWon).toBe(2);
    expect(r.gamesLost).toBe(1);
    expect(r.onPlay).toBe(true);
    expect(r.id).toBeTruthy();
    expect(r.timestamp).toBeGreaterThan(0);
  });

  it('accumulates multiple results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const id = matchupAt(0).id;
    useDeckStore.getState().addMatchResult(id, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().addMatchResult(id, { won: false, gamesWon: 1, gamesLost: 2 });
    useDeckStore.getState().addMatchResult(id, { won: true, gamesWon: 2, gamesLost: 1 });
    expect(matchupAt(0).results).toHaveLength(3);
    expect(matchupAt(0).results.filter((r) => r.won)).toHaveLength(2);
  });

  it('does not affect other matchups', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchup('vs Control');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    expect(matchupAt(0).results).toHaveLength(1);
    expect(matchupAt(1).results).toHaveLength(0);
  });

  it('increments version and sets dirty', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const vBefore = deck().version;
    useDeckStore.getState().markClean();
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    expect(deck().version).toBe(vBefore + 1);
    expect(useDeckStore.getState().dirty).toBe(true);
  });
});

describe('removeMatchResult', () => {
  it('removes a result by id', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    const id = matchupAt(0).id;
    useDeckStore.getState().addMatchResult(id, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().addMatchResult(id, { won: false, gamesWon: 0, gamesLost: 2 });
    useDeckStore.getState().removeMatchResult(id, matchupAt(0).results[0]!.id);
    expect(matchupAt(0).results).toHaveLength(1);
    expect(matchupAt(0).results[0]!.won).toBe(false);
  });

  it('does nothing for non-existent result id', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().removeMatchResult(matchupAt(0).id, 'nonexistent');
    expect(matchupAt(0).results).toHaveLength(1);
  });
});

describe('snapshotHistory', () => {
  it('captures matchup state including results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    useDeckStore.getState().snapshotHistory('testuser', 'test snapshot');
    const entry = deck().history[0]!;
    expect(entry.matchups[0]!.results).toHaveLength(1);
    expect(entry.matchups[0]!.results[0]!.won).toBe(true);
  });

  it('creates a deep clone (mutations do not affect snapshot)', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().snapshotHistory('testuser', 'snapshot before changes');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    const snapshot = deck().history[0]!;
    expect(snapshot.matchups[0]!.results).toHaveLength(0);
    expect(matchupAt(0).results).toHaveLength(1);
  });
});

describe('refreshFromMoxfield', () => {
  it('updates cards without touching matchups or results', () => {
    useDeckStore.getState().setDeck(baseDeck());
    useDeckStore.getState().addMatchup('vs Burn');
    useDeckStore.getState().addMatchResult(matchupAt(0).id, { won: true, gamesWon: 2, gamesLost: 0 });
    const newMain = [{ name: 'New Card', scryfallId: 'new', imageUrl: '', quantity: 4 }];
    useDeckStore.getState().refreshFromMoxfield(newMain, [], 'legacy');
    expect(deck().mainboard[0]!.name).toBe('New Card');
    expect(deck().format).toBe('legacy');
    expect(matchupAt(0).results).toHaveLength(1);
    expect(matchupAt(0).name).toBe('vs Burn');
  });
});
