import { useState, useEffect, useRef } from 'react';
import { toSlug } from '@/utils/slug';

interface AddMatchupDialogProps {
  open: boolean;
  onAdd: (name: string) => void;
  onClose: () => void;
  existingSlugs: string[];
}

export function AddMatchupDialog({ open, onAdd, onClose, existingSlugs }: AddMatchupDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    if (existingSlugs.includes(toSlug(trimmed))) {
      setError('A matchup with a similar name already exists');
      return;
    }
    onAdd(trimmed);
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-slate-800 text-slate-100 rounded-xl p-0 max-w-sm w-full backdrop:bg-black/60"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add Matchup</h2>
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder='e.g., "vs Burn"'
            className="w-full rounded-lg bg-slate-900 border border-slate-600 px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
