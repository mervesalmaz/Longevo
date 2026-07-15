import Link from "next/link";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { treatments } from "@/data/treatments";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TreatmentGuidesSection() {
  // Live clinic counts per treatment via the clinic_treatments join table.
  // Two simple queries (links + id→slug map) avoid embedded-relationship
  // typing ambiguity. Real counts are shown as-is, including 0.
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
    <Section tone="alt">
      <SectionHeader
        title="Tedavi ve testleri keşfet"
        subtitle="Her tedavi için: nedir, kimler için uygun, Türkiye'de fiyat aralığı, doğrulanmış klinikler."
      />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              // TODO: /tr/tedaviler/[slug] editorial pages to be built.
              // Until then this 404s gracefully — see roadmap note in
              // src/data/treatments.ts for the live-data migration.
              href={`/tr/tedaviler/${t.slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-300 hover:bg-neutral-50 transition-colors flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                }}
              >
                <Icon
                  style={{
                    color: "hsl(var(--longevo-green))",
                    width: 20,
                    height: 20,
                  }}
                />
              </div>

              {/* Title */}
              <h3 className="text-base font-medium text-neutral-900 mb-1.5">
                {t.title}
              </h3>

              {/* Description — single line */}
              <p className="text-sm text-neutral-600 mb-4 line-clamp-1">
                {t.description}
              </p>

              {/* Meta — live clinic count + starting price */}
              <div className="mt-auto text-xs text-neutral-500">
                {count > 0 ? (
                  <>
                    <span className="text-neutral-600">{count}</span> klinik
                    <span className="text-neutral-300 mx-1.5">·</span>
                    Fiyat ~₺
                    <span className="text-neutral-600">{price}</span>
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
    </Section>
  );
}
