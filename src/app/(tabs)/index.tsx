import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalorieSummaryCard } from '@/components/cico/calorie-summary-card';
import { DayHeader } from '@/components/cico/day-header';
import { EditEntrySheet } from '@/components/cico/edit-entry-sheet';
import { MealSection } from '@/components/cico/meal-section';
import { QuickAddModal } from '@/components/cico/quick-add-modal';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import {
  deleteFoodLog,
  insertFood,
  insertFoodLog,
  updateFoodLog,
  useDatabase,
  type FoodLog,
  type MealType,
} from '@/db';
import { useDayLog } from '@/hooks/use-day-log';
import { addDays, toISODate } from '@/lib/date';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snacks', 'dinner'];

export default function CicoScreen() {
  const db = useDatabase();
  const today = useMemo(() => new Date(), []);
  const todayIso = toISODate(today);

  const [selectedDate, setSelectedDate] = useState(today);
  const dateIso = toISODate(selectedDate);
  const { loading, logs, calorieGoal, refresh } = useDayLog(dateIso);

  const [quickAddMeal, setQuickAddMeal] = useState<MealType | null>(null);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);

  const consumed = logs.reduce((sum, log) => sum + log.calories, 0);
  const logsByMeal = MEAL_TYPES.reduce<Record<MealType, FoodLog[]>>(
    (acc, meal) => {
      acc[meal] = logs.filter((log) => log.meal_type === meal);
      return acc;
    },
    { breakfast: [], lunch: [], snacks: [], dinner: [] }
  );

  const handleQuickAdd = async (name: string, calories: number) => {
    if (!quickAddMeal) return;
    const food = await insertFood(db, {
      name,
      calories_per_100g: calories,
      protein_g: null,
      fat_g: null,
      saturated_fat_g: null,
      carbs_g: null,
      sugar_g: null,
      fiber_g: null,
      sodium_mg: null,
      salt_g: null,
      source: 'custom',
      barcode: null,
      fetched_at: null,
    });
    await insertFoodLog(db, {
      food_id: food.id,
      date: dateIso,
      meal_type: quickAddMeal,
      food_name: name,
      grams: 100,
      calories,
    });
    await refresh();
  };

  const handleEditSave = async (id: number, grams: number, calories: number) => {
    const log = logs.find((l) => l.id === id);
    if (!log) return;
    await updateFoodLog(db, id, { food_id: log.food_id, food_name: log.food_name, grams, calories });
    await refresh();
  };

  const handleDelete = async (log: FoodLog) => {
    await deleteFoodLog(db, log.id);
    await refresh();
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            padding: Spacing.four,
            gap: Spacing.four,
            paddingBottom: BottomTabInset + Spacing.four,
          }}>
          <DayHeader
            date={dateIso}
            todayIso={todayIso}
            onPrev={() => setSelectedDate((d) => addDays(d, -1))}
            onNext={() => setSelectedDate((d) => addDays(d, 1))}
          />

          {!loading && (
            <>
              <CalorieSummaryCard consumed={consumed} calorieGoal={calorieGoal} />

              {MEAL_TYPES.map((meal) => (
                <MealSection
                  key={meal}
                  mealType={meal}
                  logs={logsByMeal[meal]}
                  onAdd={() => setQuickAddMeal(meal)}
                  onEdit={setEditingLog}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <QuickAddModal mealType={quickAddMeal} onClose={() => setQuickAddMeal(null)} onSave={handleQuickAdd} />
      <EditEntrySheet log={editingLog} onClose={() => setEditingLog(null)} onSave={handleEditSave} />
    </ThemedView>
  );
}
