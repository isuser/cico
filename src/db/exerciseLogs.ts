import type { SQLiteDatabase } from 'expo-sqlite';

import type { ExerciseLog } from './types';

export type ExerciseLogInput = Omit<ExerciseLog, 'id' | 'created_at'>;
export type ExerciseLogUpdate = Pick<
  ExerciseLog,
  'activity_name' | 'met_value' | 'duration_minutes' | 'calories_burned'
>;

export async function getExerciseLogsForDate(
  db: SQLiteDatabase,
  date: string
): Promise<ExerciseLog[]> {
  return db.getAllAsync<ExerciseLog>(
    'SELECT * FROM exercise_logs WHERE date = $date ORDER BY id ASC',
    { $date: date }
  );
}

/** Inclusive of both endpoints — used for weekly charts and history browsing. */
export async function getExerciseLogsForDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<ExerciseLog[]> {
  return db.getAllAsync<ExerciseLog>(
    'SELECT * FROM exercise_logs WHERE date BETWEEN $startDate AND $endDate ORDER BY date ASC, id ASC',
    { $startDate: startDate, $endDate: endDate }
  );
}

export async function insertExerciseLog(
  db: SQLiteDatabase,
  log: ExerciseLogInput
): Promise<ExerciseLog> {
  const result = await db.runAsync(
    `INSERT INTO exercise_logs (date, activity_name, met_value, duration_minutes, calories_burned, created_at)
     VALUES ($date, $activity_name, $met_value, $duration_minutes, $calories_burned, $created_at)`,
    {
      $date: log.date,
      $activity_name: log.activity_name,
      $met_value: log.met_value,
      $duration_minutes: log.duration_minutes,
      $calories_burned: log.calories_burned,
      $created_at: new Date().toISOString(),
    }
  );

  const saved = await db.getFirstAsync<ExerciseLog>(
    'SELECT * FROM exercise_logs WHERE id = $id',
    { $id: result.lastInsertRowId }
  );
  if (!saved) {
    throw new Error('Failed to save exercise log');
  }
  return saved;
}

/** Adjusts duration (and the resulting calories); caller recalculates calories_burned. */
export async function updateExerciseLog(
  db: SQLiteDatabase,
  id: number,
  changes: ExerciseLogUpdate
): Promise<void> {
  await db.runAsync(
    `UPDATE exercise_logs
     SET activity_name = $activity_name, met_value = $met_value, duration_minutes = $duration_minutes, calories_burned = $calories_burned
     WHERE id = $id`,
    {
      $id: id,
      $activity_name: changes.activity_name,
      $met_value: changes.met_value,
      $duration_minutes: changes.duration_minutes,
      $calories_burned: changes.calories_burned,
    }
  );
}

export async function deleteExerciseLog(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM exercise_logs WHERE id = $id', { $id: id });
}

export function sumCaloriesBurned(logs: ExerciseLog[]): number {
  return logs.reduce((total, log) => total + log.calories_burned, 0);
}

/** round(met_value × weight_kg × duration_minutes / 60), per the Compendium calorie formula. */
export function calculateCaloriesBurned({
  metValue,
  weightKg,
  durationMinutes,
}: {
  metValue: number;
  weightKg: number;
  durationMinutes: number;
}): number {
  return Math.round((metValue * weightKg * durationMinutes) / 60);
}
