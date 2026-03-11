interface ScoreOption {
  readonly label: string;
  readonly gamesWon: number;
  readonly gamesLost: number;
}

const SCORES: readonly ScoreOption[] = [
  { label: '2-0', gamesWon: 2, gamesLost: 0 },
  { label: '2-1', gamesWon: 2, gamesLost: 1 },
  { label: '1-2', gamesWon: 1, gamesLost: 2 },
  { label: '0-2', gamesWon: 0, gamesLost: 2 },
];

interface ScoreControlsProps {
  onPlay: boolean | undefined;
  onPlayChange: (value: boolean | undefined) => void;
  onScore: (gamesWon: number, gamesLost: number) => void;
}

export function ScoreControls({ onPlay, onPlayChange, onScore }: ScoreControlsProps) {
  return (
    <div className="controls">
      <div className="play-draw">
        <button
          className={`toggle-btn ${onPlay === true ? 'active' : ''}`}
          onClick={() => onPlayChange(onPlay === true ? undefined : true)}
        >
          Play
        </button>
        <button
          className={`toggle-btn ${onPlay === false ? 'active' : ''}`}
          onClick={() => onPlayChange(onPlay === false ? undefined : false)}
        >
          Draw
        </button>
      </div>

      <div className="score-buttons">
        {SCORES.map((score) => (
          <button
            key={score.label}
            className={`score-btn ${score.gamesWon === 2 ? 'win' : 'loss'}`}
            onClick={() => onScore(score.gamesWon, score.gamesLost)}
          >
            {score.label}
          </button>
        ))}
      </div>
    </div>
  );
}
