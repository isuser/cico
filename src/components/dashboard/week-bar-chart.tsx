import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
import { weekdayLetter } from '@/lib/date';

export const CHART_HEIGHT = 120;
const MIN_BAR_HEIGHT = 24;
const EMPTY_BAR_HEIGHT = 12;
const BAR_WIDTH = 28;

export function WeekBarChart({
  weekDates,
  dayTotals,
  todayIso,
  barColor,
}: {
  weekDates: string[];
  dayTotals: Record<string, number>;
  todayIso: string;
  barColor: string;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const daysWithData = weekDates.filter((date) => (dayTotals[date] ?? 0) > 0);
  const maxValue = Math.max(0, ...daysWithData.map((date) => dayTotals[date]));

  return (
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
                  backgroundColor: hasData ? barColor : theme.border,
                  opacity: hasData && !isToday ? 0.35 : 1,
                }}
              />
            </View>
            <ThemedText
              type="label"
              themeColor={isToday ? undefined : 'textSecondary'}
              style={isToday ? { color: barColor, fontFamily: FontFamily.bold } : undefined}>
              {weekdayLetter(date, t)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}
