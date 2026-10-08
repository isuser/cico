import { CountryOptions } from '@/components/country-options';
import { OnboardingStepShell } from '@/components/onboarding/step-shell';
import { useOnboarding } from '@/hooks/onboarding-context';
import { useTranslation } from '@/i18n/context';

export function CountryStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draft, update } = useOnboarding();
  const { t } = useTranslation();

  return (
    <OnboardingStepShell
      step={5}
      totalSteps={6}
      title={t('onboarding.country.title')}
      subtitle={t('onboarding.country.subtitle')}
      onBack={onBack}
      onNext={onNext}>
      <CountryOptions value={draft.country} onChange={(country) => update({ country })} />
    </OnboardingStepShell>
  );
}
