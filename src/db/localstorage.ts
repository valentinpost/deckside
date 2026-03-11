import type { RecentDeck } from '@/types/deck';
import { MAX_RECENT_DECKS } from '@/constants';

const RECENT_KEY = 'sideboard-recent-decks';
const AUTHOR_KEY = 'sideboard-author';

export function getRecentDecks(): RecentDeck[] {
  try {
    const storedJson = localStorage.getItem(RECENT_KEY);
    return storedJson ? (JSON.parse(storedJson) as RecentDeck[]) : [];
  } catch {
    return [];
  }
}

export function addRecentDeck(deck: RecentDeck): void {
  const existing = getRecentDecks().filter((entry) => entry.deckId !== deck.deckId);
  existing.unshift({ ...deck, lastOpened: Date.now() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(existing.slice(0, MAX_RECENT_DECKS)));
}

export function removeRecentDeck(deckId: string): void {
  const filtered = getRecentDecks().filter((entry) => entry.deckId !== deckId);
  localStorage.setItem(RECENT_KEY, JSON.stringify(filtered));
}

export function getAuthorName(): string {
  return localStorage.getItem(AUTHOR_KEY) ?? '';
}

export function setAuthorName(name: string): void {
  localStorage.setItem(AUTHOR_KEY, name);
}
