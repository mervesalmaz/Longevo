"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ClinicCard } from "@/components/clinic-card";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { Clinic, Treatment } from "@/lib/types";

const cities = ["Istanbul", "Ankara", "Berlin", "London"];

type SortOption = "rating" | "reviews" | "name";

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { t } = useTranslation();

  const [clinics, setClinics] = useState<(Clinic & { avg_rating: number; review_count: number })[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [treatment, setTreatment] = useState(searchParams.get("treatment") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") ?? "0");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) ?? "rating");

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "0") sp.set(key, value);
      });
      router.replace(`/search?${sp.toString()}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    supabase.from("treatments").select("*").order("name").then(({ data }) => setTreatments(data ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      let q = supabase.from("clinics").select(`
        *,
        doctors (id, name, title),
        clinic_treatments (treatment:treatments(id, name, slug)),
        reviews (rating)
      `);

      // Case-insensitive exact match (handles "istanbul" URL + "Istanbul" DB value)
      if (city) q = q.ilike("city", city);
      if (verifiedOnly) q = q.eq("verified", true);
      if (query) q = q.ilike("name", `%${query}%`);

      const { data } = await q;

      let results = (data ?? []).map((clinic) => {
        const ratings = clinic.reviews?.map((r: { rating: number }) => r.rating) ?? [];
        const avg_rating = ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;
        return { ...clinic, avg_rating, review_count: ratings.length };
      });

      if (treatment) {
        results = results.filter((c) =>
          c.clinic_treatments?.some(
            (ct: { treatment: { slug: string } }) => ct.treatment.slug === treatment
          )
        );
      }

      if (minRating && minRating !== "0") {
        results = results.filter((c) => c.avg_rating >= Number(minRating));
      }

      switch (sortBy) {
        case "rating": results.sort((a, b) => b.avg_rating - a.avg_rating); break;
        case "reviews": results.sort((a, b) => b.review_count - a.review_count); break;
        case "name": results.sort((a, b) => a.name.localeCompare(b.name)); break;
      }

      setClinics(results);
      setLoading(false);
    };

    fetchClinics();
    updateURL({ q: query, city, treatment, min_rating: minRating, verified: verifiedOnly ? "true" : "", sort: sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, city, treatment, minRating, verifiedOnly, sortBy]);

  const clearFilters = () => {
    setQuery(""); setCity(""); setTreatment(""); setMinRating("0"); setVerifiedOnly(false); setSortBy("rating");
  };

  const hasFilters = query || city || treatment || (minRating && minRating !== "0") || verifiedOnly;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories / Treatments */}
      <div>
        <h3 className="font-semibold mb-3">{t("search_treatments")}</h3>
        <div className="space-y-2">
          {treatments.map((t) => (
            <div key={t.slug} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`treatment-${t.slug}`}
                checked={treatment === t.slug}
                onChange={() => setTreatment(treatment === t.slug ? "" : t.slug)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`treatment-${t.slug}`} className="text-sm cursor-pointer">
                {t.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* City */}
      <div>
        <h3 className="font-semibold mb-3">{t("search_city")}</h3>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue placeholder={t("search_all_cities")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">{t("search_all_cities")}</SelectItem>
            {cities.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Minimum Rating */}
      <div>
        <h3 className="font-semibold mb-3">{t("search_min_rating")}</h3>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">{t("search_any_rating")}</SelectItem>
            <SelectItem value="3">3+ ★</SelectItem>
            <SelectItem value="4">4+ ★</SelectItem>
            <SelectItem value="4.5">4.5+ ★</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Verified */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="verified"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Label htmlFor="verified" className="text-sm cursor-pointer">{t("search_verified_only")}</Label>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t("search_title")}</h1>
          <p className="text-gray-600">
            {loading
              ? t("common_loading")
              : `${clinics.length} ${t("search_clinics_lower")}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="font-semibold text-lg">{t("search_filters")}</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("nav_search_mobile")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Separator className="mb-6" />

              <FilterPanel />
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clinics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal size={16} /> {t("search_filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-6">
                      <SlidersHorizontal className="w-5 h-5" />
                      <h2 className="font-semibold text-lg">{t("search_filters")}</h2>
                    </div>
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort bar */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {t("search_showing")} {clinics.length}
                </span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">{t("search_sort_rated")}</SelectItem>
                    <SelectItem value="reviews">{t("search_sort_reviewed")}</SelectItem>
                    <SelectItem value="name">{t("search_sort_name")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-white animate-pulse rounded-lg border" />
                ))}
              </div>
            ) : clinics.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("search_no_results")}</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find what you&apos;re looking for
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    treatments={clinic.clinic_treatments?.map((ct: { treatment: { name: string } }) => ct.treatment.name) ?? []}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
