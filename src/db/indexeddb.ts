import { openDB, type IDBPDatabase } from 'idb';
import type { StoredDeck } from '@/types/deck';

const DB_NAME = 'sideboard-guide';
const DB_VERSION = 1;

interface SideboardDB {
  decks: { key: string; value: StoredDeck };
}

let dbPromise: Promise<IDBPDatabase<SideboardDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<SideboardDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('decks')) {
          db.createObjectStore('decks', { keyPath: 'deckId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getCachedDeck(deckId: string): Promise<StoredDeck | undefined> {
  const db = await getDB();
  return db.get('decks', deckId);
}

export async function cacheDeck(deck: StoredDeck): Promise<void> {
  const db = await getDB();
  await db.put('decks', deck);
}

export async function deleteCachedDeck(deckId: string): Promise<void> {
  const db = await getDB();
  await db.delete('decks', deckId);
}
