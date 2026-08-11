import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Units } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
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
  const { t } = useTranslation();
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
        <ThemedText type="bold">{t('dashboard.weightCard.title')}</ThemedText>
        <ThemedText type="label" themeColor="textSecondary" style={{ marginTop: 2 }}>
          {displayWeight !== null && latestWeightDate !== null
            ? t('dashboard.weightCard.lastEntry', {
                weight: displayWeight,
                unit: unitLabel,
                date: formatDayLabel(latestWeightDate, todayIso, t),
              })
            : t('dashboard.weightCard.neverPrompted')}
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
          {t('dashboard.weightCard.add')}
        </ThemedText>
      </Pressable>
    </View>
  );
}
