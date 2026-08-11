import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedView } from '@/components/themed-view';
import { DatabaseProvider } from '@/db';
import { useFontsLoaded } from '@/hooks/use-fonts-loaded';
import { ProfileGateProvider, useProfileGate } from '@/hooks/profile-gate';
import { LanguageProvider } from '@/i18n/context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useFontsLoaded();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {fontsLoaded ? (
          <DatabaseProvider>
            <LanguageProvider>
              <ProfileGateProvider>
                <RootNavigator />
              </ProfileGateProvider>
            </LanguageProvider>
          </DatabaseProvider>
        ) : (
          <ThemedView style={{ flex: 1 }} />
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Onboarding gate: routes to the onboarding flow when no `profile` row
 * exists yet, or straight to the tabs when one does. No AsyncStorage
 * flags — the SQLite row is the single source of truth, checked fresh
 * on every launch (and re-checked via useProfileGate().refresh() once
 * onboarding saves a profile).
 *
 * fontsLoaded is deliberately NOT threaded down as a prop into this
 * subtree — DatabaseProvider wraps SQLiteProvider, which is wrapped in
 * React.memo with a comparator that only checks databaseName/options/
 * onInit/onError/useSuspense, not children. A prop that changes value
 * over time (like fontsLoaded going false -> true) gets silently
 * swallowed if it only flows through `children`: the memo bails out
 * of re-rendering since none of ITS OWN watched props changed, so it
 * keeps serving the stale children closure from its last real render
 * forever. profileExists doesn't have this problem because it flows
 * through Context, which pierces memo boundaries by design — hence
 * gating on fontsLoaded one level higher, before DatabaseProvider even
 * mounts, instead of passing it through as a prop.
 */
function RootNavigator() {
  const { profileExists } = useProfileGate();

  if (profileExists === null) {
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
