import { View } from 'react-native';

import { WeekBarChart } from '@/components/dashboard/week-bar-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function ExerciseWeeklyChart({
  weekDates,
  dayTotals,
  todayIso,
}: {
  weekDates: string[];
  dayTotals: Record<string, number>;
  todayIso: string;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const daysWithData = weekDates.filter((date) => (dayTotals[date] ?? 0) > 0);
  const isEmpty = daysWithData.length === 0;
  const weekTotal = daysWithData.reduce((sum, date) => sum + dayTotals[date], 0);

  return (
    <ThemedView type="accentSoft" style={{ borderRadius: Spacing.five, padding: Spacing.three }}>
      <ThemedText type="bold" style={{ fontSize: 16, lineHeight: 20, marginBottom: Spacing.three }}>
        {t('dashboard.exercise.title')}
      </ThemedText>

      <WeekBarChart
        weekDates={weekDates}
        dayTotals={dayTotals}
        todayIso={todayIso}
        barColor={theme.success}
      />

      {isEmpty ? (
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={{ textAlign: 'center', marginTop: Spacing.four }}>
          {t('dashboard.exercise.emptyState')}
        </ThemedText>
      ) : (
        <View
          style={{
            marginTop: Spacing.four,
            paddingTop: Spacing.three,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}>
          <ThemedText type="label" themeColor="textSecondary">
            {t('dashboard.exercise.weekTotal')}
          </ThemedText>
          <ThemedText type="stat">
            {t('dashboard.exercise.weekTotalValue', { value: weekTotal.toLocaleString() })}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
