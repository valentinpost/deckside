import type { RecentDeck } from '@/types/deck';
import { MAX_RECENT_DECKS } from '@/constants';

const RECENT_KEY = 'sideboard-recent-decks';
const AUTHOR_KEY = 'sideboard-author';

export function getRecentDecks(): RecentDeck[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as RecentDeck[]) : [];
  } catch {
    return [];
  }
}

export function addRecentDeck(deck: RecentDeck): void {
  const recents = getRecentDecks().filter((d) => d.deckId !== deck.deckId);
  recents.unshift({ ...deck, lastOpened: Date.now() });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, MAX_RECENT_DECKS)));
}

export function removeRecentDeck(deckId: string): void {
  const recents = getRecentDecks().filter((d) => d.deckId !== deckId);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
}

export function getAuthorName(): string {
  return localStorage.getItem(AUTHOR_KEY) ?? '';
}

export function setAuthorName(name: string): void {
  localStorage.setItem(AUTHOR_KEY, name);
}
