import type { Locale } from './types';
import { en } from './en';
import { ar } from './ar';

export type { Locale } from './types';
export { LOCALE_STORAGE_KEY } from './types';

export const messages: Record<Locale, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  ar: ar as unknown as Record<string, unknown>,
};

export function lookup(dict: unknown, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

/** Replace {{key}} placeholders */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(String(v));
  }
  return out;
}

export function translate(
  locale: Locale,
  path: string,
  fallback?: string,
  vars?: Record<string, string | number>
): string {
  const fromDict = lookup(messages[locale], path);
  const raw = fromDict !== undefined ? fromDict : fallback;
  if (raw === undefined) return path;
  return vars ? interpolate(raw, vars) : raw;
}
