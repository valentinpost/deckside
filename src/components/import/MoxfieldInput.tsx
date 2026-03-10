import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseMoxfieldUrl } from '@/utils/moxfieldUrl';

export function MoxfieldInput() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const deckId = parseMoxfieldUrl(url);
    if (!deckId) {
      setError('Please enter a valid Moxfield deck URL');
      return;
    }
    navigate(`/deck/${deckId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
  );
}
