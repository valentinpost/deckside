import { useSyncExternalStore, useCallback } from 'react';
import { getRecentDecks, removeRecentDeck } from '@/db/localstorage';
import type { RecentDeck } from '@/types/deck';

let listeners: Array<() => void> = [];
let snapshot: RecentDeck[] = getRecentDecks();

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return snapshot;
}

/** Call after any write to localStorage recents */
export function notifyRecentDecksChanged() {
  snapshot = getRecentDecks();
  listeners.forEach((l) => l());
}

export function useRecentDecks() {
  const recents = useSyncExternalStore(subscribe, getSnapshot);

  const remove = useCallback((deckId: string) => {
    removeRecentDeck(deckId);
    notifyRecentDecksChanged();
  }, []);

  return { recents, remove };
}
