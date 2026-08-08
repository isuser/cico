import type { ActivityLevel, Gender } from '@/db';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export const ACTIVITY_LEVEL_INFO: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1–3 days a week' },
  {
    value: 'moderately_active',
    label: 'Moderately Active',
    description: 'Moderate exercise 3–5 days a week',
  },
  { value: 'very_active', label: 'Very Active', description: 'Hard exercise 6–7 days a week' },
];

/** Mifflin-St Jeor equation. Height in cm, weight in kg. */
export function calculateBmr({
  gender,
  age,
  height,
  weight,
}: {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
}): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') return base + 5;
  if (gender === 'female') return base - 161;
  // 'other' — average of the male/female offsets, since Mifflin-St Jeor has no neutral form.
  return base - 78;
}

/** Suggested daily calorie target: BMR × activity level multiplier, rounded. */
export function calculateSuggestedCalorieGoal(params: {
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
}): number {
  return Math.round(calculateBmr(params) * ACTIVITY_MULTIPLIERS[params.activityLevel]);
}
