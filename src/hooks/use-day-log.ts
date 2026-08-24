import { useCallback, useEffect, useState } from 'react';

import {
  getExerciseLogsForDate,
  getFoodLogsForDate,
  getProfile,
  useDatabase,
  type ExerciseLog,
  type FoodLog,
} from '@/db';

export type DayLog = {
  loading: boolean;
  logs: FoodLog[];
  exerciseLogs: ExerciseLog[];
  calorieGoal: number | null;
  weightKg: number | null;
  refresh: () => Promise<void>;
};

export function useDayLog(date: string): DayLog {
  const db = useDatabase();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [profile, dayLogs, dayExerciseLogs] = await Promise.all([
      getProfile(db),
      getFoodLogsForDate(db, date),
      getExerciseLogsForDate(db, date),
    ]);
    setCalorieGoal(profile?.calorie_goal ?? null);
    setWeightKg(profile?.weight ?? null);
    setLogs(dayLogs);
    setExerciseLogs(dayExerciseLogs);
    setLoading(false);
  }, [db, date]);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, logs, exerciseLogs, calorieGoal, weightKg, refresh: load };
}
