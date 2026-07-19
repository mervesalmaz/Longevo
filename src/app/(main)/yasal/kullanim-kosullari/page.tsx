import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("legal_terms_meta_title"),
    description: t("legal_terms_meta_description"),
  };
}

export default function KullanimKosullariPage() {
  const t = getT();
  return (
    <LegalPlaceholder
      title={t("legal_terms_title")}
      slug="kullanim-kosullari"
      description={t("legal_terms_description")}
    />
  );
}
