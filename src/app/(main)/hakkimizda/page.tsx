import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";

export const metadata: Metadata = {
  title: "Hakkımızda — Longevo",
  description:
    "Longevo Türkiye'nin ilk longevity klinik keşif platformu. Hikayemiz, misyonumuz ve topluluk-öncelikli yaklaşımımız.",
};

const principles = [
  {
    icon: BadgeCheck,
    title: "Doğrulanmış içerik",
    desc: "Her klinik ruhsat kontrolünden geçer. Her yorum e-posta ve tedavi tarihi ile doğrulanır. Sahte içeriğe sıfır tolerans.",
  },
  {
    icon: Users,
    title: "Topluluk öncelikli",
    desc: "Longevo reklamcılık değil, topluluk güveni üzerine kurulu. Ücretli sıralama yok — sadece gerçek topluluk puanları.",
  },
  {
    icon: Target,
    title: "Türkiye odaklı",
    desc: "Global longevity platformları Türkiye'yi görmüyor. Biz yerel pazarı derinlemesine kapsıyoruz — İstanbul'dan Antalya'ya.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Hakkımızda" },
          ]}
        />

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-6">
          Longevo
        </h1>

        <p className="text-xl text-neutral-700 leading-relaxed mb-10">
          Türkiye&apos;nin ilk longevity klinik keşif platformu. IV terapiden
          biyobelirteç testlerine, NAD+ kürlerinden genetik analizlere —
          doğrulanmış kliniklerini, gerçek biohacker deneyimleriyle tek yerde
          topluyoruz.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-4">
            Neden Longevo?
          </h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>
              Türkiye&apos;de longevity ve biohacking ilgisi hızla büyüyor.
              Ama ekosistem parçalı: kliniklerin web siteleri güncel değil,
              fiyatlar şeffaf değil, deneyim paylaşımları Reddit ve Twitter
              iplikleri arasında kaybolmuş durumda.
            </p>
            <p>
              Global platformlar (TripAdvisor, Healthgrades, ZocDoc)
              Türkiye&apos;yi görmüyor. Yerel tıp rehberleri ise longevity
              kategorisini ciddiye almıyor. Longevo bu boşluğu dolduruyor.
            </p>
            <p>
              Vaadimiz basit: Sağlıklı yaşlanma yolculuğunda doğru kliniği,
              doğru tedaviyi, gerçek deneyimlerle bulmanı sağlamak.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-medium text-neutral-900 mb-6">
            İlkelerimiz
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
            Şu an nerdeyiz?
          </h2>
          <p className="text-neutral-700 leading-relaxed mb-4">
            Longevo özel beta aşamasında. Ekosistemi haritalandırıyoruz,
            klinikleri tek tek doğruluyoruz, editör ekibimiz derinlemesine
            rehberler yazıyor. Hedefimiz 2026&apos;da Türkiye&apos;nin en
            güvenilir longevity referansı olmak.
          </p>
          <p className="text-neutral-700 leading-relaxed">
            Beta&apos;ya katılmak için bekleme listesine katılabilir, klinik
            sahibiysen direkt başvuru yapabilirsin.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="gap-2 text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Link href="/beta">
              Beta&apos;ya katıl
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/iletisim">İletişime geç</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
