import { QuestionGeneratorService } from '../../domain/services/QuestionGeneratorService';
import { SqliteAttemptRepository } from '../../data/repositories/SqliteAttemptRepository';
import { AttemptRepository } from '../../domain/repositories/AttemptRepository';

/** Minimal composition root. Swap implementations here (e.g. in-memory for tests). */
export const questionGenerator = new QuestionGeneratorService();
export const attemptRepository: AttemptRepository = new SqliteAttemptRepository();

