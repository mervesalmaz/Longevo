import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { cities } from "@/data/cities";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getT();
  return {
    title: t("cities_meta_title"),
    description: t("cities_meta_description"),
  };
}

export default async function CitiesListPage() {
  const t = getT();
  const supabase = createServerSupabaseClient();
  const { data: clinicRows } = await supabase.from("clinics").select("city");
  const queryOk = clinicRows != null;

  // Match `clinics.city` against the Turkish city name (same key the detail
  // page uses via ilike). Turkish locale lowercasing on both sides.
  const liveCounts: Record<string, number> = {};
  (clinicRows ?? []).forEach((r) => {
    const k = (r.city ?? "").toLocaleLowerCase("tr").trim();
    if (k) liveCounts[k] = (liveCounts[k] ?? 0) + 1;
  });

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("cities_breadcrumb") },
          ]}
        />

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            {t("cities_title")}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {t("cities_intro")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cities.map((city) => {
            const count = queryOk
              ? liveCounts[city.name.toLocaleLowerCase("tr").trim()] ?? 0
              : city.clinicCount;
            return (
              <Link
                key={city.slug}
                href={`/tr/sehirler/${city.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-neutral-50 overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-medium text-neutral-900 mb-1">
                    {city.name}
                  </h2>
                  <div className="text-sm text-neutral-600">
                    <span className="text-neutral-900 font-medium">
                      {count}
                    </span>{" "}
                    {t("clinic_count_suffix")}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
