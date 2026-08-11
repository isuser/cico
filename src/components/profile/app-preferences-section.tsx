import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { DayOfWeek, Profile, ProfileInput } from '@/db';

const FIRST_DAY_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'sunday', label: 'Sunday' },
];

export function AppPreferencesSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  return (
    <SectionCard title="App preferences">
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">First day of week</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {FIRST_DAY_OPTIONS.map((option) => (
            <View key={option.value} style={{ flex: 1 }}>
              <OptionCard
                label={option.label}
                selected={profile.first_day_of_week === option.value}
                onPress={() =>
                  option.value !== profile.first_day_of_week &&
                  onSave({ first_day_of_week: option.value })
                }
              />
            </View>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}
