import { useEffect, useMemo } from 'react';

import { FormField } from '@/components/form-field';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useTranslation } from '@/i18n/context';
import { calculateSuggestedCalorieGoal } from '@/lib/calorieGoal';

export function CalorieGoalStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();
  const { t } = useTranslation();

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
      title={t('onboarding.calorieGoal.title')}
      subtitle={
        suggestion !== null
          ? t('onboarding.calorieGoal.suggestion', { suggestion })
          : t('onboarding.calorieGoal.fallbackSubtitle')
      }
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!(Number(draft.calorieGoal) > 0)}>
      <FormField
        label={t('onboarding.calorieGoal.label')}
        value={draft.calorieGoal}
        onChangeText={(calorieGoal) => update({ calorieGoal, calorieGoalTouched: true })}
        keyboardType="number-pad"
        suffix="kcal"
      />
    </OnboardingStepShell>
  );
}
