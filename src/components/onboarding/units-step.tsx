import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { Spacing } from '@/constants/theme';
import type { Units } from '@/db';
import { useOnboarding } from '@/hooks/onboarding-context';

const UNIT_OPTIONS: { value: Units; label: string; description: string }[] = [
  { value: 'metric', label: 'Metric', description: 'kg, cm' },
  { value: 'imperial', label: 'Imperial', description: 'lbs, ft/in' },
];

export function UnitsStep({
  onFinish,
  onBack,
  saving,
}: {
  onFinish: () => void;
  onBack: () => void;
  saving: boolean;
}) {
  const { draft, update } = useOnboarding();

  return (
    <OnboardingStepShell
      step={5}
      totalSteps={5}
      title="Units"
      subtitle="Applies across the whole app. You can change this later in Profile."
      onBack={onBack}
      onNext={onFinish}
      nextLabel="Finish"
      nextLoading={saving}>
      <View style={{ gap: Spacing.two }}>
        {UNIT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={draft.units === option.value}
            onPress={() => update({ units: option.value })}
          />
        ))}
      </View>
    </OnboardingStepShell>
  );
}
