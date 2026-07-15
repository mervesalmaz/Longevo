import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Longevo",
  description: "Longevo gizlilik politikası ve veri işleme uygulamaları.",
};

export default function GizlilikPage() {
  return (
    <LegalPlaceholder
      title="Gizlilik Politikası"
      slug="gizlilik"
      description="Longevo üzerinden topladığımız bilgiler, bu bilgileri nasıl kullandığımız, üçüncü taraflarla paylaşım politikamız ve veri güvenliği önlemlerimiz bu belgede yer alacak."
    />
  );
}
