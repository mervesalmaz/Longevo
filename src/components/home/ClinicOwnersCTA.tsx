import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getT } from "@/lib/i18n/server";

export default function ClinicOwnersCTA() {
  const t = getT();
  const valueProps = [
    {
      title: t("home_owners_prop_1_title"),
      desc: t("home_owners_prop_1_desc"),
    },
    {
      title: t("home_owners_prop_2_title"),
      desc: t("home_owners_prop_2_desc"),
    },
    {
      title: t("home_owners_prop_3_title"),
      desc: t("home_owners_prop_3_desc"),
    },
  ];
  return (
    <section
      className="relative overflow-hidden py-16"
      // Distinct accent-tinted band: subtle green wash over neutral-950
      // so it reads as a "different" surface without overpowering. Less
      // prominent than hero, more emphasized than footer.
      style={{
        backgroundColor: "hsl(var(--longevo-green) / 0.06)",
      }}
    >
      {/* Top & bottom hairlines in brand accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--longevo-green) / 0.4), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--longevo-green) / 0.4), transparent)",
        }}
      />

      {/* Soft radial glow behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "hsl(var(--longevo-green))" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative text-center">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-3">
          {t("home_owners_title")}
        </h2>
        <p className="text-lg text-neutral-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("home_owners_subtitle")}
        </p>

        {/* Value props */}
        <ul className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10 text-left">
          {valueProps.map((prop) => (
            <li key={prop.title} className="flex items-start gap-3 flex-1">
              <CheckCircle2
                className="flex-shrink-0 mt-0.5"
                style={{
                  color: "hsl(var(--longevo-green))",
                  width: 22,
                  height: 22,
                }}
                aria-hidden
              />
              <div>
                <div className="text-base font-medium text-neutral-900 mb-1">
                  {prop.title}
                </div>
                <div className="text-sm text-neutral-600 leading-relaxed">
                  {prop.desc}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Primary CTA */}
        <Button
          asChild
          size="lg"
          className="gap-2 text-white px-6 h-12 text-base"
          style={{ backgroundColor: "hsl(var(--longevo-green))" }}
        >
          {/* TODO: /klinik-kaydi route to be built. Temporary 404-graceful link. */}
          <Link href="/klinik-kaydi">
            {t("home_owners_cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>

        {/* Founding-cohort fine print */}
        <p className="text-sm text-neutral-500 mt-4 max-w-xl mx-auto leading-relaxed">
          {t("home_owners_fineprint")}
        </p>
      </div>
    </section>
  );
}
