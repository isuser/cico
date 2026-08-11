import { useMemo } from 'react';
import { View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Gender } from '@/db';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useTranslation } from '@/i18n/context';

const GENDER_OPTIONS: { value: Gender; labelKey: string }[] = [
  { value: 'female', labelKey: 'gender.female' },
  { value: 'male', labelKey: 'gender.male' },
  { value: 'other', labelKey: 'gender.other' },
];

export function PersonalInfoStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();
  const { t } = useTranslation();

  const isValid = useMemo(
    () =>
      draft.name.trim().length > 0 &&
      draft.gender !== null &&
      Number(draft.age) > 0 &&
      Number(draft.height) > 0 &&
      Number(draft.weight) > 0,
    [draft]
  );

  return (
    <OnboardingStepShell
      step={2}
      totalSteps={5}
      title={t('onboarding.personalInfo.title')}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}>
      <FormField
        label={t('onboarding.personalInfo.name')}
        value={draft.name}
        onChangeText={(name) => update({ name })}
        placeholder={t('onboarding.personalInfo.namePlaceholder')}
        autoCapitalize="words"
      />

      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">{t('onboarding.personalInfo.gender')}</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {GENDER_OPTIONS.map((option) => (
            <View key={option.value} style={{ flex: 1 }}>
              <OptionCard
                label={t(option.labelKey)}
                selected={draft.gender === option.value}
                onPress={() => update({ gender: option.value })}
              />
            </View>
          ))}
        </View>
      </View>

      <FormField
        label={t('onboarding.personalInfo.age')}
        value={draft.age}
        onChangeText={(age) => update({ age })}
        keyboardType="number-pad"
        placeholder={t('onboarding.personalInfo.agePlaceholder')}
      />
      <FormField
        label={t('onboarding.personalInfo.height')}
        value={draft.height}
        onChangeText={(height) => update({ height })}
        keyboardType="decimal-pad"
        placeholder={t('onboarding.personalInfo.heightPlaceholder')}
        suffix="cm"
      />
      <FormField
        label={t('onboarding.personalInfo.weight')}
        value={draft.weight}
        onChangeText={(weight) => update({ weight })}
        keyboardType="decimal-pad"
        placeholder={t('onboarding.personalInfo.weightPlaceholder')}
        suffix="kg"
      />
    </OnboardingStepShell>
  );
}
