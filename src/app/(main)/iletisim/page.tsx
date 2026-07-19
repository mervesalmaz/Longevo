import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Building2, Newspaper, MessageCircle } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("contact_meta_title"),
    description: t("contact_meta_description"),
  };
}

export default function ContactPage() {
  const t = getT();

  const channels = [
    {
      icon: MessageCircle,
      title: t("contact_channel_general_title"),
      desc: t("contact_channel_general_desc"),
      email: "hello@longevo.life",
    },
    {
      icon: Building2,
      title: t("contact_channel_clinic_title"),
      desc: t("contact_channel_clinic_desc"),
      email: "klinik@longevo.life",
      cta: { href: "/klinik-kaydi", label: t("contact_channel_clinic_cta") },
    },
    {
      icon: Newspaper,
      title: t("footer_press"),
      desc: t("contact_channel_press_desc"),
      email: "press@longevo.life",
    },
    {
      icon: Mail,
      title: t("contact_channel_legal_title"),
      desc: t("contact_channel_legal_desc"),
      email: "legal@longevo.life",
    },
  ];

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("footer_contact") },
          ]}
        />

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
          {t("footer_contact")}
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-12">
          {t("contact_subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((c) => (
            <div
              key={c.email}
              className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                }}
              >
                <c.icon
                  style={{
                    color: "hsl(var(--longevo-green))",
                    width: 18,
                    height: 18,
                  }}
                />
              </div>
              <h2 className="font-medium text-neutral-900 mb-1">{c.title}</h2>
              <p className="text-sm text-neutral-600 mb-4 flex-1 leading-relaxed">
                {c.desc}
              </p>
              <a
                href={`mailto:${c.email}`}
                className="text-sm font-medium hover:underline break-all"
                style={{ color: "hsl(var(--longevo-green))" }}
              >
                {c.email}
              </a>
              {c.cta && (
                <Link
                  href={c.cta.href}
                  className="text-xs text-neutral-500 hover:text-neutral-700 mt-2"
                >
                  {c.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-sm text-neutral-500 text-center">
          {t("contact_location")}
        </div>
      </div>
    </PageShell>
  );
}
