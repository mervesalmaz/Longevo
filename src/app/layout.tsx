import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Longevo — Discover Longevity Clinics & Treatments",
  description:
    "The world's first longevity clinic discovery platform. Find verified clinics, compare treatments, and join our private beta to start your biohacking journey.",
  metadataBase: new URL("https://longevo.life"),
  openGraph: {
    title: "Longevo — Discover Longevity Clinics & Treatments",
    description:
      "Discover, compare, and book verified longevity clinics. Join our private beta.",
    url: "https://longevo.life",
    siteName: "Longevo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Longevo — Discover Longevity Clinics & Treatments",
    description:
      "The world's first longevity clinic discovery platform. Join our private beta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <CookieConsent />
        <SpeedInsights />
      </body>
    </html>
  );
}
