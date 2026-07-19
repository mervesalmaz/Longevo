import { cookies } from "next/headers";
import {
  translations,
  type Locale,
  type TranslationKey,
} from "./translations";

const COOKIE_NAME = "longevo_locale";

/**
 * Reads the active locale from the request cookie. Turkish is the default
 * when no cookie is set (Turkey-first product). Use in server components,
 * route handlers, and generateMetadata — anywhere React context / hooks
 * are unavailable.
 */
export function getLocale(): Locale {
  const value = cookies().get(COOKIE_NAME)?.value;
  return value === "en" || value === "tr" ? value : "tr";
}

/**
 * Server-side translator bound to the request's locale.
 * Mirrors the client `useTranslation().t` fallback chain:
 * requested locale → English → raw key.
 *
 *   const t = getT();
 *   <h1>{t("home_hero_title")}</h1>
 */
export function getT(): (key: TranslationKey) => string {
  const locale = getLocale();
  return (key: TranslationKey): string =>
    translations[locale][key] ?? translations.en[key] ?? key;
}
