# Deckside

A sideboard guide builder for Magic: The Gathering. Import decks from Moxfield, create matchup-specific sideboard plans (cards in/out), track match results, and sync across devices via Cloudflare KV.

## Tech Stack

- **React 18** + **TypeScript** — UI and type safety
- **Vite** — build tool and dev server
- **Zustand** — lightweight state management (single store, no providers)
- **React Query** — async data fetching with caching
- **IndexedDB** (via `idb`) — local offline cache for decks
- **Cloudflare Workers + KV** — cloud sync and Moxfield API proxy
- **SCSS** — component-scoped styles with BEM-ish naming
- **Vitest** + **React Testing Library** — unit and component tests

## Data Flow

### Loading a Deck

`useDeck` loads deck data through a multi-source fallback chain:

1. **Zustand store** — if the deck is already loaded in-memory, return immediately
2. **IndexedDB** — check local cache
3. **Cloudflare KV** — check cloud storage
4. Pick whichever (local or remote) has the higher `version` number
5. **Moxfield** — if neither exists, fetch fresh from Moxfield API

Once loaded, the deck is placed in the Zustand store, which becomes the authoritative source for all UI reads.

### Saving Changes

All mutations go through the Zustand store (`deckStore.ts`). Each mutation:

1. Updates state immutably
2. Increments the `version` counter
3. Persists to IndexedDB immediately
4. Sets a `dirty` flag

The `useDeckSync` hook watches the dirty flag and debounces a cloud save (2 seconds). On conflict (server has a newer version), the server's version wins.

### Key Concept: `withUpdatedMatchup`

Most store mutations target a single matchup within the deck. The `withUpdatedMatchup` helper centralizes the pattern of mapping over matchups, applying an update to one, and bumping the version — eliminating repetition across 5 different actions.

## Core Types (`src/types/deck.ts`)

| Type           | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `Card`         | A deck card with name, image, quantity, mana cost           |
| `CardRef`      | A name + quantity reference (used in sideboard plans)       |
| `MatchResult`  | A single BO3 match result with score and play/draw info     |
| `Matchup`      | A named matchup with cards out/in, notes, and match results |
| `HistoryEntry` | A snapshot of all matchups at a point in time (for undo)    |
| `StoredDeck`   | The complete deck: cards, matchups, history, version        |
| `RecentDeck`   | Minimal deck info for the recent decks list                 |

## Routes

| Path                         | Page          | Description                                |
| ---------------------------- | ------------- | ------------------------------------------ |
| `/`                          | `HomePage`    | Enter a Moxfield URL or pick a recent deck |
| `/deck/:deckId`              | `DeckPage`    | View/manage matchups for a deck            |
| `/deck/:deckId/:matchupSlug` | `MatchupPage` | Edit a specific matchup's sideboard plan   |

## Running Locally

```bash
npm install
npm run dev         # Start dev server
npm run build       # Production build
npm run lint        # ESLint

# Tests (on Windows/MINGW, npx vitest may fail — use this instead):
node node_modules/vitest/vitest.mjs run
```

## Project Structure

