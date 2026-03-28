import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  I18nManager,
  View,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import type { Locale } from '../i18n/types';
import { LOCALE_STORAGE_KEY } from '../i18n/types';
import { translate as translateRaw } from '../i18n/index';
import { Theme } from '../constants/theme';
import { safeStorageGet, safeStorageSet } from '../utils/safeStorage';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (loc: Locale) => Promise<void>;
  /** Dot path; optional English fallback; optional {{var}} interpolation */
  t: (path: string, fallback?: string, vars?: Record<string, string | number>) => string;
  isRtl: boolean;
  /** Horizontal mirror for directional icons (chevrons, arrows) in Arabic */
  rtlMirror: ViewStyle | undefined;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyRtl(isRtl: boolean) {
  if (I18nManager.isRTL === isRtl) return;
  I18nManager.allowRTL(isRtl);
  I18nManager.forceRTL(isRtl);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await safeStorageGet(LOCALE_STORAGE_KEY);
        const loc: Locale = stored === 'ar' ? 'ar' : 'en';
        if (!cancelled) {
          applyRtl(loc === 'ar');
          setLocaleState(loc);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback(async (loc: Locale) => {
    applyRtl(loc === 'ar');
    setLocaleState(loc);
    await safeStorageSet(LOCALE_STORAGE_KEY, loc);
  }, []);

  const t = useCallback(
    (path: string, fallback?: string, vars?: Record<string, string | number>) => {
      const fromLocale = translateRaw(locale, path, undefined, vars);
      if (fromLocale !== path) return fromLocale;
      const fromEn = translateRaw('en', path, fallback, vars);
      if (fromEn !== path) return fromEn;
      return fallback ?? path;
    },
    [locale]
  );

  const value = useMemo(() => {
    const isRtl = locale === 'ar';
    return {
      locale,
      setLocale,
      t,
      isRtl,
      rtlMirror: isRtl ? { transform: [{ scaleX: -1 }] } : undefined,
      ready,
    };
  }, [locale, setLocale, t, ready]);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

/** Safe when provider might be absent (e.g. tests) */
export function useOptionalLanguage(): LanguageContextValue | null {
  return useContext(LanguageContext);
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
});
