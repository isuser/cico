import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { Spacing } from '@/constants/theme';
import type { Units } from '@/db';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useTranslation } from '@/i18n/context';

const UNIT_OPTIONS: { value: Units; labelKey: string; descriptionKey: string }[] = [
  { value: 'metric', labelKey: 'units.metric', descriptionKey: 'units.metricDescription' },
  { value: 'imperial', labelKey: 'units.imperial', descriptionKey: 'units.imperialDescription' },
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
  const { t } = useTranslation();

  return (
    <OnboardingStepShell
      step={5}
      totalSteps={5}
      title={t('onboarding.units.title')}
      subtitle={t('onboarding.units.subtitle')}
      onBack={onBack}
      onNext={onFinish}
      nextLabel={t('onboarding.units.finish')}
      nextLoading={saving}>
      <View style={{ gap: Spacing.two }}>
        {UNIT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={t(option.labelKey)}
            description={t(option.descriptionKey)}
            selected={draft.units === option.value}
            onPress={() => update({ units: option.value })}
          />
        ))}
      </View>
    </OnboardingStepShell>
  );
}
