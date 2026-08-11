import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppPreferencesSection } from '@/components/profile/app-preferences-section';
import { GoalSettingsSection } from '@/components/profile/goal-settings-section';
import { PersonalInfoSection } from '@/components/profile/personal-info-section';
import { UnitsSection } from '@/components/profile/units-section';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { getProfile, saveProfile, useDatabase, type Profile, type ProfileInput } from '@/db';

function toInput(profile: Profile): ProfileInput {
  const { id: _id, created_at: _created_at, ...input } = profile;
  return input;
}

export default function ProfileScreen() {
  const db = useDatabase();
  const [profile, setProfile] = useState<Profile | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProfile(db).then(setProfile);
    }, [db])
  );

  const handleSave = async (patch: Partial<ProfileInput>) => {
    if (!profile) return;
    const updated = await saveProfile(db, { ...toInput(profile), ...patch });
    setProfile(updated);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            padding: Spacing.four,
            gap: Spacing.four,
            paddingBottom: BottomTabInset + Spacing.four,
          }}>
          <ThemedText type="display">Profile</ThemedText>

          {profile ? (
            <>
              <PersonalInfoSection key={profile.units} profile={profile} onSave={handleSave} />
              <GoalSettingsSection profile={profile} onSave={handleSave} />
              <UnitsSection profile={profile} onSave={handleSave} />
              <AppPreferencesSection profile={profile} onSave={handleSave} />
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
