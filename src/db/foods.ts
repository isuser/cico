import type { SQLiteDatabase } from 'expo-sqlite';

import type { Food } from './types';

export type FoodInput = Omit<Food, 'id' | 'created_at'>;

export async function getFoodById(db: SQLiteDatabase, id: number): Promise<Food | null> {
  return db.getFirstAsync<Food>('SELECT * FROM foods WHERE id = $id', { $id: id });
}

export async function findFoodByBarcode(
  db: SQLiteDatabase,
  barcode: string
): Promise<Food | null> {
  return db.getFirstAsync<Food>('SELECT * FROM foods WHERE barcode = $barcode', {
    $barcode: barcode,
  });
}

/** Local-only search over previously cached and custom foods, newest first. */
export async function searchFoodsLocal(db: SQLiteDatabase, query: string): Promise<Food[]> {
  return db.getAllAsync<Food>(
    'SELECT * FROM foods WHERE name LIKE $query ORDER BY id DESC LIMIT 50',
    { $query: `%${query}%` }
  );
}

/** Most recently cached/custom foods, for the Add Food sheet's "Recent" section. */
export async function getRecentFoods(db: SQLiteDatabase, limit = 10): Promise<Food[]> {
  return db.getAllAsync<Food>('SELECT * FROM foods ORDER BY id DESC LIMIT $limit', {
    $limit: limit,
  });
}

/** Inserts a food (custom or Open Food Facts) and returns the full saved row. */
export async function insertFood(db: SQLiteDatabase, food: FoodInput): Promise<Food> {
  const result = await db.runAsync(
    `INSERT INTO foods (
       name, calories_per_100g, protein_g, fat_g, saturated_fat_g, carbs_g,
       sugar_g, fiber_g, sodium_mg, salt_g, source, barcode, reference_portion,
       fetched_at, created_at
     ) VALUES (
       $name, $calories_per_100g, $protein_g, $fat_g, $saturated_fat_g, $carbs_g,
       $sugar_g, $fiber_g, $sodium_mg, $salt_g, $source, $barcode, $reference_portion,
       $fetched_at, $created_at
     )`,
    {
      $name: food.name,
      $calories_per_100g: food.calories_per_100g,
      $protein_g: food.protein_g,
      $fat_g: food.fat_g,
      $saturated_fat_g: food.saturated_fat_g,
      $carbs_g: food.carbs_g,
      $sugar_g: food.sugar_g,
      $fiber_g: food.fiber_g,
      $sodium_mg: food.sodium_mg,
      $salt_g: food.salt_g,
      $source: food.source,
      $barcode: food.barcode,
      $reference_portion: food.reference_portion,
      $fetched_at: food.fetched_at,
      $created_at: new Date().toISOString(),
    }
  );

  const saved = await getFoodById(db, result.lastInsertRowId);
  if (!saved) {
    throw new Error('Failed to save food');
  }
  return saved;
}
