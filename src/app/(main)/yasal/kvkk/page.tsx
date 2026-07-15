import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/page/LegalPlaceholder";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Longevo",
  description:
    "Longevo olarak kişisel verilerinizi nasıl işlediğimize dair KVKK kapsamındaki aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalPlaceholder
      title="KVKK Aydınlatma Metni"
      slug="kvkk"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, Longevo olarak topladığımız kişisel veriler (e-posta, isim, yorum içerikleri, klinik başvuruları, Google Analytics aracılığıyla anonimleştirilmiş kullanım verisi), işleme amaçlarımız, saklama süreleri ve haklarınız bu belgede detaylandırılacaktır."
    />
  );
}
