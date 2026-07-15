import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Alternating surface tone for rhythm between sections. */
  tone?: "base" | "alt" | "accent";
  id?: string;
}

const toneBg: Record<NonNullable<SectionProps["tone"]>, string> = {
  base: "bg-white",
  alt: "bg-neutral-50",
  accent: "bg-white",
};

/**
 * Shared full-width section wrapper.
 *   - Outer <section>: py-16 md:py-24
 *   - Inner container: max-w-7xl mx-auto px-6
 */
export function Section({
  children,
  className = "",
  tone = "base",
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", toneBg[tone], className)}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}
