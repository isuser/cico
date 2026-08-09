import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const theme = useTheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.four,
          paddingHorizontal: Spacing.five,
        }}>
        <ThemedText
          type="title"
          style={{ textAlign: 'center', fontFamily: FontFamily.extraBold, color: theme.accent }}>
          CICO
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          Simple, friction-free calorie tracking. No clutter, just calories.
        </ThemedText>
        <Pressable
          onPress={onNext}
          style={{
            backgroundColor: theme.accent,
            paddingVertical: Spacing.three,
            paddingHorizontal: Spacing.six,
            borderRadius: Spacing.three,
            marginTop: Spacing.four,
          }}>
          <ThemedText type="default" style={{ color: '#ffffff' }}>
            Get Started
          </ThemedText>
        </Pressable>
        <ThemedText type="label" themeColor="textSecondary">
          No account required
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}
