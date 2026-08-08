import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const ACCENT = '#0274DF';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
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
        <ThemedText type="title" style={{ textAlign: 'center' }}>
          CICO
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center' }}>
          Simple, friction-free calorie tracking. No clutter, just calories.
        </ThemedText>
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            {
              backgroundColor: ACCENT,
              paddingVertical: Spacing.three,
              paddingHorizontal: Spacing.six,
              borderRadius: Spacing.three,
              marginTop: Spacing.four,
            },
            pressed && { opacity: 0.85 },
          ]}>
          <ThemedText type="default" style={{ color: '#ffffff' }}>
            Get Started
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
