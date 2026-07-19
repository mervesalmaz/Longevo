import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";
import { getT } from "@/lib/i18n/server";

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t("legal_kvkk_meta_title"),
    description: t("legal_kvkk_meta_description"),
  };
}

export default function KvkkPage() {
  const t = getT();
  return (
    <LegalPlaceholder
      title={t("legal_kvkk_title")}
      slug="kvkk"
      description={t("legal_kvkk_description")}
    />
  );
}
