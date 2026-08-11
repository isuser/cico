import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getFoodById, useDatabase, type FoodLog } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function EditEntrySheet({
  log,
  onClose,
  onSave,
}: {
  log: FoodLog | null;
  onClose: () => void;
  onSave: (id: number, grams: number, calories: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const db = useDatabase();
  const [grams, setGrams] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!log) return;
    setGrams(String(log.grams));
    getFoodById(db, log.food_id).then((food) => setCaloriesPer100g(food?.calories_per_100g ?? null));
  }, [log, db]);

  const gramsNumber = Number(grams);
  const previewCalories =
    caloriesPer100g !== null && gramsNumber > 0 ? Math.round((caloriesPer100g * gramsNumber) / 100) : null;
  const isValid = gramsNumber > 0 && previewCalories !== null;

  const handleSave = async () => {
    if (!log || !isValid || previewCalories === null || saving) return;
    setSaving(true);
    try {
      await onSave(log.id, gramsNumber, previewCalories);
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
            <ThemedText type="subtitle">{log?.food_name}</ThemedText>
            <FormField
              label={t('cico.editEntry.amount')}
              value={grams}
              onChangeText={setGrams}
              keyboardType="decimal-pad"
              suffix="g"
              autoFocus
            />
            {previewCalories !== null ? (
              <ThemedText type="label" themeColor="textSecondary">
                {t('cico.editEntry.caloriesPreview', { calories: previewCalories.toLocaleString() })}
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
