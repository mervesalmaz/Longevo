import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("legal_cerez_meta_title"),
    description: t("legal_cerez_meta_description"),
  };
}

export default function CerezPage() {
  const t = getT();
  return (
    <LegalPlaceholder
      title={t("legal_cerez_title")}
      slug="cerez"
      description={t("legal_cerez_description")}
    />
  );
}
