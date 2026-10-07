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

export interface UserProfile {
  name: string;
  age: number;
  avatar: string;
  grade: Grade;
  stars: number;
}

export interface GameScoreSummary {
  gameId: string;
  bestScore: number;
  timesPlayed: number;
  lastScore: number;
  lastPlayed: string;
}

export interface AttemptHistoryItem {
  id: number;
  operation: Operation;
  grade: Grade;
  difficulty: Difficulty;
  questionText: string;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean;
  answeredAt: string;
}

export interface AttemptStats {
  total: number;
  correct: number;
  accuracy: number;
}

export interface AttemptRepository {
  save(attempt: AttemptRecord): Promise<void>;
  addStars(count: number): Promise<number>;
  getStars(): Promise<number>;
  saveGameScore(gameId: string, score: number): Promise<void>;
  getBestScore(gameId: string): Promise<number>;
  getProfile(): Promise<UserProfile>;
  updateProfile(profile: Partial<UserProfile>): Promise<void>;
  getGameScoreSummaries(): Promise<GameScoreSummary[]>;
  getAttemptHistory(limit?: number): Promise<AttemptHistoryItem[]>;
  getAttemptStats(): Promise<AttemptStats>;
}
