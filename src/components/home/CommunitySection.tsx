import Link from "next/link";
import { PenLine, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";
import { NewsletterForm } from "./NewsletterForm";

export default function CommunitySection() {
  return (
    <Section tone="base" id="newsletter">
      <SectionHeader
        title="Topluluğun bir parçası ol"
        subtitle="Deneyimini paylaş, sorular sor, Türkiye'deki biohacker'larla bağlan."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT — Review CTA */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-7 flex flex-col hover:border-neutral-300 transition-colors">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{
              backgroundColor: "hsl(var(--longevo-green) / 0.12)",
            }}
          >
            <PenLine
              className="w-5 h-5"
              style={{ color: "hsl(var(--longevo-green))" }}
            />
          </div>

          <h3 className="text-xl font-medium text-neutral-900 mb-2">
            Deneyimini paylaş
          </h3>
          <p className="text-base text-neutral-700 leading-relaxed mb-3">
            Aldığın bir tedaviyi değerlendir, benzer yolculukta olanlara yardımcı
            ol.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6 flex-1">
            Her yorum doğrulama sürecinden geçer. Yorumunu 5 dakikada tamamla.
          </p>

          <Button
            asChild
            className="self-start gap-2 text-white"
            style={{ backgroundColor: "hsl(var(--longevo-green))" }}
          >
            <Link href="/reviews/new">
              Yorum yaz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* RIGHT — Newsletter */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-7 flex flex-col hover:border-neutral-300 transition-colors">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{
              backgroundColor: "hsl(var(--longevo-green) / 0.12)",
            }}
          >
            <Newspaper
              className="w-5 h-5"
              style={{ color: "hsl(var(--longevo-green))" }}
            />
          </div>

          <h3 className="text-xl font-medium text-neutral-900 mb-2">
            Haftalık Longevo bülteni
          </h3>
          <p className="text-base text-neutral-700 leading-relaxed mb-6 flex-1">
            Türkiye&apos;deki yeni klinikler, tartışılan tedaviler, bilimsel
            gelişmeler. Haftada bir e-posta, spam yok.
          </p>

          <NewsletterForm />

          {/* KVKK disclosure */}
          <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
            Abone olarak{" "}
            <Link
              href="/tr/kvkk"
              className="underline hover:text-neutral-700 transition-colors"
            >
              KVKK kapsamında aydınlatma metnini
            </Link>{" "}
            okudum ve onaylıyorum.
          </p>
        </div>
      </div>
    </Section>
  );
}
