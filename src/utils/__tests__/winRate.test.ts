import { describe, it, expect } from 'vitest';
import { calcWinRate, calcDeckWinRate, formatWinRate } from '../winRate';
import type { MatchResult, Matchup } from '@/types/deck';

function result(won: boolean, gamesWon: number, gamesLost: number): MatchResult {
  return { id: String(Math.random()), timestamp: Date.now(), won, gamesWon, gamesLost };
}

function matchup(results: MatchResult[]): Matchup {
  return { id: '1', name: 'vs X', slug: 'vs-x', notes: '', out: [], in: [], results };
}

describe('calcWinRate', () => {
  it('returns nulls for empty results', () => {
    const stats = calcWinRate([]);
    expect(stats.totalMatches).toBe(0);
    expect(stats.matchWinRate).toBeNull();
    expect(stats.gameWinRate).toBeNull();
  });

  it('calculates 100% win rate', () => {
    const stats = calcWinRate([result(true, 2, 0), result(true, 2, 1)]);
    expect(stats.matchWins).toBe(2);
    expect(stats.matchLosses).toBe(0);
    expect(stats.matchWinRate).toBe(1);
  });

  it('calculates 0% win rate', () => {
    const stats = calcWinRate([result(false, 0, 2), result(false, 1, 2)]);
    expect(stats.matchWins).toBe(0);
    expect(stats.matchLosses).toBe(2);
    expect(stats.matchWinRate).toBe(0);
  });

  it('calculates mixed results correctly', () => {
    const stats = calcWinRate([
      result(true, 2, 0),
      result(true, 2, 1),
      result(false, 1, 2),
    ]);
    expect(stats.matchWins).toBe(2);
    expect(stats.matchLosses).toBe(1);
    expect(stats.totalMatches).toBe(3);
    expect(stats.matchWinRate).toBeCloseTo(0.6667, 3);
  });

  it('calculates game win rate separately from match win rate', () => {
    const stats = calcWinRate([
      result(true, 2, 1),   // 2 game wins, 1 game loss
      result(false, 0, 2),  // 0 game wins, 2 game losses
    ]);
    expect(stats.matchWinRate).toBe(0.5);
    expect(stats.gameWins).toBe(2);
    expect(stats.gameLosses).toBe(3);
    expect(stats.gameWinRate).toBe(2 / 5);
  });
});

describe('calcDeckWinRate', () => {
  it('aggregates across matchups', () => {
    const m1 = matchup([result(true, 2, 0), result(true, 2, 1)]);
    const m2 = matchup([result(false, 1, 2)]);
    const stats = calcDeckWinRate([m1, m2]);
    expect(stats.matchWins).toBe(2);
    expect(stats.matchLosses).toBe(1);
    expect(stats.totalMatches).toBe(3);
  });

  it('handles matchups with undefined results (backward compat)', () => {
    const m = { id: '1', name: 'vs X', slug: 'vs-x', notes: '', out: [], in: [] } as Matchup;
    const stats = calcDeckWinRate([m]);
    expect(stats.totalMatches).toBe(0);
    expect(stats.matchWinRate).toBeNull();
  });

  it('returns empty stats for no matchups', () => {
    const stats = calcDeckWinRate([]);
    expect(stats.totalMatches).toBe(0);
    expect(stats.matchWinRate).toBeNull();
  });
});

describe('formatWinRate', () => {
  it('formats null as --', () => {
    expect(formatWinRate(null)).toBe('--');
  });

  it('formats 0 as 0%', () => {
    expect(formatWinRate(0)).toBe('0%');
  });

  it('formats 1 as 100%', () => {
    expect(formatWinRate(1)).toBe('100%');
  });

  it('rounds to nearest integer', () => {
    expect(formatWinRate(0.6667)).toBe('67%');
    expect(formatWinRate(0.333)).toBe('33%');
  });
});
