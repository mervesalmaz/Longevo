import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("about_meta_title"),
    description: t("about_meta_description"),
  };
}

export default function AboutPage() {
  const t = getT();

  const principles = [
    {
      icon: BadgeCheck,
      title: t("about_principle_verified_title"),
      desc: t("about_principle_verified_desc"),
    },
    {
      icon: Users,
      title: t("about_principle_community_title"),
      desc: t("about_principle_community_desc"),
    },
    {
      icon: Target,
      title: t("about_principle_turkey_title"),
      desc: t("about_principle_turkey_desc"),
    },
  ];

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("footer_about_us") },
          ]}
        />

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-6">
          Longevo
        </h1>

        <p className="text-xl text-neutral-700 leading-relaxed mb-10">
          {t("about_intro")}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">
            {t("about_why_title")}
          </h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>{t("about_why_p1")}</p>
            <p>{t("about_why_p2")}</p>
            <p>{t("about_why_p3")}</p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">
            {t("about_principles_title")}
          </h2>
          <div className="space-y-5">
            {principles.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                  }}
                >
                  <p.icon
                    style={{
                      color: "hsl(var(--longevo-green))",
                      width: 18,
                      height: 18,
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">
            {t("about_status_title")}
          </h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            {t("about_status_p1")}
          </p>
          <p className="text-neutral-700 leading-relaxed">
            {t("about_status_p2")}
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="gap-2 text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Link href="/beta">
              {t("about_cta_join")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/iletisim">{t("about_cta_contact")}</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
