import { useMemo } from 'react';
import { View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Gender } from '@/db';
import { useOnboarding } from '@/hooks/onboarding-context';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

export function PersonalInfoStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();

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
      title="About you"
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}>
      <FormField
        label="Name"
        value={draft.name}
        onChangeText={(name) => update({ name })}
        placeholder="Jane Doe"
        autoCapitalize="words"
      />

      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">Gender</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {GENDER_OPTIONS.map((option) => (
            <View key={option.value} style={{ flex: 1 }}>
              <OptionCard
                label={option.label}
                selected={draft.gender === option.value}
                onPress={() => update({ gender: option.value })}
              />
            </View>
          ))}
        </View>
      </View>

      <FormField
        label="Age"
        value={draft.age}
        onChangeText={(age) => update({ age })}
        keyboardType="number-pad"
        placeholder="28"
      />
      <FormField
        label="Height"
        value={draft.height}
        onChangeText={(height) => update({ height })}
        keyboardType="decimal-pad"
        placeholder="170"
        suffix="cm"
      />
      <FormField
        label="Current weight"
        value={draft.weight}
        onChangeText={(weight) => update({ weight })}
        keyboardType="decimal-pad"
        placeholder="70"
        suffix="kg"
      />
    </OnboardingStepShell>
  );
}
