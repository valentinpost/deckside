import { describe, it, expect } from 'vitest';
import { importDeckFromJson } from '../exportImport';
import type { StoredDeck } from '@/types/deck';

describe('importDeckFromJson', () => {
  it('imports a valid deck file', async () => {
    const deck: StoredDeck = {
      deckId: 'abc',
      deckName: 'Test',
      moxfieldUrl: 'https://moxfield.com/decks/abc',
      lastFetchedFromMoxfield: Date.now(),
      mainboard: [],
      sideboard: [],
      matchups: [],
      history: [],
      version: 1,
    };
    const file = new File([JSON.stringify(deck)], 'test.json', { type: 'application/json' });
    const result = await importDeckFromJson(file);
    expect(result.deckId).toBe('abc');
    expect(result.deckName).toBe('Test');
  });

  it('rejects invalid JSON structure', async () => {
    const file = new File(['{"foo": "bar"}'], 'bad.json', { type: 'application/json' });
    await expect(importDeckFromJson(file)).rejects.toThrow('Invalid sideboard guide file');
  });

  it('rejects non-JSON', async () => {
    const file = new File(['not json'], 'bad.txt', { type: 'text/plain' });
    await expect(importDeckFromJson(file)).rejects.toThrow();
  });
});
