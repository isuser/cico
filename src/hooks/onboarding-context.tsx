import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { ActivityLevel, Gender, Units } from '@/db';

export type OnboardingDraft = {
  name: string;
  gender: Gender | null;
  /** Raw text-input values — parsed to numbers at validation/save time. */
  age: string;
  height: string;
  weight: string;
  activityLevel: ActivityLevel | null;
  calorieGoal: string;
  /** Once true, the calculated suggestion stops overwriting a manual edit. */
  calorieGoalTouched: boolean;
  units: Units;
};

const initialDraft: OnboardingDraft = {
  name: '',
  gender: null,
  age: '',
  height: '',
  weight: '',
  activityLevel: null,
  calorieGoal: '',
  calorieGoalTouched: false,
  units: 'metric',
};

type OnboardingContextValue = {
  draft: OnboardingDraft;
  update: (changes: Partial<OnboardingDraft>) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      update: (changes) => setDraft((prev) => ({ ...prev, ...changes })),
    }),
    [draft]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an <OnboardingProvider>');
  }
  return context;
}
