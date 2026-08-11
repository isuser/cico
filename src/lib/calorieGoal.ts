import type { ActivityLevel, Gender } from '@/db';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export const ACTIVITY_LEVEL_INFO: { value: ActivityLevel; labelKey: string; descriptionKey: string }[] = [
  {
    value: 'sedentary',
    labelKey: 'activityLevel.sedentary.label',
    descriptionKey: 'activityLevel.sedentary.description',
  },
  {
    value: 'lightly_active',
    labelKey: 'activityLevel.lightlyActive.label',
    descriptionKey: 'activityLevel.lightlyActive.description',
  },
  {
    value: 'moderately_active',
    labelKey: 'activityLevel.moderatelyActive.label',
    descriptionKey: 'activityLevel.moderatelyActive.description',
  },
  {
    value: 'very_active',
    labelKey: 'activityLevel.veryActive.label',
    descriptionKey: 'activityLevel.veryActive.description',
  },
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
