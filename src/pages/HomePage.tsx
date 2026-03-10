import { useHomePage } from '@/hooks/useHomePage';
import { DeckUrlForm } from '@/components/home/DeckUrlForm';
import { JsonImportButton } from '@/components/home/JsonImportButton';
import { RecentDeckList } from '@/components/home/RecentDeckList';

export function HomePage() {
  const { url, error, recents, remove, handleUrlChange, handleSubmit, handleImport } = useHomePage();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 pt-8">
        <h1 className="text-3xl font-bold">Sideboard Guide</h1>
        <p className="text-slate-400">
          Create matchup-specific sideboard plans for your MTG decks
        </p>
      </div>

      <DeckUrlForm url={url} error={error} onUrlChange={handleUrlChange} onSubmit={handleSubmit} />
      <JsonImportButton onImport={handleImport} />
      <RecentDeckList recents={recents} onRemove={remove} />
    </div>
  );
}
