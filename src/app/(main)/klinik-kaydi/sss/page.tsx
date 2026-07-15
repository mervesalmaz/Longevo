import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";

export const metadata: Metadata = {
  title: "Klinik kaydı SSS — Longevo",
  description:
    "Longevo'da klinik kaydı sıkça sorulan sorular: doğrulama süreci, ücretlendirme, listeleme kriterleri.",
};

const faqs = [
  {
    q: "Başvurum ne kadar sürede değerlendirilir?",
    a: "Başvurular manuel olarak incelenir. Ortalama yanıt süresi 48 saat. Ekstra belge (ruhsat, doktor sertifikası) istenebildiğinde süreç 5 iş gününe kadar uzayabilir.",
  },
  {
    q: "Listeleme için ücret alıyor musunuz?",
    a: "Temel profil listesi ücretsizdir. Beta döneminde ilk 20 doğrulanmış klinik için 12 ay ücretsiz premium üyelik sağlanıyor (öne çıkarma, yorum yanıtlama, analytics). Premium ücretlendirme lansman sonrası açıklanacak.",
  },
  {
    q: "Klinik doğrulama kriterleriniz neler?",
    a: "Sağlık Bakanlığı ruhsatı zorunludur. Ek olarak doktor kadro bilgileri, fiziksel adres doğrulaması ve en az bir longevity tedavisinin aktif sunumu aranır. Doğrulanmamış klinikler profil açsa da arama sonuçlarında \"Doğrulanmış\" rozeti almazlar.",
  },
  {
    q: "Yorumlar üzerinde kontrolüm var mı?",
    a: "Yorumlara profilinizden yanıt verebilirsiniz. Sahte/spam yorumları bize bildirebilirsiniz, moderasyon ekibimiz 24 saat içinde inceler. Negatif yorumları silemezsiniz — bu platformun güvenilirliği için kritik. Ancak yanıt hakkınız her zaman saklıdır.",
  },
  {
    q: "Kaç tedavi ekleyebilirim?",
    a: "Sınır yok. Ancak profilinizin \"Doğrulanmış\" rozeti alabilmesi için eklediğiniz her tedavinin kliniğinizde aktif olarak sunulması gerekir. Sadece liste doldurmak için eklenen tedaviler yüzünden rozet kaybedilebilir.",
  },
  {
    q: "Klinik bilgilerimi nasıl güncelleyebilirim?",
    a: "Başvurunuz onaylandıktan sonra size admin panel erişimi veriyoruz. Oradan klinik bilgileri, fotoğraflar, tedavi listesi, çalışma saatleri gibi tüm alanları güncelleyebilirsiniz. Kritik değişiklikler (klinik adı, ruhsat) yeniden doğrulama gerektirebilir.",
  },
  {
    q: "Hangi şehirlerde listelenebilirim?",
    a: "Şu an İstanbul, Ankara, İzmir ve Antalya'ya odaklanıyoruz. Bu şehirler dışındaki klinikleri de kabul ediyoruz ama öne çıkarılma programımız öncelikle bu dört şehirdedir. Farklı şehirdeki ilk birkaç klinik ek destek alır.",
  },
  {
    q: "Başvurum reddedilirse ne olur?",
    a: "Red sebebi size e-posta ile açıkça bildirilir. En yaygın red sebepleri: ruhsat eksikliği, sunulan tedavilerin longevity kapsamı dışında olması, eksik iletişim bilgisi. Eksikleri tamamlayıp tekrar başvurabilirsiniz.",
  },
];

export default function FaqPage() {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Klinik kaydı", href: "/klinik-kaydi" },
            { label: "SSS" },
          ]}
        />

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
          Sıkça sorulan sorular
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed mb-12">
          Klinik kaydı, doğrulama, ücretlendirme ve günlük kullanım ile ilgili
          soruların cevapları.
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
            Sorularına cevap bulamadın mı?
          </p>
          <Button
            asChild
            className="gap-2 text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Link href="/klinik-kaydi">
              Başvuruya başla
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
