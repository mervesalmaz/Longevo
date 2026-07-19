import Link from "next/link";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

/**
 * Guard: section stays hidden until the community has produced enough
 * authentic content. Showing 1-2 reviews undermines the trust signal.
 * Launch target: 10+ verified reviews via founding reviewer programme.
 */
const MIN_REVIEWS_FOR_DISPLAY = 10;

const TURKISH_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function formatInitials(name: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDisplayName(name: string): string {
  if (!name?.trim()) return "Anonim";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  // "Mehmet Kaya" → "Mehmet K."
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

function formatTurkishDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
}

export default async function RecentReviewsSection() {
  const supabase = createServerSupabaseClient();
  const t = getT();

  // Gate 1: require ≥ 10 reviews in the system before rendering
  const { count } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  if (!count || count < MIN_REVIEWS_FOR_DISPLAY) return null;

  // Gate 2: fetch latest 4 (DESC) with clinic join
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `id, rating, body, treatment_received, verified_visit, created_at, user_id,
       clinic:clinics(name, slug)`
    )
    .order("created_at", { ascending: false })
    .limit(4);

  if (!reviews || reviews.length === 0) return null;

  // Fetch author profiles (no FK between reviews and users_profile,
  // both reference auth.users — two-step query pattern)
  const userIds = reviews
    .map((r) => r.user_id)
    .filter(Boolean) as string[];

  const profilesMap: Record<
    string,
    { display_name: string; avatar_url: string | null }
  > = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("users_profile")
      .select("id, display_name, avatar_url")
      .in("id", userIds);
    (profiles ?? []).forEach((p) => {
      profilesMap[p.id] = p;
    });
  }

  return (
    <Section tone="base">
      <SectionHeader
        title={t("home_reviews_title")}
        subtitle={t("home_reviews_subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((review) => {
          const profile = review.user_id ? profilesMap[review.user_id] : null;
          const rawName = profile?.display_name ?? t("reviews_anonymous");
          const displayName = formatDisplayName(rawName);
          const initials = formatInitials(rawName);
          const clinic = Array.isArray(review.clinic)
            ? review.clinic[0]
            : review.clinic;
          const quote = truncate(review.body ?? "", 160);
          const dateStr = formatTurkishDate(review.created_at);

          return (
            <article
              key={review.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
            >
              {/* Top: avatar + name + verified badge */}
              <header className="flex items-center gap-3 mb-3">
                <div
                  aria-hidden
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: "hsl(var(--longevo-green) / 0.15)",
                    color: "hsl(var(--longevo-green))",
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {displayName}
                    </span>
                    {review.verified_visit && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-neutral-200"
                        style={{ color: "hsl(var(--longevo-green))" }}
                      >
                        <BadgeCheck className="w-2.5 h-2.5" />
                        {t("common_verified")}
                      </span>
                    )}
                  </div>
                </div>
              </header>

              {/* Clinic · treatment */}
              <div className="text-xs text-neutral-600 mb-3 truncate">
                {clinic ? (
                  <Link
                    href={`/clinics/${clinic.slug}`}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {clinic.name}
                  </Link>
                ) : (
                  <span className="text-neutral-600">
                    {t("home_reviews_clinic_removed")}
                  </span>
                )}
                {review.treatment_received && (
                  <>
                    <span className="text-neutral-300 mx-1.5">·</span>
                    <span className="text-neutral-600">
                      {review.treatment_received}
                    </span>
                  </>
                )}
              </div>

              {/* Stars */}
              <div
                className="flex items-center gap-0.5 mb-4"
                role="img"
                aria-label={t("reviews_stars_aria").replace("{rating}", String(review.rating))}
              >
                {[...Array(5)].map((_, i) => {
                  const filled = i < review.rating;
                  return (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5"
                      fill={filled ? "hsl(var(--longevo-green))" : "transparent"}
                      stroke={
                        filled ? "hsl(var(--longevo-green))" : "#d4d4d4"
                      }
                      strokeWidth={1.5}
                    />
                  );
                })}
              </div>

              {/* Quote (first 160 chars, line-clamp-3) */}
              <blockquote className="text-sm text-neutral-700 mb-5 line-clamp-3 leading-relaxed flex-1">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Footer: date + read link */}
              <footer className="pt-4 mt-auto border-t border-neutral-100 flex items-center justify-between gap-2">
                <time
                  dateTime={review.created_at}
                  className="text-xs text-neutral-500"
                >
                  {dateStr}
                </time>
                {clinic && (
                  <Link
                    href={`/clinics/${clinic.slug}`}
                    className="inline-flex items-center gap-1 text-xs hover:underline"
                    style={{ color: "hsl(var(--longevo-green))" }}
                  >
                    {t("home_reviews_view_clinic")}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </footer>
            </article>
          );
        })}
      </div>

      {/* Section bottom CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "hsl(var(--longevo-green))" }}
        >
          {t("home_reviews_cta")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}
