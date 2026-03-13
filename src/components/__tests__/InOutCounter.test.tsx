import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InOutCounter } from '../matchup/InOutCounter';

describe('InOutCounter', () => {
  it('returns null when both out and in are empty', () => {
    const { container } = render(<InOutCounter out={[]} inCards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays swap count', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 3 }]} inCards={[{ name: 'B', quantity: 3 }]} />);
    expect(screen.getByText('3 swaps')).toBeInTheDocument();
  });

  it('hides unbalanced indicator when balanced', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 2 }]} inCards={[{ name: 'B', quantity: 2 }]} />);
    expect(screen.queryByText(/out \/ .* in/)).not.toBeInTheDocument();
  });

  it('shows unbalanced indicator when out > in', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 4 }]} inCards={[{ name: 'B', quantity: 1 }]} />);
    expect(screen.getByText('4 out / 1 in')).toBeInTheDocument();
  });

  it('shows unbalanced indicator when in > out', () => {
    render(<InOutCounter out={[{ name: 'A', quantity: 1 }]} inCards={[{ name: 'B', quantity: 3 }]} />);
    expect(screen.getByText('1 out / 3 in')).toBeInTheDocument();
  });

  it('sums multiple card refs', () => {
    render(
      <InOutCounter
        out={[{ name: 'A', quantity: 2 }, { name: 'B', quantity: 1 }]}
        inCards={[{ name: 'C', quantity: 3 }]}
      />,
    );
    expect(screen.getByText('3 swaps')).toBeInTheDocument();
  });
});
