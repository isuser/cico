import type { SQLiteDatabase } from 'expo-sqlite';

import type { FoodLog, MealType } from './types';

export type FoodLogInput = Omit<FoodLog, 'id' | 'created_at'>;
export type FoodLogUpdate = Pick<FoodLog, 'food_id' | 'food_name' | 'grams' | 'calories'>;

export async function getFoodLogsForDate(db: SQLiteDatabase, date: string): Promise<FoodLog[]> {
  return db.getAllAsync<FoodLog>(
    'SELECT * FROM food_logs WHERE date = $date ORDER BY id ASC',
    { $date: date }
  );
}

/** Inclusive of both endpoints — used for weekly charts and history browsing. */
export async function getFoodLogsForDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<FoodLog[]> {
  return db.getAllAsync<FoodLog>(
    'SELECT * FROM food_logs WHERE date BETWEEN $startDate AND $endDate ORDER BY date ASC, id ASC',
    { $startDate: startDate, $endDate: endDate }
  );
}

export async function insertFoodLog(db: SQLiteDatabase, log: FoodLogInput): Promise<FoodLog> {
  const result = await db.runAsync(
    `INSERT INTO food_logs (food_id, date, meal_type, food_name, grams, calories, created_at)
     VALUES ($food_id, $date, $meal_type, $food_name, $grams, $calories, $created_at)`,
    {
      $food_id: log.food_id,
      $date: log.date,
      $meal_type: log.meal_type,
      $food_name: log.food_name,
      $grams: log.grams,
      $calories: log.calories,
      $created_at: new Date().toISOString(),
    }
  );

  const saved = await db.getFirstAsync<FoodLog>('SELECT * FROM food_logs WHERE id = $id', {
    $id: result.lastInsertRowId,
  });
  if (!saved) {
    throw new Error('Failed to save food log');
  }
  return saved;
}

/** Adjusts grams and/or swaps the food; calories must be recalculated by the caller. */
export async function updateFoodLog(
  db: SQLiteDatabase,
  id: number,
  changes: FoodLogUpdate
): Promise<void> {
  await db.runAsync(
    `UPDATE food_logs
     SET food_id = $food_id, food_name = $food_name, grams = $grams, calories = $calories
     WHERE id = $id`,
    {
      $id: id,
      $food_id: changes.food_id,
      $food_name: changes.food_name,
      $grams: changes.grams,
      $calories: changes.calories,
    }
  );
}

export async function deleteFoodLog(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM food_logs WHERE id = $id', { $id: id });
}

export function sumCaloriesByMeal(logs: FoodLog[]): Record<MealType, number> {
  const totals: Record<MealType, number> = { breakfast: 0, lunch: 0, snacks: 0, dinner: 0 };
  for (const log of logs) {
    totals[log.meal_type] += log.calories;
  }
  return totals;
}
