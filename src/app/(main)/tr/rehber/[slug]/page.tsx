import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ArticleCategory } from "@/lib/types";

export const dynamic = "force-dynamic";

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!data) return { title: "Rehber bulunamadı — Longevo" };
  return {
    title: `${data.title} — Longevo Rehber`,
    description: data.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerSupabaseClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  const style =
    catStyle[article.category as ArticleCategory] ?? catStyle.Rehber;

  return (
    <PageShell>
      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Rehber", href: "/tr/rehber" },
            { label: article.title },
          ]}
        />

        <div className="mb-6">
          <span
            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
          >
            {article.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-neutral-600 leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-neutral-500 pb-6 mb-8 border-b border-neutral-200">
          {article.reading_time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.reading_time} dk okuma
            </span>
          )}
          {article.published_at && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {fmtDate(article.published_at)}
            </span>
          )}
          {article.author && <span>{article.author}</span>}
        </div>

        {article.cover_image && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-neutral-50 mb-10">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {article.content ? (
          <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="font-medium text-neutral-900 mb-1">
              Makale yazım aşamasında
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Bu rehberin tam içeriği şu anda editör ekibimiz tarafından
              hazırlanıyor. Üst kısımdaki özet konu hakkında genel bir fikir
              veriyor. Yayınlandığında e-posta bülteninde haberdar olmak
              istersen aboneliğe geçebilirsin.
            </p>
          </div>
        )}
      </article>
    </PageShell>
  );
}
