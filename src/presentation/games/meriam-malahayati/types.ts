export interface PirateShip {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
  xPos: number; // -1: left, 0: center, 1: right
}

export interface CannonRound {
  id: string;
  missionType: 'kelipatan' | 'fpb' | 'kpk' | 'faktor';
  questionPrompt: string;
  questionHint: string;
  correctAnswer: number;
  ships: PirateShip[];
}
