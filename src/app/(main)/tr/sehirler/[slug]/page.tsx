import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "@/components/page/Breadcrumb";
import { cities } from "@/data/cities";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const c = cities.find((x) => x.slug === params.slug);
  if (!c) return { title: "Şehir bulunamadı — Longevo" };
  return {
    title: `${c.name} longevity klinikleri — Longevo`,
    description: `${c.name}'da bulunan doğrulanmış longevity ve biohacking klinikleri. Tedaviler, doktorlar, yorumlar bir arada.`,
  };
}

export default async function CityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const supabase = createServerSupabaseClient();
  const { data: clinics } = await supabase
    .from("clinics")
    .select(
      `id, name, slug, city, country, cover_image_url, verified,
       reviews (rating)`
    )
    .ilike("city", city.name)
    .order("created_at", { ascending: false });

  const list = (clinics ?? []).map((c) => {
    const ratings =
      c.reviews?.map((r: { rating: number }) => r.rating) ?? [];
    const avg =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 0;
    return { ...c, avg, count: ratings.length };
  });

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Şehirler", href: "/tr/sehirler" },
            { label: city.name },
          ]}
        />

        {/* Hero */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-14">
          <div className="md:col-span-3">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 mb-4">
              {city.name}&apos;da longevity
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
              {city.name}, Türkiye&apos;nin longevity ekosisteminde önemli
              bir merkez. Şehirdeki doğrulanmış klinikleri, sunulan tedavileri
              ve gerçek biohacker yorumlarını bir arada inceleyebilirsin.
            </p>
            <div className="text-sm text-neutral-500">
              <span className="text-neutral-900 font-medium">{list.length}</span>{" "}
              doğrulanmış klinik
            </div>
          </div>
          <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto rounded-2xl overflow-hidden bg-neutral-50">
            <Image
              src={city.image}
              alt={city.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Clinics list */}
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-medium text-neutral-900">
            {city.name} klinikleri
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-neutral-700 hover:text-neutral-900"
          >
            <Link href={`/search?city=${city.slug}`}>
              <Search className="w-4 h-4 mr-1" />
              Filtrele ve ara
            </Link>
          </Button>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center">
            <MapPin className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600 mb-4">
              {city.name}&apos;da henüz doğrulanmış klinik yok. Klinik
              sahipleri başvurduğunda burada göreceksin.
            </p>
            <Button asChild variant="outline">
              <Link href="/klinik-kaydi">
                Kliniğini kaydet
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((clinic) => (
              <Link
                key={clinic.id}
                href={`/clinics/${clinic.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all flex flex-col shadow-sm"
              >
                <div className="relative aspect-[16/9] bg-neutral-50 overflow-hidden">
                  {clinic.cover_image_url ? (
                    <Image
                      src={clinic.cover_image_url}
                      alt={clinic.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                <div className="p-5">
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    {clinic.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-neutral-600">
                    <MapPin className="w-3 h-3" />
                    {clinic.city}
                  </div>
                  {clinic.count > 0 && (
                    <div className="mt-3 text-xs text-neutral-500">
                      <span className="text-neutral-900 font-medium">
                        {clinic.avg.toFixed(1)}
                      </span>{" "}
                      · {clinic.count} yorum
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
