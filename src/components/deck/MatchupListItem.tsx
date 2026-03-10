import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Matchup } from '@/types/deck';
import { sumQuantities } from '@/utils/validation';

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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); onDelete(); }}
        className="btn-icon-danger"
        aria-label={`Delete ${matchup.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
