export type Language = 'en' | 'pt' | 'es' | 'fr';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

export const DEFAULT_LANGUAGE: Language = 'en';
