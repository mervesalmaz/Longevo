import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { treatments } from "@/data/treatments";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tedaviler — Longevo",
  description:
    "Türkiye'de sunulan longevity tedavilerinin kapsamlı rehberi. IV terapi, NAD+, biyobelirteç testi, genetik analiz ve daha fazlası.",
};

export default async function TreatmentsListPage() {
  // Live clinic counts + starting prices per treatment (see
  // TreatmentGuidesSection for the same pattern). Real counts shown as-is.
  const supabase = createServerSupabaseClient();
  const [{ data: links }, { data: treatmentRows }] = await Promise.all([
    supabase.from("clinic_treatments").select("treatment_id"),
    supabase.from("treatments").select("id, slug, starting_price_try"),
  ]);

  const slugById: Record<string, string> = {};
  const livePrices: Record<string, number> = {};
  (treatmentRows ?? []).forEach((t) => {
    if (!t.id || !t.slug) return;
    slugById[t.id] = t.slug;
    if (t.starting_price_try != null) livePrices[t.slug] = t.starting_price_try;
  });

  const liveCounts: Record<string, number> = {};
  (links ?? []).forEach((l) => {
    const slug = slugById[l.treatment_id];
    if (!slug) return;
    liveCounts[slug] = (liveCounts[slug] ?? 0) + 1;
  });

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Tedaviler" },
          ]}
        />

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            Longevity tedavileri
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Türkiye&apos;de sunulan tüm longevity tedavilerinin kapsamlı
            rehberi. Her tedavi için nedir, kimler için uygun, fiyat aralığı
            ve o tedaviyi sunan doğrulanmış klinikler.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((t) => {
            const Icon = t.icon;
            const count = liveCounts[t.slug] ?? 0;
            const priceValue = livePrices[t.slug];
            const price =
              priceValue != null
                ? priceValue.toLocaleString("tr-TR")
                : t.startPrice;
            return (
              <Link
                key={t.slug}
                href={`/tr/tedaviler/${t.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                  }}
                >
                  <Icon
                    style={{
                      color: "hsl(var(--longevo-green))",
                      width: 22,
                      height: 22,
                    }}
                  />
                </div>
                <h2 className="text-lg font-medium text-neutral-900 mb-1.5">
                  {t.title}
                </h2>
                <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                  {t.description}
                </p>
                <div className="mt-auto text-xs text-neutral-500">
                  {count > 0 ? (
                    <>
                      <span className="text-neutral-700 font-medium">
                        {count}
                      </span>{" "}
                      klinik
                      <span className="text-neutral-300 mx-1.5">·</span>
                      Fiyat ~₺
                      <span className="text-neutral-700 font-medium">
                        {price}
                      </span>
                      &apos;den
                    </>
                  ) : (
                    <span className="text-neutral-400">Henüz klinik yok</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
