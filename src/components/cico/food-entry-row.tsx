import { useRef } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { FoodLog } from '@/db';

const DANGER = '#EF4444';

export function FoodEntryRow({
  log,
  onPress,
  onDelete,
}: {
  log: FoodLog;
  onPress: () => void;
  onDelete: () => void;
}) {
  const swipeableRef = useRef<Swipeable>(null);

  const confirmDelete = () => {
    Alert.alert('Delete entry?', `Remove "${log.food_name}" from this meal.`, [
      { text: 'Cancel', style: 'cancel', onPress: () => swipeableRef.current?.close() },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
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
            Delete
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
          <ThemedText type="default">{log.food_name}</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            {log.calories} kcal
          </ThemedText>
        </View>
      </Pressable>
    </Swipeable>
  );
}
