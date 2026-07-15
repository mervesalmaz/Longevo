import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
}: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div
      className={`mb-10 md:mb-14 flex flex-col md:flex-row gap-4 ${
        isCenter ? "items-center text-center" : "md:items-end md:justify-between"
      }`}
    >
      <div className={isCenter ? "" : "max-w-3xl"}>
        {eyebrow && (
          <div
            className="text-xs font-medium tracking-wider uppercase mb-3"
            style={{ color: "hsl(var(--longevo-green))" }}
          >
            {eyebrow}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p
            className={`text-base text-neutral-600 max-w-2xl mt-3 ${
              isCenter ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
