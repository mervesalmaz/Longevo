import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("sss_meta_title"),
    description: t("sss_meta_desc"),
  };
}

export default function FaqPage() {
  const t = getT();

  const faqs = [
    { q: t("sss_faq_1_q"), a: t("sss_faq_1_a") },
    { q: t("sss_faq_2_q"), a: t("sss_faq_2_a") },
    { q: t("sss_faq_3_q"), a: t("sss_faq_3_a") },
    { q: t("sss_faq_4_q"), a: t("sss_faq_4_a") },
    { q: t("sss_faq_5_q"), a: t("sss_faq_5_a") },
    { q: t("sss_faq_6_q"), a: t("sss_faq_6_a") },
    { q: t("sss_faq_7_q"), a: t("sss_faq_7_a") },
    { q: t("sss_faq_8_q"), a: t("sss_faq_8_a") },
  ];

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("klinik_breadcrumb"), href: "/klinik-kaydi" },
            { label: t("sss_breadcrumb") },
          ]}
        />

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
          {t("sss_title")}
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-12">
          {t("sss_subtitle")}
        </p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-300 transition-colors"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                <h2 className="text-base font-medium text-neutral-900 pr-4">
                  {faq.q}
                </h2>
                <span className="flex-shrink-0 text-neutral-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ backgroundColor: "hsl(var(--longevo-green) / 0.06)" }}
        >
          <p className="text-sm text-neutral-700 mb-4">
            {t("sss_cta_prompt")}
          </p>
          <Button
            asChild
            className="gap-2 text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Link href="/klinik-kaydi">
              {t("sss_cta_button")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
