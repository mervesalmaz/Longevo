import { AlertTriangle, Mail } from "lucide-react";
import { PageShell } from "@/components/home/PageShell";
import { Breadcrumb } from "./Breadcrumb";

interface LegalPlaceholderProps {
  title: string;
  slug: string;
  description: string;
}

export function LegalPlaceholder({
  title,
  description,
}: LegalPlaceholderProps) {
  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Breadcrumb
          items={[
            { label: "Ana sayfa", href: "/" },
            { label: "Yasal", href: "/yasal/kvkk" },
            { label: title },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-4">
          {title}
        </h1>
        <p className="text-lg text-neutral-600 mb-10">{description}</p>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 mb-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900 mb-1">
                Belge taslak aşamasında
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                Longevo şu anda özel beta aşamasında. Bu yasal belge, kamuya
                açık lansmandan önce hukuk müşavirimizin incelemesinden
                geçtikten sonra yayınlanacak. Bu süreçte beta üyeleri için
                geçerli koşullar aşağıdaki iletişim adresinden talep edilebilir.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-neutral-700">
          <h2 className="text-xl font-medium text-neutral-900">
            Bu belge neyi kapsayacak?
          </h2>
          <p>
            {description}
          </p>

          <h2 className="text-xl font-medium text-neutral-900 pt-4">
            Sorum var, ne yapmalıyım?
          </h2>
          <p>
            Beta sürecinde veri işleme, üyelik, yorum gönderme veya bülten
            abonelikleri hakkında sorularınız varsa bize ulaşın:
          </p>

          <a
            href="mailto:hello@longevo.life"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "hsl(var(--longevo-green))" }}
          >
            <Mail className="w-4 h-4" />
            hello@longevo.life
          </a>
        </div>

        <p className="text-xs text-neutral-500 mt-16 pt-6 border-t border-neutral-200">
          Son güncelleme: Taslak. Lansman öncesi yayınlanacak.
        </p>
      </div>
    </PageShell>
  );
}
