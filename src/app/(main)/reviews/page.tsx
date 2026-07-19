import type { Metadata } from "next";
import Link from "next/link";
import { Star, BadgeCheck, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = getT();
  return {
    title: t("reviews_meta_title"),
    description: t("reviews_meta_description"),
  };
}

const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatDisplayName(name: string): string {
  if (!name?.trim()) return "Anonim";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

function formatInitials(name: string): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTurkishDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function truncate(text: string, max: number): string {
  const clean = (text ?? "").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
}

export default async function ReviewsPage() {
  const t = getT();
  const supabase = createServerSupabaseClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `id, rating, title, body, treatment_received, verified_visit, created_at, user_id,
       clinic:clinics(name, slug)`
    )
    .order("created_at", { ascending: false })
    .limit(60);

  const userIds = (reviews ?? [])
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

  const list = reviews ?? [];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: t("common_home"), href: "/" },
            { label: t("reviews_breadcrumb") },
          ]}
        />

        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            {t("reviews_title")}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            {t("reviews_intro")}
          </p>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <PenLine className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600 mb-4">{t("reviews_empty")}</p>
            <Button
              asChild
              className="text-white"
              style={{ backgroundColor: "hsl(var(--longevo-green))" }}
            >
              <Link href="/reviews/new">{t("home_hero_share_cta")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((review) => {
              const profile = review.user_id
                ? profilesMap[review.user_id]
                : null;
              const rawName = profile?.display_name || t("reviews_anonymous");
              const displayName = formatDisplayName(rawName);
              const initials = formatInitials(rawName);
              const clinic = Array.isArray(review.clinic)
                ? review.clinic[0]
                : review.clinic;
              const quote = truncate(review.body ?? "", 200);
              const dateStr = formatTurkishDate(review.created_at);

              return (
                <article
                  key={review.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
                >
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
                            {t("reviews_verified_badge")}
                          </span>
                        )}
                      </div>
                    </div>
                  </header>

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
                        {t("reviews_clinic_removed")}
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

                  <div
                    className="flex items-center gap-0.5 mb-3"
                    role="img"
                    aria-label={t("reviews_stars_aria").replace(
                      "{rating}",
                      String(review.rating)
                    )}
                  >
                    {[...Array(5)].map((_, i) => {
                      const filled = i < review.rating;
                      return (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          fill={filled ? "hsl(var(--longevo-green))" : "transparent"}
                          stroke={filled ? "hsl(var(--longevo-green))" : "#d4d4d4"}
                          strokeWidth={1.5}
                        />
                      );
                    })}
                  </div>

                  {review.title && (
                    <h2 className="text-sm font-semibold text-neutral-900 mb-1.5">
                      {review.title}
                    </h2>
                  )}
                  <blockquote className="text-sm text-neutral-700 mb-5 line-clamp-4 leading-relaxed flex-1">
                    &ldquo;{quote}&rdquo;
                  </blockquote>

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
                        className="text-xs hover:underline"
                        style={{ color: "hsl(var(--longevo-green))" }}
                      >
                        {t("reviews_view_clinic")}
                      </Link>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
