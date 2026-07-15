"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  MessageSquareHeart,
  PenLine,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { TranslationKey } from "@/lib/i18n/translations";

const quickChips: {
  key: TranslationKey;
  href: string;
}[] = [
  { key: "home_hero_chip_istanbul", href: "/search?city=Istanbul" },
  { key: "home_hero_chip_ankara", href: "/search?city=Ankara" },
  { key: "home_hero_chip_iv", href: "/search?treatment=iv-terapi" },
  { key: "home_hero_chip_biomarker", href: "/search?treatment=biyobelirtec" },
  { key: "home_hero_chip_nad", href: "/search?treatment=nad-terapi" },
  { key: "home_hero_chip_all", href: "/search" },
];

const trustBadges: {
  icon: typeof ShieldCheck;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  {
    icon: BadgeCheck,
    titleKey: "home_hero_trust_1_title",
    descKey: "home_hero_trust_1_desc",
  },
  {
    icon: ShieldCheck,
    titleKey: "home_hero_trust_2_title",
    descKey: "home_hero_trust_2_desc",
  },
  {
    icon: MessageSquareHeart,
    titleKey: "home_hero_trust_3_title",
    descKey: "home_hero_trust_3_desc",
  },
];

export function HomeHero() {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/60 via-white to-white">
      {/* Soft green blob accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "hsl(var(--longevo-green))" }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* LEFT: 60% — Headline + Search */}
          <div className="lg:col-span-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              {t("home_hero_title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-3 font-medium">
              {t("home_hero_kicker")}
            </p>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
              {t("home_hero_subtitle")}
            </p>

            {/* Search */}
            <form onSubmit={handleSubmit} className="mb-5">
              <label htmlFor="hero-search" className="sr-only">
                {t("home_hero_search_label")}
              </label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="hero-search"
                  type="search"
                  aria-label={t("home_hero_search_label")}
                  placeholder={t("home_hero_search_placeholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-14 pr-36 h-14 rounded-full border-2 border-gray-200 bg-white text-base shadow-sm focus:border-transparent focus-visible:ring-2"
                  style={{
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ["--tw-ring-color" as any]: "hsl(var(--longevo-green))",
                  }}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-full text-white gap-1.5"
                  style={{ backgroundColor: "hsl(var(--longevo-green))" }}
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </form>

            {/* Quick filter chips */}
            <div className="flex flex-wrap gap-2 mb-2">
              {quickChips.map((chip) => (
                <Link
                  key={chip.key}
                  href={chip.href}
                  className="text-sm px-3.5 py-1.5 rounded-full border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  {t(chip.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: 40% — Share CTA card */}
          <aside className="lg:col-span-2">
            <div className="bg-white border rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-[0.08]"
                style={{ backgroundColor: "hsl(var(--longevo-green))" }}
              />
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                style={{ backgroundColor: "hsl(var(--longevo-green) / 0.1)" }}
              >
                <PenLine
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--longevo-green))" }}
                />
              </div>
              <h2 className="text-lg font-bold mb-1.5">
                {t("home_hero_share_title")}
              </h2>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {t("home_hero_share_desc")}
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full gap-2 border-2 hover:bg-green-50"
                style={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  borderColor: "hsl(var(--longevo-green))",
                  color: "hsl(var(--longevo-green))",
                }}
              >
                <Link href="/search">
                  {t("home_hero_share_cta")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
          {trustBadges.map((badge) => (
            <div
              key={badge.titleKey}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100"
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                }}
              >
                <badge.icon
                  className="w-4.5 h-4.5"
                  style={{
                    color: "hsl(var(--longevo-green))",
                    width: 18,
                    height: 18,
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-semibold mb-0.5">
                  {t(badge.titleKey)}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {t(badge.descKey)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Launch message (honest alternative to fake stats) */}
        <div className="mt-8 text-sm text-gray-600 text-center md:text-left italic">
          {t("home_hero_launch_message")}
        </div>
      </div>
    </section>
  );
}
