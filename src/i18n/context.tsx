import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { getProfile, saveProfile, useDatabase } from '@/db';

import { translate } from './translate';
import { DEFAULT_LANGUAGE, type Language } from './types';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Loads `profile.language` once (defaulting to English until it resolves, or if no profile
 * exists yet — e.g. during onboarding). Mounted once at the app root so every screen shares the
 * same language state instead of each polling the profile row independently.
 */
export function LanguageProvider({ children }: PropsWithChildren) {
  const db = useDatabase();
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    getProfile(db).then((profile) => {
      if (profile) setLanguageState(profile.language);
    });
  }, [db]);

  const setLanguage = useCallback(
    async (next: Language) => {
      setLanguageState(next);
      const current = await getProfile(db);
      if (current) {
        const { id: _id, created_at: _created_at, ...input } = current;
        await saveProfile(db, { ...input, language: next });
      }
    },
    [db]
  );

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(language, key, params),
    [language]
  );
  return { t, language };
}
