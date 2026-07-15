/**
 * Static treatment guide data for the home page showcase.
 *
 * TODO: Once Supabase has real clinic counts + treatment price ranges,
 * replace this static file with a server-side query that:
 *   1. Counts verified clinics offering each treatment (via clinic_treatments)
 *   2. Reads a `starting_price_try` column added to the `treatments` table
 * These estimates are pre-launch placeholders based on Turkish market research
 * and should NOT be treated as authoritative. Update before public launch.
 */

import type { LucideIcon } from "lucide-react";
import {
  Droplet,
  FlaskConical,
  Sparkles,
  Cloud,
  BarChart3,
  Dna,
  Circle,
  Atom,
} from "lucide-react";

export interface TreatmentGuide {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** TODO: replace with live count from Supabase */
  clinicCount: number;
  /** TODO: replace with live min price from Supabase (TRY) */
  startPrice: string;
}

export const treatments: TreatmentGuide[] = [
  {
    slug: "iv-terapi",
    icon: Droplet,
    title: "IV Terapi",
    description: "Vitamin ve mineral infüzyonu",
    clinicCount: 12,
    startPrice: "800",
  },
  {
    slug: "biyobelirtec",
    icon: FlaskConical,
    title: "Biyobelirteç Testi",
    description: "Kapsamlı kan paneli ve analiz",
    clinicCount: 8,
    startPrice: "2.500",
  },
  {
    slug: "nad-terapi",
    icon: Sparkles,
    title: "NAD+ Terapi",
    description: "Hücresel yenilenme küreleri",
    clinicCount: 6,
    startPrice: "1.500",
  },
  {
    slug: "ozon-terapi",
    icon: Cloud,
    title: "Ozon Terapi",
    description: "Oksidatif tedavi uygulamaları",
    clinicCount: 10,
    startPrice: "500",
  },
  {
    slug: "hormon-paneli",
    icon: BarChart3,
    title: "Hormon Paneli",
    description: "Hormon optimizasyonu testleri",
    clinicCount: 7,
    startPrice: "1.800",
  },
  {
    slug: "genetik-analiz",
    icon: Dna,
    title: "Genetik Analiz",
    description: "DNA tabanlı sağlık raporu",
    clinicCount: 4,
    startPrice: "4.000",
  },
  {
    slug: "prp-terapi",
    icon: Circle,
    title: "PRP Terapi",
    description: "Platelet açısından zengin plazma",
    clinicCount: 9,
    startPrice: "2.000",
  },
  {
    slug: "kok-hucre",
    icon: Atom,
    title: "Kök Hücre",
    description: "Rejeneratif tıp uygulamaları",
    clinicCount: 3,
    startPrice: "15.000",
  },
];
