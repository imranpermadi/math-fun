import { AttemptRecord, AttemptRepository } from '../../domain/repositories/AttemptRepository';
import { DatabaseService } from '../database/DatabaseService';

export class SqliteAttemptRepository implements AttemptRepository {
  constructor(private readonly dbService: DatabaseService = DatabaseService.shared) {}

  async save(a: AttemptRecord): Promise<void> {
    await this.dbService.connection.runAsync(
      `INSERT INTO question_attempt
        (operation, grade, difficulty, question_text, correct_answer, user_answer, is_correct)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      a.operation, a.grade, a.difficulty, a.questionText, a.correctAnswer, a.userAnswer, a.isCorrect ? 1 : 0,
    );
  }

  async addStars(count: number): Promise<number> {
    const db = this.dbService.connection;
    await db.runAsync('UPDATE player_profile SET stars = stars + ? WHERE id = 1', count);
    return this.getStars();
  }

  async getStars(): Promise<number> {
    const row = await this.dbService.connection.getFirstAsync<{ stars: number }>(
      'SELECT stars FROM player_profile WHERE id = 1',
    );
    return row?.stars ?? 0;
  }

  async saveGameScore(gameId: string, score: number): Promise<void> {
    await this.dbService.connection.runAsync(
      'INSERT INTO game_score (game_id, score) VALUES (?, ?)', gameId, score,
    );
  }

  async getBestScore(gameId: string): Promise<number> {
    const row = await this.dbService.connection.getFirstAsync<{ best: number | null }>(
      'SELECT MAX(score) AS best FROM game_score WHERE game_id = ?', gameId,
    );
    return row?.best ?? 0;
  }
}

