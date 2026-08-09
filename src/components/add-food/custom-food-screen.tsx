import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function CustomFoodScreen({
  mealLabel,
  onBack,
  onSubmit,
}: {
  mealLabel: string;
  onBack: () => void;
  onSubmit: (data: { name: string; caloriesPer100g: number; referencePortion: string | null }) => Promise<void>;
}) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [referencePortion, setReferencePortion] = useState('');
  const [saving, setSaving] = useState(false);

  const isValid = name.trim().length > 0 && Number(caloriesPer100g) > 0;

  const handleSubmit = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        caloriesPer100g: Number(caloriesPer100g),
        referencePortion: referencePortion.trim().length > 0 ? referencePortion.trim() : null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView
      style={{
        height: '80%',
        borderTopLeftRadius: Spacing.five,
        borderTopRightRadius: Spacing.five,
      }}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1, padding: Spacing.four, gap: Spacing.three }}>
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.border,
            alignSelf: 'center',
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
          <Pressable onPress={onBack} hitSlop={12}>
            <ThemedText type="subtitle" themeColor="textSecondary" style={{ fontSize: 22 }}>
              ‹
            </ThemedText>
          </Pressable>
          <ThemedText type="bold" style={{ fontSize: 19 }}>
            Custom Food
          </ThemedText>
        </View>

        <View style={{ flex: 1, gap: Spacing.three }}>
          <FormField
            label="Food name"
            value={name}
            onChangeText={setName}
            placeholder="Homemade granola bar"
            autoFocus
          />
          <FormField
            label="Calories per 100g"
            value={caloriesPer100g}
            onChangeText={setCaloriesPer100g}
            keyboardType="number-pad"
            placeholder="433"
            suffix="kcal"
          />
          <FormField
            label="Reference portion (optional)"
            value={referencePortion}
            onChangeText={setReferencePortion}
            placeholder="1 bar (45g)"
          />
          <View
            style={{
              flexDirection: 'row',
              gap: Spacing.two,
              backgroundColor: theme.accentSoft,
              borderRadius: Spacing.three,
              padding: Spacing.three,
            }}>
            <ThemedText type="bold" style={{ color: theme.accent }}>
              !
            </ThemedText>
            <ThemedText type="label" themeColor="textSecondary" style={{ flex: 1 }}>
              This food is saved for reuse. When you log it, enter the grams you ate and calories
              are calculated automatically.
            </ThemedText>
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!isValid || saving}
          style={{
            backgroundColor: isValid ? theme.accent : '#9CA3AF',
            paddingVertical: Spacing.three,
            borderRadius: Spacing.three,
            alignItems: 'center',
          }}>
          <ThemedText type="default" style={{ color: '#ffffff' }}>
            {saving ? 'Saving…' : `Add to ${mealLabel}`}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
