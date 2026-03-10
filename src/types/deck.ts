export interface Card {
  name: string;
  scryfallId: string;
  imageUrl: string;
  quantity: number;
  manaCost?: string;
  typeLine?: string;
}

export interface CardRef {
  name: string;
  quantity: number;
}

export interface Matchup {
  id: string;
  name: string;
  slug: string;
  notes: string;
  out: CardRef[];
  in: CardRef[];
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
  moxfieldUrl: string;
  lastFetchedFromMoxfield: number;
  mainboard: Card[];
  sideboard: Card[];
  matchups: Matchup[];
  history: HistoryEntry[];
  version: number;
}

export interface RecentDeck {
  deckId: string;
  deckName: string;
  lastOpened: number;
}
