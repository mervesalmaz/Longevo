import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { cities } from "@/data/cities";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function CityGuidesSection() {
  // Live clinic counts per city — matched on `clinics.city` against the
  // Turkish city name (same key the detail page uses via ilike). Turkish
  // locale lowercasing so "İstanbul" → "istanbul" on both sides.
  const supabase = createServerSupabaseClient();
  const { data: clinicRows } = await supabase.from("clinics").select("city");
  const queryOk = clinicRows != null;

  const liveCounts: Record<string, number> = {};
  (clinicRows ?? []).forEach((r) => {
    const key = (r.city ?? "").toLocaleLowerCase("tr").trim();
    if (!key) return;
    liveCounts[key] = (liveCounts[key] ?? 0) + 1;
  });

  return (
    <Section tone="base">
      <SectionHeader
        title="Şehrinizde longevity"
        subtitle="Türkiye'nin dört şehrinde longevity ekosistemini keşfedin."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cities.map((city) => {
          const count = queryOk
            ? liveCounts[city.name.toLocaleLowerCase("tr").trim()] ?? 0
            : city.clinicCount;
          return (
            <Link
              key={city.slug}
              // TODO: /tr/sehirler/[slug] city-guide pages to be built.
              href={`/tr/sehirler/${city.slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 transition-colors flex flex-col"
            >
              {/* 16:9 cover image */}
              <div className="relative aspect-[16/9] bg-neutral-50 overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-medium text-neutral-900 mb-1">
                  {city.name}
                </h3>
                <div className="text-sm text-neutral-600">
                  <span className="text-neutral-700">{count}</span> klinik
                </div>
              </div>
            </Link>
          );
        })}

        {/* 5th card: "Tüm şehirler →" CTA */}
        <Link
          href="/tr/sehirler"
          className="group rounded-2xl border border-dashed border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center p-6 text-center col-span-2 md:col-span-1"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ backgroundColor: "hsl(var(--longevo-green) / 0.12)" }}
          >
            <MapPin
              style={{
                color: "hsl(var(--longevo-green))",
                width: 20,
                height: 20,
              }}
            />
          </div>
          <span className="text-sm font-medium text-neutral-900 mb-1">
            Tüm şehirler
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-neutral-600 group-hover:text-neutral-700">
            Keşfet
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>
    </Section>
  );
}
