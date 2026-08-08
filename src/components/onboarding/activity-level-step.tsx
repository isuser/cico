import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/onboarding-context';
import { ACTIVITY_LEVEL_INFO } from '@/lib/calorieGoal';

export function ActivityLevelStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();

  return (
    <OnboardingStepShell
      step={3}
      totalSteps={5}
      title="Activity level"
      subtitle="Only used to suggest a calorie goal on the next step."
      onBack={onBack}
      onNext={onNext}
      nextDisabled={draft.activityLevel === null}>
      <View style={{ gap: Spacing.two }}>
        {ACTIVITY_LEVEL_INFO.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={draft.activityLevel === option.value}
            onPress={() => update({ activityLevel: option.value })}
          />
        ))}
      </View>
    </OnboardingStepShell>
  );
}
