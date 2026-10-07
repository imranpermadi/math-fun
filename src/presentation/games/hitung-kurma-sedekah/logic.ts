import { Grade } from '../../../domain/enums';
import { NAMES, pickOne, randInt } from '../../../core/utils/random';

export type KurmaMode = 'sub' | 'add';

export interface KurmaRound {
  mode: KurmaMode;
  name: string;
  /** Kurma already in the target at start (add mode) or total in source (sub mode). */
  a: number;
  b: number;
  /** Number of draggable kurma in the source tray. */
  sourceCount: number;
  /** How many must be dragged to the target. */
  need: number;
  answer: number;
  instruction: string;
  question: string;
}

export function makeKurmaRound(grade: Grade): KurmaRound {
  const max = grade === Grade.One ? 8 : grade === Grade.Two ? 12 : 15;
  const name = pickOne(NAMES);
  if (Math.random() < 0.5) {
    const a = randInt(3, max);
    const b = randInt(1, Math.min(6, a - 1));
    return {
      mode: 'sub', name, a, b, sourceCount: a, need: b, answer: a - b,
      instruction: `Bismillah. ${name} punya ${a} kurma. Ayo sedekahkan ${b} kurma ke kotak sedekah dengan menggeser kurma!`,
      question: `Alhamdulillah! Berapa sisa kurma ${name}?`,
    };
  }
  const a = randInt(2, Math.max(3, max - 4));
  const b = randInt(1, Math.min(6, max - a));
  return {
    mode: 'add', name, a, b, sourceCount: b, need: b, answer: a + b,
    instruction: `${name} punya ${a} kurma di keranjang. Ibu memberi ${b} kurma lagi. Geser ${b} kurma ke keranjang ${name}!`,
    question: `Berapa jumlah kurma ${name} sekarang?`,
  };
}

