import type { CardRef } from '@/types/deck';

interface SideboardPlanProps {
  out: CardRef[];
  inCards: CardRef[];
}

export function SideboardPlan({ out, inCards }: SideboardPlanProps) {
  if (out.length === 0 && inCards.length === 0) {
    return null;
  }

  return (
    <div className="sideboard-plan">
      <div className="column">
        <h4 className="out-heading">Out</h4>
        {out.length === 0 ? (
          <p className="none">None</p>
        ) : (
          <ul className="list">
            {out.map((ref) => (
              <li key={ref.name} className="item">
                -{ref.quantity} {ref.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="column">
        <h4 className="in-heading">In</h4>
        {inCards.length === 0 ? (
          <p className="none">None</p>
        ) : (
          <ul className="list">
            {inCards.map((ref) => (
              <li key={ref.name} className="item">
                +{ref.quantity} {ref.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
