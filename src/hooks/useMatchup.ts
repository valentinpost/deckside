import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { getAuthorName } from '@/db/localstorage';
import { findStaleRefs } from '@/utils/deckDiff';
import { toggleCardRef } from '@/utils/cardRefs';
import { toSlug } from '@/utils/slug';
import type { CardRef, MatchResult } from '@/types/deck';

export function useMatchup(deckId?: string, matchupSlug?: string) {
  const { isLoading, error } = useDeck(deckId);
  const deck = useDeckStore((state) => state.deck);
  const updateMatchupCards = useDeckStore((state) => state.updateMatchupCards);
  const updateMatchupNotes = useDeckStore((state) => state.updateMatchupNotes);
  const addMatchResult = useDeckStore((state) => state.addMatchResult);
  const removeMatchResult = useDeckStore((state) => state.removeMatchResult);
  const renameMatchup = useDeckStore((state) => state.renameMatchup);
  const removeMatchup = useDeckStore((state) => state.removeMatchup);
  const snapshotHistory = useDeckStore((state) => state.snapshotHistory);
  // Track by ID once found so a slug rename doesn't briefly lose the reference.
  // Reset when the slug param changes (navigation to a different matchup).
  const matchupIdRef = useRef<string | null>(null);
  const prevSlugRef = useRef(matchupSlug);
  if (prevSlugRef.current !== matchupSlug) {
    prevSlugRef.current = matchupSlug;
    matchupIdRef.current = null;
  }
  const matchupBySlug = deck?.matchups.find((entry) => entry.slug === matchupSlug);
  if (matchupBySlug) matchupIdRef.current = matchupBySlug.id;
  const matchup = matchupBySlug ?? deck?.matchups.find((entry) => entry.id === matchupIdRef.current);

  const [outRefs, setOutRefs] = useState<CardRef[]>([]);
  const [inRefs, setInRefs] = useState<CardRef[]>([]);
  const [outDrawRefs, setOutDrawRefs] = useState<CardRef[]>([]);
  const [inDrawRefs, setInDrawRefs] = useState<CardRef[]>([]);
  const [notes, setNotes] = useState('');
  const [onDraw, setOnDraw] = useState(false);

  useEffect(() => {
    if (matchup) {
      setOutRefs(matchup.out);
      setInRefs(matchup.in);
      setOutDrawRefs(matchup.outOnDraw ?? matchup.out);
      setInDrawRefs(matchup.inOnDraw ?? matchup.in);
      setNotes(matchup.notes);
      setOnDraw(false);
    }
  }, [matchup?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeOut = onDraw ? outDrawRefs : outRefs;
  const activeIn = onDraw ? inDrawRefs : inRefs;
  const hasDrawPlan = matchup?.outOnDraw !== undefined || matchup?.inOnDraw !== undefined;

  const handleOutToggle = useCallback((name: string, qty: number) => {
    const setter = onDraw ? setOutDrawRefs : setOutRefs;
    const currentIn = onDraw ? inDrawRefs : inRefs;
    setter((prev) => {
      const next = toggleCardRef(prev, name, qty);
      if (matchup) updateMatchupCards(matchup.id, next, currentIn, onDraw ? true : undefined);
      return next;
    });
  }, [matchup, onDraw, inRefs, inDrawRefs, updateMatchupCards]);

  const handleInToggle = useCallback((name: string, qty: number) => {
    const setter = onDraw ? setInDrawRefs : setInRefs;
    const currentOut = onDraw ? outDrawRefs : outRefs;
    setter((prev) => {
      const next = toggleCardRef(prev, name, qty);
      if (matchup) updateMatchupCards(matchup.id, currentOut, next, onDraw ? true : undefined);
      return next;
    });
  }, [matchup, onDraw, outRefs, outDrawRefs, updateMatchupCards]);

  const handleNotesBlur = useCallback(() => {
    if (matchup) updateMatchupNotes(matchup.id, notes);
  }, [matchup, notes, updateMatchupNotes]);

  const handleAddResult = useCallback(
    (result: Omit<MatchResult, 'id' | 'timestamp'>) => {
      if (matchup) addMatchResult(matchup.id, result);
    },
    [matchup, addMatchResult],
  );

  const handleRemoveResult = useCallback(
    (resultId: string) => {
      if (matchup) removeMatchResult(matchup.id, resultId);
    },
    [matchup, removeMatchResult],
  );

  const handleRename = useCallback(
    (name: string): string | undefined => {
      if (!matchup) return undefined;
      const author = getAuthorName();
      if (author) snapshotHistory(author, `Renamed matchup: ${matchup.name} -> ${name}`);
      renameMatchup(matchup.id, name);
      return toSlug(name);
    },
    [matchup, renameMatchup, snapshotHistory],
  );

  const handleDelete = useCallback(() => {
    if (!matchup) return;
    const author = getAuthorName();
    if (author) snapshotHistory(author, `Deleted matchup: ${matchup.name}`);
    removeMatchup(matchup.id);
  }, [matchup, removeMatchup, snapshotHistory]);

  const staleCardsByMatchup = useMemo(
    () => deck ? findStaleRefs(deck.matchups, deck.mainboard, deck.sideboard) : new Map(),
    [deck?.matchups, deck?.mainboard, deck?.sideboard],
  );

  const staleCards = matchup ? (staleCardsByMatchup.get(matchup.id) ?? []) : [];

  return {
    isLoading,
    error,
    deck,
    matchup,
    outRefs: activeOut,
    inRefs: activeIn,
    notes,
    setNotes,
    onDraw,
    setOnDraw,
    hasDrawPlan,
    staleCards,
    handleOutToggle,
    handleInToggle,
    handleNotesBlur,
    handleAddResult,
    handleRemoveResult,
    handleRename,
    handleDelete,
  };
}
