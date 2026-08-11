import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { Spacing } from '@/constants/theme';
import type { Profile, ProfileInput, Units } from '@/db';

const UNIT_OPTIONS: { value: Units; label: string; description: string }[] = [
  { value: 'metric', label: 'Metric', description: 'kg, cm' },
  { value: 'imperial', label: 'Imperial', description: 'lbs, ft/in' },
];

export function UnitsSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  return (
    <SectionCard title="Units">
      <View style={{ gap: Spacing.two }}>
        {UNIT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={profile.units === option.value}
            onPress={() => option.value !== profile.units && onSave({ units: option.value })}
          />
        ))}
      </View>
    </SectionCard>
  );
}
