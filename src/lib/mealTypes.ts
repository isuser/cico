import type { MealType } from '@/db';

/** Translation keys for meal type labels — shared between meal-section.tsx and add-food-sheet.tsx. */
export const MEAL_TYPE_KEYS: Record<MealType, string> = {
  breakfast: 'mealTypes.breakfast',
  lunch: 'mealTypes.lunch',
  snacks: 'mealTypes.snacks',
  dinner: 'mealTypes.dinner',
};
