import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, MapPin, Sparkles } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Title & query strategy adapt to total review volume:
 *   reviewCount < 10   →  "Yeni eklenen klinikler" + newest verified first
 *   reviewCount 10-50  →  "Doğrulanmış klinikler"   + verified w/ reviews prioritized
 *   reviewCount > 50   →  "Topluluğun seçimi"        + top avg_rating (≥ 3 reviews)
 */
const EARLY_THRESHOLD = 10;
const MATURE_THRESHOLD = 50;
const MIN_REVIEWS_FOR_TOP = 3; // required before a clinic can be "Topluluğun seçimi"

type ClinicRow = {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  cover_image_url: string | null;
  editorial_summary: string | null;
  original_description: string | null;
  description: string | null;
  verified: boolean;
  created_at: string;
  reviews: { rating: number }[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clinic_treatments: { treatment: any }[] | null;
};

function bestSummary(c: ClinicRow): string {
  return (
    c.editorial_summary?.trim() ||
    c.original_description?.trim() ||
    c.description?.trim() ||
    ""
  );
}

function computeStats(reviews: { rating: number }[] | null) {
  const ratings = (reviews ?? []).map((r) => r.rating);
  const count = ratings.length;
  const avg = count > 0 ? ratings.reduce((a, b) => a + b, 0) / count : 0;
  return { avg, count };
}

export default async function FeaturedClinicsSection() {
  const supabase = createServerSupabaseClient();

  // 1. Total review volume — drives title + ranking strategy
  const { count: totalReviewsRaw } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });
  const totalReviews = totalReviewsRaw ?? 0;

  let title: string;
  if (totalReviews < EARLY_THRESHOLD) title = "Yeni eklenen klinikler";
  else if (totalReviews <= MATURE_THRESHOLD) title = "Doğrulanmış klinikler";
  else title = "Topluluğun seçimi";

  // 2. Fetch verified clinics (narrow select)
  // Try with editorial columns first; if they don't exist yet (pre-migration),
  // fall back to the legacy `description` column so the section still renders.
  let clinicsRaw: unknown[] | null = null;
  {
    const { data, error } = await supabase
      .from("clinics")
      .select(
        `id, name, slug, city, country, cover_image_url,
         editorial_summary, original_description, description,
         verified, created_at,
         reviews (rating),
         clinic_treatments (treatment:treatments(name, slug))`
      )
      .eq("verified", true);
    if (!error) {
      clinicsRaw = data;
    } else {
      // Migration not yet run — fall back to legacy select
      const { data: legacy } = await supabase
        .from("clinics")
        .select(
          `id, name, slug, city, country, cover_image_url,
           description, verified, created_at,
           reviews (rating),
           clinic_treatments (treatment:treatments(name, slug))`
        )
        .eq("verified", true);
      clinicsRaw = legacy;
    }
  }

  const clinics = (clinicsRaw ?? []) as ClinicRow[];

  // 3. Rank & slice based on lifecycle stage
  let featured: (ClinicRow & { avg: number; count: number })[] = [];

  if (totalReviews < EARLY_THRESHOLD) {
    // Early: newest verified, no rating gate
    featured = clinics
      .map((c) => ({ ...c, ...computeStats(c.reviews) }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3);
  } else if (totalReviews <= MATURE_THRESHOLD) {
    // Mid: prefer verified with ≥ 1 review, fall back to newest if not enough
    const withStats = clinics.map((c) => ({ ...c, ...computeStats(c.reviews) }));
    const withReviews = withStats
      .filter((c) => c.count > 0)
      .sort((a, b) => b.avg - a.avg || b.count - a.count);
    if (withReviews.length >= 3) {
      featured = withReviews.slice(0, 3);
    } else {
      const fallback = withStats
        .filter((c) => !withReviews.find((w) => w.id === c.id))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      featured = [...withReviews, ...fallback].slice(0, 3);
    }
  } else {
    // Mature: top avg_rating with ≥ MIN_REVIEWS_FOR_TOP reviews
    featured = clinics
      .map((c) => ({ ...c, ...computeStats(c.reviews) }))
      .filter((c) => c.count >= MIN_REVIEWS_FOR_TOP)
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 3);
  }

  // Empty state: no verified clinics at all
  if (featured.length === 0) return null;

  return (
    <Section tone="alt">
      <SectionHeader
        title={title}
        subtitle="Longevo ekosistemine son katılan, doğrulanmış klinikler."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featured.map((clinic) => {
          const summary = bestSummary(clinic);
          const treatments = (clinic.clinic_treatments ?? [])
            .map((ct) =>
              Array.isArray(ct.treatment) ? ct.treatment[0] : ct.treatment
            )
            .filter(Boolean)
            .slice(0, 3) as { name: string; slug: string }[];

          return (
            <article
              key={clinic.id}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 transition-colors flex flex-col"
            >
              <Link
                href={`/clinics/${clinic.slug}`}
                className="flex flex-col h-full"
              >
                {/* 16:9 cover */}
                <div className="relative aspect-[16/9] bg-neutral-50 overflow-hidden">
                  {clinic.cover_image_url ? (
                    <Image
                      src={clinic.cover_image_url}
                      alt={`${clinic.name} klinik kapak görseli`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-5xl font-light opacity-40"
                      style={{ color: "hsl(var(--longevo-green))" }}
                    >
                      {clinic.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-lg font-medium text-neutral-900 leading-snug">
                      {clinic.name}
                    </h3>
                    <RatingBadge
                      avg={clinic.avg}
                      count={clinic.count}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-sm text-neutral-600 mb-3">
                    <MapPin className="w-3 h-3" />
                    {clinic.city}
                    {clinic.country && (
                      <span className="text-neutral-500">
                        , {clinic.country}
                      </span>
                    )}
                  </div>

                  {summary && (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-4">
                      {summary}
                    </p>
                  )}

                  {treatments.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      {treatments.map((t) => (
                        <span
                          key={t.slug}
                          className="inline-block px-2 py-0.5 text-[11px] rounded-full border border-neutral-200 text-neutral-600 bg-neutral-50"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Section bottom CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "hsl(var(--longevo-green))" }}
        >
          Tüm klinikleri gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}

/**
 * Rating badge — two visual states:
 *   count === 0  →  "Yeni" pill (green accent)
 *   count > 0    →  "4.8 ⭐ (23 yorum)"
 */
function RatingBadge({ avg, count }: { avg: number; count: number }) {
  if (count === 0) {
    return (
      <span
        className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: "hsl(var(--longevo-green) / 0.12)",
          color: "hsl(var(--longevo-green))",
        }}
      >
        <Sparkles className="w-2.5 h-2.5" />
        Yeni
      </span>
    );
  }

  return (
    <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs text-neutral-700">
      <Star
        className="w-3 h-3"
        fill="hsl(var(--longevo-green))"
        stroke="hsl(var(--longevo-green))"
      />
      <span className="text-neutral-900 font-medium">{avg.toFixed(1)}</span>
      <span className="text-neutral-500">
        ({count} yorum)
      </span>
    </span>
  );
}
