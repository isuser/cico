import { useRef } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ExerciseLog } from '@/db';
import { useTranslation } from '@/i18n/context';

const DANGER = '#EF4444';

export function ExerciseEntryRow({
  log,
  onPress,
  onDelete,
}: {
  log: ExerciseLog;
  onPress: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);

  const confirmDelete = () => {
    Alert.alert(
      t('cico.deleteExerciseEntry.title'),
      t('cico.deleteExerciseEntry.message', { name: log.activity_name }),
      [
        { text: t('common.cancel'), style: 'cancel', onPress: () => swipeableRef.current?.close() },
        { text: t('common.delete'), style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <Pressable
          onPress={confirmDelete}
          style={{
            backgroundColor: DANGER,
            justifyContent: 'center',
            alignItems: 'center',
            width: 88,
          }}>
          <ThemedText type="bold" style={{ color: '#ffffff' }}>
            {t('common.delete')}
          </ThemedText>
        </Pressable>
      )}>
      <Pressable onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: Spacing.two,
          }}>
          <ThemedText type="default">{log.activity_name}</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            {t('cico.exerciseEntrySummary', {
              minutes: log.duration_minutes,
              calories: log.calories_burned,
            })}
          </ThemedText>
        </View>
      </Pressable>
    </Swipeable>
  );
}
