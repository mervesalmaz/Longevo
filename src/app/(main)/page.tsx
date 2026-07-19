import type { Metadata } from "next";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import RecentReviewsSection from "@/components/home/RecentReviewsSection";
import TreatmentGuidesSection from "@/components/home/TreatmentGuidesSection";
import CityGuidesSection from "@/components/home/CityGuidesSection";
import FeaturedClinicsSection from "@/components/home/FeaturedClinicsSection";
import EditorialSection from "@/components/home/EditorialSection";
import CommunitySection from "@/components/home/CommunitySection";
import ClinicOwnersCTA from "@/components/home/ClinicOwnersCTA";
import Footer from "@/components/home/Footer";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("meta_site_title"),
    description: t("home_meta_description"),
    openGraph: {
      title: t("meta_site_title"),
      description: t("meta_site_og_description"),
      images: [
        {
          url: "https://longevo.life/opengraph-image",
          width: 1200,
          height: 630,
          alt: t("meta_site_title"),
        },
      ],
      locale: "tr_TR",
      type: "website",
      url: "https://longevo.life",
      siteName: "Longevo",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta_site_title"),
      description: t("meta_site_og_description"),
      images: ["https://longevo.life/opengraph-image"],
    },
    alternates: {
      canonical: "https://longevo.life/",
      languages: {
        "tr-TR": "https://longevo.life/",
      },
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <RecentReviewsSection />
        <TreatmentGuidesSection />
        <CityGuidesSection />
        <FeaturedClinicsSection />
        <EditorialSection />
        <CommunitySection />
        <ClinicOwnersCTA />
      </main>
      <Footer />
    </>
  );
}
