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
    <div className="max-w-lg mx-auto">
      <label className="rounded-lg border border-dashed border-slate-600 hover:border-slate-500 p-4 flex items-center justify-center text-sm text-slate-400 hover:text-slate-300 transition-colors cursor-pointer">
        Or import a saved sideboard guide (JSON)
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
