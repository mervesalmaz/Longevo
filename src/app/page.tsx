export const dynamic = "force-dynamic";

import Link from "next/link";
import { Search, BadgeCheck, Star, ArrowRight, Activity, Users, MessageSquare, Leaf, FlaskConical, Dna, Droplets, Wind, Syringe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClinicCard } from "@/components/clinic-card";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const treatmentChips = [
  { name: "IV Therapy", slug: "iv-therapy", icon: Droplets },
  { name: "Biomarker Testing", slug: "biomarker-testing", icon: BarChart3 },
  { name: "NAD+", slug: "nad-therapy", icon: FlaskConical },
  { name: "Ozone Therapy", slug: "ozone-therapy", icon: Wind },
  { name: "Hormone Panel", slug: "hormone-panel", icon: Syringe },
  { name: "Genetic Analysis", slug: "genetic-analysis", icon: Dna },
];

const steps = [
  {
    step: "1",
    title: "Search",
    description: "Browse clinics by city, treatment type, or rating.",
    icon: Search,
  },
  {
    step: "2",
    title: "Compare",
    description: "Read verified reviews and compare doctors and treatments.",
    icon: Star,
  },
  {
    step: "3",
    title: "Book",
    description: "Contact your chosen clinic and start your longevity journey.",
    icon: BadgeCheck,
  },
];

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  const [clinicsRes, doctorsRes, reviewsRes] = await Promise.all([
    supabase.from("clinics").select("id", { count: "exact", head: true }),
    supabase.from("doctors").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  const totalClinics = clinicsRes.count ?? 0;
  const totalDoctors = doctorsRes.count ?? 0;
  const totalReviews = reviewsRes.count ?? 0;

  const { data: clinics } = await supabase
    .from("clinics")
    .select(`
      *,
      doctors (id, name, title),
      clinic_treatments (treatment:treatments(name, slug)),
      reviews (rating)
    `)
    .eq("verified", true)
    .limit(6);

  const featuredClinics = (clinics ?? [])
    .map((clinic) => {
      const ratings = clinic.reviews?.map((r: { rating: number }) => r.rating) ?? [];
      const avg_rating =
        ratings.length > 0
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;
      return { ...clinic, avg_rating, review_count: ratings.length };
    })
    .sort((a, b) => b.avg_rating - a.avg_rating);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover the Best
            <br />
            <span className="text-primary">Longevity Clinics</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Find top-rated clinics, read verified reviews, and compare
            treatments to optimize your healthspan.
          </p>
          <div className="max-w-2xl mx-auto">
            <Link href="/search">
              <div className="flex items-center bg-white border rounded-xl shadow-lg p-2 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center gap-3 flex-1 px-4 py-2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                  <span>Search by clinic name, city, or treatment...</span>
                </div>
                <Button size="lg" className="rounded-lg">
                  Search
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold">{totalClinics}</span>
              </div>
              <p className="text-sm text-muted-foreground">Clinics</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold">{totalDoctors}</span>
              </div>
              <p className="text-sm text-muted-foreground">Doctors</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="text-2xl md:text-3xl font-bold">{totalReviews}</span>
              </div>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Browse by Treatment
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            Explore clinics offering cutting-edge longevity treatments.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {treatmentChips.map((treatment) => {
              const Icon = treatment.icon;
              return (
                <Link key={treatment.slug} href={`/search?treatment=${treatment.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{treatment.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Clinics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Clinics</h2>
              <p className="text-muted-foreground mt-1">Top-rated verified longevity clinics</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/search" className="gap-2">
                View All <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                treatments={
                  clinic.clinic_treatments?.map(
                    (ct: { treatment: { name: string } }) => ct.treatment.name
                  ) ?? []
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Finding your ideal longevity clinic is easy with Longevo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Optimize Your Health?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of health-conscious individuals who trust Longevo to find the best longevity clinics.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/search">Explore Clinics</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
