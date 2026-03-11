import { useHomePage } from '@/hooks/useHomePage';
import { DeckUrlForm } from '@/components/home/DeckUrlForm';
import { JsonImportButton } from '@/components/home/JsonImportButton';
import { RecentDeckList } from '@/components/home/RecentDeckList';

export function HomePage() {
  const { url, error, recents, remove, handleUrlChange, handleSubmit, handleImport } = useHomePage();

  return (
    <div className="home-page">
      <div className="hero">
        <h1 className="title">Sideboard Guide</h1>
        <p className="subtitle">
          Create matchup-specific sideboard plans for your MTG decks
        </p>
      </div>

      <DeckUrlForm url={url} error={error} onUrlChange={handleUrlChange} onSubmit={handleSubmit} />
      <JsonImportButton onImport={handleImport} />
      <RecentDeckList recents={recents} onRemove={remove} />
    </div>
  );
}
