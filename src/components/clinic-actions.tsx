"use client";

import { useEffect, useState } from "react";
import { Share2, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/locale-provider";

const SAVED_KEY = "longevo_saved_clinics";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Share + Save actions for the clinic detail page.
 * Share uses the Web Share API when available, otherwise copies the URL.
 * Save toggles a bookmark persisted in localStorage.
 */
export function ClinicActions({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(slug));
  }, [slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const handleSave = () => {
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    try {
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
    setSaved(next.includes(slug));
  };

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2 shadow-md"
        onClick={handleShare}
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {copied ? t("common_copied") : t("common_share")}
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2 shadow-md"
        aria-pressed={saved}
        onClick={handleSave}
      >
        <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        {saved ? t("common_saved") : t("common_save")}
      </Button>
    </div>
  );
}
