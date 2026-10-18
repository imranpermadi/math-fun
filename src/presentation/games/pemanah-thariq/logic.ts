import { Grade, Difficulty } from '../../../domain/enums';
import { numberChoices } from '../../../core/utils/random';
import type { ArcheryRound, ArcheryTarget } from './types';

export function generateArcheryRound(grade: Grade = Grade.One, _diff: Difficulty = Difficulty.Medium): ArcheryRound {
  let a: number;
  let b: number;
  let op: '+' | '-' | '×';
  let answer: number;
  let prompt: string;
  let hint: string;

  if (grade <= Grade.One) {
    op = Math.random() > 0.5 ? '+' : '-';
    if (op === '+') {
      a = Math.floor(Math.random() * 25) + 5;
      b = Math.floor(Math.random() * 25) + 5;
      answer = a + b;
    } else {
      answer = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 15) + 3;
      a = answer + b;
    }
    prompt = `${a} ${op} ${b} = ?`;
    hint = `Bidik papan sasaran berangka ${answer}!`;
  } else if (grade <= Grade.Two) {
    const isMulti = Math.random() > 0.4;
    if (isMulti) {
      op = '×';
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      prompt = `${a} × ${b} = ?`;
      hint = `Pemanah Thariq membidik hasil ${a} dikali ${b}`;
    } else {
      op = Math.random() > 0.5 ? '+' : '-';
      a = Math.floor(Math.random() * 150) + 20;
      b = Math.floor(Math.random() * 120) + 15;
      if (op === '+') {
        answer = a + b;
      } else {
        if (a < b) [a, b] = [b, a];
        answer = a - b;
      }
      prompt = `${a} ${op} ${b} = ?`;
      hint = `Tepatkan bidikan busur panah ke angka yang benar`;
    }
  } else {
    // Grade 5-6: Mixed operations with rounding or fast mental math
    op = '×';
    a = (Math.floor(Math.random() * 8) + 2) * 5;
    b = Math.floor(Math.random() * 8) + 2;
    answer = a * b;
    prompt = `${a} × ${b} = ?`;
    hint = `Hitung cepat dan lepaskan panah tepat sasaran!`;
  }

  const rawChoices = numberChoices(answer, 3, Math.max(2, Math.floor(answer * 0.15)));
  const targets: ArcheryTarget[] = rawChoices.map((val, idx) => ({
    id: `target-${idx}-${val}`,
    value: val,
    label: String(val),
    isCorrect: val === answer,
    xOffset: (idx - 1) * 30, // left, center, right
  }));

  return {
    id: `round-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    questionPrompt: prompt,
    questionHint: hint,
    correctAnswer: answer,
    targets,
  };
}
