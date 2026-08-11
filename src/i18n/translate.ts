import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import pt from './translations/pt.json';
import type { Language } from './types';

type PluralForm = { one: string; other: string };
export type TranslationNode = string | PluralForm | { [key: string]: TranslationNode };
export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const TRANSLATIONS: Record<Language, TranslationNode> = { en, pt, es, fr };

function lookup(tree: TranslationNode, key: string): string | PluralForm | undefined {
  let node: TranslationNode | undefined = tree;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) return undefined;
    node = (node as { [key: string]: TranslationNode })[part];
    if (node === undefined) return undefined;
  }
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && node !== null && 'one' in node && 'other' in node) {
    return node as PluralForm;
  }
  return undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    name in params ? String(params[name]) : match
  );
}

/**
 * Dotted-path key lookup with `{{var}}` interpolation. Falls back to English, then to the raw
 * key, so a missing translation never crashes the app — it just shows English or the key itself.
 * `params.count` selects between a `{ one, other }` plural pair when the key resolves to one.
 */
export function translate(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const resolved = lookup(TRANSLATIONS[language], key) ?? lookup(TRANSLATIONS.en, key);
  if (resolved === undefined) return key;

  if (typeof resolved === 'string') return interpolate(resolved, params);

  const count = params?.count;
  const form = count === 1 ? resolved.one : resolved.other;
  return interpolate(form, params);
}
