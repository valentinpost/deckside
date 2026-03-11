import { useState, useRef, useEffect } from 'react';
import { toSlug } from '@/utils/slug';

interface AddMatchupInlineProps {
  onAdd: (name: string) => void;
  onCancel: () => void;
  existingSlugs: string[];
}

export function AddMatchupInline({ onAdd, onCancel, existingSlugs }: AddMatchupInlineProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit() {
    if (doneRef.current) return;
    const trimmed = name.trim();
    if (!trimmed) {
      doneRef.current = true;
      onCancel();
      return;
    }
    if (existingSlugs.includes(toSlug(trimmed))) {
      setError('A matchup with a similar name already exists');
      return;
    }
    doneRef.current = true;
    onAdd(trimmed);
  }

  function handleCancel() {
    if (doneRef.current) return;
    doneRef.current = true;
    onCancel();
  }

  return (
    <div className="add-matchup-inline">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(''); }}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
          if (e.key === 'Escape') handleCancel();
        }}
        placeholder='e.g., "vs Burn"'
        className="input"
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
