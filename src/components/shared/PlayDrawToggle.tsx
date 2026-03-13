interface PlayDrawToggleProps {
  onDraw: boolean;
  onChange: (onDraw: boolean) => void;
}

export function PlayDrawToggle({ onDraw, onChange }: PlayDrawToggleProps) {
  return (
    <div className="play-draw-toggle">
      <button
        className="toggle-btn"
        data-active={!onDraw ? '' : undefined}
        onClick={() => onChange(false)}
      >
        Play
      </button>
      <button
        className="toggle-btn"
        data-active={onDraw ? '' : undefined}
        onClick={() => onChange(true)}
      >
        Draw
      </button>
    </div>
  );
}
