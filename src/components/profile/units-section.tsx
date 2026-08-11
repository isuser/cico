import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { Spacing } from '@/constants/theme';
import type { Profile, ProfileInput, Units } from '@/db';
import { useTranslation } from '@/i18n/context';

const UNIT_OPTIONS: { value: Units; labelKey: string; descriptionKey: string }[] = [
  { value: 'metric', labelKey: 'units.metric', descriptionKey: 'units.metricDescription' },
  { value: 'imperial', labelKey: 'units.imperial', descriptionKey: 'units.imperialDescription' },
];

export function UnitsSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('profile.units.title')}>
      <View style={{ gap: Spacing.two }}>
        {UNIT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={t(option.labelKey)}
            description={t(option.descriptionKey)}
            selected={profile.units === option.value}
            onPress={() => option.value !== profile.units && onSave({ units: option.value })}
          />
        ))}
      </View>
    </SectionCard>
  );
}
