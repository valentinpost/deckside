import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Matchup } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';
import { EditIcon, TrashIcon } from '@/components/icons';

interface MatchupListItemProps {
  deckId: string;
  matchup: Matchup;
  onDelete: () => void;
  onRename: (name: string) => void;
}

export function MatchupListItem({ deckId, matchup, onDelete, onRename }: MatchupListItemProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(matchup.name);
  const outCount = sumQuantities(matchup.out);
  const inCount = sumQuantities(matchup.in);
  const balanced = outCount === inCount;

  function handleRenameSubmit() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== matchup.name) {
      onRename(trimmed);
    }
    setEditing(false);
  }

  return (
    <div className="list-item">
      <Link to={`/deck/${deckId}/${matchup.slug}`} className="flex-1 min-w-0">
        {editing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setEditing(false); }}
            onClick={(e) => e.preventDefault()}
            autoFocus
            className="input-inline"
          />
        ) : (
          <>
            <div className="font-medium truncate">{matchup.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {outCount > 0 || inCount > 0 ? (
                <span className={balanced ? 'text-green-400' : 'text-yellow-400'}>
                  -{outCount} / +{inCount}
                </span>
              ) : (
                <span>No swaps configured</span>
              )}
            </div>
          </>
        )}
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); setEditName(matchup.name); setEditing(true); }}
        className="btn-icon-neutral"
        aria-label={`Rename ${matchup.name}`}
      >
        <EditIcon />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); onDelete(); }}
        className="btn-icon-danger"
        aria-label={`Delete ${matchup.name}`}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