```
src/
├── api/                    # External service integrations
│   ├── moxfield.ts         #   Moxfield deck fetching & card transformation
│   ├── cloudflare.ts       #   Cloud storage (KV) deck sync
│   └── scryfall.ts         #   Scryfall card image fetching
│
├── components/             # React components (organized by feature)
│   ├── deck/               #   Deck page: header, matchup list, card preview
│   ├── history/            #   Edit history panel with revert support
│   ├── home/               #   Home page: URL form, JSON import, recent decks
│   ├── import/             #   JSON import/export buttons
│   ├── layout/             #   App shell with navigation header
│   ├── matchup/            #   Matchup page: card grids, sideboard plan, results
│   ├── shared/             #   Reusable UI: badges, file picker, error/loading, dialogs
│   └── icons.tsx           #   SVG icon components
│
├── db/                     # Local persistence
│   ├── indexeddb.ts        #   IndexedDB deck cache (get, put, delete)
│   └── localstorage.ts     #   localStorage for recent decks & author name
│
├── hooks/                  # Custom React hooks
│   ├── useDeck.ts          #   Deck loading with multi-source fallback
│   ├── useDeckPage.ts      #   Deck page state & matchup CRUD handlers
│   ├── useDeckSync.ts      #   Debounced cloud sync on dirty flag
│   ├── useHomePage.ts      #   Home page form & navigation logic
│   ├── useMatchup.ts       #   Matchup card selection & result tracking
│   ├── useRecentDecks.ts   #   Recent decks via useSyncExternalStore
│   ├── useRefreshMoxfield.ts # Re-fetch deck cards from Moxfield
│   └── useResizeAnimation.ts # Animated height transitions for desktop
│
├── pages/                  # Route-level page components
│   ├── HomePage.tsx        #   Deck URL input + import + recent decks
│   ├── DeckPage.tsx        #   Matchup management for a loaded deck
│   └── MatchupPage.tsx     #   Card selection and sideboard planning
│
├── store/
│   └── deckStore.ts        #   Zustand store — single source of truth for deck state
│
├── styles/                 #   SCSS organized to mirror component structure
│
├── types/
│   ├── deck.ts             #   Core domain types (Card, Matchup, StoredDeck, etc.)
│   ├── moxfield.ts         #   Moxfield API response shapes
│   └── scryfall.ts         #   Scryfall API response shapes
│
├── utils/                  # Pure utility functions
│   ├── cardRefs.ts         #   Toggle card quantities in/out
│   ├── cardSort.ts         #   Sort cards by mana value, lands last
│   ├── deckDiff.ts         #   Detect card changes & stale references
│   ├── exportImport.ts     #   JSON export/import for decks
│   ├── format.ts           #   Relative timestamp formatting
│   ├── moxfieldUrl.ts      #   Parse & build Moxfield URLs
│   ├── slug.ts             #   URL-safe slug generation
│   ├── validation.ts       #   Card quantity validation, balance checks, swap summaries
│   └── winRate.ts          #   Match/game win rate statistics
│
├── App.tsx                 #   Router setup with 3 routes
├── config.ts               #   API endpoint configuration
├── constants.ts            #   App-wide constants (sync debounce, limits)
└── main.tsx                #   React entry point with QueryClient
```

## Shared Components (`src/components/shared/`)

Reusable UI primitives — use these instead of building one-off equivalents:

| Component         | Props                                    | Description                                                     |
| ----------------- | ---------------------------------------- | --------------------------------------------------------------- |
| `FormatBadge`     | `format?: string`                        | Renders a capitalized format pill (e.g. "Standard"). Null-safe. |
| `WinRateBadge`    | `stats: WinRateStats`, `className?`      | Renders "67% (4W-2L)". Returns null when no matches recorded.   |
| `FilePickerButton`| `accept`, `onSelect`, `label`, `className?` | Hidden file input with label — handles ref and reset.           |
| `ErrorBanner`     | `message`, `onRetry?`                    | Error message with optional retry button.                       |
| `LoadingSpinner`  | `message?`                               | Centered spinner with text.                                     |
| `ConfirmDialog`   | `open`, `title`, `message`, `onConfirm`, `onCancel` | Native `<dialog>` modal with confirm/cancel.           |
| `AuthorNameInput` | `onSet`                                  | Name input form for edit tracking.                              |

Other reusable components outside `shared/`:

| Component            | Location               | Description                                           |
| -------------------- | ---------------------- | ----------------------------------------------------- |
| `InlineRenameInput`  | `components/deck/`     | Self-contained inline text input with submit on Enter/blur, cancel on Escape. |
| `ScoreControls`      | `components/matchup/`  | Play/Draw toggle + BO3 score buttons (2-0, 2-1, 1-2, 0-2). |
| `ResultHistoryList`  | `components/matchup/`  | Sorted match result list with delete buttons.         |

## Complex Logic Reference

| Area                                | File(s)                                                       | What it does                                                                       |
| ----------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Multi-source deck loading           | `hooks/useDeck.ts`                                            | Fallback chain: store → IndexedDB → cloud → Moxfield                               |
| Cloud sync with conflict resolution | `hooks/useDeckSync.ts`, `api/cloudflare.ts`                   | Debounced PUT with version-based conflict detection                                |
| Image URL migration                 | `hooks/useDeck.ts` (`applyImageMigration`)                    | Rebuilds Scryfall image URLs for old cached data missing them                      |
| Edit history & revert               | `store/deckStore.ts` (snapshot/revert), `components/history/` | Snapshots matchups before destructive changes; revert creates a new snapshot first |
| Card selection toggle               | `utils/cardRefs.ts`, `hooks/useMatchup.ts`                    | Cycles quantity 0 → 1 → ... → max → 0; local state syncs to store on each toggle   |
| Stale card detection                | `utils/deckDiff.ts`                                           | Finds matchup card refs that no longer exist in the deck after a Moxfield refresh  |
| Animated sideboard summary          | `hooks/useResizeAnimation.ts`                                 | ResizeObserver-based height animation on desktop; natural flow on mobile           |
| Recent decks (external store)       | `hooks/useRecentDecks.ts`, `db/localstorage.ts`               | `useSyncExternalStore` bridges localStorage writes to React re-renders             |
