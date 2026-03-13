import { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useMatchup } from '@/hooks/useMatchup';
import { FormatBadge } from '@/components/shared/FormatBadge';
import { WinRateBadge } from '@/components/shared/WinRateBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CardGrid } from '@/components/matchup/CardGrid';
import { InOutCounter } from '@/components/matchup/InOutCounter';
import { SideboardPlan } from '@/components/matchup/SideboardPlan';
import { StaleCardBanner } from '@/components/matchup/StaleCardBanner';
import { MatchupNotes } from '@/components/matchup/MatchupNotes';
import { MatchResultLogger } from '@/components/matchup/MatchResultLogger';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { calcWinRate } from '@/utils/winRate';
import { toSlug } from '@/utils/slug';
import { PlayDrawToggle } from '@/components/shared/PlayDrawToggle';
import { EditIcon, TrashIcon } from '@/components/icons';

export function MatchupPage() {
  const { deckId, matchupSlug } = useParams<{ deckId: string; matchupSlug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = (location.state as { isNew?: boolean } | null)?.isNew === true;

  const {
    isLoading, error, deck, matchup,
    outRefs, inRefs, notes, setNotes,
    onDraw, setOnDraw,
    staleCards, handleOutToggle, handleInToggle, handleNotesBlur,
    handleAddResult, handleRemoveResult,
    handleRename, handleDelete,
  } = useMatchup(deckId, matchupSlug);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [renameError, setRenameError] = useState('');
  const pendingAutoEdit = useRef(isNew);

  const hasSwaps = outRefs.length > 0 || inRefs.length > 0;

  if (isLoading) return <LoadingSpinner message="Loading deck..." />;
  if (error) return <ErrorBanner message={error.message} />;
  if (!deck) return <ErrorBanner message="Deck not found" />;
  if (!matchup) {
    return (
      <div className="matchup-page-not-found">
        <ErrorBanner message={`Matchup "${matchupSlug}" not found`} />
        <Link to={`/deck/${deckId}`} className="back-link">
          Back to deck
        </Link>
      </div>
    );
  }

  function startEditing() {
    if (!matchup) return;
    const isDefault = /^New Matchup( \d+)?$/.test(matchup.name);
    setEditName(isDefault ? '' : matchup.name);
    setEditing(true);
  }

  function submitRename() {
    const trimmed = editName.trim();
    if (!trimmed || !matchup || trimmed === matchup.name) {
      setRenameError('');
      setEditName('');
      setEditing(false);
      return;
    }
    const newSlug = toSlug(trimmed);
    const duplicate = deck?.matchups.find((m) => m.slug === newSlug && m.id !== matchup.id);
    if (duplicate) {
      setRenameError('A matchup with that name already exists');
      return;
    }
    setRenameError('');
    const slug = handleRename(trimmed);
    if (slug) navigate(`/deck/${deckId}/${slug}`, { replace: true });
    setEditName('');
    setEditing(false);
  }

  function onDelete() {
    handleDelete();
    navigate(`/deck/${deckId}`, { replace: true });
  }

  // Auto-enter edit mode for newly created matchups once data loads
  if (pendingAutoEdit.current && matchup) {
    pendingAutoEdit.current = false;
    setEditing(true);
    setEditName('');
  }

  return (
    <div className="matchup-page">
      <div className="page-header">
        <div className="title-row">
          {editing ? (
            <div className="title-edit">
              <input
                type="text"
                autoFocus
                value={editName}
                placeholder={matchup.name}
                onChange={(e) => { setEditName(e.target.value); setRenameError(''); }}
                onBlur={submitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename();
                  if (e.key === 'Escape') { setRenameError(''); setEditing(false); }
                }}
                className="title-input"
                data-error={renameError ? '' : undefined}
              />
              {renameError && <p className="title-error">{renameError}</p>}
            </div>
          ) : (
            <h1 className="title" onClick={startEditing}>
              {matchup.name}
              <EditIcon size={14} className="title-edit-hint" />
            </h1>
          )}
          <div className="header-actions">
            <button onClick={() => setConfirmingDelete(true)} className="btn-icon-danger" aria-label="Delete matchup">
              <TrashIcon />
            </button>
          </div>
        </div>
        <div className="header-meta">
          <FormatBadge format={deck.format} />
          <WinRateBadge stats={calcWinRate(matchup.results ?? [])} className="header-win-rate" />
        </div>
      </div>

      <StaleCardBanner staleCards={staleCards} />

      <PlayDrawToggle onDraw={onDraw} onChange={setOnDraw} />

      <div className="section">
        <h3 className="out-label">Tap mainboard cards to take OUT</h3>
        <CardGrid cards={deck.mainboard} selectedRefs={outRefs} mode="out" onToggle={handleOutToggle} />
      </div>

      <div className="section">
        <h3 className="in-label">Tap sideboard cards to bring IN</h3>
        <CardGrid cards={deck.sideboard} selectedRefs={inRefs} mode="in" onToggle={handleInToggle} />
      </div>

      <MatchupNotes notes={notes} onChange={setNotes} onBlur={handleNotesBlur} />

      <MatchResultLogger
        results={matchup.results ?? []}
        onAdd={handleAddResult}
        onRemove={handleRemoveResult}
      />

      {hasSwaps && (
        <div className="sideboard-summary">
          <div className="summary-inner">
            <InOutCounter out={outRefs} inCards={inRefs} />
            <SideboardPlan out={outRefs} inCards={inRefs} />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete Matchup"
        message={`Are you sure you want to delete "${matchup.name}"? You can restore it from history.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={onDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
