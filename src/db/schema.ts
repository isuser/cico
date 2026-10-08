import type { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 6;

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER NOT NULL,
  height REAL NOT NULL,
  weight REAL NOT NULL,
  calorie_goal INTEGER NOT NULL,
  activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active')),
  units TEXT NOT NULL CHECK (units IN ('metric', 'imperial')),
  first_day_of_week TEXT NOT NULL DEFAULT 'monday' CHECK (first_day_of_week IN ('sunday', 'monday')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'pt', 'es', 'fr')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  calories_per_100g INTEGER NOT NULL,
  protein_g REAL,
  fat_g REAL,
  saturated_fat_g REAL,
  carbs_g REAL,
  sugar_g REAL,
  fiber_g REAL,
  sodium_mg REAL,
  salt_g REAL,
  source TEXT NOT NULL CHECK (source IN ('custom', 'open_food_facts')),
  barcode TEXT,
  reference_portion TEXT,
  fetched_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_foods_barcode ON foods(barcode);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);

CREATE TABLE IF NOT EXISTS food_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food_id INTEGER NOT NULL REFERENCES foods(id),
  date TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
  food_name TEXT NOT NULL,
  grams REAL NOT NULL,
  calories INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_food_logs_date ON food_logs(date);

CREATE TABLE IF NOT EXISTS weight_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  weight REAL NOT NULL,
  created_at TEXT NOT NULL
);
`;

/**
 * Runs once per database connection (via SQLiteProvider's onInit) and is
 * idempotent — safe to call on every app launch. Table creation itself is
 * gated behind PRAGMA user_version so future schema changes can be added
 * as additional `if (currentDbVersion === N)` steps without re-running
 * earlier migrations.
 */
export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = row?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(CREATE_TABLES);
    currentDbVersion = 4;
  }

  if (currentDbVersion === 1) {
    await db.execAsync('ALTER TABLE foods ADD COLUMN reference_portion TEXT');
    currentDbVersion = 2;
  }

  if (currentDbVersion === 2) {
    await db.execAsync(
      `ALTER TABLE profile ADD COLUMN first_day_of_week TEXT NOT NULL DEFAULT 'monday' CHECK (first_day_of_week IN ('sunday', 'monday'))`
    );
    currentDbVersion = 3;
  }

  if (currentDbVersion === 3) {
    await db.execAsync(
      `ALTER TABLE profile ADD COLUMN language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'pt', 'es', 'fr'))`
    );
    currentDbVersion = 4;
  }

  if (currentDbVersion === 4) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercise_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        activity_name TEXT NOT NULL,
        met_value REAL NOT NULL,
        duration_minutes REAL NOT NULL,
        calories_burned INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_exercise_logs_date ON exercise_logs(date);
    `);
    currentDbVersion = 5;
  }

  if (currentDbVersion === 5) {
    // Nullable: null means worldwide food search. No CHECK constraint so the curated country
    // list in src/lib/countries.ts can grow without another migration.
    await db.execAsync('ALTER TABLE profile ADD COLUMN country TEXT');
    currentDbVersion = 6;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
