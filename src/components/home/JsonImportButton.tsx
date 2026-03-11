import { FilePickerButton } from '@/components/shared/FilePickerButton';

interface JsonImportButtonProps {
  onImport: (file: File) => void;
}

export function JsonImportButton({ onImport }: JsonImportButtonProps) {
  return (
    <div className="json-import-button">
      <FilePickerButton
        accept=".json"
        onSelect={onImport}
        label="Or import a saved deck (JSON)"
        className="label"
      />
    </div>
  );
}
