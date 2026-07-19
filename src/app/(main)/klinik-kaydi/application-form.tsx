"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { treatments } from "@/data/treatments";
import { track } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n/locale-provider";

type Status = "idle" | "loading" | "success" | "error";

export function ApplicationForm() {
  const supabase = createClient();
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [form, setForm] = useState({
    clinic_name: "",
    city: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });

  const toggleTreatment = (slug: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { error: dbError } = await supabase
      .from("clinic_applications")
      .insert({
        clinic_name: form.clinic_name.trim(),
        city: form.city.trim(),
        contact_name: form.contact_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        treatments: selectedTreatments.length > 0 ? selectedTreatments : null,
        message: form.message.trim() || null,
      });

    if (dbError) {
      setError(dbError.message);
      setStatus("error");
      return;
    }

    setStatus("success");
    track("clinic_application_submitted", {
      city: form.city.trim(),
      treatments_count: selectedTreatments.length,
      has_phone: form.phone.trim().length > 0,
      has_website: form.website.trim().length > 0,
    });
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 md:p-10 text-center shadow-sm">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "hsl(var(--longevo-green) / 0.12)" }}
        >
          <CheckCircle2
            className="w-8 h-8"
            style={{ color: "hsl(var(--longevo-green))" }}
          />
        </div>
        <h2 className="text-2xl font-medium text-neutral-900 mb-2">
          {t("klinik_form_success_title")}
        </h2>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          {t("klinik_form_success_desc")}
        </p>
        <Button asChild variant="outline">
          <Link href="/">{t("klinik_form_back_home")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 space-y-5 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clinic_name">{t("klinik_form_clinic_name")}</Label>
          <Input
            id="clinic_name"
            required
            value={form.clinic_name}
            onChange={(e) => setForm({ ...form, clinic_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="city">{t("klinik_form_city")}</Label>
          <Input
            id="city"
            required
            placeholder={t("klinik_form_city_placeholder")}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_name">{t("klinik_form_contact_name")}</Label>
          <Input
            id="contact_name"
            required
            value={form.contact_name}
            onChange={(e) =>
              setForm({ ...form, contact_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="email">{t("klinik_form_email")}</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">{t("klinik_form_phone")}</Label>
          <Input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="website">{t("klinik_form_website")}</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://…"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">{t("klinik_form_treatments")}</Label>
        <div className="flex flex-wrap gap-2">
          {treatments.map((t) => {
            const selected = selectedTreatments.includes(t.slug);
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => toggleTreatment(t.slug)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  selected
                    ? "border-[hsl(var(--longevo-green))] bg-[hsl(var(--longevo-green)/0.08)] text-[hsl(var(--longevo-green))] font-medium"
                    : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700"
                }`}
              >
                {t.title}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t("klinik_form_message")}</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder={t("klinik_form_message_placeholder")}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="w-full sm:w-auto gap-2 text-white"
          style={{ backgroundColor: "hsl(var(--longevo-green))" }}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("klinik_form_submitting")}
            </>
          ) : (
            <>
              {t("klinik_form_submit")}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-neutral-500 mt-3">
          {t("klinik_form_kvkk_before")}
          <Link
            href="/yasal/kvkk"
            className="underline hover:text-neutral-700"
          >
            {t("klinik_form_kvkk_link")}
          </Link>
          {t("klinik_form_kvkk_after")}
        </p>
      </div>
    </form>
  );
}
