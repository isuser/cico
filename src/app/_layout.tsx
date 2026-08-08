import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedView } from '@/components/themed-view';
import { DatabaseProvider } from '@/db';
import { useFontsLoaded } from '@/hooks/use-fonts-loaded';
import { ProfileGateProvider, useProfileGate } from '@/hooks/profile-gate';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFontsLoaded();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <DatabaseProvider>
        <ProfileGateProvider>
          <RootNavigator fontsLoaded={fontsLoaded} />
        </ProfileGateProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

/**
 * Onboarding gate: routes to the onboarding flow when no `profile` row
 * exists yet, or straight to the tabs when one does. No AsyncStorage
 * flags — the SQLite row is the single source of truth, checked fresh
 * on every launch (and re-checked via useProfileGate().refresh() once
 * onboarding saves a profile). Also waits on DM Sans loading, since
 * every screen renders text in it.
 */
function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { profileExists } = useProfileGate();

  if (!fontsLoaded || profileExists === null) {
    return <ThemedView style={{ flex: 1 }} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!profileExists}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={profileExists}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
