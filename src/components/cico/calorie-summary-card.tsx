import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function CalorieSummaryCard({
  consumed,
  calorieGoal,
}: {
  consumed: number;
  calorieGoal: number | null;
}) {
  const theme = useTheme();
  const goal = calorieGoal ?? 0;
  const remaining = goal - consumed;
  const pct = goal > 0 ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;

  return (
    <ThemedView type="accentSoft" style={{ borderRadius: Spacing.five, padding: Spacing.four, gap: Spacing.three }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <ThemedText type="label" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
            Consumed
          </ThemedText>
          <ThemedText
            type="stat"
            style={{ fontSize: 40, lineHeight: 48, letterSpacing: -0.8, color: theme.accent, marginTop: 2 }}>
            {consumed.toLocaleString()}
          </ThemedText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <ThemedText type="label" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
            Remaining
          </ThemedText>
          <ThemedText
            type="stat"
            style={{ fontSize: 40, lineHeight: 48, letterSpacing: -0.8, color: theme.success, marginTop: 2 }}>
            {remaining.toLocaleString()}
          </ThemedText>
        </View>
      </View>

      <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.border, overflow: 'hidden' }}>
        <View
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 4,
            backgroundColor: theme.accent,
          }}
        />
      </View>

      <ThemedText type="label" themeColor="textSecondary">
        of {goal.toLocaleString()} kcal goal
      </ThemedText>
    </ThemedView>
  );
}
