import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { DayOfWeek, Profile, ProfileInput } from '@/db';
import { useLanguage, useTranslation } from '@/i18n/context';
import { LANGUAGES } from '@/i18n/types';

const FIRST_DAY_OPTIONS: { value: DayOfWeek; labelKey: string }[] = [
  { value: 'monday', labelKey: 'firstDayOfWeek.monday' },
  { value: 'sunday', labelKey: 'firstDayOfWeek.sunday' },
];

export function AppPreferencesSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <SectionCard title={t('profile.appPreferences.title')}>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">{t('profile.appPreferences.firstDayOfWeek')}</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {FIRST_DAY_OPTIONS.map((option) => (
            <View key={option.value} style={{ flex: 1 }}>
              <OptionCard
                label={t(option.labelKey)}
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

      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">{t('profile.appPreferences.language')}</ThemedText>
        <View style={{ gap: Spacing.two }}>
          {LANGUAGES.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={language === option.value}
              onPress={() => option.value !== language && setLanguage(option.value)}
            />
          ))}
        </View>
      </View>
    </SectionCard>
  );
}
