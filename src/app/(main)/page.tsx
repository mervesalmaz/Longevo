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

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Longevo — Türkiye'nin longevity klinik rehberi",
  description:
    "Türkiye'deki biohacking kliniği ve anti-aging merkezlerini doğrulanmış kullanıcı yorumlarıyla karşılaştır. IV terapi, NAD+ tedavisi, biyobelirteç testi ve daha fazlası.",
  openGraph: {
    title: "Longevo — Türkiye'nin longevity klinik rehberi",
    description:
      "Doğrulanmış kullanıcı yorumlarıyla klinik, test ve tedavi keşfet.",
    images: [
      {
        url: "https://longevo.life/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Longevo — Türkiye'nin longevity klinik rehberi",
      },
    ],
    locale: "tr_TR",
    type: "website",
    url: "https://longevo.life",
    siteName: "Longevo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Longevo — Türkiye'nin longevity klinik rehberi",
    description:
      "Doğrulanmış kullanıcı yorumlarıyla klinik, test ve tedavi keşfet.",
    images: ["https://longevo.life/opengraph-image"],
  },
  alternates: {
    canonical: "https://longevo.life/",
    languages: {
      "tr-TR": "https://longevo.life/",
    },
  },
};

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
