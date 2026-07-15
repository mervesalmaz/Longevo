import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Longevo",
  description: "Longevo platformu kullanım koşulları.",
};

export default function KullanimKosullariPage() {
  return (
    <LegalPlaceholder
      title="Kullanım Koşulları"
      slug="kullanim-kosullari"
      description="Longevo platformunu kullanımınıza ilişkin haklarınız ve yükümlülükleriniz, yorum yazma kuralları, klinik sahipleri için listeleme şartları ve fikri mülkiyet haklarımız bu belgede düzenlenecek."
    />
  );
}
