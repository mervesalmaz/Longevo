import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("legal_gizlilik_meta_title"),
    description: t("legal_gizlilik_meta_description"),
  };
}

export default function GizlilikPage() {
  const t = getT();
  return (
    <LegalPlaceholder
      title={t("legal_gizlilik_title")}
      slug="gizlilik"
      description={t("legal_gizlilik_description")}
    />
  );
}
