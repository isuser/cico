import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDayLabel, weekdayLetter } from '@/lib/date';

export function RecentDaysList({
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
  const daysWithData = [...weekDates].filter((date) => (dayTotals[date] ?? 0) > 0).reverse();

  if (daysWithData.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: Spacing.three }}>
      <ThemedText type="label" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
        This week
      </ThemedText>
      <View>
        {daysWithData.map((date, index) => {
          const total = dayTotals[date];
          const isToday = date === todayIso;
          const delta = calorieGoal !== null ? total - calorieGoal : null;

          return (
            <View
              key={date}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.three,
                paddingVertical: Spacing.three,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: theme.border,
              }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: Spacing.two,
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday ? theme.accent : theme.backgroundElement,
                }}>
                <ThemedText type="smallBold" style={isToday ? { color: '#ffffff' } : undefined}>
                  {weekdayLetter(date)}
                </ThemedText>
              </View>

              <View style={{ flex: 1 }}>
                <ThemedText type="bold">{formatDayLabel(date, todayIso)}</ThemedText>
                <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: 2 }}>
                  {total.toLocaleString()} kcal logged
                </ThemedText>
              </View>

              {delta !== null ? (
                <ThemedText type="bold" style={{ color: delta <= 0 ? theme.success : theme.accent }}>
                  {delta > 0 ? '+' : ''}
                  {delta.toLocaleString()}
                </ThemedText>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
