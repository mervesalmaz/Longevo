import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Article, ArticleCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rehber — Longevo",
  description:
    "Longevity üzerine araştırma destekli yazılar. NAD+, biyobelirteç testi, anti-aging ve klinik seçimi rehberleri.",
};

const TR_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const catStyle: Record<ArticleCategory, { bg: string; text: string }> = {
  Rehber: { bg: "bg-[hsl(var(--longevo-green)/0.12)]", text: "text-[hsl(var(--longevo-green))]" },
  Bilimsel: { bg: "bg-blue-50", text: "text-blue-700" },
  Röportaj: { bg: "bg-amber-50", text: "text-amber-700" },
};

export default async function ArticlesListPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, category, title, excerpt, reading_time, cover_image, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  const articles = (error ? [] : (data ?? [])) as Pick<
    Article,
    "id" | "slug" | "category" | "title" | "excerpt" | "reading_time" | "cover_image" | "published_at"
  >[];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Rehber" },
          ]}
        />

        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
            Longevo Rehber
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Longevity müdahaleleri üzerine araştırma destekli derin yazılar.
            Klinik seçimi, bilimsel temel ve topluluk deneyimleri.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600">
              İlk makaleler yakında. Editör ekibimiz içerik hazırlıyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => {
              const style = catStyle[a.category as ArticleCategory] ?? catStyle.Rehber;
              return (
                <Link
                  key={a.id}
                  href={`/tr/rehber/${a.slug}`}
                  className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
                >
                  <div className="relative aspect-[16/9] bg-neutral-50 overflow-hidden">
                    {a.cover_image ? (
                      <Image
                        src={a.cover_image}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 50%, hsl(var(--longevo-green) / 0.2) 0%, transparent 70%)",
                        }}
                      />
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className={`self-start inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full mb-3 ${style.bg} ${style.text}`}>
                      {a.category}
                    </span>
                    <h2 className="text-lg font-medium text-neutral-900 mb-3 leading-snug line-clamp-2 flex-1">
                      {a.title}
                    </h2>
                    {a.excerpt && (
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-4">
                        {a.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-auto">
                      {a.reading_time && (
                        <>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {a.reading_time} dk
                          </span>
                          <span className="text-neutral-300">·</span>
                        </>
                      )}
                      <time>{fmtDate(a.published_at)}</time>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
