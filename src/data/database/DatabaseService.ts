import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mathfun.db';

/** Each entry = one schema version. Append only; never edit shipped migrations. */
const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS player_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT 'Sahabat Kecil',
    grade INTEGER NOT NULL DEFAULT 1,
    stars INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  INSERT OR IGNORE INTO player_profile (id) VALUES (1);

  CREATE TABLE IF NOT EXISTS question_attempt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation TEXT NOT NULL,
    grade INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    question_text TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    user_answer INTEGER,
    is_correct INTEGER NOT NULL,
    answered_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_attempt_op ON question_attempt(operation, grade);

  CREATE TABLE IF NOT EXISTS game_score (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    played_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_score_game ON game_score(game_id);

  CREATE TABLE IF NOT EXISTS material_progress (
    material_id TEXT PRIMARY KEY,
    completed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `,
];

export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  static get shared(): DatabaseService {
    return (this.instance ??= new DatabaseService());
  }

  /** Idempotent. Safe to call from many places; opens + migrates once. */
  initialize(): Promise<void> {
    return (this.initPromise ??= this.open());
  }

  get connection(): SQLite.SQLiteDatabase {
    if (!this.db) throw new Error('DatabaseService not initialized. Await initialize() first.');
    return this.db;
  }

  async close(): Promise<void> {
    await this.db?.closeAsync();
    this.db = null;
    this.initPromise = null;
  }

  private async open(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DB_NAME);
    await this.db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    await this.migrate(this.db);
  }

  private async migrate(db: SQLite.SQLiteDatabase): Promise<void> {
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const current = row?.user_version ?? 0;
    for (let v = current; v < MIGRATIONS.length; v++) {
      await db.withTransactionAsync(async () => {
        await db.execAsync(MIGRATIONS[v]);
        await db.execAsync(`PRAGMA user_version = ${v + 1}`);
      });
    }
  }
}

