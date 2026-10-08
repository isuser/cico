/**
 * Countries offered for localized food search — a curated set with large Open Food Facts
 * databases. Codes are lowercase ISO 3166-1 alpha-2, which is what OFF's `cc` parameter expects.
 * Display names live in the `countries.<code>` translation keys.
 */
export const COUNTRY_CODES = [
  'ar',
  'au',
  'at',
  'be',
  'br',
  'ca',
  'fr',
  'de',
  'ie',
  'it',
  'mx',
  'nl',
  'pl',
  'pt',
  'es',
  'se',
  'ch',
  'gb',
  'us',
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];
