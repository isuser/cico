import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { calculateCaloriesBurned, type ExerciseLog } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function EditExerciseSheet({
  log,
  weightKg,
  onClose,
  onSave,
}: {
  log: ExerciseLog | null;
  weightKg: number | null;
  onClose: () => void;
  onSave: (id: number, durationMinutes: number, caloriesBurned: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!log) return;
    setMinutes(String(log.duration_minutes));
  }, [log]);

  const minutesNumber = Number(minutes);
  const previewCalories =
    log && weightKg !== null && minutesNumber > 0
      ? calculateCaloriesBurned({ metValue: log.met_value, weightKg, durationMinutes: minutesNumber })
      : null;
  const isValid = minutesNumber > 0 && previewCalories !== null;

  const handleSave = async () => {
    if (!log || !isValid || previewCalories === null || saving) return;
    setSaving(true);
    try {
      await onSave(log.id, minutesNumber, previewCalories);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={log !== null} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <ThemedView
          style={{
            borderTopLeftRadius: Spacing.five,
            borderTopRightRadius: Spacing.five,
            padding: Spacing.four,
          }}>
          <SafeAreaView edges={['bottom']} style={{ gap: Spacing.three }}>
            <ThemedText type="subtitle">{log?.activity_name}</ThemedText>
            <FormField
              label={t('cico.editExerciseEntry.duration')}
              value={minutes}
              onChangeText={setMinutes}
              keyboardType="decimal-pad"
              suffix="min"
              autoFocus
            />
            {previewCalories !== null ? (
              <ThemedText type="label" themeColor="textSecondary">
                {t('cico.editExerciseEntry.caloriesPreview', {
                  calories: previewCalories.toLocaleString(),
                })}
              </ThemedText>
            ) : null}
            <Pressable
              onPress={handleSave}
              disabled={!isValid || saving}
              style={{
                backgroundColor: isValid ? theme.accent : '#9CA3AF',
                paddingVertical: Spacing.three,
                borderRadius: Spacing.three,
                alignItems: 'center',
                marginTop: Spacing.two,
              }}>
              <ThemedText type="default" style={{ color: '#ffffff' }}>
                {saving ? t('common.saving') : t('common.save')}
              </ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: 'center', paddingVertical: Spacing.two }}>
              <ThemedText type="default" themeColor="textSecondary">
                {t('common.cancel')}
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </ThemedView>
      </View>
    </Modal>
  );
}
