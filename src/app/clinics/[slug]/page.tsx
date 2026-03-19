export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Globe,
  BadgeCheck,
  Star,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
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
    <div>
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-muted">
        {clinic.cover_image_url ? (
          <img
            src={clinic.cover_image_url}
            alt={clinic.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {clinic.name}
              </h1>
              {clinic.verified && (
                <Badge className="bg-primary text-white gap-1">
                  <BadgeCheck size={14} />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} />
              <span>
                {clinic.city}, {clinic.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {clinic.description}
              </p>
            </section>

            {/* Treatments */}
            {treatments.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Treatments</h2>
                <div className="flex flex-wrap gap-2">
                  {treatments.map((t: { name: string; slug: string }) => (
                    <Link key={t.slug} href={`/search?treatment=${t.slug}`}>
                      <Badge
                        variant="secondary"
                        className="text-sm py-1.5 px-3 hover:bg-primary/10 transition-colors"
                      >
                        {t.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Doctors */}
            {clinic.doctors && clinic.doctors.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Our Doctors</h2>
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
                      <Card key={doctor.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={doctor.avatar_url}
                                alt={doctor.name}
                              />
                              <AvatarFallback>
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-primary">
                                {doctor.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Reviews ({reviewCount})
                </h2>
                <Button asChild>
                  <Link href={`/reviews/new?clinic=${clinic.slug}`}>
                    Write a Review
                  </Link>
                </Button>
              </div>

              {/* Rating Summary */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="text-center sm:text-left">
                      <div className="text-4xl font-bold">
                        {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                      </div>
                      <StarRating rating={avgRating} size={20} />
                      <p className="text-sm text-muted-foreground mt-1">
                        {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ratingDist.map((rd) => (
                        <div key={rd.star} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rd.star}★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${rd.pct}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {rd.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review List */}
              <div className="space-y-4">
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
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={review.user_id ? profilesMap[review.user_id]?.avatar_url ?? undefined : undefined}
                                />
                                <AvatarFallback>
                                  <User size={14} />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {review.user_id ? profilesMap[review.user_id]?.display_name ?? "Anonymous" : "Anonymous"}
                                </p>
                                <div className="flex items-center gap-2">
                                  <StarRating
                                    rating={review.rating}
                                    size={14}
                                  />
                                  {review.verified_visit && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-primary"
                                    >
                                      Verified Visit
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar size={12} />
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-medium mt-3">
                              {review.title}
                            </h4>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {review.body}
                          </p>
                          {review.treatment_received && (
                            <Badge variant="secondary" className="mt-3 text-xs">
                              {review.treatment_received}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
              </div>

              {reviewCount === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No reviews yet. Be the first to leave a review!</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Contact Information</h3>
                <Separator />
                {clinic.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-muted-foreground mt-0.5" />
                    <span className="text-sm">{clinic.address}</span>
                  </div>
                )}
                {clinic.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-muted-foreground" />
                    <a
                      href={`tel:${clinic.phone}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {clinic.phone}
                    </a>
                  </div>
                )}
                {clinic.website && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-muted-foreground" />
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-primary transition-colors truncate"
                    >
                      {clinic.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <Separator />
                {/* Map Placeholder */}
                {clinic.lat && clinic.lng && (
                  <div className="rounded-lg overflow-hidden border h-48 bg-muted flex items-center justify-center">
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
                <Button className="w-full" asChild>
                  <Link href={`/reviews/new?clinic=${clinic.slug}`}>
                    Write a Review
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
