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
    <dialog ref={dialogRef} onClose={onClose} className="add-matchup-dialog">
      <form onSubmit={handleSubmit} className="body">
        <h2 className="title">Add Matchup</h2>
        <div className="field-group">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder='e.g., "vs Burn"'
            className="input"
          />
          {error && <p className="error">{error}</p>}
        </div>
        <div className="actions">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
