import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseMoxfieldUrl } from '@/utils/moxfieldUrl';
import { importDeckFromJson } from '@/utils/exportImport';
import { cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { useRecentDecks, notifyRecentDecksChanged } from '@/hooks/useRecentDecks';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { recents, remove } = useRecentDecks();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const deckId = parseMoxfieldUrl(url);
    if (!deckId) {
      setError('Please enter a valid Moxfield deck URL');
      return;
    }
    navigate(`/deck/${deckId}`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const deck = await importDeckFromJson(file);
      await cacheDeck(deck);
      addRecentDeck({ deckId: deck.deckId, deckName: deck.deckName, lastOpened: Date.now() });
      notifyRecentDecksChanged();
      navigate(`/deck/${deck.deckId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-8">
        <h1 className="text-3xl font-bold">Sideboard Guide</h1>
        <p className="text-slate-400">
          Create matchup-specific sideboard plans for your MTG decks
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-3">
        <label htmlFor="moxfield-url" className="block text-sm font-medium text-slate-300">
          Moxfield Deck URL
        </label>
        <div className="flex gap-2">
          <input
            id="moxfield-url"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="https://www.moxfield.com/decks/..."
            className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 text-sm font-medium transition-colors"
          >
            Load
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      <div className="max-w-lg mx-auto">
        <label className="rounded-lg border border-dashed border-slate-600 hover:border-slate-500 p-4 flex items-center justify-center text-sm text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
          Or import a saved sideboard guide (JSON)
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-300">Recent Decks</h2>
        {recents.length === 0 ? (
          <p className="text-slate-500 text-sm">No recent decks yet. Paste a Moxfield URL above to get started.</p>
        ) : (
          <div className="space-y-2">
            {recents.map((deck) => (
              <div
                key={deck.deckId}
                className="flex items-center gap-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3 hover:bg-slate-800 transition-colors"
              >
                <Link to={`/deck/${deck.deckId}`} className="flex-1 min-w-0">
                  <div className="font-medium truncate">{deck.deckName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Last opened {new Date(deck.lastOpened).toLocaleDateString()}
                  </div>
                </Link>
                <button
                  onClick={() => remove(deck.deckId)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  aria-label={`Remove ${deck.deckName}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
