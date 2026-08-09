export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active';

export type Units = 'metric' | 'imperial';

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type FoodSource = 'custom' | 'open_food_facts';

/** Single row — id is always 1. */
export interface Profile {
  id: 1;
  name: string;
  gender: Gender;
  age: number;
  /** cm */
  height: number;
  /** kg */
  weight: number;
  calorie_goal: number;
  activity_level: ActivityLevel;
  units: Units;
  created_at: string;
}

export interface Food {
  id: number;
  name: string;
  calories_per_100g: number;
  protein_g: number | null;
  fat_g: number | null;
  saturated_fat_g: number | null;
  carbs_g: number | null;
  sugar_g: number | null;
  fiber_g: number | null;
  sodium_mg: number | null;
  salt_g: number | null;
  source: FoodSource;
  barcode: string | null;
  /** e.g. "1 bar (45g)" — informational only, shown at log time to help fill in grams. */
  reference_portion: string | null;
  fetched_at: string | null;
  created_at: string;
}

export interface FoodLog {
  id: number;
  food_id: number;
  /** YYYY-MM-DD */
  date: string;
  meal_type: MealType;
  food_name: string;
  grams: number;
  calories: number;
  created_at: string;
}

export interface WeightLog {
  id: number;
  /** YYYY-MM-DD, unique — a second log on the same date overwrites this row */
  date: string;
  /** kg */
  weight: number;
  created_at: string;
}
