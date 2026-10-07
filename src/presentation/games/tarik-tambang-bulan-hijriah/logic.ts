export const MAX_PULL = 6;
export const SECONDS_PER_OPPONENT_PULL = 5;
export const TOTAL_SECONDS = 60;

/** Rope position: + = our team winning, - = opponent winning. Clamped to ±MAX_PULL. */
export function ropePosition(score: number, misses: number, timeLeft: number): number {
  const elapsed = TOTAL_SECONDS - timeLeft;
  const opponentPulls = Math.floor(elapsed / SECONDS_PER_OPPONENT_PULL);
  return Math.max(-MAX_PULL, Math.min(MAX_PULL, score - misses - opponentPulls));
}

