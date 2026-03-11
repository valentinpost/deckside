import type { MatchResult, Matchup } from '@/types/deck';

export interface WinRateStats {
  matchWins: number;
  matchLosses: number;
  totalMatches: number;
  matchWinRate: number | null;
  gameWins: number;
  gameLosses: number;
  totalGames: number;
  gameWinRate: number | null;
}

export function calcWinRate(results: MatchResult[]): WinRateStats {
  const matchWins = results.filter((result) => result.won).length;
  const matchLosses = results.filter((result) => !result.won).length;
  const totalMatches = results.length;
  const matchWinRate = totalMatches > 0 ? matchWins / totalMatches : null;

  const gameWins = results.reduce((sum, result) => sum + result.gamesWon, 0);
  const gameLosses = results.reduce((sum, result) => sum + result.gamesLost, 0);
  const totalGames = gameWins + gameLosses;
  const gameWinRate = totalGames > 0 ? gameWins / totalGames : null;

  return { matchWins, matchLosses, totalMatches, matchWinRate, gameWins, gameLosses, totalGames, gameWinRate };
}

export function calcDeckWinRate(matchups: Matchup[]): WinRateStats {
  const allResults = matchups.flatMap((matchup) => matchup.results ?? []);
  return calcWinRate(allResults);
}

export function formatWinRate(rate: number | null): string {
  if (rate === null) return '--';
  return `${Math.round(rate * 100)}%`;
}
