import {
  AttemptHistoryItem,
  AttemptRecord,
  AttemptRepository,
  AttemptStats,
  GameScoreSummary,
  UserProfile,
} from '../../domain/repositories/AttemptRepository';
import { Difficulty, Grade, Operation } from '../../domain/enums';
import { DatabaseService } from '../database/DatabaseService';

export class SqliteAttemptRepository implements AttemptRepository {
  constructor(private readonly dbService: DatabaseService = DatabaseService.shared) {}

  async save(a: AttemptRecord): Promise<void> {
    await this.dbService.connection.runAsync(
      `INSERT INTO question_attempt
        (operation, grade, difficulty, question_text, correct_answer, user_answer, is_correct)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      a.operation,
      a.grade,
      a.difficulty,
      a.questionText,
      a.correctAnswer,
      a.userAnswer,
      a.isCorrect ? 1 : 0
    );
  }

  async addStars(count: number): Promise<number> {
    const db = this.dbService.connection;
    await db.runAsync('UPDATE player_profile SET stars = stars + ? WHERE id = 1', count);
    return this.getStars();
  }

  async getStars(): Promise<number> {
    const row = await this.dbService.connection.getFirstAsync<{ stars: number }>(
      'SELECT stars FROM player_profile WHERE id = 1'
    );
    return row?.stars ?? 0;
  }

  async saveGameScore(gameId: string, score: number): Promise<void> {
    await this.dbService.connection.runAsync(
      'INSERT INTO game_score (game_id, score) VALUES (?, ?)',
      gameId,
      score
    );
  }

  async getBestScore(gameId: string): Promise<number> {
    const row = await this.dbService.connection.getFirstAsync<{ best: number | null }>(
      'SELECT MAX(score) AS best FROM game_score WHERE game_id = ?',
      gameId
    );
    return row?.best ?? 0;
  }

  async getProfile(): Promise<UserProfile> {
    const row = await this.dbService.connection.getFirstAsync<{
      name: string;
      age: number;
      avatar: string;
      grade: number;
      stars: number;
    }>('SELECT name, age, avatar, grade, stars FROM player_profile WHERE id = 1');

    return {
      name: row?.name ?? 'Sahabat Kecil',
      age: row?.age ?? 7,
      avatar: row?.avatar ?? '🧒',
      grade: (row?.grade as Grade) ?? Grade.One,
      stars: row?.stars ?? 0,
    };
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    if (profile.name !== undefined) {
      fields.push('name = ?');
      values.push(profile.name);
    }
    if (profile.age !== undefined) {
      fields.push('age = ?');
      values.push(profile.age);
    }
    if (profile.avatar !== undefined) {
      fields.push('avatar = ?');
      values.push(profile.avatar);
    }
    if (profile.grade !== undefined) {
      fields.push('grade = ?');
      values.push(profile.grade);
    }
    if (profile.stars !== undefined) {
      fields.push('stars = ?');
      values.push(profile.stars);
    }

    if (fields.length > 0) {
      await this.dbService.connection.runAsync(
        `UPDATE player_profile SET ${fields.join(', ')} WHERE id = 1`,
        ...values
      );
    }
  }

  async getGameScoreSummaries(): Promise<GameScoreSummary[]> {
    const rows = await this.dbService.connection.getAllAsync<{
      game_id: string;
      best_score: number;
      times_played: number;
      last_score: number;
      last_played: string;
    }>(`
      SELECT
        game_id,
        MAX(score) AS best_score,
        COUNT(id) AS times_played,
        (SELECT score FROM game_score gs2 WHERE gs2.game_id = gs1.game_id ORDER BY id DESC LIMIT 1) AS last_score,
        MAX(played_at) AS last_played
      FROM game_score gs1
      GROUP BY game_id
      ORDER BY best_score DESC
    `);

    return rows.map((r) => ({
      gameId: r.game_id,
      bestScore: r.best_score ?? 0,
      timesPlayed: r.times_played ?? 0,
      lastScore: r.last_score ?? 0,
      lastPlayed: r.last_played ?? '',
    }));
  }

  async getAttemptHistory(limit = 40): Promise<AttemptHistoryItem[]> {
    const rows = await this.dbService.connection.getAllAsync<{
      id: number;
      operation: string;
      grade: number;
      difficulty: string;
      question_text: string;
      correct_answer: number;
      user_answer: number | null;
      is_correct: number;
      answered_at: string;
    }>(
      `
      SELECT id, operation, grade, difficulty, question_text, correct_answer, user_answer, is_correct, answered_at
      FROM question_attempt
      ORDER BY id DESC
      LIMIT ?
    `,
      limit
    );

    return rows.map((r) => ({
      id: r.id,
      operation: r.operation as Operation,
      grade: r.grade as Grade,
      difficulty: r.difficulty as Difficulty,
      questionText: r.question_text,
      correctAnswer: r.correct_answer,
      userAnswer: r.user_answer,
      isCorrect: r.is_correct === 1,
      answeredAt: r.answered_at,
    }));
  }

  async getAttemptStats(): Promise<AttemptStats> {
    const row = await this.dbService.connection.getFirstAsync<{
      total: number;
      correct: number;
    }>(`
      SELECT COUNT(id) AS total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS correct
      FROM question_attempt
    `);

    const total = row?.total ?? 0;
    const correct = row?.correct ?? 0;
    return {
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }
}
