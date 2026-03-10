import { useRef } from 'react';
import type { StoredDeck } from '@/types/deck';
import { exportDeckToJson, importDeckFromJson } from '@/utils/exportImport';

interface ImportExportButtonsProps {
  deck: StoredDeck;
  onImport: (deck: StoredDeck) => void;
}

export function ImportExportButtons({ deck, onImport }: ImportExportButtonsProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importDeckFromJson(file);
      onImport(imported);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import file');
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => exportDeckToJson(deck)} className="btn-secondary">
        Export JSON
      </button>
      <label className="btn-secondary cursor-pointer">
        Import JSON
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
