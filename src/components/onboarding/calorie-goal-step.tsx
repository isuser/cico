import { useEffect, useMemo } from 'react';

import { FormField } from '@/components/form-field';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { useOnboarding } from '@/hooks/onboarding-context';
import { calculateSuggestedCalorieGoal } from '@/lib/calorieGoal';

export function CalorieGoalStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();

  const suggestion = useMemo(() => {
    if (!draft.gender || !draft.activityLevel) return null;
    const age = Number(draft.age);
    const height = Number(draft.height);
    const weight = Number(draft.weight);
    if (!age || !height || !weight) return null;
    return calculateSuggestedCalorieGoal({
      gender: draft.gender,
      age,
      height,
      weight,
      activityLevel: draft.activityLevel,
    });
  }, [draft.gender, draft.activityLevel, draft.age, draft.height, draft.weight]);

  // Keeps the field in sync with the suggestion until the user edits it directly.
  useEffect(() => {
    if (suggestion !== null && !draft.calorieGoalTouched) {
      update({ calorieGoal: String(suggestion) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestion, draft.calorieGoalTouched]);

  return (
    <OnboardingStepShell
      step={4}
      totalSteps={5}
      title="Your calorie goal"
      subtitle={
        suggestion !== null
          ? `Based on your info, we suggest ${suggestion} kcal/day (BMR × activity level). Adjust it if you'd like.`
          : 'Set your daily calorie goal.'
      }
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!(Number(draft.calorieGoal) > 0)}>
      <FormField
        label="Daily calorie goal"
        value={draft.calorieGoal}
        onChangeText={(calorieGoal) => update({ calorieGoal, calorieGoalTouched: true })}
        keyboardType="number-pad"
        suffix="kcal"
      />
    </OnboardingStepShell>
  );
}
