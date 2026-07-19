import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { LocaleProvider } from "@/lib/i18n/locale-provider";
import { getLocale, getT } from "@/lib/i18n/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export function generateMetadata(): Metadata {
  const t = getT();
  const title = t("meta_site_title");
  const description = t("meta_site_description");
  return {
    title,
    description,
    metadataBase: new URL("https://longevo.life"),
    openGraph: {
      title,
      description: t("meta_site_og_description"),
      url: "https://longevo.life",
      siteName: "Longevo",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <LocaleProvider initialLocale={locale}>
          {children}
          <CookieConsent />
        </LocaleProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
