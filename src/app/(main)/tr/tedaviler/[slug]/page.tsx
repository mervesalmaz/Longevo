import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { treatments, treatmentLabel } from "@/data/treatments";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT, getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tt = getT();
  const found = treatments.find((x) => x.slug === params.slug);
  if (!found) return { title: tt("treatment_notfound_title") };
  const { title, description } = treatmentLabel(found, getLocale());
  return {
    title: `${title} — Longevo`,
    description: `${title}: ${description}. ${tt("treatment_meta_desc_suffix")}`,
  };
}

// TR route slug === DB treatment slug used by clinic_treatments.
// Kept as an explicit allow-list so unknown slugs resolve to undefined.
const SLUG_MAP: Record<string, string> = {
  "iv-terapi": "iv-terapi",
  biyobelirtec: "biyobelirtec",
  "nad-terapi": "nad-terapi",
  "ozon-terapi": "ozon-terapi",
  "hormon-paneli": "hormon-paneli",
  "genetik-analiz": "genetik-analiz",
  "prp-terapi": "prp-terapi",
  "kok-hucre": "kok-hucre",
};

export default async function TreatmentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tt = getT();
  const locale = getLocale();
  const treatment = treatments.find((t) => t.slug === params.slug);
  if (!treatment) notFound();

  const { title, description } = treatmentLabel(treatment, locale);
  const Icon = treatment.icon;
  const dbSlug = SLUG_MAP[params.slug];

  // Find clinics offering this treatment (live)
  const supabase = createServerSupabaseClient();
  let clinicCount = 0;
  if (dbSlug) {
    const { count } = await supabase
      .from("clinic_treatments")
      .select("clinic_id, treatments!inner(slug)", {
        count: "exact",
        head: true,
      })
      .eq("treatments.slug", dbSlug);
    clinicCount = count ?? 0;
  }

  const related = treatments.filter((t) => t.slug !== params.slug).slice(0, 3);

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: tt("common_home"), href: "/" },
            { label: tt("treatments_breadcrumb"), href: "/tr/tedaviler" },
            { label: title },
          ]}
        />

        {/* Hero */}
        <div className="flex items-start gap-5 mb-10">
          <div
            className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--longevo-green) / 0.12)" }}
          >
            <Icon
              style={{
                color: "hsl(var(--longevo-green))",
                width: 30,
                height: 30,
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-2">
              {title}
            </h1>
            <p className="text-lg text-neutral-600">{description}</p>
            <div className="flex items-center gap-3 mt-4 text-sm text-neutral-500">
              <span>
                <span className="text-neutral-900 font-medium">
                  {clinicCount}
                </span>{" "}
                {tt("treatment_clinics_offer")}
              </span>
              <span className="text-neutral-300">·</span>
              <span>
                {tt("treatments_price_prefix")}
                {treatment.startPrice}
                {tt("treatment_price_starts_suffix")}
              </span>
            </div>
          </div>
        </div>

        {/* Content placeholder — editorial guide coming */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 mb-10">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-neutral-900 mb-1">
                {tt("treatment_guide_soon")}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {tt("treatment_guide_prep").replace(
                  "{treatment}",
                  title.toLowerCase()
                )}
              </p>
            </div>
          </div>
        </div>

        {/* CTA to clinics offering this treatment */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-14"
          style={{
            backgroundColor: "hsl(var(--longevo-green) / 0.06)",
            border: "1px solid hsl(var(--longevo-green) / 0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-medium text-neutral-900 mb-1">
                {tt("treatment_cta_heading").replace(
                  "{treatment}",
                  title
                )}
              </h2>
              <p className="text-sm text-neutral-600">
                {clinicCount > 0
                  ? tt("treatment_cta_desc_count").replace(
                      "{count}",
                      String(clinicCount)
                    )
                  : tt("treatment_cta_desc_empty")}
              </p>
            </div>
            <Button
              asChild
              className="gap-2 text-white flex-shrink-0"
              style={{ backgroundColor: "hsl(var(--longevo-green))" }}
            >
              <Link href={`/search?treatment=${dbSlug ?? params.slug}`}>
                <Search className="w-4 h-4" />
                {tt("treatment_view_clinics")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Related */}
        <div>
          <h2 className="text-xl font-medium text-neutral-900 mb-5">
            {tt("treatment_related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => {
              const RIcon = r.icon;
              const rLabel = treatmentLabel(r, locale);
              return (
                <Link
                  key={r.slug}
                  href={`/tr/tedaviler/${r.slug}`}
                  className="rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all flex items-center gap-3"
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: "hsl(var(--longevo-green) / 0.12)",
                    }}
                  >
                    <RIcon
                      style={{
                        color: "hsl(var(--longevo-green))",
                        width: 14,
                        height: 14,
                      }}
                    />
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {rLabel.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
