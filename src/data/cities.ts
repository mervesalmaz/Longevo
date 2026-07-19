/**
 * Static city guide metadata for the home page showcase.
 *
 * Scope: Turkey-first. Berlin / London / other international cities
 * intentionally excluded — the brand positions around Turkish longevity.
 *
 * TODO — IMAGES:
 *   Unsplash URLs below are acceptable for pre-launch. Before public launch,
 *   replace with either (1) licensed editorial photos or (2) our own
 *   location-shot photography hosted in public/images/cities/[slug].jpg.
 *   At that point also remove the images.unsplash.com entry from
 *   next.config.mjs if no other section depends on it.
 *
 * TODO — CLINIC COUNTS:
 *   clinicCount here is a placeholder default. The component queries
 *   Supabase at render time (see CityGuidesSection.tsx) and overrides
 *   these numbers with the live count. This static value is only shown
 *   if Supabase is unreachable.
 */

export interface CityGuide {
  slug: string;
  name: string;
  /** City name with the correct Turkish locative suffix (vowel harmony). */
  locative: string;
  image: string;
  /** Fallback value; live count comes from Supabase at render time. */
  clinicCount: number;
}

export const cities: CityGuide[] = [
  {
    slug: "istanbul",
    name: "İstanbul",
    locative: "İstanbul'da",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=450&fit=crop",
    clinicCount: 25,
  },
  {
    slug: "ankara",
    name: "Ankara",
    locative: "Ankara'da",
    image: "/images/cities/ankara.jpg",
    clinicCount: 8,
  },
  {
    slug: "izmir",
    name: "İzmir",
    locative: "İzmir'de",
    image: "/images/cities/izmir.jpg",
    clinicCount: 5,
  },
  {
    slug: "antalya",
    name: "Antalya",
    locative: "Antalya'da",
    image: "/images/cities/antalya.jpg",
    clinicCount: 3,
  },
];
