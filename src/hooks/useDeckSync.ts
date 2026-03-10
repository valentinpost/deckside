import { useEffect, useRef, useCallback } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { saveDeckToCloud } from '@/api/cloudflare';
import { SYNC_DEBOUNCE_MS } from '@/constants';

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
    console.log(`[sync] Saving deck v${current.version} to cloud...`);
    try {
      const result = await saveDeckToCloud(current);
      if (result.ok) {
        console.log('[sync] Save successful');
        markClean();
      } else if (result.conflict) {
        console.warn(`[sync] Conflict — server has v${result.conflict.version}, adopting`);
        setDeck(result.conflict);
      }
    } catch (err) {
      console.error('[sync] Save failed:', err);
    } finally {
      syncingRef.current = false;
    }
  }, [markClean, setDeck]);

  useEffect(() => {
    if (!dirty || !deck) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sync();
    }, SYNC_DEBOUNCE_MS);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [dirty, deck, sync]);
}
