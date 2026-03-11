import { describe, it, expect } from 'vitest';
import { importDeckFromJson } from '../exportImport';
import type { StoredDeck } from '@/types/deck';

/** Create a File with a working .text() method (jsdom doesn't implement it) */
function makeFile(content: string, name: string, type: string): File {
  const file = new File([content], name, { type });
  file.text = () => Promise.resolve(content);
  return file;
}

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
    const file = makeFile(JSON.stringify(deck), 'test.json', 'application/json');
    const result = await importDeckFromJson(file);
    expect(result.deckId).toBe('abc');
    expect(result.deckName).toBe('Test');
  });

  it('rejects invalid JSON structure', async () => {
    const file = makeFile('{"foo": "bar"}', 'bad.json', 'application/json');
    await expect(importDeckFromJson(file)).rejects.toThrow('Invalid sideboard guide file');
  });

  it('rejects non-JSON', async () => {
    const file = makeFile('not json', 'bad.txt', 'text/plain');
    await expect(importDeckFromJson(file)).rejects.toThrow();
  });
});
