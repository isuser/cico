import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RecentDaysList } from '@/components/dashboard/recent-days-list';
import { WeeklyChart } from '@/components/dashboard/weekly-chart';
import { WeightLogCard } from '@/components/dashboard/weight-log-card';
import { WeightLogModal } from '@/components/dashboard/weight-log-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { getProfile, upsertWeightLogForDate, useDatabase, type DayOfWeek, type Units } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useWeekSummary } from '@/hooks/use-week-summary';
import { addDays, formatWeekRange, startOfWeek, toISODate } from '@/lib/date';

export default function DashboardScreen() {
  const theme = useTheme();
  const db = useDatabase();
  const today = useMemo(() => new Date(), []);
  const todayIso = toISODate(today);

  const [firstDayOfWeek, setFirstDayOfWeek] = useState<DayOfWeek>('monday');
  const [units, setUnits] = useState<Units>('metric');
  const currentWeekStart = useMemo(
    () => startOfWeek(today, firstDayOfWeek),
    [today, firstDayOfWeek]
  );

  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const { loading, weekDates, dayTotals, calorieGoal, latestWeightKg, latestWeightDate, refresh } =
    useWeekSummary(weekStart);

  const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime();
  const canGoForward = !isCurrentWeek;

  // Re-checks profile-derived preferences on every focus, since they can change in the
  // Profile tab while this screen stays mounted (native tabs don't unmount on switch).
  useFocusEffect(
    useCallback(() => {
      getProfile(db).then((profile) => {
        if (!profile) return;
        setFirstDayOfWeek(profile.first_day_of_week);
        setUnits(profile.units);
      });
    }, [db])
  );

  // Keeps weekStart pinned to "current week" across a first-day-of-week change, without
  // disturbing a user who has navigated to a past week.
  const wasCurrentWeek = useRef(isCurrentWeek);
  useEffect(() => {
    if (wasCurrentWeek.current) {
      setWeekStart(currentWeekStart);
    }
  }, [currentWeekStart]);
  useEffect(() => {
    wasCurrentWeek.current = isCurrentWeek;
  });

  const handleSaveWeight = async (weightKg: number) => {
    await upsertWeightLogForDate(db, todayIso, weightKg);
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText type="display">Dashboard</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
              <Pressable onPress={() => setWeekStart((w) => addDays(w, -7))} hitSlop={8}>
                <ThemedText type="default" themeColor="textSecondary">
                  ‹
                </ThemedText>
              </Pressable>
              <ThemedText type="small" themeColor="textSecondary">
                {formatWeekRange(weekStart)}
              </ThemedText>
              <Pressable
                onPress={() => canGoForward && setWeekStart((w) => addDays(w, 7))}
                disabled={!canGoForward}
                hitSlop={8}>
                <ThemedText
                  type="default"
                  themeColor="textSecondary"
                  style={!canGoForward ? { opacity: 0.3 } : undefined}>
                  ›
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {!loading && (
            <>
              <WeeklyChart
                weekDates={weekDates}
                dayTotals={dayTotals}
                todayIso={todayIso}
                calorieGoal={calorieGoal}
              />

              {isCurrentWeek ? (
                <WeightLogCard
                  latestWeightKg={latestWeightKg}
                  latestWeightDate={latestWeightDate}
                  todayIso={todayIso}
                  units={units}
                  onAdd={() => setWeightModalVisible(true)}
                />
              ) : null}

              <RecentDaysList
                weekDates={weekDates}
                dayTotals={dayTotals}
                todayIso={todayIso}
                calorieGoal={calorieGoal}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <WeightLogModal
        visible={weightModalVisible}
        units={units}
        onClose={() => setWeightModalVisible(false)}
        onSave={handleSaveWeight}
      />
    </ThemedView>
  );
}
