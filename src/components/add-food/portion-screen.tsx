import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Food } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function PortionScreen({
  food,
  mealLabel,
  onClose,
  onLog,
}: {
  food: Food;
  mealLabel: string;
  onClose: () => void;
  onLog: (grams: number, calories: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [grams, setGrams] = useState('');
  const [saving, setSaving] = useState(false);

  const gramsNumber = Number(grams);
  const previewCalories =
    gramsNumber > 0 ? Math.round((food.calories_per_100g * gramsNumber) / 100) : null;
  const isValid = previewCalories !== null;

  const handleLog = async () => {
    if (!isValid || previewCalories === null || saving) return;
    setSaving(true);
    try {
      await onLog(gramsNumber, previewCalories);
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
            {food.name}
          </ThemedText>
          <Pressable onPress={onClose} hitSlop={8}>
            <ThemedText type="default" themeColor="textSecondary">
              ✕
            </ThemedText>
          </Pressable>
        </View>
        {food.reference_portion ? (
          <ThemedText type="label" themeColor="textSecondary">
            {food.reference_portion}
          </ThemedText>
        ) : null}

        <FormField
          label={t('addFood.portion.title')}
          value={grams}
          onChangeText={setGrams}
          keyboardType="decimal-pad"
          suffix="g"
          autoFocus
        />

        {previewCalories !== null ? (
          <ThemedText type="label" themeColor="textSecondary">
            {t('addFood.portion.equation', { grams: gramsNumber, calories: previewCalories.toLocaleString() })}
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
            {saving ? t('common.saving') : t('addFood.portion.logTo', { meal: mealLabel })}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
