import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Users, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { getT } from "@/lib/i18n/server";
import { ApplicationForm } from "./application-form";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("klinik_meta_title"),
    description: t("klinik_meta_desc"),
  };
}

export default function ClinicSignupPage() {
  const t = getT();

  const perks = [
    {
      icon: CheckCircle2,
      title: t("klinik_perk_1_title"),
      desc: t("klinik_perk_1_desc"),
    },
    {
      icon: BadgeCheck,
      title: t("klinik_perk_2_title"),
      desc: t("klinik_perk_2_desc"),
    },
    {
      icon: Users,
      title: t("klinik_perk_3_title"),
      desc: t("klinik_perk_3_desc"),
    },
    {
      icon: TrendingUp,
      title: t("klinik_perk_4_title"),
      desc: t("klinik_perk_4_desc"),
    },
  ];

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("klinik_breadcrumb") },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
              {t("klinik_hero_title")}
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {t("klinik_hero_subtitle")}
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                color: "hsl(var(--longevo-green))",
              }}
            >
              🎁 {t("klinik_hero_badge")}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wider mb-3">
              {t("klinik_perks_heading")}
            </h2>
            {perks.map((p) => (
              <div key={p.title} className="flex items-start gap-3">
                <p.icon
                  className="flex-shrink-0 mt-0.5"
                  style={{
                    color: "hsl(var(--longevo-green))",
                    width: 18,
                    height: 18,
                  }}
                />
                <div>
                  <div className="text-sm font-medium text-neutral-900">
                    {p.title}
                  </div>
                  <div className="text-xs text-neutral-600 leading-relaxed">
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ApplicationForm />

        <div className="mt-12 text-center text-sm text-neutral-500">
          {t("klinik_faq_prompt_before")}
          <Link
            href="/klinik-kaydi/sss"
            className="underline hover:text-neutral-700 transition-colors"
          >
            {t("klinik_faq_prompt_link")}
          </Link>
          {t("klinik_faq_prompt_after")}
        </div>
      </div>
    </PageShell>
  );
}
