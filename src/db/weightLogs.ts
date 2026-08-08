import type { SQLiteDatabase } from 'expo-sqlite';

import type { WeightLog } from './types';

/** One entry per day — logging again on the same date overwrites the previous entry. */
export async function upsertWeightLogForDate(
  db: SQLiteDatabase,
  date: string,
  weight: number
): Promise<WeightLog> {
  await db.runAsync(
    `INSERT INTO weight_logs (date, weight, created_at)
     VALUES ($date, $weight, $created_at)
     ON CONFLICT(date) DO UPDATE SET weight = excluded.weight`,
    { $date: date, $weight: weight, $created_at: new Date().toISOString() }
  );

  const saved = await db.getFirstAsync<WeightLog>('SELECT * FROM weight_logs WHERE date = $date', {
    $date: date,
  });
  if (!saved) {
    throw new Error('Failed to save weight log');
  }
  return saved;
}

/** Inclusive of both endpoints, ordered oldest to newest. */
export async function getWeightLogsForRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<WeightLog[]> {
  return db.getAllAsync<WeightLog>(
    'SELECT * FROM weight_logs WHERE date BETWEEN $startDate AND $endDate ORDER BY date ASC',
    { $startDate: startDate, $endDate: endDate }
  );
}

export async function getLatestWeightLog(db: SQLiteDatabase): Promise<WeightLog | null> {
  return db.getFirstAsync<WeightLog>('SELECT * FROM weight_logs ORDER BY date DESC LIMIT 1');
}
