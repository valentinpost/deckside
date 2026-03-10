export const WORKER_BASE = '';

export const API = {
  deck: (deckId: string) => `${WORKER_BASE}/api/deck/${deckId}`,
  moxfield: (deckId: string) => `${WORKER_BASE}/api/moxfield/${deckId}`,
} as const;
