import { cookies } from "next/headers";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/translations";

/**
 * (main) route group layout: provides the i18n context to all public
 * pages. Chrome (Header/Footer) is rendered by each page — either directly
 * (home page per its spec) or via <PageShell> (all others).
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("longevo_locale")?.value;
  const initialLocale: Locale =
    cookieLocale === "tr" || cookieLocale === "en" ? cookieLocale : "tr";

  return (
    <LocaleProvider initialLocale={initialLocale}>{children}</LocaleProvider>
  );
}
