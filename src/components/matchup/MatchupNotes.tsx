interface MatchupNotesProps {
  notes: string;
  onChange: (notes: string) => void;
  onBlur: () => void;
}

export function MatchupNotes({ notes, onChange, onBlur }: MatchupNotesProps) {
  return (
    <div className="matchup-notes">
      <label htmlFor="matchup-notes" className="label">
        Notes
      </label>
      <textarea
        id="matchup-notes"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder="Strategy notes for this matchup..."
        rows={3}
        className="textarea"
      />
    </div>
  );
}
