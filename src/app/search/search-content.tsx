"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import type { Clinic, Treatment } from "@/lib/types";

const cities = ["Istanbul", "Ankara", "Berlin", "London"];

type SortOption = "rating" | "reviews" | "newest";

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [clinics, setClinics] = useState<(Clinic & { avg_rating: number; review_count: number })[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [treatment, setTreatment] = useState(searchParams.get("treatment") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("min_rating") ?? "");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("sort") as SortOption) ?? "rating");

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) sp.set(key, value);
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

      if (city) q = q.eq("city", city);
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

      if (minRating) {
        results = results.filter((c) => c.avg_rating >= Number(minRating));
      }

      switch (sortBy) {
        case "rating": results.sort((a, b) => b.avg_rating - a.avg_rating); break;
        case "reviews": results.sort((a, b) => b.review_count - a.review_count); break;
        case "newest": results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      }

      setClinics(results);
      setLoading(false);
    };

    fetchClinics();
    updateURL({ q: query, city, treatment, min_rating: minRating, verified: verifiedOnly ? "true" : "", sort: sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, city, treatment, minRating, verifiedOnly, sortBy]);

  const clearFilters = () => {
    setQuery(""); setCity(""); setTreatment(""); setMinRating(""); setVerifiedOnly(false); setSortBy("rating");
  };

  const hasFilters = query || city || treatment || minRating || verifiedOnly;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">City</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger><SelectValue placeholder="All cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All cities</SelectItem>
            {cities.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Treatment</Label>
        <Select value={treatment} onValueChange={setTreatment}>
          <SelectTrigger><SelectValue placeholder="All treatments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All treatments</SelectItem>
            {treatments.map((t) => (<SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm font-medium mb-2 block">Min Rating</Label>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger><SelectValue placeholder="Any rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Any rating</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="verified" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded border-gray-300 text-primary focus:ring-primary" />
        <Label htmlFor="verified" className="text-sm">Verified clinics only</Label>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full gap-2">
          <X size={14} /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Clinics</h1>
        <p className="text-muted-foreground">Find the perfect longevity clinic for your needs.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clinics..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="outline" className="gap-2"><SlidersHorizontal size={16} /> Filters</Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="mt-8"><h3 className="font-semibold mb-4">Filters</h3><FilterPanel /></div>
          </SheetContent>
        </Sheet>
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {city && <Badge variant="secondary" className="gap-1">{city}<button onClick={() => setCity("")}><X size={12} /></button></Badge>}
          {treatment && <Badge variant="secondary" className="gap-1">{treatments.find((t) => t.slug === treatment)?.name ?? treatment}<button onClick={() => setTreatment("")}><X size={12} /></button></Badge>}
          {minRating && <Badge variant="secondary" className="gap-1">{minRating}+ Stars<button onClick={() => setMinRating("")}><X size={12} /></button></Badge>}
          {verifiedOnly && <Badge variant="secondary" className="gap-1">Verified Only<button onClick={() => setVerifiedOnly(false)}><X size={12} /></button></Badge>}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden sm:block w-64 shrink-0">
          <div className="sticky top-24"><h3 className="font-semibold mb-4">Filters</h3><FilterPanel /></div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No clinics found.</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {clinics.length} {clinics.length === 1 ? "clinic" : "clinics"} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    treatments={clinic.clinic_treatments?.map((ct: { treatment: { name: string } }) => ct.treatment.name) ?? []}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
