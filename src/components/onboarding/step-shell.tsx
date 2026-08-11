import type { ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';

export function OnboardingStepShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel,
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
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: Spacing.four, gap: Spacing.four }}
          keyboardShouldPersistTaps="handled">
          <ThemedText type="small" themeColor="textSecondary">
            {t('onboarding.stepShell.stepOf', { step, total: totalSteps })}
          </ThemedText>

          <View style={{ gap: Spacing.two }}>
            <ThemedText type="display" style={{ fontSize: 32, lineHeight: 38 }}>
              {title}
            </ThemedText>
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
              <ThemedText type="default">{t('onboarding.stepShell.back')}</ThemedText>
            </Pressable>
          ) : null}
          <Pressable
            onPress={onNext}
            disabled={nextDisabled || nextLoading}
            style={{
              flex: 1,
              backgroundColor: nextDisabled ? '#9CA3AF' : theme.accent,
              paddingVertical: Spacing.three,
              borderRadius: Spacing.three,
              alignItems: 'center',
            }}>
            <ThemedText type="default" style={{ color: '#ffffff' }}>
              {nextLoading ? t('common.saving') : (nextLabel ?? t('onboarding.stepShell.next'))}
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
