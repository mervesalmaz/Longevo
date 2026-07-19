"use client";

import {
  createContext,
  useContext,
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
  initialLocale = "tr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // SSR + hydration use the same initialLocale (from the server cookie),
  // so there is no flash or hydration mismatch. Locale changes only when
  // the user explicitly picks one via the language switcher (setLocale).
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

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
