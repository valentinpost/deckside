import type { StoredDeck } from '@/types/deck';

const WORKER_BASE = 'https://deckside.deckside-35.workers.dev';

export async function fetchDeckFromCloud(deckId: string): Promise<StoredDeck | null> {
  const res = await fetch(`${WORKER_BASE}/api/deck/${deckId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Cloud fetch failed (${res.status})`);
  return res.json() as Promise<StoredDeck>;
}

export async function saveDeckToCloud(deck: StoredDeck): Promise<{ ok: boolean; conflict?: StoredDeck }> {
  const res = await fetch(`${WORKER_BASE}/api/deck/${deck.deckId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });

  if (res.status === 409) {
    const conflict = (await res.json()) as StoredDeck;
    return { ok: false, conflict };
  }
  if (!res.ok) throw new Error(`Cloud save failed (${res.status})`);
  return { ok: true };
}
