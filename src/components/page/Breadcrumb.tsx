"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-provider";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("breadcrumb_aria_label")} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-600">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-neutral-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-neutral-900 font-medium" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
