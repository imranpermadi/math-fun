export interface MineGem {
  id: string;
  value: number;
  label: string;
  isPrime: boolean;
  isCorrect: boolean;
  color: string;
}

export interface MinecartRound {
  id: string;
  questionPrompt: string;
  questionHint: string;
  explanation: string;
  correctAnswer: number;
  gems: MineGem[];
}
