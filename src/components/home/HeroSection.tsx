import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSearchForm } from "./HeroSearchForm";
import { getT } from "@/lib/i18n/server";

export default function HeroSection() {
  const t = getT();
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Soft green-washed gradient — subtle, light theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 80% 0%, hsl(var(--longevo-green) / 0.08) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 40% at 0% 100%, hsl(var(--longevo-green) / 0.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-start">
          {/* LEFT: 60% */}
          <div className="md:col-span-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 mb-4">
              {t("home_hero_h1")}
            </h1>
            <h2 className="text-lg font-normal text-neutral-600 mb-3">
              {t("home_hero_h2")}
            </h2>
            <p className="text-sm text-neutral-500 mb-8 max-w-2xl leading-relaxed">
              {t("home_hero_intro")}
            </p>

            <HeroSearchForm />
          </div>

          {/* RIGHT: 40% — Deneyimini paylaş kartı */}
          <aside className="md:col-span-2">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:border-neutral-300 hover:shadow-md transition-all relative overflow-hidden shadow-sm">
              <div
                aria-hidden
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
                style={{ backgroundColor: "hsl(var(--longevo-green))" }}
              />
              <div
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 relative"
                style={{ backgroundColor: "hsl(var(--longevo-green) / 0.1)" }}
              >
                <PenLine
                  className="w-5 h-5"
                  style={{ color: "hsl(var(--longevo-green))" }}
                />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1.5">
                {t("home_hero_share_title")}
              </h3>
              <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
                {t("home_hero_share_desc")}
              </p>
              <Button
                asChild
                className="w-full gap-2 text-white"
                style={{ backgroundColor: "hsl(var(--longevo-green))" }}
              >
                <Link href="/reviews/new">
                  {t("home_hero_share_cta")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Honest launch message */}
        <div className="mt-16 text-sm text-neutral-500 text-center italic">
          {t("home_hero_launch_message")}
        </div>

        {/*
          FUTURE — Social proof strip
          Activate once we hit ≥ 20 clinics AND ≥ 50 verified reviews.
        */}
      </div>
    </section>
  );
}
