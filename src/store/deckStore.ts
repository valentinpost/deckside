import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { StoredDeck, Matchup, MatchResult, CardRef, HistoryEntry, DeckColor } from '@/types/deck';
import { toSlug } from '@/utils/slug';
import { cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { notifyRecentDecksChanged } from '@/hooks/useRecentDecks';
import { HISTORY_CAP } from '@/constants';

interface DeckState {
  deck: StoredDeck | null;
  dirty: boolean;
  setDeck: (deck: StoredDeck) => void;
  addMatchup: (name: string) => void;
  removeMatchup: (matchupId: string) => void;
  updateMatchupCards: (matchupId: string, out: CardRef[], inCards: CardRef[]) => void;
  updateMatchupNotes: (matchupId: string, notes: string) => void;
  renameMatchup: (matchupId: string, name: string) => void;
  snapshotHistory: (author: string, action: string) => void;
  revertToHistory: (entryId: string, author: string) => void;
  addMatchResult: (matchupId: string, result: Omit<MatchResult, 'id' | 'timestamp'>) => void;
  removeMatchResult: (matchupId: string, resultId: string) => void;
  setDeckColor: (color: DeckColor) => void;
  setFaceCard: (scryfallId: string | undefined) => void;
  refreshFromMoxfield: (mainboard: StoredDeck['mainboard'], sideboard: StoredDeck['sideboard'], format?: string) => void;
  markClean: () => void;
}

function persistDeck(deck: StoredDeck) {
  cacheDeck(deck).catch(console.error);
}

function updateRecentEntry(deck: StoredDeck) {
  addRecentDeck({
    deckId: deck.deckId,
    deckName: deck.deckName,
    format: deck.format,
    lastOpened: Date.now(),
    deckColor: deck.deckColor,
    faceCardId: deck.faceCardId,
  });
  notifyRecentDecksChanged();
}

/** Create an updated deck with a single matchup modified by the updater function */
function withUpdatedMatchup(
  deck: StoredDeck,
  matchupId: string,
  updater: (matchup: Matchup) => Matchup,
): StoredDeck {
  return {
    ...deck,
    matchups: deck.matchups.map((matchup) =>
      matchup.id === matchupId ? updater(matchup) : matchup,
    ),
    version: deck.version + 1,
  };
}

export const useDeckStore = create<DeckState>((set, get) => ({
  deck: null,
  dirty: false,

  setDeck: (deck) => set({ deck, dirty: false }),

  addMatchup: (name) =>
    set((state) => {
      if (!state.deck) return state;
      const matchup: Matchup = {
        id: nanoid(),
        name,
        slug: toSlug(name),
        notes: '',
        out: [],
        in: [],
        results: [],
      };
      const updatedDeck = {
        ...state.deck,
        matchups: [...state.deck.matchups, matchup],
        version: state.deck.version + 1,
      };
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  removeMatchup: (matchupId) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = {
        ...state.deck,
        matchups: state.deck.matchups.filter((matchup) => matchup.id !== matchupId),
        version: state.deck.version + 1,
      };
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  updateMatchupCards: (matchupId, out, inCards) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = withUpdatedMatchup(state.deck, matchupId, (matchup) => ({
        ...matchup, out, in: inCards,
      }));
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  updateMatchupNotes: (matchupId, notes) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = withUpdatedMatchup(state.deck, matchupId, (matchup) => ({
        ...matchup, notes,
      }));
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  renameMatchup: (matchupId, name) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = withUpdatedMatchup(state.deck, matchupId, (matchup) => ({
        ...matchup, name, slug: toSlug(name),
      }));
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  snapshotHistory: (author, action) =>
    set((state) => {
      if (!state.deck) return state;
      const entry: HistoryEntry = {
        id: nanoid(),
        author,
        timestamp: Date.now(),
        action,
        matchups: structuredClone(state.deck.matchups),
      };
      const trimmedHistory = [entry, ...state.deck.history].slice(0, HISTORY_CAP);
      const updatedDeck = { ...state.deck, history: trimmedHistory, version: state.deck.version + 1 };
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  revertToHistory: (entryId, author) => {
    const state = get();
    if (!state.deck) return;
    const entry = state.deck.history.find((historyEntry) => historyEntry.id === entryId);
    if (!entry) return;

    // Snapshot current state before reverting
    get().snapshotHistory(author, `Reverted to: ${entry.action}`);

    set((currentState) => {
      if (!currentState.deck) return currentState;
      const updatedDeck = {
        ...currentState.deck,
        matchups: structuredClone(entry.matchups),
        version: currentState.deck.version + 1,
      };
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    });
  },

  addMatchResult: (matchupId, partialResult) =>
    set((state) => {
      if (!state.deck) return state;
      const result: MatchResult = {
        ...partialResult,
        id: nanoid(),
        timestamp: Date.now(),
      };
      const updatedDeck = withUpdatedMatchup(state.deck, matchupId, (matchup) => ({
        ...matchup, results: [...(matchup.results ?? []), result],
      }));
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  removeMatchResult: (matchupId, resultId) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = withUpdatedMatchup(state.deck, matchupId, (matchup) => ({
        ...matchup, results: (matchup.results ?? []).filter((result) => result.id !== resultId),
      }));
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  setDeckColor: (color) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = { ...state.deck, deckColor: color, version: state.deck.version + 1 };
      persistDeck(updatedDeck);
      updateRecentEntry(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  setFaceCard: (scryfallId) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = { ...state.deck, faceCardId: scryfallId, version: state.deck.version + 1 };
      persistDeck(updatedDeck);
      updateRecentEntry(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  refreshFromMoxfield: (mainboard, sideboard, format) =>
    set((state) => {
      if (!state.deck) return state;
      const updatedDeck = {
        ...state.deck,
        mainboard,
        sideboard,
        format: format ?? state.deck.format,
        lastFetchedFromMoxfield: Date.now(),
        version: state.deck.version + 1,
      };
      persistDeck(updatedDeck);
      return { deck: updatedDeck, dirty: true };
    }),

  markClean: () => set({ dirty: false }),
}));
