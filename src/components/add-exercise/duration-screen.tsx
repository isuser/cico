import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { calculateCaloriesBurned } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
import type { ExerciseActivity } from '@/lib/exerciseActivities';

export function DurationScreen({
  activity,
  weightKg,
  onClose,
  onLog,
}: {
  activity: ExerciseActivity;
  weightKg: number;
  onClose: () => void;
  onLog: (durationMinutes: number, caloriesBurned: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState('');
  const [saving, setSaving] = useState(false);

  const minutesNumber = Number(minutes);
  const previewCalories =
    minutesNumber > 0
      ? calculateCaloriesBurned({ metValue: activity.met, weightKg, durationMinutes: minutesNumber })
      : null;
  const isValid = previewCalories !== null;

  const handleLog = async () => {
    if (!isValid || previewCalories === null || saving) return;
    setSaving(true);
    try {
      await onLog(minutesNumber, previewCalories);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView
      style={{
        borderTopLeftRadius: Spacing.five,
        borderTopRightRadius: Spacing.five,
      }}>
      <SafeAreaView edges={['bottom']} style={{ padding: Spacing.four, gap: Spacing.three }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.border,
            alignSelf: 'center',
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText type="bold" style={{ fontSize: 19 }}>
            {activity.name}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={8}>
            <ThemedText type="default" themeColor="textSecondary">
              ✕
            </ThemedText>
          </Pressable>
        </View>

        <FormField
          label={t('addExercise.duration.title')}
          value={minutes}
          onChangeText={setMinutes}
          keyboardType="decimal-pad"
          suffix="min"
          autoFocus
        />

        {previewCalories !== null ? (
          <ThemedText type="label" themeColor="textSecondary">
            {t('addExercise.duration.equation', {
              minutes: minutesNumber,
              calories: previewCalories.toLocaleString(),
            })}
          </ThemedText>
        ) : null}

        <Pressable
          onPress={handleLog}
          disabled={!isValid || saving}
          style={{
            backgroundColor: isValid ? theme.accent : '#9CA3AF',
            paddingVertical: Spacing.three,
            borderRadius: Spacing.three,
            alignItems: 'center',
          }}>
          <ThemedText type="default" style={{ color: '#ffffff' }}>
            {saving ? t('common.saving') : t('addExercise.duration.logButton')}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
