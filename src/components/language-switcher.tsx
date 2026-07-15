"use client";

import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { locales, type Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();
  const current = locales.find((l) => l.code === locale) ?? locales[0];

  const handleChange = (code: Locale) => {
    setLocale(code);
    // Refresh to re-render server components with new cookie
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="sm" className="gap-1.5 h-9 px-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium uppercase">{current.code}</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span>
              {current.flag} {current.label}
            </span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => handleChange(l.code as Locale)}
            className="cursor-pointer gap-2"
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1">{l.label}</span>
            {locale === l.code && <Check className="w-4 h-4 text-green-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
