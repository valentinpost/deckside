import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchResultLogger } from '../matchup/MatchResultLogger';
import type { MatchResult } from '@/types/deck';

function result(won: boolean, gamesWon: number, gamesLost: number, extra?: Partial<MatchResult>): MatchResult {
  return {
    id: String(Math.random()),
    timestamp: Date.now() - Math.random() * 100000,
    won,
    gamesWon,
    gamesLost,
    ...extra,
  };
}

describe('MatchResultLogger', () => {
  it('renders score buttons', () => {
    render(<MatchResultLogger results={[]} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('2-0')).toBeInTheDocument();
    expect(screen.getByText('2-1')).toBeInTheDocument();
    expect(screen.getByText('1-2')).toBeInTheDocument();
    expect(screen.getByText('0-2')).toBeInTheDocument();
  });

  it('calls onAdd with correct data when clicking a win button', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('2-1'));

    expect(onAdd).toHaveBeenCalledWith({
      won: true,
      gamesWon: 2,
      gamesLost: 1,
      onPlay: undefined,
    });
  });

  it('calls onAdd with correct data when clicking a loss button', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('0-2'));

    expect(onAdd).toHaveBeenCalledWith({
      won: false,
      gamesWon: 0,
      gamesLost: 2,
      onPlay: undefined,
    });
  });

  it('includes onPlay when play toggle is active', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('Play'));
    await user.click(screen.getByText('2-0'));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ onPlay: true }),
    );
  });

  it('includes onPlay=false when draw toggle is active', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('Draw'));
    await user.click(screen.getByText('2-0'));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ onPlay: false }),
    );
  });

  it('resets onPlay after logging a result', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('Play'));
    await user.click(screen.getByText('2-0'));

    // Second click should have onPlay undefined (reset)
    await user.click(screen.getByText('2-1'));
    expect(onAdd).toHaveBeenLastCalledWith(
      expect.objectContaining({ onPlay: undefined }),
    );
  });

  it('deselects play/draw toggle on second click', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<MatchResultLogger results={[]} onAdd={onAdd} onRemove={vi.fn()} />);

    await user.click(screen.getByText('Play'));
    await user.click(screen.getByText('Play')); // deselect
    await user.click(screen.getByText('2-0'));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ onPlay: undefined }),
    );
  });

  it('displays win rate stats when results exist', () => {
    const results = [
      result(true, 2, 0),
      result(true, 2, 1),
      result(false, 1, 2),
    ];
    render(<MatchResultLogger results={results} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText(/67%/)).toBeInTheDocument();
    expect(screen.getByText(/3 matches/)).toBeInTheDocument();
  });

  it('does not display stats when no results', () => {
    render(<MatchResultLogger results={[]} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('renders result history entries', () => {
    const results = [
      result(true, 2, 0, { onPlay: true }),
      result(false, 0, 2),
    ];
    render(<MatchResultLogger results={results} onAdd={vi.fn()} onRemove={vi.fn()} />);
    // Score buttons + result entries both contain score text, so use getAllByText
    const twoZero = screen.getAllByText('2-0');
    expect(twoZero.length).toBeGreaterThanOrEqual(2); // button + history entry
    const zeroTwo = screen.getAllByText('0-2');
    expect(zeroTwo.length).toBeGreaterThanOrEqual(2);
    // Play/Draw tag in history + toggle button
    const playElements = screen.getAllByText('Play');
    expect(playElements.length).toBeGreaterThanOrEqual(2); // toggle + history tag
  });

  it('calls onRemove when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const results = [result(true, 2, 0)];
    render(<MatchResultLogger results={results} onAdd={vi.fn()} onRemove={onRemove} />);

    const removeBtn = screen.getByLabelText('Remove result');
    await user.click(removeBtn);

    expect(onRemove).toHaveBeenCalledWith(results[0]!.id);
  });
});
