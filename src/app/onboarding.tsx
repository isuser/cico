import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';
import { OnboardingProvider } from '@/hooks/onboarding-context';

export default function OnboardingScreen() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
