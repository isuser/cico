import { useMemo } from 'react';
import { View } from 'react-native';

import { OptionCard } from '@/components/onboarding/option-card';
import { Spacing } from '@/constants/theme';
import { useTranslation } from '@/i18n/context';
import { COUNTRY_CODES, type CountryCode } from '@/lib/countries';

/** "Worldwide" followed by the curated countries, sorted by their name in the app language. */
export function CountryOptions({
  value,
  onChange,
}: {
  value: CountryCode | null;
  onChange: (country: CountryCode | null) => void;
}) {
  const { t, language } = useTranslation();

  const countries = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({ code, label: t(`countries.${code}`) })).sort((a, b) =>
        a.label.localeCompare(b.label, language)
      ),
    [t, language]
  );

  return (
    <View style={{ gap: Spacing.two }}>
      <OptionCard
        label={t('countries.worldwide')}
        selected={value === null}
        onPress={() => value !== null && onChange(null)}
      />
      {countries.map((country) => (
        <OptionCard
          key={country.code}
          label={country.label}
          selected={value === country.code}
          onPress={() => value !== country.code && onChange(country.code)}
        />
      ))}
    </View>
  );
}
