"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Stethoscope,
  Syringe,
  MessageSquare,
  Users,
  Star,
  TrendingUp,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalClinics: number;
  verifiedClinics: number;
  totalDoctors: number;
  totalTreatments: number;
  totalReviews: number;
  totalUsers: number;
  avgRating: number;
  recentReviews: {
    id: string;
    rating: number;
    title: string;
    created_at: string;
    clinic: { name: string; slug: string } | null;
  }[];
  topClinics: {
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    verified: boolean;
    review_count: number;
    avg_rating: number;
  }[];
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [
      { count: totalClinics },
      { count: verifiedClinics },
      { count: totalDoctors },
      { count: totalTreatments },
      { count: totalReviews },
      { count: totalUsers },
      { data: allReviews },
      { data: recentReviews },
      { data: clinicsWithReviews },
    ] = await Promise.all([
      supabase.from("clinics").select("*", { count: "exact", head: true }),
      supabase.from("clinics").select("*", { count: "exact", head: true }).eq("verified", true),
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("treatments").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase.from("users_profile").select("*", { count: "exact", head: true }),
      supabase.from("reviews").select("rating"),
      supabase
        .from("reviews")
        .select("id, rating, title, created_at, clinic:clinics(name, slug)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("clinics").select("id, name, slug, city, country, verified"),
    ]);

    // Calculate avg rating
    const ratings = (allReviews ?? []).map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    // Get review counts per clinic
    const { data: reviewCounts } = await supabase
      .from("reviews")
      .select("clinic_id, rating");

    const clinicStats: Record<string, { count: number; total: number }> = {};
    (reviewCounts ?? []).forEach((r) => {
      if (!clinicStats[r.clinic_id]) clinicStats[r.clinic_id] = { count: 0, total: 0 };
      clinicStats[r.clinic_id].count++;
      clinicStats[r.clinic_id].total += r.rating;
    });

    const topClinics = (clinicsWithReviews ?? [])
      .map((c) => ({
        ...c,
        review_count: clinicStats[c.id]?.count ?? 0,
        avg_rating: clinicStats[c.id]
          ? clinicStats[c.id].total / clinicStats[c.id].count
          : 0,
      }))
      .sort((a, b) => b.avg_rating - a.avg_rating || b.review_count - a.review_count)
      .slice(0, 5);

    setStats({
      totalClinics: totalClinics ?? 0,
      verifiedClinics: verifiedClinics ?? 0,
      totalDoctors: totalDoctors ?? 0,
      totalTreatments: totalTreatments ?? 0,
      totalReviews: totalReviews ?? 0,
      totalUsers: totalUsers ?? 0,
      avgRating,
      recentReviews: (recentReviews ?? []).map((r) => ({
        ...r,
        clinic: Array.isArray(r.clinic) ? r.clinic[0] : r.clinic,
      })),
      topClinics,
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-lg border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Clinics",
      value: stats.totalClinics,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/clinics",
    },
    {
      label: "Verified Clinics",
      value: stats.verifiedClinics,
      icon: BadgeCheck,
      color: "bg-green-50 text-green-600",
      href: "/admin/clinics",
    },
    {
      label: "Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/doctors",
    },
    {
      label: "Treatments",
      value: stats.totalTreatments,
      icon: Syringe,
      color: "bg-orange-50 text-orange-600",
      href: "/admin/treatments",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      icon: MessageSquare,
      color: "bg-yellow-50 text-yellow-600",
      href: "/admin/reviews",
    },
    {
      label: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-pink-50 text-pink-600",
      href: "/admin/users",
    },
    {
      label: "Avg Rating",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: "bg-amber-50 text-amber-600",
      href: "/admin/reviews",
    },
    {
      label: "Verification Rate",
      value: stats.totalClinics > 0
        ? `${Math.round((stats.verifiedClinics / stats.totalClinics) * 100)}%`
        : "0%",
      icon: TrendingUp,
      color: "bg-teal-50 text-teal-600",
      href: "/admin/clinics",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Recent Reviews</h2>
              <Link
                href="/admin/reviews"
                className="text-sm text-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentReviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet</p>
              ) : (
                stats.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              i < review.rating
                                ? "hsl(var(--longevo-green))"
                                : "#E0E0E0",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {review.title || "No title"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.clinic?.name ?? "Unknown clinic"} &middot;{" "}
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Clinics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Top Rated Clinics</h2>
              <Link
                href="/admin/clinics"
                className="text-sm text-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {stats.topClinics.length === 0 ? (
                <p className="text-gray-500 text-sm">No clinics yet</p>
              ) : (
                stats.topClinics.map((clinic, idx) => (
                  <div
                    key={clinic.id}
                    className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {clinic.name}
                        {clinic.verified && (
                          <BadgeCheck className="inline w-4 h-4 ml-1 text-green-600" />
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {clinic.city}, {clinic.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {clinic.avg_rating > 0 ? clinic.avg_rating.toFixed(1) : "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {clinic.review_count} reviews
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
