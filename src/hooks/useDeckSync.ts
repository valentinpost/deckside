import { useEffect, useRef, useCallback } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { saveDeckToCloud } from '@/api/cloudflare';

const DEBOUNCE_MS = 2000;

export function useDeckSync() {
  const deck = useDeckStore((s) => s.deck);
  const dirty = useDeckStore((s) => s.dirty);
  const markClean = useDeckStore((s) => s.markClean);
  const setDeck = useDeckStore((s) => s.setDeck);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncingRef = useRef(false);

  const sync = useCallback(async () => {
    const current = useDeckStore.getState().deck;
    if (!current || syncingRef.current) return;

    syncingRef.current = true;
    try {
      const result = await saveDeckToCloud(current);
      if (result.ok) {
        markClean();
      } else if (result.conflict) {
        // Server has a newer version — adopt it
        setDeck(result.conflict);
        console.warn('Sync conflict — adopted server version');
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      syncingRef.current = false;
    }
  }, [markClean, setDeck]);

  useEffect(() => {
    if (!dirty || !deck) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sync();
    }, DEBOUNCE_MS);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [dirty, deck, sync]);
}
