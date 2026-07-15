"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  translations,
  type Locale,
  type TranslationKey,
} from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const COOKIE_NAME = "longevo_locale";

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // SSR + hydration use the same initialLocale (from server cookie)
  // to avoid hydration mismatch. Client-side setLocale updates both
  // cookie and state, which causes a re-render with fresh translations.
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // If no cookie was set yet, try browser language as a one-time default
    if (typeof document === "undefined") return;
    const hasCookie = document.cookie.includes(`${COOKIE_NAME}=`);
    if (!hasCookie) {
      const browserLang = navigator.language.toLowerCase();
      const detected: Locale = browserLang.startsWith("tr") ? "tr" : "en";
      if (detected !== initialLocale) {
        setLocaleState(detected);
        document.cookie = `${COOKIE_NAME}=${detected}; path=/; max-age=${
          60 * 60 * 24 * 365
        }; SameSite=Lax`;
      }
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;
    document.documentElement.lang = newLocale;
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] ?? translations.en[key] ?? key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
