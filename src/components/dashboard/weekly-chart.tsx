import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { weekdayLetter } from '@/lib/date';

const CHART_HEIGHT = 120;
const MIN_BAR_HEIGHT = 24;
const EMPTY_BAR_HEIGHT = 12;
const BAR_WIDTH = 28;

export function WeeklyChart({
  weekDates,
  dayTotals,
  todayIso,
  calorieGoal,
}: {
  weekDates: string[];
  dayTotals: Record<string, number>;
  todayIso: string;
  calorieGoal: number | null;
}) {
  const theme = useTheme();
  const daysWithData = weekDates.filter((date) => (dayTotals[date] ?? 0) > 0);
  const isEmpty = daysWithData.length === 0;
  const maxValue = Math.max(0, ...daysWithData.map((date) => dayTotals[date]));

  const weekAvg = isEmpty
    ? 0
    : Math.round(daysWithData.reduce((sum, date) => sum + dayTotals[date], 0) / daysWithData.length);
  const vsGoal = calorieGoal !== null ? weekAvg - calorieGoal : null;

  return (
    <ThemedView type="accentSoft" style={{ borderRadius: Spacing.five, padding: Spacing.three }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: Spacing.two,
          height: CHART_HEIGHT,
        }}>
        {weekDates.map((date) => {
          const value = dayTotals[date] ?? 0;
          const hasData = value > 0;
          const isToday = date === todayIso;
          const barHeight = hasData
            ? Math.max(MIN_BAR_HEIGHT, Math.round((value / maxValue) * CHART_HEIGHT))
            : EMPTY_BAR_HEIGHT;

          return (
            <View key={date} style={{ width: BAR_WIDTH, alignItems: 'center', gap: Spacing.two }}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                  style={{
                    width: BAR_WIDTH,
                    height: barHeight,
                    borderRadius: Spacing.two,
                    backgroundColor: hasData ? theme.accent : theme.border,
                    opacity: hasData && !isToday ? 0.35 : 1,
                  }}
                />
              </View>
              <ThemedText
                type="label"
                themeColor={isToday ? undefined : 'textSecondary'}
                style={isToday ? { color: theme.accent, fontFamily: FontFamily.bold } : undefined}>
                {weekdayLetter(date)}
              </ThemedText>
            </View>
          );
        })}
      </View>

      {isEmpty ? (
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={{ textAlign: 'center', marginTop: Spacing.four }}>
          Log meals to see your weekly trends
        </ThemedText>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: Spacing.four,
            paddingTop: Spacing.three,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}>
          <View>
            <ThemedText type="label" themeColor="textSecondary">
              Week avg
            </ThemedText>
            <ThemedText type="stat">{weekAvg.toLocaleString()} kcal</ThemedText>
          </View>
          {vsGoal !== null ? (
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText type="label" themeColor="textSecondary">
                vs goal
              </ThemedText>
              <ThemedText type="stat" style={{ color: vsGoal <= 0 ? theme.success : theme.accent }}>
                {vsGoal > 0 ? '+' : ''}
                {vsGoal.toLocaleString()} kcal
              </ThemedText>
            </View>
          ) : null}
        </View>
      )}
    </ThemedView>
  );
}
