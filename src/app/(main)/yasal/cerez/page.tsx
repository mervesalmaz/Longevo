import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Çerez Politikası — Longevo",
  description: "Longevo çerez kullanım politikası.",
};

export default function CerezPage() {
  return (
    <LegalPlaceholder
      title="Çerez Politikası"
      slug="cerez"
      description="Longevo'nun kullandığı çerez türleri (zorunlu, analitik, tercih), bunların amaçları, saklama süreleri ve çerez tercihlerinizi yönetme hakkınız bu belgede açıklanacak."
    />
  );
}
