"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readConsent, writeConsent } from "@/lib/analytics";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Mount only after hydration to avoid layout shift on SSR
    const decision = readConsent();
    if (!decision) {
      // Tiny delay so it doesn't pop on top of the page paint
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: false });
    setOpen(false);
  };

  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-4 inset-x-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[60] rounded-2xl border border-neutral-200 bg-white shadow-xl p-5"
    >
      <button
        onClick={rejectAll}
        aria-label="Banner'ı kapat (sadece zorunlu çerezler)"
        className="absolute top-3 right-3 p-1 rounded hover:bg-neutral-100 text-neutral-500"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "hsl(var(--longevo-green) / 0.12)",
          }}
        >
          <Cookie
            style={{
              color: "hsl(var(--longevo-green))",
              width: 20,
              height: 20,
            }}
          />
        </div>
        <div>
          <h2
            id="cookie-consent-title"
            className="text-base font-medium text-neutral-900 mb-1"
          >
            Çerez tercihlerin
          </h2>
          <p
            id="cookie-consent-desc"
            className="text-sm text-neutral-600 leading-relaxed"
          >
            Longevo&apos;yu nasıl kullandığını anlamak için anonim analitik
            çerezler kullanıyoruz. Reklam çerezi kullanmıyoruz.{" "}
            <Link
              href="/yasal/cerez"
              className="underline hover:text-neutral-900"
            >
              Detaylar
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={rejectAll}
          className="flex-1 sm:flex-initial border-neutral-300"
        >
          Sadece zorunlu
        </Button>
        <Button
          size="sm"
          onClick={acceptAll}
          className="flex-1 text-white"
          style={{ backgroundColor: "hsl(var(--longevo-green))" }}
        >
          Kabul et
        </Button>
      </div>
    </div>
  );
}
