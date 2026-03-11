import { describe, it, expect } from 'vitest';
import { diffCardLists, findStaleRefs } from '../deckDiff';
import type { Card, Matchup } from '@/types/deck';

function card(name: string, qty = 4): Card {
  return { name, scryfallId: name, imageUrl: '', quantity: qty };
}

describe('diffCardLists', () => {
  it('detects no changes', () => {
    const cards = [card('A'), card('B')];
    const result = diffCardLists(cards, cards);
    expect(result.addedCards).toEqual([]);
    expect(result.removedCards).toEqual([]);
    expect(result.changedQuantities).toEqual([]);
  });

  it('detects added cards', () => {
    const result = diffCardLists([card('A')], [card('A'), card('B')]);
    expect(result.addedCards).toEqual(['B']);
  });

  it('detects removed cards', () => {
    const result = diffCardLists([card('A'), card('B')], [card('A')]);
    expect(result.removedCards).toEqual(['B']);
  });

  it('detects quantity changes', () => {
    const result = diffCardLists([card('A', 4)], [card('A', 3)]);
    expect(result.changedQuantities).toEqual([{ name: 'A', oldQty: 4, newQty: 3 }]);
  });
});

describe('findStaleRefs', () => {
  it('finds stale out refs', () => {
    const matchups: Matchup[] = [{
      id: '1', name: 'vs X', slug: 'vs-x', notes: '',
      out: [{ name: 'Removed Card', quantity: 1 }],
      in: [],
      results: [],
    }];
    const result = findStaleRefs(matchups, [card('A')], []);
    expect(result.get('1')).toEqual(['Removed Card']);
  });

  it('finds stale in refs', () => {
    const matchups: Matchup[] = [{
      id: '1', name: 'vs X', slug: 'vs-x', notes: '',
      out: [],
      in: [{ name: 'Removed Side', quantity: 1 }],
      results: [],
    }];
    const result = findStaleRefs(matchups, [], [card('A')]);
    expect(result.get('1')).toEqual(['Removed Side']);
  });

  it('returns empty map when no stale refs', () => {
    const matchups: Matchup[] = [{
      id: '1', name: 'vs X', slug: 'vs-x', notes: '',
      out: [{ name: 'A', quantity: 1 }],
      in: [{ name: 'B', quantity: 1 }],
      results: [],
    }];
    const result = findStaleRefs(matchups, [card('A')], [card('B')]);
    expect(result.size).toBe(0);
  });
});
