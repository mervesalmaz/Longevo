"use client";

import { useTranslation } from "./locale-provider";
import type { TranslationKey } from "./translations";

/**
 * Inline translation component for use inside server components.
 * Usage: <Tr k="home_hero_title" />
 */
export function Tr({ k }: { k: TranslationKey }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}
