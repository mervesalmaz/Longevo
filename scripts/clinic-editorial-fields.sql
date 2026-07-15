-- =========================================================================
-- Longevo — Clinic Editorial Fields Migration
-- =========================================================================
-- Adds two columns to public.clinics for the editorial pipeline:
--
--   • editorial_summary  — Longevo's own ~200-char positioning copy. Shown
--                          on home page cards and clinic-detail hero.
--   • original_description — The clinic's self-submitted long description.
--                            Shown on the clinic-detail page as secondary.
--
-- The existing `description` column is preserved for backward compatibility
-- and backfilled into original_description. Code should prefer:
--   editorial_summary > original_description > description
--
-- Run in: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new
-- =========================================================================

-- 1. Add new columns (idempotent)
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS editorial_summary TEXT,
  ADD COLUMN IF NOT EXISTS original_description TEXT;

-- 2. Backfill: copy existing `description` into original_description
--    (only if original_description is still NULL — safe to re-run)
UPDATE public.clinics
SET original_description = description
WHERE original_description IS NULL
  AND description IS NOT NULL;

-- 3. Optional length guard for editorial_summary (200 chars)
ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_editorial_summary_length;

ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_editorial_summary_length
  CHECK (editorial_summary IS NULL OR char_length(editorial_summary) <= 200);

-- 4. Verification
SELECT
  name,
  (editorial_summary IS NOT NULL) AS has_editorial,
  (original_description IS NOT NULL) AS has_original
FROM public.clinics
ORDER BY created_at DESC;
