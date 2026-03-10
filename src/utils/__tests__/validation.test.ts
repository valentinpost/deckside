import { describe, it, expect } from 'vitest';
import { sumQuantities, isBalanced, validateCardRef } from '../validation';
import type { CardRef, Card } from '@/types/deck';

describe('sumQuantities', () => {
  it('sums an empty array', () => {
    expect(sumQuantities([])).toBe(0);
  });

  it('sums multiple refs', () => {
    const refs: CardRef[] = [
      { name: 'A', quantity: 2 },
      { name: 'B', quantity: 3 },
    ];
    expect(sumQuantities(refs)).toBe(5);
  });
});

describe('isBalanced', () => {
  it('returns true when empty', () => {
    expect(isBalanced([], [])).toBe(true);
  });

  it('returns true when balanced', () => {
    expect(isBalanced(
      [{ name: 'A', quantity: 2 }],
      [{ name: 'B', quantity: 2 }],
    )).toBe(true);
  });

  it('returns false when unbalanced', () => {
    expect(isBalanced(
      [{ name: 'A', quantity: 2 }],
      [{ name: 'B', quantity: 3 }],
    )).toBe(false);
  });
});

describe('validateCardRef', () => {
  const cards: Card[] = [
    { name: 'Lightning Bolt', scryfallId: '1', imageUrl: '', quantity: 4 },
    { name: 'Goblin Guide', scryfallId: '2', imageUrl: '', quantity: 4 },
  ];

  it('returns null for valid ref', () => {
    expect(validateCardRef({ name: 'Lightning Bolt', quantity: 3 }, cards)).toBeNull();
  });

  it('returns error for missing card', () => {
    expect(validateCardRef({ name: 'Counterspell', quantity: 1 }, cards)).toContain('not found');
  });

  it('returns error for excessive quantity', () => {
    expect(validateCardRef({ name: 'Lightning Bolt', quantity: 5 }, cards)).toContain('only 4');
  });
});
