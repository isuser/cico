import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

export function TabPlaceholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.two,
          paddingHorizontal: Spacing.five,
          paddingBottom: BottomTabInset,
        }}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          {subtitle}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
