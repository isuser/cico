import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const ACCENT = '#0274DF';

export function OnboardingStepShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  nextLoading = false,
}: {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
}) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: Spacing.four, gap: Spacing.four }}
          keyboardShouldPersistTaps="handled">
          <ThemedText type="small" themeColor="textSecondary">
            Step {step} of {totalSteps}
          </ThemedText>

          <View style={{ gap: Spacing.two }}>
            <ThemedText type="subtitle">{title}</ThemedText>
            {subtitle ? (
              <ThemedText type="default" themeColor="textSecondary">
                {subtitle}
              </ThemedText>
            ) : null}
          </View>

          <View style={{ gap: Spacing.three }}>{children}</View>
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: Spacing.three, padding: Spacing.four }}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              style={{
                justifyContent: 'center',
                paddingVertical: Spacing.three,
                paddingHorizontal: Spacing.four,
              }}>
              <ThemedText type="default">Back</ThemedText>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onNext}
            disabled={nextDisabled || nextLoading}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: nextDisabled ? '#9CA3AF' : ACCENT,
                paddingVertical: Spacing.three,
                borderRadius: Spacing.three,
                alignItems: 'center',
              },
              pressed && !nextDisabled && { opacity: 0.85 },
            ]}>
            <ThemedText type="default" style={{ color: '#ffffff' }}>
              {nextLoading ? 'Saving…' : nextLabel}
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
