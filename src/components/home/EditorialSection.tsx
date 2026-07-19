import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getT } from "@/lib/i18n/server";
import type { Article, ArticleCategory } from "@/lib/types";

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

function formatTurkishDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${TURKISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Per-category pill styling. Subtle dark-theme tints; green reserved for
 * the brand action accent elsewhere on the page.
 */
const categoryStyle: Record<
  ArticleCategory,
  { bg: string; text: string; dot: string }
> = {
  Rehber: {
    bg: "bg-[hsl(var(--longevo-green)/0.12)]",
    text: "text-[hsl(var(--longevo-green))]",
    dot: "bg-[hsl(var(--longevo-green))]",
  },
  Bilimsel: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Röportaj: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
};

export default async function EditorialSection() {
  const supabase = createServerSupabaseClient();
  const t = getT();

  // Fetch featured + published articles. If the table doesn't exist yet
  // (pre-migration), silently render nothing — section stays hidden.
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, category, title, excerpt, reading_time, cover_image, published_at"
    )
    .eq("featured", true)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);

  if (error) return null;
  const articles = (data ?? []) as Pick<
    Article,
    | "id"
    | "slug"
    | "category"
    | "title"
    | "excerpt"
    | "reading_time"
    | "cover_image"
    | "published_at"
  >[];

  if (articles.length === 0) return null;

  return (
    <Section tone="base">
      <SectionHeader
        title={t("home_editorial_title")}
        subtitle={t("home_editorial_subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((article) => {
          const style =
            categoryStyle[article.category as ArticleCategory] ??
            categoryStyle.Rehber;
          const date = formatTurkishDate(article.published_at);

          return (
            <article
              key={article.id}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 transition-colors flex flex-col"
            >
              <Link
                href={`/tr/rehber/${article.slug}`}
                className="flex flex-col h-full"
              >
                {/* 16:9 cover */}
                <div className="relative aspect-[16/9] bg-neutral-50 overflow-hidden">
                  {article.cover_image ? (
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 50%, hsl(var(--longevo-green) / 0.2) 0%, transparent 70%)",
                      }}
                    />
                  )}
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 self-start text-[11px] font-medium px-2.5 py-1 rounded-full mb-4 ${style.bg} ${style.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-neutral-900 mb-3 leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-5 flex-1">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mt-auto">
                    {article.reading_time && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.reading_time} {t("home_editorial_read_unit")}
                        </span>
                        {date && (
                          <span className="text-neutral-300">·</span>
                        )}
                      </>
                    )}
                    {date && (
                      <time dateTime={article.published_at ?? ""}>{date}</time>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Section bottom CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/tr/rehber"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          style={{ color: "hsl(var(--longevo-green))" }}
        >
          {t("home_editorial_cta")}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}
