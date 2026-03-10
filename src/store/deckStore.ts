import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { StoredDeck, Matchup, CardRef, HistoryEntry } from '@/types/deck';
import { toSlug } from '@/utils/slug';
import { cacheDeck } from '@/db/indexeddb';
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
  refreshFromMoxfield: (mainboard: StoredDeck['mainboard'], sideboard: StoredDeck['sideboard']) => void;
  markClean: () => void;
}

function persistDeck(deck: StoredDeck) {
  cacheDeck(deck).catch(console.error);
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
      };
      const deck = {
        ...state.deck,
        matchups: [...state.deck.matchups, matchup],
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  removeMatchup: (matchupId) =>
    set((state) => {
      if (!state.deck) return state;
      const deck = {
        ...state.deck,
        matchups: state.deck.matchups.filter((m) => m.id !== matchupId),
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  updateMatchupCards: (matchupId, out, inCards) =>
    set((state) => {
      if (!state.deck) return state;
      const deck = {
        ...state.deck,
        matchups: state.deck.matchups.map((m) =>
          m.id === matchupId ? { ...m, out, in: inCards } : m,
        ),
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  updateMatchupNotes: (matchupId, notes) =>
    set((state) => {
      if (!state.deck) return state;
      const deck = {
        ...state.deck,
        matchups: state.deck.matchups.map((m) =>
          m.id === matchupId ? { ...m, notes } : m,
        ),
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  renameMatchup: (matchupId, name) =>
    set((state) => {
      if (!state.deck) return state;
      const deck = {
        ...state.deck,
        matchups: state.deck.matchups.map((m) =>
          m.id === matchupId ? { ...m, name, slug: toSlug(name) } : m,
        ),
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
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
      const history = [entry, ...state.deck.history].slice(0, HISTORY_CAP);
      const deck = { ...state.deck, history, version: state.deck.version + 1 };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  revertToHistory: (entryId, author) => {
    const state = get();
    if (!state.deck) return;
    const entry = state.deck.history.find((h) => h.id === entryId);
    if (!entry) return;

    // Snapshot current state before reverting
    get().snapshotHistory(author, `Reverted to: ${entry.action}`);

    set((s) => {
      if (!s.deck) return s;
      const deck = {
        ...s.deck,
        matchups: structuredClone(entry.matchups),
        version: s.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    });
  },

  refreshFromMoxfield: (mainboard, sideboard) =>
    set((state) => {
      if (!state.deck) return state;
      const deck = {
        ...state.deck,
        mainboard,
        sideboard,
        lastFetchedFromMoxfield: Date.now(),
        version: state.deck.version + 1,
      };
      persistDeck(deck);
      return { deck, dirty: true };
    }),

  markClean: () => set({ dirty: false }),
}));
