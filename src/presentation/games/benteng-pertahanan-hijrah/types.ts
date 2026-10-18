export interface TowerCatapult {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
  towerType: 'fire' | 'ice' | 'stone';
}

export interface DefenseRound {
  id: string;
  waveNumber: number;
  enemyName: string;
  enemyEmoji: string;
  questionPrompt: string;
  questionHint: string;
  pemdasExplanation: string;
  correctAnswer: number;
  catapults: TowerCatapult[];
}
