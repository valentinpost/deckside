import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseMoxfieldUrl } from '@/utils/moxfieldUrl';
import { importDeckFromJson } from '@/utils/exportImport';
import { cacheDeck } from '@/db/indexeddb';
import { addRecentDeck } from '@/db/localstorage';
import { useRecentDecks, notifyRecentDecksChanged } from '@/hooks/useRecentDecks';

export function useHomePage() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { recents, remove } = useRecentDecks();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const deckId = parseMoxfieldUrl(url);
    if (!deckId) {
      setError('Please enter a valid Moxfield deck URL');
      return;
    }
    navigate(`/deck/${deckId}`);
  }

  async function handleImport(file: File) {
    try {
      const deck = await importDeckFromJson(file);
      await cacheDeck(deck);
      addRecentDeck({ deckId: deck.deckId, deckName: deck.deckName, format: deck.format, lastOpened: Date.now() });
      notifyRecentDecksChanged();
      navigate(`/deck/${deck.deckId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file');
    }
  }

  function handleUrlChange(value: string) {
    setUrl(value);
    setError('');
  }

  return { url, error, recents, remove, handleUrlChange, handleSubmit, handleImport };
}
