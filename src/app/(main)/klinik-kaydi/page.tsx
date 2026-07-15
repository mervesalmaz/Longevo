import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Users, BadgeCheck } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = {
  title: "Kliniğini listele — Longevo",
  description:
    "Longevo'da kliniğini listele, Türkiye'nin en hedefli longevity kitlesine ulaş. İlk 20 klinik için 12 ay ücretsiz premium üyelik.",
};

const perks = [
  {
    icon: CheckCircle2,
    title: "Ücretsiz profil",
    desc: "Klinik bilgileri, fotoğraflar, tedavi listesi, iletişim.",
  },
  {
    icon: BadgeCheck,
    title: "Doğrulanmış yorumlar",
    desc: "Gerçek müşterilerden, filtreli ve şeffaf.",
  },
  {
    icon: Users,
    title: "Hedefli kitle",
    desc: "Longevity araması yapan high-intent kullanıcıya ulaş.",
  },
  {
    icon: TrendingUp,
    title: "SEO trafiği",
    desc: "\"İstanbul NAD+ terapi\" gibi aramalarda görünürlük.",
  },
];

export default function ClinicSignupPage() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Klinik kaydı" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14">
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
              Kliniğini Longevo&apos;da listele
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Türkiye&apos;nin ilk longevity keşif platformunda yer al. IV
              terapi, NAD+, biyobelirteç testi veya diğer longevity tedavileri
              sunuyorsan — Longevo&apos;da profil açarak hedefli kitleye
              ulaşabilirsin.
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                color: "hsl(var(--longevo-green))",
              }}
            >
              🎁 İlk 20 klinik için 12 ay ücretsiz premium üyelik
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wider mb-3">
              Sana ne sunuyoruz
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
          Sıkça sorulan sorular için{" "}
          <Link
            href="/klinik-kaydi/sss"
            className="underline hover:text-neutral-700 transition-colors"
          >
            SSS sayfasına
          </Link>{" "}
          göz at. Süreç, doğrulama kriterleri ve ücretlendirme burada
          açıklanıyor.
        </div>
      </div>
    </PageShell>
  );
}
