import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Gender, Profile, ProfileInput } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { cmToFeetInches, feetInchesToCm, kgToLbsRounded, lbsToKg } from '@/lib/units';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
];

/**
 * Keyed by `profile.units` in the parent — remounts (resetting all local state) whenever the
 * units preference changes, instead of trying to live-resync converted field text mid-edit.
 */
export function PersonalInfoSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  const theme = useTheme();
  const isImperial = profile.units === 'imperial';

  // Captured once at mount, in the same units as the editable fields below, so the dirty check
  // below can do plain string/number comparison instead of re-deriving through a lossy
  // cm<->in/kg<->lb round trip.
  const [initial] = useState(() => {
    const { feet, inches } = cmToFeetInches(profile.height);
    return {
      name: profile.name,
      gender: profile.gender,
      age: profile.age,
      heightCm: String(profile.height),
      heightFeet: String(feet),
      heightInches: String(inches),
      weightKg: String(profile.weight),
      weightLbs: String(kgToLbsRounded(profile.weight)),
    };
  });

  const [name, setName] = useState(initial.name);
  const [gender, setGender] = useState<Gender>(initial.gender);
  const [age, setAge] = useState(String(initial.age));
  const [heightCm, setHeightCm] = useState(initial.heightCm);
  const [heightFeet, setHeightFeet] = useState(initial.heightFeet);
  const [heightInches, setHeightInches] = useState(initial.heightInches);
  const [weightKg, setWeightKg] = useState(initial.weightKg);
  const [weightLbs, setWeightLbs] = useState(initial.weightLbs);
  const [saving, setSaving] = useState(false);

  const height = isImperial
    ? feetInchesToCm(Number(heightFeet) || 0, Number(heightInches) || 0)
    : Number(heightCm);
  const weight = isImperial ? lbsToKg(Number(weightLbs) || 0) : Number(weightKg);

  const isValid = useMemo(
    () => name.trim().length > 0 && Number(age) > 0 && height > 0 && weight > 0,
    [name, age, height, weight]
  );

  const isDirty = isImperial
    ? name.trim() !== initial.name ||
      gender !== initial.gender ||
      age !== String(initial.age) ||
      heightFeet !== initial.heightFeet ||
      heightInches !== initial.heightInches ||
      weightLbs !== initial.weightLbs
    : name.trim() !== initial.name ||
      gender !== initial.gender ||
      age !== String(initial.age) ||
      heightCm !== initial.heightCm ||
      weightKg !== initial.weightKg;

  const handleSave = async () => {
    if (!isValid || !isDirty || saving) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), gender, age: Number(age), height, weight });
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

      {isImperial ? (
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <View style={{ flex: 1 }}>
            <FormField
              label="Height (feet)"
              value={heightFeet}
              onChangeText={setHeightFeet}
              keyboardType="number-pad"
              suffix="ft"
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormField
              label="Height (inches)"
              value={heightInches}
              onChangeText={setHeightInches}
              keyboardType="number-pad"
              suffix="in"
            />
          </View>
        </View>
      ) : (
        <FormField
          label="Height"
          value={heightCm}
          onChangeText={setHeightCm}
          keyboardType="decimal-pad"
          suffix="cm"
        />
      )}

      <FormField
        label="Current weight"
        value={isImperial ? weightLbs : weightKg}
        onChangeText={isImperial ? setWeightLbs : setWeightKg}
        keyboardType="decimal-pad"
        suffix={isImperial ? 'lbs' : 'kg'}
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
