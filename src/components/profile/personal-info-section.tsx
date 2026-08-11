import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Gender, Profile, ProfileInput } from '@/db';
import { useTheme } from '@/hooks/use-theme';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

export function PersonalInfoSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  const theme = useTheme();
  const [name, setName] = useState(profile.name);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.height));
  const [weight, setWeight] = useState(String(profile.weight));
  const [saving, setSaving] = useState(false);

  const isValid = useMemo(
    () => name.trim().length > 0 && Number(age) > 0 && Number(height) > 0 && Number(weight) > 0,
    [name, age, height, weight]
  );

  const isDirty =
    name.trim() !== profile.name ||
    gender !== profile.gender ||
    Number(age) !== profile.age ||
    Number(height) !== profile.height ||
    Number(weight) !== profile.weight;

  const handleSave = async () => {
    if (!isValid || !isDirty || saving) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        gender,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Personal info">
      <FormField label="Name" value={name} onChangeText={setName} autoCapitalize="words" />

      <View style={{ gap: Spacing.one }}>
        <ThemedText type="smallBold">Gender</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {GENDER_OPTIONS.map((option) => (
            <View key={option.value} style={{ flex: 1 }}>
              <OptionCard
                label={option.label}
                selected={gender === option.value}
                onPress={() => setGender(option.value)}
              />
            </View>
          ))}
        </View>
      </View>

      <FormField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
      <FormField
        label="Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
        suffix="cm"
      />
      <FormField
        label="Current weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        suffix="kg"
      />

      <Pressable
        onPress={handleSave}
        disabled={!isValid || !isDirty || saving}
        style={{
          backgroundColor: isValid && isDirty ? theme.accent : '#9CA3AF',
          paddingVertical: Spacing.three,
          borderRadius: Spacing.three,
          alignItems: 'center',
          marginTop: Spacing.one,
        }}>
        <ThemedText type="default" style={{ color: '#ffffff' }}>
          {saving ? 'Saving…' : 'Save'}
        </ThemedText>
      </Pressable>
    </SectionCard>
  );
}
