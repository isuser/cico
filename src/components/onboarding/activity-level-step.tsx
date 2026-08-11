import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useTranslation } from '@/i18n/context';
import { ACTIVITY_LEVEL_INFO } from '@/lib/calorieGoal';

export function ActivityLevelStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();
  const { t } = useTranslation();

  return (
    <OnboardingStepShell
      step={3}
      totalSteps={5}
      title={t('onboarding.activityLevel.title')}
      subtitle={t('onboarding.activityLevel.subtitle')}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={draft.activityLevel === null}>
      <View style={{ gap: Spacing.two }}>
        {ACTIVITY_LEVEL_INFO.map((option) => (
          <OptionCard
            key={option.value}
            label={t(option.labelKey)}
            description={t(option.descriptionKey)}
            selected={draft.activityLevel === option.value}
            onPress={() => update({ activityLevel: option.value })}
          />
        ))}
      </View>
    </OnboardingStepShell>
  );
}
