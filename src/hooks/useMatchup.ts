import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { findStaleRefs } from '@/utils/deckDiff';
import { toggleCardRef } from '@/utils/cardRefs';
import type { CardRef } from '@/types/deck';

export function useMatchup(deckId?: string, matchupSlug?: string) {
  const { isLoading, error } = useDeck(deckId);
  const deck = useDeckStore((s) => s.deck);
  const updateMatchupCards = useDeckStore((s) => s.updateMatchupCards);
  const updateMatchupNotes = useDeckStore((s) => s.updateMatchupNotes);
  const matchup = deck?.matchups.find((m) => m.slug === matchupSlug);

  const [outRefs, setOutRefs] = useState<CardRef[]>([]);
  const [inRefs, setInRefs] = useState<CardRef[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (matchup) {
      setOutRefs(matchup.out);
      setInRefs(matchup.in);
      setNotes(matchup.notes);
    }
  }, [matchup?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOutToggle = useCallback((name: string, qty: number) => {
    setOutRefs((prev) => {
      const next = toggleCardRef(prev, name, qty);
      if (matchup) updateMatchupCards(matchup.id, next, inRefs);
      return next;
    });
  }, [matchup, inRefs, updateMatchupCards]);

  const handleInToggle = useCallback((name: string, qty: number) => {
    setInRefs((prev) => {
      const next = toggleCardRef(prev, name, qty);
      if (matchup) updateMatchupCards(matchup.id, outRefs, next);
      return next;
    });
  }, [matchup, outRefs, updateMatchupCards]);

  const handleNotesBlur = useCallback(() => {
    if (matchup) updateMatchupNotes(matchup.id, notes);
  }, [matchup, notes, updateMatchupNotes]);

  const staleMap = useMemo(
    () => deck ? findStaleRefs(deck.matchups, deck.mainboard, deck.sideboard) : new Map(),
    [deck?.matchups, deck?.mainboard, deck?.sideboard],
  );

  const staleCards = matchup ? (staleMap.get(matchup.id) ?? []) : [];

  return {
    isLoading,
    error,
    deck,
    matchup,
    outRefs,
    inRefs,
    notes,
    setNotes,
    staleCards,
    handleOutToggle,
    handleInToggle,
    handleNotesBlur,
  };
}
