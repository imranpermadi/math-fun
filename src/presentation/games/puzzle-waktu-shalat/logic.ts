import { Difficulty } from '../../../domain/enums';
import { pickOne, shuffle } from '../../../core/utils/random';

export const PRAYERS = [
  { name: 'Subuh', hour: 4 },
  { name: 'Dzuhur', hour: 12 },
  { name: 'Ashar', hour: 3 },
  { name: 'Maghrib', hour: 6 },
  { name: 'Isya', hour: 7 },
];

export interface TimeRound {
  mode: 'set' | 'read';
  prayer: string;
  hour: number; // 1..12
  minute: number;
  choices: string[];
}

export const fmt = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

export function minutesFor(d: Difficulty): number[] {
  return d === Difficulty.Easy ? [0] : d === Difficulty.Medium ? [0, 30] : [0, 15, 30, 45];
}

export function makeTimeRound(difficulty: Difficulty): TimeRound {
  const p = pickOne(PRAYERS);
  const hour = p.hour;
  const minute = pickOne(minutesFor(difficulty));
  const mode = Math.random() < 0.5 ? 'set' : 'read';
  const correct = fmt(hour, minute);
  const wrong = new Set<string>();
  while (wrong.size < 2) {
    const h = ((hour + pickOne([-2, -1, 1, 2]) + 11) % 12) + 1;
    const m = pickOne([...minutesFor(difficulty), 0, 30]);
    const t = fmt(h, m);
    if (t !== correct) wrong.add(t);
  }
  return { mode, prayer: p.name, hour, minute, choices: shuffle([correct, ...wrong]) };
}

export const hourAngle = (h: number, m: number) => (h % 12) * 30 + m * 0.5;
export const minuteAngle = (m: number) => m * 6;

