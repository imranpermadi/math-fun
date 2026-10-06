import { Difficulty, Grade, Operation } from '../enums';

export interface AttemptRecord {
  operation: Operation;
  grade: Grade;
  difficulty: Difficulty;
  questionText: string;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
}

export interface AttemptRepository {
  save(attempt: AttemptRecord): Promise<void>;
  addStars(count: number): Promise<number>;
  getStars(): Promise<number>;
  saveGameScore(gameId: string, score: number): Promise<void>;
  getBestScore(gameId: string): Promise<number>;
}

