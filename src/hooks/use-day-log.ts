import { useCallback, useEffect, useState } from 'react';

import { getFoodLogsForDate, getProfile, useDatabase, type FoodLog } from '@/db';

export type DayLog = {
  loading: boolean;
  logs: FoodLog[];
  calorieGoal: number | null;
  refresh: () => Promise<void>;
};

export function useDayLog(date: string): DayLog {
  const db = useDatabase();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [profile, dayLogs] = await Promise.all([getProfile(db), getFoodLogsForDate(db, date)]);
    setCalorieGoal(profile?.calorie_goal ?? null);
    setLogs(dayLogs);
    setLoading(false);
  }, [db, date]);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, logs, calorieGoal, refresh: load };
}
