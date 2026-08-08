import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function PlaceholderScreen({
  title,
  subtitle,
  bottomInset = 0,
}: {
  title: string;
  subtitle: string;
  bottomInset?: number;
}) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.two,
          paddingHorizontal: Spacing.five,
          paddingBottom: bottomInset,
        }}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          {subtitle}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
