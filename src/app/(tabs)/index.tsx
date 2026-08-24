import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddExerciseSheet } from '@/components/add-exercise/add-exercise-sheet';
import { AddFoodSheet } from '@/components/add-food/add-food-sheet';
import { CalorieSummaryCard } from '@/components/cico/calorie-summary-card';
import { DayHeader } from '@/components/cico/day-header';
import { EditEntrySheet } from '@/components/cico/edit-entry-sheet';
import { EditExerciseSheet } from '@/components/cico/edit-exercise-sheet';
import { ExerciseSection } from '@/components/cico/exercise-section';
import { MealSection } from '@/components/cico/meal-section';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import {
  deleteExerciseLog,
  deleteFoodLog,
  sumCaloriesBurned,
  updateExerciseLog,
  updateFoodLog,
  useDatabase,
  type ExerciseLog,
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
  const { loading, logs, exerciseLogs, calorieGoal, weightKg, refresh } = useDayLog(dateIso);

  const [addFoodMeal, setAddFoodMeal] = useState<MealType | null>(null);
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null);
  const [addingExercise, setAddingExercise] = useState(false);
  const [editingExerciseLog, setEditingExerciseLog] = useState<ExerciseLog | null>(null);

  const consumed = logs.reduce((sum, log) => sum + log.calories, 0);
  const caloriesBurned = sumCaloriesBurned(exerciseLogs);
  const logsByMeal = MEAL_TYPES.reduce<Record<MealType, FoodLog[]>>(
    (acc, meal) => {
      acc[meal] = logs.filter((log) => log.meal_type === meal);
      return acc;
    },
    { breakfast: [], lunch: [], snacks: [], dinner: [] }
  );

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

  const handleEditExerciseSave = async (id: number, durationMinutes: number, caloriesBurned: number) => {
    const log = exerciseLogs.find((l) => l.id === id);
    if (!log) return;
    await updateExerciseLog(db, id, {
      activity_name: log.activity_name,
      met_value: log.met_value,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
    });
    await refresh();
  };

  const handleDeleteExercise = async (log: ExerciseLog) => {
    await deleteExerciseLog(db, log.id);
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
              <CalorieSummaryCard
                consumed={consumed}
                calorieGoal={calorieGoal}
                caloriesBurned={caloriesBurned}
              />

              {MEAL_TYPES.map((meal) => (
                <MealSection
                  key={meal}
                  mealType={meal}
                  logs={logsByMeal[meal]}
                  onAdd={() => setAddFoodMeal(meal)}
                  onEdit={setEditingLog}
                  onDelete={handleDelete}
                />
              ))}

              <ExerciseSection
                logs={exerciseLogs}
                onAdd={() => setAddingExercise(true)}
                onEdit={setEditingExerciseLog}
                onDelete={handleDeleteExercise}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <AddFoodSheet
        mealType={addFoodMeal}
        date={dateIso}
        onClose={() => setAddFoodMeal(null)}
        onLogged={refresh}
      />
      <EditEntrySheet log={editingLog} onClose={() => setEditingLog(null)} onSave={handleEditSave} />

      <AddExerciseSheet
        visible={addingExercise}
        date={dateIso}
        weightKg={weightKg}
        onClose={() => setAddingExercise(false)}
        onLogged={refresh}
      />
      <EditExerciseSheet
        log={editingExerciseLog}
        weightKg={weightKg}
        onClose={() => setEditingExerciseLog(null)}
        onSave={handleEditExerciseSave}
      />
    </ThemedView>
  );
}
