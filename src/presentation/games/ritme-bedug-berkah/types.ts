export interface RhythmDrum {
  id: string;
  lane: number; // 0: left, 1: center, 2: right
  value: number;
  label: string;
  isCorrect: boolean;
}

export interface RhythmRound {
  id: string;
  rhythmTitle: string;
  questionPrompt: string;
  questionHint: string;
  correctAnswer: number;
  drums: RhythmDrum[];
}
