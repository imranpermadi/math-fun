export interface MultiItem {
  multiplier: number;
  multiplicand: number;
  product: number;
  speechText: string;
}

export interface MultiQuizQuestion {
  id: string;
  a: number;
  b: number;
  answer: number;
  choices: number[];
  prompt: string;
  hint: string;
}

/** Generate 1 x N up to 10 x N */
export function getTableItems(n: number): MultiItem[] {
  return Array.from({ length: 10 }, (_, idx) => {
    const a = idx + 1;
    return {
      multiplier: a,
      multiplicand: n,
      product: a * n,
      speechText: `${a} kali ${n} sama dengan ${a * n}`,
    };
  });
}

/** Generate quiz questions for a target table (1..10) or mixed */
export function generateQuizQuestions(targetN: number | 'mix', count: number = 10): MultiQuizQuestion[] {
  const questions: MultiQuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const b = targetN === 'mix' ? Math.floor(Math.random() * 9) + 2 : targetN; // 2..10 or target
    const a = Math.floor(Math.random() * 10) + 1; // 1..10
    const answer = a * b;

    // Distractors
    const candidates = [
      answer + b,
      answer - b,
      answer + 1,
      answer - 1,
      answer + 2,
      answer - 2,
      (a + 1) * b,
      Math.max(1, (a - 1) * b),
      a * (b + 1),
    ].filter((c) => c > 0 && c !== answer);

    const uniqueCandidates = Array.from(new Set(candidates)).sort(() => Math.random() - 0.5);
    let delta = 1;
    while (uniqueCandidates.length < 3) {
      const fallback = answer + delta;
      if (!uniqueCandidates.includes(fallback) && fallback !== answer) {
        uniqueCandidates.push(fallback);
      }
      delta++;
    }
    const choices = [answer, ...uniqueCandidates.slice(0, 3)].sort(() => Math.random() - 0.5);

    questions.push({
      id: `mq-${i}-${Date.now().toString(36)}`,
      a,
      b,
      answer,
      choices,
      prompt: `${a} × ${b} = ?`,
      hint: `${a} kelompok, masing-masing berisi ${b}`,
    });
  }

  return questions;
}

export const MULTI_COLORS: Record<number, string> = {
  1: '#00B4D8', // Sky
  2: '#06D6A0', // Emerald Mint
  3: '#FFB703', // Amber Gold
  4: '#FB5607', // Orange Coral
  5: '#E63946', // Crimson Red
  6: '#8338EC', // Violet Purple
  7: '#3A86FF', // Azure Blue
  8: '#F72585', // Bubblegum Pink
  9: '#7209B7', // Deep Purple
  10: '#2EC4B6', // Fresh Teal
};
