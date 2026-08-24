import { Pressable, View } from 'react-native';

import { ExerciseEntryRow } from '@/components/cico/exercise-entry-row';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { sumCaloriesBurned, type ExerciseLog } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function ExerciseSection({
  logs,
  onAdd,
  onEdit,
  onDelete,
}: {
  logs: ExerciseLog[];
  onAdd: () => void;
  onEdit: (log: ExerciseLog) => void;
  onDelete: (log: ExerciseLog) => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const subtotal = sumCaloriesBurned(logs);

  return (
    <View style={{ gap: Spacing.two }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: Spacing.two }}>
          <ThemedText type="bold" style={{ fontSize: 16, lineHeight: 20 }}>
            {t('cico.exerciseSection.title')}
          </ThemedText>
          {logs.length > 0 ? (
            <ThemedText type="label" themeColor="textSecondary">
              {t('cico.exerciseSection.subtotal', { subtotal: subtotal.toLocaleString() })}
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
          <ThemedText type="bold" style={{ color: theme.accent, fontSize: 16, lineHeight: 20 }}>
            +
          </ThemedText>
        </Pressable>
      </View>

      {logs.length === 0 ? (
        <ThemedText type="label" themeColor="textSecondary">
          {t('cico.exerciseSection.emptyState')}
        </ThemedText>
      ) : (
        <View>
          {logs.map((log) => (
            <ExerciseEntryRow
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
