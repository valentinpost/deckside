import { useRef } from 'react';

interface JsonImportButtonProps {
  onImport: (file: File) => void;
}

export function JsonImportButton({ onImport }: JsonImportButtonProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImport(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="json-import-button">
      <label className="label">
        Or import a saved deck (JSON)
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
