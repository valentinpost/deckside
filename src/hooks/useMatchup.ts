import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { findStaleRefs } from '@/utils/deckDiff';
import { toggleCardRef } from '@/utils/cardRefs';
import type { CardRef, MatchResult } from '@/types/deck';

export function useMatchup(deckId?: string, matchupSlug?: string) {
  const { isLoading, error } = useDeck(deckId);
  const deck = useDeckStore((state) => state.deck);
  const updateMatchupCards = useDeckStore((state) => state.updateMatchupCards);
  const updateMatchupNotes = useDeckStore((state) => state.updateMatchupNotes);
  const addMatchResult = useDeckStore((state) => state.addMatchResult);
  const removeMatchResult = useDeckStore((state) => state.removeMatchResult);
  const matchup = deck?.matchups.find((entry) => entry.slug === matchupSlug);

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
  };
}
