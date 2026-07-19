"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { TranslationKey } from "@/lib/i18n/translations";

const quickChips: { labelKey: TranslationKey; href: string }[] = [
  { labelKey: "home_hero_chip_istanbul", href: "/search?city=istanbul" },
  { labelKey: "home_hero_chip_ankara", href: "/search?city=ankara" },
  { labelKey: "home_hero_chip_iv", href: "/search?treatment=iv-terapi" },
  { labelKey: "home_hero_chip_biomarker", href: "/search?treatment=biyobelirtec" },
  { labelKey: "home_hero_chip_nad", href: "/search?treatment=nad-terapi" },
  { labelKey: "home_hero_chip_all", href: "/search" },
];

export function HeroSearchForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    track("hero_search_performed", {
      has_query: q.length > 0,
      query_length: q.length,
    });
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div>
      {/* Search box */}
      <form onSubmit={handleSubmit} className="mb-5">
        <label htmlFor="hero-search" className="sr-only">
          {t("home_hero_search_label")}
        </label>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
          <Input
            id="hero-search"
            type="search"
            aria-label={t("home_hero_search_label")}
            placeholder={t("home_hero_search_placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-14 pr-28 h-14 rounded-full border-2 border-neutral-200 bg-white text-base text-neutral-900 placeholder:text-neutral-500 focus-visible:border-transparent focus-visible:ring-2 shadow-sm"
          />
          <Button
            type="submit"
            size="sm"
            aria-label={t("hero_search_button")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-full text-white gap-1.5"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{t("hero_search_button")}</span>
          </Button>
        </div>
      </form>

      {/* Quick filter chips */}
      <nav aria-label={t("hero_popular_searches")} className="flex flex-wrap gap-2">
        {quickChips.map((chip) => (
          <Link
            key={chip.labelKey}
            href={chip.href}
            className="text-sm px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-colors text-neutral-700"
          >
            {t(chip.labelKey)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
