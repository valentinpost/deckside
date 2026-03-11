export type DeckColor = 'slate' | 'rose' | 'amber' | 'emerald' | 'sky' | 'violet';

export interface Card {
  name: string;
  scryfallId: string;
  imageUrl: string;
  quantity: number;
  manaCost?: string;
  typeLine?: string;
  price?: number;
}

export interface CardRef {
  name: string;
  quantity: number;
}

export interface MatchResult {
  id: string;
  timestamp: number;
  won: boolean;
  gamesWon: number;
  gamesLost: number;
  onPlay?: boolean;
}

export interface Matchup {
  id: string;
  name: string;
  slug: string;
  notes: string;
  out: CardRef[];
  in: CardRef[];
  results: MatchResult[];
}

export interface HistoryEntry {
  id: string;
  author: string;
  timestamp: number;
  action: string;
  matchups: Matchup[];
}

export interface StoredDeck {
  deckId: string;
  deckName: string;
  format?: string;
  moxfieldUrl: string;
  lastFetchedFromMoxfield: number;
  mainboard: Card[];
  sideboard: Card[];
  matchups: Matchup[];
  history: HistoryEntry[];
  version: number;
  deckColor?: DeckColor;
  faceCardId?: string;
}

export interface RecentDeck {
  deckId: string;
  deckName: string;
  format?: string;
  lastOpened: number;
  deckColor?: DeckColor;
  faceCardId?: string;
}
