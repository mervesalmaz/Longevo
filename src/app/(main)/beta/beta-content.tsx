"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Microscope,
  Heart,
  Mail,
  ArrowRight,
  Users,
  Globe2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { track } from "@/lib/analytics";

export default function BetaContent() {
  const supabase = createClient();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const perks = [
    {
      icon: Stethoscope,
      title: t("beta_perk_1_title"),
      desc: t("beta_perk_1_desc"),
    },
    {
      icon: Microscope,
      title: t("beta_perk_2_title"),
      desc: t("beta_perk_2_desc"),
    },
    {
      icon: Heart,
      title: t("beta_perk_3_title"),
      desc: t("beta_perk_3_desc"),
    },
  ];

  const stats = [
    { value: "500+", label: t("beta_stat_waitlist") },
    { value: "8+", label: t("beta_stat_countries") },
    { value: "20+", label: t("beta_stat_treatments") },
  ];

  const interestOptions = [
    "Anti-Aging",
    "IV Therapy",
    "Biomarker Testing",
    "Stem Cells",
    "NAD+ Therapy",
    "Hormone Therapy",
    "Genetic Analysis",
    "Peptides",
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const { error: supaError } = await supabase.from("beta_signups").insert({
      email: email.toLowerCase().trim(),
      name: name.trim() || null,
      interests: interests.length > 0 ? interests : null,
    });

    if (supaError) {
      if (supaError.code === "23505") {
        setError(t("beta_form_duplicate"));
      } else {
        setError(supaError.message);
      }
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
    setName("");
    setInterests([]);
    track("beta_signup_completed", {
      interests_count: interests.length,
      has_name: name.trim().length > 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                color: "hsl(var(--longevo-green))",
              }}
            >
              <Sparkles className="w-4 h-4" />
              {t("beta_badge")}
            </div>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              {t("beta_hero_title_1")}{" "}
              <span style={{ color: "hsl(var(--longevo-green))" }}>
                {t("beta_hero_title_2")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {t("beta_hero_subtitle")}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 max-w-2xl mx-auto mb-16">
            {status === "success" ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                  }}
                >
                  <CheckCircle2
                    className="w-8 h-8"
                    style={{ color: "hsl(var(--longevo-green))" }}
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("beta_success_title")}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t("beta_success_subtitle")}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setStatus("idle")}
                  className="mr-2"
                >
                  {t("beta_success_add_another")}
                </Button>
                <Button asChild>
                  <Link href="/search">{t("beta_success_explore")}</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold mb-1">
                    {t("beta_form_title")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {t("beta_form_subtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {t("beta_form_name")}
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("beta_form_name_placeholder")}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {t("beta_form_email")}
                    </label>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("beta_form_email_placeholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {t("beta_form_interests")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => {
                      const selected = interests.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleInterest(opt)}
                          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                            selected
                              ? "bg-green-50 border-green-600 text-green-700 font-medium"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 text-white"
                  style={{ backgroundColor: "hsl(var(--longevo-green))" }}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    t("beta_form_submit_loading")
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      {t("beta_form_submit")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  {t("beta_form_privacy")}
                </p>
              </form>
            )}
          </div>

          {/* Perks */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              {t("beta_perks_title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                    }}
                  >
                    <perk.icon
                      className="w-6 h-6"
                      style={{ color: "hsl(var(--longevo-green))" }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{perk.title}</h3>
                  <p className="text-sm text-gray-600">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Users,
                n: "01",
                title: t("beta_step_1_title"),
                desc: t("beta_step_1_desc"),
              },
              {
                icon: Award,
                n: "02",
                title: t("beta_step_2_title"),
                desc: t("beta_step_2_desc"),
              },
              {
                icon: Globe2,
                n: "03",
                title: t("beta_step_3_title"),
                desc: t("beta_step_3_desc"),
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="text-xs font-semibold text-gray-400 tracking-wider mb-2">
                  {t("beta_step")} {step.n}
                </div>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{
                    backgroundColor: "hsl(var(--longevo-green) / 0.1)",
                  }}
                >
                  <step.icon
                    className="w-6 h-6"
                    style={{ color: "hsl(var(--longevo-green))" }}
                  />
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center text-sm text-gray-500">
            {t("beta_footer_cta")}{" "}
            <Link
              href="/search"
              className="font-medium hover:underline"
              style={{ color: "hsl(var(--longevo-green))" }}
            >
              {t("beta_footer_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
