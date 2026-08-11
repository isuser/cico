import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Units } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { formatDayLabel } from '@/lib/date';
import { kgToLbsRounded } from '@/lib/units';

export function WeightLogCard({
  latestWeightKg,
  latestWeightDate,
  todayIso,
  units,
  onAdd,
}: {
  latestWeightKg: number | null;
  latestWeightDate: string | null;
  todayIso: string;
  units: Units;
  onAdd: () => void;
}) {
  const theme = useTheme();
  const isImperial = units === 'imperial';
  const displayWeight =
    latestWeightKg !== null ? (isImperial ? kgToLbsRounded(latestWeightKg) : latestWeightKg) : null;
  const unitLabel = isImperial ? 'lbs' : 'kg';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: theme.border,
        borderRadius: Spacing.five,
        paddingVertical: Spacing.three,
        paddingHorizontal: Spacing.four,
      }}>
      <View style={{ flex: 1 }}>
        <ThemedText type="bold">Log this week&rsquo;s weight</ThemedText>
        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: 2 }}>
          {displayWeight !== null && latestWeightDate !== null
            ? `Last: ${displayWeight} ${unitLabel} · ${formatDayLabel(latestWeightDate, todayIso)}`
            : 'Never prompted — always optional'}
        </ThemedText>
      </View>
      <Pressable
        onPress={onAdd}
        style={{
          backgroundColor: theme.buttonSecondary,
          paddingVertical: Spacing.two,
          paddingHorizontal: Spacing.three,
          borderRadius: Spacing.two,
        }}>
        <ThemedText type="bold" style={{ color: theme.accent }}>
          + Add
        </ThemedText>
      </Pressable>
    </View>
  );
}
