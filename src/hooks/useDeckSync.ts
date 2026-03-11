import { useEffect, useRef, useCallback } from 'react';
import { useDeckStore } from '@/store/deckStore';
import { saveDeckToCloud } from '@/api/cloudflare';
import { SYNC_DEBOUNCE_MS } from '@/constants';

export function useDeckSync() {
  const deck = useDeckStore((state) => state.deck);
  const dirty = useDeckStore((state) => state.dirty);
  const markClean = useDeckStore((state) => state.markClean);
  const setDeck = useDeckStore((state) => state.setDeck);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncing = useRef(false);

  const sync = useCallback(async () => {
    const currentDeck = useDeckStore.getState().deck;
    if (!currentDeck || isSyncing.current) return;

    isSyncing.current = true;
    console.log(`[sync] Saving deck v${currentDeck.version} to cloud...`);
    try {
      const result = await saveDeckToCloud(currentDeck);
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
      isSyncing.current = false;
    }
  }, [markClean, setDeck]);

  useEffect(() => {
    if (!dirty || !deck) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      sync();
    }, SYNC_DEBOUNCE_MS);

    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [dirty, deck, sync]);
}
