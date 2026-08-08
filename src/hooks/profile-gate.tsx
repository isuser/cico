import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import { hasProfile, useDatabase } from '@/db';

type ProfileGateState = {
  /** `null` while the initial check is in flight. */
  profileExists: boolean | null;
  /** Re-checks the profile row. Call after onboarding saves a profile to flip the gate. */
  refresh: () => Promise<void>;
};

const ProfileGateContext = createContext<ProfileGateState | null>(null);

/**
 * Tracks whether the `profile` row exists, re-checked on demand via
 * `refresh()`. Must be nested inside a `<DatabaseProvider>`.
 */
export function ProfileGateProvider({ children }: PropsWithChildren) {
  const db = useDatabase();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    setProfileExists(await hasProfile(db));
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProfileGateContext.Provider value={{ profileExists, refresh }}>
      {children}
    </ProfileGateContext.Provider>
  );
}

export function useProfileGate(): ProfileGateState {
  const context = useContext(ProfileGateContext);
  if (!context) {
    throw new Error('useProfileGate must be used within a <ProfileGateProvider>');
  }
  return context;
}
