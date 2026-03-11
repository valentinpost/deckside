import type { StoredDeck } from '@/types/deck';
import { API } from '@/config';

export async function fetchDeckFromCloud(deckId: string): Promise<StoredDeck | null> {
  const response = await fetch(API.deck(deckId));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Cloud fetch failed (${response.status})`);
  return response.json() as Promise<StoredDeck>;
}

export async function saveDeckToCloud(deck: StoredDeck): Promise<{ ok: boolean; conflict?: StoredDeck }> {
  const response = await fetch(API.deck(deck.deckId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });

  if (response.status === 409) {
    const conflictDeck = (await response.json()) as StoredDeck;
    return { ok: false, conflict: conflictDeck };
  }
  if (!response.ok) throw new Error(`Cloud save failed (${response.status})`);
  return { ok: true };
}
