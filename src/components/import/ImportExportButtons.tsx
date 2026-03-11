import type { StoredDeck } from '@/types/deck';
import { exportDeckToJson, importDeckFromJson } from '@/utils/exportImport';
import { FilePickerButton } from '@/components/shared/FilePickerButton';

interface ImportExportButtonsProps {
  deck: StoredDeck;
  onImport: (deck: StoredDeck) => void;
}

export function ImportExportButtons({ deck, onImport }: ImportExportButtonsProps) {
  async function handleFileSelected(file: File) {
    try {
      const imported = await importDeckFromJson(file);
      onImport(imported);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import file');
    }
  }

  return (
    <div className="import-export-buttons">
      <button onClick={() => exportDeckToJson(deck)} className="btn-secondary">
        Export JSON
      </button>
      <FilePickerButton
        accept=".json"
        onSelect={handleFileSelected}
        label="Import JSON"
        className="import-label"
      />
    </div>
  );
}
