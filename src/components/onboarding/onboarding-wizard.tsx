import { useState } from 'react';

import { ActivityLevelStep } from '@/components/onboarding/activity-level-step';
import { CalorieGoalStep } from '@/components/onboarding/calorie-goal-step';
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step';
import { UnitsStep } from '@/components/onboarding/units-step';
import { WelcomeStep } from '@/components/onboarding/welcome-step';
import { saveProfile, useDatabase } from '@/db';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useProfileGate } from '@/hooks/profile-gate';

const STEP_COUNT = 5;

export function OnboardingWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const { draft } = useOnboarding();
  const db = useDatabase();
  const { refresh } = useProfileGate();

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEP_COUNT - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const finish = async () => {
    if (!draft.gender || !draft.activityLevel || saving) return;
    setSaving(true);
    try {
      await saveProfile(db, {
        name: draft.name.trim(),
        gender: draft.gender,
        age: Number(draft.age),
        height: Number(draft.height),
        weight: Number(draft.weight),
        calorie_goal: Number(draft.calorieGoal),
        activity_level: draft.activityLevel,
        units: draft.units,
        first_day_of_week: 'monday',
      });
      // Flips the onboarding gate — Stack.Protected then redirects to (tabs) automatically.
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  switch (stepIndex) {
    case 0:
      return <WelcomeStep onNext={goNext} />;
    case 1:
      return <PersonalInfoStep onNext={goNext} onBack={goBack} />;
    case 2:
      return <ActivityLevelStep onNext={goNext} onBack={goBack} />;
    case 3:
      return <CalorieGoalStep onNext={goNext} onBack={goBack} />;
    default:
      return <UnitsStep onFinish={finish} onBack={goBack} saving={saving} />;
  }
}
