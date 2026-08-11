import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { OptionCard } from '@/components/onboarding/option-card';
import { SectionCard } from '@/components/profile/section-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ActivityLevel, Profile, ProfileInput } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { ACTIVITY_LEVEL_INFO, calculateSuggestedCalorieGoal } from '@/lib/calorieGoal';

export function GoalSettingsSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (patch: Partial<ProfileInput>) => Promise<void>;
}) {
  const theme = useTheme();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activity_level);
  const [goal, setGoal] = useState(String(profile.calorie_goal));
  const [savingGoal, setSavingGoal] = useState(false);

  const suggestion = useMemo(
    () =>
      calculateSuggestedCalorieGoal({
        gender: profile.gender,
        age: profile.age,
        height: profile.height,
        weight: profile.weight,
        activityLevel,
      }),
    [profile.gender, profile.age, profile.height, profile.weight, activityLevel]
  );

  const isValid = Number(goal) > 0;
  const isDirty = Number(goal) !== profile.calorie_goal;

  const handleSelectActivity = (value: ActivityLevel) => {
    if (value === activityLevel) return;
    setActivityLevel(value);
    onSave({ activity_level: value });
  };

  const handleSaveGoal = async () => {
    if (!isValid || !isDirty || savingGoal) return;
    setSavingGoal(true);
    try {
      await onSave({ calorie_goal: Number(goal) });
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <SectionCard
      title="Goal settings"
      subtitle={`Suggested ${suggestion.toLocaleString()} kcal/day, based on your info and activity level below. Doesn't change your goal automatically.`}>
      <View style={{ gap: Spacing.two }}>
        {ACTIVITY_LEVEL_INFO.map((option) => (
          <OptionCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={activityLevel === option.value}
            onPress={() => handleSelectActivity(option.value)}
          />
        ))}
      </View>

      <FormField
        label="Daily calorie goal"
        value={goal}
        onChangeText={setGoal}
        keyboardType="number-pad"
        suffix="kcal"
      />

      <Pressable
        onPress={handleSaveGoal}
        disabled={!isValid || !isDirty || savingGoal}
        style={{
          backgroundColor: isValid && isDirty ? theme.accent : '#9CA3AF',
          paddingVertical: Spacing.three,
          borderRadius: Spacing.three,
          alignItems: 'center',
          marginTop: Spacing.one,
        }}>
        <ThemedText type="default" style={{ color: '#ffffff' }}>
          {savingGoal ? 'Saving…' : 'Save goal'}
        </ThemedText>
      </Pressable>
    </SectionCard>
  );
}
