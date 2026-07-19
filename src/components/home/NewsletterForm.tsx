"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n/locale-provider";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        already?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(
          data.already
            ? t("newsletter_already")
            : t("newsletter_success")
        );
        setEmail("");
        track("newsletter_subscribed", {
          source: "home_newsletter",
          already_subscribed: data.already ?? false,
        });
      } else {
        setStatus("error");
        setMessage(
          data.error === "invalid_email"
            ? t("newsletter_invalid_email")
            : t("newsletter_error")
        );
      }
    } catch {
      setStatus("error");
      setMessage(t("newsletter_error"));
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "hsl(var(--longevo-green) / 0.15)" }}
        >
          <CheckCircle2
            className="w-4 h-4"
            style={{ color: "hsl(var(--longevo-green))" }}
          />
        </div>
        <p className="text-sm text-neutral-700 pt-1">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          <label htmlFor="newsletter-email" className="sr-only">
            {t("newsletter_email_label")}
          </label>
          <Input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            aria-label={t("newsletter_email_label")}
            placeholder={t("newsletter_email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-11 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-500"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-11 px-5 text-white whitespace-nowrap"
          style={{ backgroundColor: "hsl(var(--longevo-green))" }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              {t("newsletter_sending")}
            </>
          ) : (
            t("home_footer_newsletter_cta")
          )}
        </Button>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2"
        >
          {message}
        </p>
      )}
    </form>
  );
}
