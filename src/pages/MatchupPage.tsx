import { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDeck } from '@/hooks/useDeck';
import { useDeckStore } from '@/store/deckStore';
import { findStaleRefs } from '@/utils/deckDiff';
import { CardGrid } from '@/components/matchup/CardGrid';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { StaleCardBanner } from '@/components/matchup/StaleCardBanner';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import type { CardRef } from '@/types/deck';

export function MatchupPage() {
  const { deckId, matchupSlug } = useParams<{ deckId: string; matchupSlug: string }>();
  const { isLoading, error } = useDeck(deckId);
  const deck = useDeckStore((s) => s.deck);
  const updateMatchupCards = useDeckStore((s) => s.updateMatchupCards);
  const updateMatchupNotes = useDeckStore((s) => s.updateMatchupNotes);
  const matchup = deck?.matchups.find((m) => m.slug === matchupSlug);

  // Local state for in-progress edits
  const [outRefs, setOutRefs] = useState<CardRef[]>([]);
  const [inRefs, setInRefs] = useState<CardRef[]>([]);
  const [notes, setNotes] = useState('');

  // Sync local state from store
  useEffect(() => {
    if (matchup) {
      setOutRefs(matchup.out);
      setInRefs(matchup.in);
      setNotes(matchup.notes);
    }
  }, [matchup?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOutToggle = useCallback((name: string, qty: number) => {
    setOutRefs((prev) => {
      const next = qty === 0
        ? prev.filter((r) => r.name !== name)
        : prev.some((r) => r.name === name)
          ? prev.map((r) => (r.name === name ? { ...r, quantity: qty } : r))
          : [...prev, { name, quantity: qty }];
      if (matchup) updateMatchupCards(matchup.id, next, inRefs);
      return next;
    });
  }, [matchup, inRefs, updateMatchupCards]);

  const handleInToggle = useCallback((name: string, qty: number) => {
    setInRefs((prev) => {
      const next = qty === 0
        ? prev.filter((r) => r.name !== name)
        : prev.some((r) => r.name === name)
          ? prev.map((r) => (r.name === name ? { ...r, quantity: qty } : r))
          : [...prev, { name, quantity: qty }];
      if (matchup) updateMatchupCards(matchup.id, outRefs, next);
      return next;
    });
  }, [matchup, outRefs, updateMatchupCards]);

  const handleNotesBlur = useCallback(() => {
    if (matchup) updateMatchupNotes(matchup.id, notes);
  }, [matchup, notes, updateMatchupNotes]);

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;
  if (!matchup) {
    return (
      <div className="space-y-4">
        <ErrorBanner message={`Matchup "${matchupSlug}" not found`} />
        <Link to={`/deck/${deckId}`} className="text-blue-400 hover:text-blue-300 text-sm">
          Back to deck
        </Link>
      </div>
    );
  }

  const staleMap = useMemo(
    () => findStaleRefs(deck.matchups, deck.mainboard, deck.sideboard),
    [deck.matchups, deck.mainboard, deck.sideboard],
  );
  const staleCards = staleMap.get(matchup.id) ?? [];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <Link to={`/deck/${deckId}`} className="text-blue-400 hover:text-blue-300 text-sm">
          &larr; Back to deck
        </Link>
        <h1 className="text-2xl font-bold mt-2">{matchup.name}</h1>
      </div>

      <StaleCardBanner staleCards={staleCards} />

      {/* Summary */}
      <SideboardPlan out={outRefs} inCards={inRefs} />

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="matchup-notes" className="block text-sm font-medium text-slate-400">
          Notes
        </label>
        <textarea
          id="matchup-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Strategy notes for this matchup..."
          rows={3}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      {/* Out — tap mainboard cards to remove */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-red-400">
          Tap mainboard cards to take OUT
        </h3>
        <CardGrid
          cards={deck.mainboard}
          selectedRefs={outRefs}
          mode="out"
          onToggle={handleOutToggle}
        />
      </div>

      {/* In — tap sideboard cards to add */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-green-400">
          Tap sideboard cards to bring IN
        </h3>
        <CardGrid
          cards={deck.sideboard}
          selectedRefs={inRefs}
          mode="in"
          onToggle={handleInToggle}
        />
      </div>

      <InOutCounter out={outRefs} inCards={inRefs} />
    </div>
  );
}
