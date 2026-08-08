import { useCallback, useEffect, useState } from 'react';

import { getFoodLogsForDateRange, getProfile, getWeightLogsForRange, useDatabase } from '@/db';
import { getWeekDates } from '@/lib/date';

export type WeekSummary = {
  loading: boolean;
  weekDates: string[];
  /** Total calories logged per date — dates with no entries are simply absent. */
  dayTotals: Record<string, number>;
  calorieGoal: number | null;
  latestWeightKg: number | null;
  latestWeightDate: string | null;
  refresh: () => Promise<void>;
};

export function useWeekSummary(weekStart: Date): WeekSummary {
  const db = useDatabase();
  const [loading, setLoading] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [dayTotals, setDayTotals] = useState<Record<string, number>>({});
  const [latestWeightKg, setLatestWeightKg] = useState<number | null>(null);
  const [latestWeightDate, setLatestWeightDate] = useState<string | null>(null);

  const weekDates = getWeekDates(weekStart);
  const startIso = weekDates[0];
  const endIso = weekDates[6];

  const load = useCallback(async () => {
    setLoading(true);
    const [profile, logs, weightLogs] = await Promise.all([
      getProfile(db),
      getFoodLogsForDateRange(db, startIso, endIso),
      getWeightLogsForRange(db, startIso, endIso),
    ]);

    const totals: Record<string, number> = {};
    for (const log of logs) {
      totals[log.date] = (totals[log.date] ?? 0) + log.calories;
    }
    // getWeightLogsForRange returns oldest-to-newest — the last entry is this week's most recent.
    const latestWeightThisWeek = weightLogs.at(-1) ?? null;

    setDayTotals(totals);
    setCalorieGoal(profile?.calorie_goal ?? null);
    setLatestWeightKg(latestWeightThisWeek?.weight ?? null);
    setLatestWeightDate(latestWeightThisWeek?.date ?? null);
    setLoading(false);
  }, [db, startIso, endIso]);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, weekDates, dayTotals, calorieGoal, latestWeightKg, latestWeightDate, refresh: load };
}
