import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { treatments, treatmentLabel } from "@/data/treatments";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT, getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getT();
  return {
    title: t("treatments_meta_title"),
    description: t("treatments_meta_description"),
  };
}

export default async function TreatmentsListPage() {
  const tx = getT();
  const locale = getLocale();
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
            { label: tx("common_home"), href: "/" },
            { label: tx("treatments_breadcrumb") },
          ]}
        />

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            {tx("treatments_title")}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {tx("treatments_intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatments.map((tg) => {
            const Icon = tg.icon;
            const { title, description } = treatmentLabel(tg, locale);
            const count = liveCounts[tg.slug] ?? 0;
            const priceValue = livePrices[tg.slug];
            const price =
              priceValue != null
                ? priceValue.toLocaleString("tr-TR")
                : tg.startPrice;
            return (
              <Link
                key={tg.slug}
                href={`/tr/tedaviler/${tg.slug}`}
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
                  {title}
                </h2>
                <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
                  {description}
                </p>
                <div className="mt-auto text-xs text-neutral-500">
                  {count > 0 ? (
                    <>
                      <span className="text-neutral-700 font-medium">
                        {count}
                      </span>{" "}
                      {tx("clinic_count_suffix")}
                      <span className="text-neutral-300 mx-1.5">·</span>
                      {tx("treatments_price_prefix")}
                      <span className="text-neutral-700 font-medium">
                        {price}
                      </span>
                      {tx("treatments_price_suffix")}
                    </>
                  ) : (
                    <span className="text-neutral-400">
                      {tx("treatments_no_clinics_yet")}
                    </span>
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
