import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDayLabel } from '@/lib/date';

export function WeightLogCard({
  latestWeightKg,
  latestWeightDate,
  todayIso,
  onAdd,
}: {
  latestWeightKg: number | null;
  latestWeightDate: string | null;
  todayIso: string;
  onAdd: () => void;
}) {
  const theme = useTheme();

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
          {latestWeightKg !== null && latestWeightDate !== null
            ? `Last: ${latestWeightKg} kg · ${formatDayLabel(latestWeightDate, todayIso)}`
            : 'Never prompted — always optional'}
        </ThemedText>
      </View>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          {
            backgroundColor: theme.buttonSecondary,
            paddingVertical: Spacing.two,
            paddingHorizontal: Spacing.three,
            borderRadius: Spacing.two,
          },
          pressed && { opacity: 0.7 },
        ]}>
        <ThemedText type="bold" style={{ color: theme.accent }}>
          + Add
        </ThemedText>
      </Pressable>
    </View>
  );
}
