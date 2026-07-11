export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  CheckCircle,
  Share2,
  Bookmark,
  Circle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewCard } from "@/components/review-card";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PageShell } from "@/components/home/PageShell";
import { Tr } from "@/lib/i18n/tr";
import type { TranslationKey } from "@/lib/i18n/translations";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: clinic } = await supabase
    .from("clinics")
    .select("name, city, editorial_summary, description, cover_image_url")
    .eq("slug", params.slug)
    .single();

  if (!clinic) {
    return { title: "Klinik bulunamadı | Longevo" };
  }

  const title = `${clinic.name} Yorumları ve Fiyatları | Longevo`;
  const summary = (clinic.editorial_summary || clinic.description || "").trim();
  const fullDescription = summary
    ? `${clinic.name} (${clinic.city}) hakkında doğrulanmış kullanıcı yorumları, tedaviler ve iletişim bilgileri. ${summary}`
    : `${clinic.name} (${clinic.city}) için doğrulanmış kullanıcı yorumları, longevity ve anti-aging tedavileri, fiyat ve iletişim bilgileri.`;
  // Trim to ~160 chars on a word boundary so the tag doesn't cut mid-word.
  const description =
    fullDescription.length <= 160
      ? fullDescription
      : fullDescription.slice(0, 157).replace(/\s+\S*$/, "") + "…";

  const canonical = `https://longevo.life/clinics/${params.slug}`;
  const images = clinic.cover_image_url ? [clinic.cover_image_url] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "Longevo",
      locale: "tr_TR",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ClinicDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createServerSupabaseClient();

  const { data: clinic } = await supabase
    .from("clinics")
    .select(
      `
      *,
      doctors (id, name, title, bio, avatar_url, specialties),
      clinic_treatments (treatment:treatments(id, name, slug)),
      reviews (id, rating, title, body, treatment_received, verified_visit, created_at, user_id)
    `
    )
    .eq("slug", params.slug)
    .single();

  if (!clinic) notFound();

  // Fetch user profiles for reviews that have a user_id
  const userIds = (clinic.reviews ?? [])
    .map((r: { user_id: string | null }) => r.user_id)
    .filter(Boolean) as string[];

  const profilesMap: Record<string, { display_name: string; avatar_url: string | null }> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("users_profile")
      .select("id, display_name, avatar_url")
      .in("id", userIds);
    (profiles ?? []).forEach((p) => { profilesMap[p.id] = p; });
  }

  const ratings =
    clinic.reviews?.map((r: { rating: number }) => r.rating) ?? [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0;
  const reviewCount = ratings.length;

  // Rating distribution (labels via <Tr> in JSX)
  const ratingKeys: TranslationKey[] = [
    "clinic_rating_excellent",
    "clinic_rating_verygood",
    "clinic_rating_average",
    "clinic_rating_poor",
    "clinic_rating_terrible",
  ];
  const ratingDist = [5, 4, 3, 2, 1].map((star, idx) => ({
    star,
    labelKey: ratingKeys[idx],
    count: ratings.filter((r: number) => r === star).length,
    pct: ratings.length > 0
      ? (ratings.filter((r: number) => r === star).length / ratings.length) * 100
      : 0,
  }));

  const treatments =
    clinic.clinic_treatments?.map(
      (ct: { treatment: { name: string; slug: string } }) => ct.treatment
    ) ?? [];

  return (
    <PageShell>
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b bg-gray-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-black"><Tr k="common_home" /></Link>
            <span>/</span>
            <Link href="/search" className="hover:text-black"><Tr k="common_browse" /></Link>
            <span>/</span>
            <span className="text-black">{clinic.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gray-200">
        <ImageWithFallback
          src={clinic.cover_image_url}
          alt={clinic.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="sm" className="gap-2 shadow-md">
            <Share2 className="w-4 h-4" />
            <Tr k="common_share" />
          </Button>
          <Button variant="secondary" size="sm" className="gap-2 shadow-md">
            <Bookmark className="w-4 h-4" />
            <Tr k="common_save" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{clinic.name}</h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Circle
                      key={i}
                      className="w-3 h-3"
                      fill={i < Math.floor(avgRating) ? "hsl(var(--longevo-green))" : "#E0E0E0"}
                      stroke="none"
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {avgRating > 0 ? avgRating.toFixed(1) : <Tr k="clinic_new" />}
                </span>
                <span className="text-gray-600">
                  ({reviewCount.toLocaleString()} <Tr k="clinic_reviews_lower" />)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{clinic.city}, {clinic.country}</span>
              </div>
            </div>
            {avgRating >= 4.5 && reviewCount >= 3 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200 hidden md:flex">
                <Award className="w-5 h-5 text-orange-600" />
                <div className="text-sm">
                  <div className="font-semibold text-orange-600">
                    <Tr k="clinic_biohackers_choice" />
                  </div>
                  <div className="text-gray-600">2026</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About — editorial summary (if present) then original/legacy description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4"><Tr k="clinic_about" /></h2>
              {clinic.editorial_summary && (
                <p className="text-gray-900 leading-relaxed font-medium mb-4">
                  {clinic.editorial_summary}
                </p>
              )}
              {(clinic.original_description || clinic.description) && (
                <p className="text-gray-700 leading-relaxed">
                  {clinic.original_description ?? clinic.description}
                </p>
              )}
            </div>

            <Separator className="my-8" />

            {/* Treatments as Features */}
            {treatments.length > 0 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4"><Tr k="clinic_treatments_features" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {treatments.map((t: { name: string; slug: string }) => (
                      <Link key={t.slug} href={`/search?treatment=${t.slug}`}>
                        <div className="flex items-center gap-2 hover:text-green-700 transition-colors">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span>{t.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <Separator className="my-8" />
              </>
            )}

            {/* Doctors */}
            {clinic.doctors && clinic.doctors.length > 0 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4"><Tr k="clinic_our_doctors" /></h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clinic.doctors.map(
                      (doctor: {
                        id: string;
                        name: string;
                        title: string;
                        bio: string;
                        avatar_url: string;
                        specialties: string[];
                      }) => (
                        <div key={doctor.id} className="border rounded-lg p-4">
                          <div className="flex gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={doctor.avatar_url}
                                alt={doctor.name}
                              />
                              <AvatarFallback className="bg-gray-200 text-gray-600">
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm" style={{ color: "hsl(var(--longevo-green))" }}>
                                {doctor.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {doctor.bio}
                              </p>
                              {doctor.specialties?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {doctor.specialties.map((s) => (
                                    <Badge
                                      key={s}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <Separator className="my-8" />
              </>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-4"><Tr k="clinic_reviews" /></h2>

              {/* Rating Overview */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-6xl font-bold mb-2">
                      {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Circle
                          key={i}
                          className="w-4 h-4"
                          fill={i < Math.floor(avgRating) ? "hsl(var(--longevo-green))" : "#E0E0E0"}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <div className="text-gray-600">
                      {reviewCount.toLocaleString()} <Tr k="clinic_reviews_lower" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ratingDist.map((dist) => (
                      <div key={dist.star} className="flex items-center gap-3">
                        <span className="text-sm w-16"><Tr k={dist.labelKey} /></span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${dist.pct}%`,
                              backgroundColor: "hsl(var(--longevo-green))",
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {dist.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div>
                {(clinic.reviews ?? [])
                  .sort(
                    (a: { created_at: string }, b: { created_at: string }) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map(
                    (review: {
                      id: string;
                      rating: number;
                      title: string;
                      body: string;
                      treatment_received: string;
                      verified_visit: boolean;
                      created_at: string;
                      user_id: string | null;
                    }) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        userName={review.user_id ? profilesMap[review.user_id]?.display_name ?? "Anonymous" : "Anonymous"}
                        avatarUrl={review.user_id ? profilesMap[review.user_id]?.avatar_url ?? undefined : undefined}
                      />
                    )
                  )}
              </div>

              {reviewCount === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p><Tr k="clinic_no_reviews" /></p>
                </div>
              )}

              <Button
                className="w-full mt-6"
                size="lg"
                style={{ backgroundColor: "hsl(var(--longevo-green))" }}
                asChild
              >
                <Link href={`/reviews/new?clinic=${clinic.slug}`}>
                  <Tr k="clinic_write_review" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24 bg-white shadow-sm">
              <h3 className="font-bold text-xl mb-4"><Tr k="clinic_contact" /></h3>

              <div className="space-y-4 mb-6">
                {clinic.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-600 mt-0.5" />
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                      style={{ color: "hsl(var(--longevo-green))" }}
                    >
                      <Tr k="clinic_visit_website" />
                    </a>
                  </div>
                )}
                {clinic.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                    <a
                      href={`tel:${clinic.phone}`}
                      className="text-sm hover:underline"
                      style={{ color: "hsl(var(--longevo-green))" }}
                    >
                      <Tr k="clinic_call" />
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <a
                    href="#"
                    className="text-sm hover:underline"
                    style={{ color: "hsl(var(--longevo-green))" }}
                  >
                    <Tr k="clinic_email" />
                  </a>
                </div>
              </div>

              {clinic.address && (
                <>
                  <Separator className="my-6" />
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{clinic.address}</span>
                  </div>
                </>
              )}

              {/* Map */}
              {clinic.lat && clinic.lng && (
                <div className="rounded-lg overflow-hidden border h-48 bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${clinic.lat},${clinic.lng}&z=15&output=embed`}
                  />
                </div>
              )}

              <Separator className="my-6" />
              <div className="text-sm">
                <p className="font-semibold mb-2"><Tr k="clinic_hours" /></p>
                <div className="space-y-1 text-gray-600">
                  <p><Tr k="clinic_hours_weekdays" /></p>
                  <p><Tr k="clinic_hours_saturday" /></p>
                  <p><Tr k="clinic_hours_sunday" /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageShell>
  );
}
