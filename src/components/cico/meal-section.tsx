import { Pressable, View } from 'react-native';

import { FoodEntryRow } from '@/components/cico/food-entry-row';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { FoodLog, MealType } from '@/db';
import { useTheme } from '@/hooks/use-theme';

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
};

export function MealSection({
  mealType,
  logs,
  onAdd,
  onEdit,
  onDelete,
}: {
  mealType: MealType;
  logs: FoodLog[];
  onAdd: () => void;
  onEdit: (log: FoodLog) => void;
  onDelete: (log: FoodLog) => void;
}) {
  const theme = useTheme();
  const subtotal = logs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <View style={{ gap: Spacing.two }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: Spacing.two }}>
          <ThemedText type="bold" style={{ fontSize: 16 }}>
            {MEAL_LABELS[mealType]}
          </ThemedText>
          {logs.length > 0 ? (
            <ThemedText type="label" themeColor="textSecondary">
              {subtotal.toLocaleString()} kcal
            </ThemedText>
          ) : null}
        </View>
        <Pressable
          onPress={onAdd}
          hitSlop={8}
          style={{
            width: 28,
            height: 28,
            borderRadius: Spacing.two,
            backgroundColor: theme.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ThemedText type="bold" style={{ color: theme.accent, fontSize: 16 }}>
            +
          </ThemedText>
        </Pressable>
      </View>

      {logs.length === 0 ? (
        <ThemedText type="label" themeColor="textSecondary">
          Tap + to log your first meal
        </ThemedText>
      ) : (
        <View>
          {logs.map((log) => (
            <FoodEntryRow
              key={log.id}
              log={log}
              onPress={() => onEdit(log)}
              onDelete={() => onDelete(log)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
