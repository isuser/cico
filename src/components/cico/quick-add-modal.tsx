import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { MealType } from '@/db';
import { useTheme } from '@/hooks/use-theme';

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
};

/**
 * Stand-in for the real Add Food flow (search / barcode / custom entry —
 * CIC-5, not built yet). Lets the CICO tab actually be exercised
 * end-to-end in the meantime: name + calories only, no portion sizing.
 */
export function QuickAddModal({
  mealType,
  onClose,
  onSave,
}: {
  mealType: MealType | null;
  onClose: () => void;
  onSave: (name: string, calories: number) => Promise<void>;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [saving, setSaving] = useState(false);
  const isValid = name.trim().length > 0 && Number(calories) > 0;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave(name.trim(), Number(calories));
      setName('');
      setCalories('');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={mealType !== null} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <ThemedView
          style={{
            borderTopLeftRadius: Spacing.five,
            borderTopRightRadius: Spacing.five,
            padding: Spacing.four,
          }}>
          <SafeAreaView edges={['bottom']} style={{ gap: Spacing.three }}>
            <ThemedText type="subtitle">
              Add to {mealType ? MEAL_LABELS[mealType] : ''}
            </ThemedText>
            <FormField label="Food name" value={name} onChangeText={setName} placeholder="Banana" autoFocus />
            <FormField
              label="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="number-pad"
              suffix="kcal"
            />
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
                {saving ? 'Saving…' : 'Add'}
              </ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: 'center', paddingVertical: Spacing.two }}>
              <ThemedText type="default" themeColor="textSecondary">
                Cancel
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </ThemedView>
      </View>
    </Modal>
  );
}
