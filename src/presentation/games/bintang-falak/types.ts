export interface CosmicMeteor {
  id: string;
  value: number;
  label: string;
  isCorrect: boolean;
  color: string;
  xLane: number; // -1, 0, 1
}

export interface CosmicRound {
  id: string;
  questionPrompt: string;
  questionHint: string;
  correctAnswer: number;
  meteors: CosmicMeteor[];
}
