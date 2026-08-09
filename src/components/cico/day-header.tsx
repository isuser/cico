import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatDayTitle, formatFullDate } from '@/lib/date';

export function DayHeader({
  date,
  todayIso,
  onPrev,
  onNext,
}: {
  date: string;
  todayIso: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const isToday = date === todayIso;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onPrev} hitSlop={12} style={{ padding: Spacing.two }}>
        <ThemedText type="subtitle" themeColor="textSecondary" style={{ fontSize: 22 }}>
          ‹
        </ThemedText>
      </Pressable>

      <View style={{ alignItems: 'center' }}>
        <ThemedText type="bold" style={{ fontSize: 18, lineHeight: 22 }}>
          {formatDayTitle(date, todayIso)}
        </ThemedText>
        <ThemedText type="label" themeColor="textSecondary">
          {formatFullDate(date)}
        </ThemedText>
      </View>

      <Pressable
        onPress={() => !isToday && onNext()}
        disabled={isToday}
        hitSlop={12}
        style={{ padding: Spacing.two }}>
        <ThemedText
          type="subtitle"
          themeColor="textSecondary"
          style={[{ fontSize: 22 }, isToday && { opacity: 0.3 }]}>
          ›
        </ThemedText>
      </Pressable>
    </View>
  );
}
