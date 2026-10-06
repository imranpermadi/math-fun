import { Difficulty, Grade, Operation } from '../enums';

export interface Question {
  readonly id: string;
  readonly text: string;
  readonly operation: Operation;
  readonly grade: Grade;
  readonly difficulty: Difficulty;
  readonly operands: readonly [number, number];
  readonly answer: number;
  /** Unit word in the answer, e.g. "kurma". */
  readonly unit: string;
}

export interface QuestionRequest {
  grade: Grade;
  difficulty: Difficulty;
  /** Optional: restrict to one operation. Random from grade-allowed set when omitted. */
  operation?: Operation;
}

