-- =========================================================================
-- Longevo — Pending Migrations (consolidated, idempotent)
-- =========================================================================
-- Production state audit (2026-04-20):
--   ✓ clinics, doctors, treatments, reviews, users_profile, beta_signups
--   ✗ clinics.editorial_summary + original_description  (FeaturedClinics uses legacy fallback)
--   ✗ articles table                                      (EditorialSection hidden)
--   ✗ newsletter_subscribers table                        (Newsletter form → HTTP 500)
--
-- This file merges 3 pending migration scripts and is safe to re-run.
--   scripts/clinic-editorial-fields.sql
--   scripts/articles-table.sql
--   scripts/newsletter-subscribers.sql
--
-- Run once in: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new
-- =========================================================================

-- ── 1. clinics: editorial_summary + original_description ────────────────
ALTER TABLE public.clinics
  ADD COLUMN IF NOT EXISTS editorial_summary TEXT,
  ADD COLUMN IF NOT EXISTS original_description TEXT;

UPDATE public.clinics
SET original_description = description
WHERE original_description IS NULL AND description IS NOT NULL;

ALTER TABLE public.clinics
  DROP CONSTRAINT IF EXISTS clinics_editorial_summary_length;
ALTER TABLE public.clinics
  ADD CONSTRAINT clinics_editorial_summary_length
  CHECK (editorial_summary IS NULL OR char_length(editorial_summary) <= 200);


-- ── 2. articles table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Rehber', 'Bilimsel', 'Röportaj')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  reading_time INTEGER,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  author TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles (slug);
CREATE INDEX IF NOT EXISTS articles_featured_published_idx
  ON public.articles (featured, published, published_at DESC);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can manage articles" ON public.articles;

CREATE POLICY "Public can view published articles" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admin can manage articles" ON public.articles
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

INSERT INTO public.articles
  (slug, category, title, excerpt, reading_time, featured, published, author, cover_image, published_at)
VALUES
  (
    'longevity-klinigi-secerken-7-soru', 'Rehber',
    'Longevity kliniği seçerken sormanız gereken 7 soru',
    'Ruhsat, doktor deneyimi, tedavi protokolü ve fiyatlandırma — doğru klinik seçimi için kritik kontrol listesi.',
    5, true, true, 'Longevo Editör',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=675&fit=crop',
    NOW()
  ),
  (
    'nad-terapisi-gercek-mi', 'Bilimsel',
    'NAD+ terapisi gerçekten işe yarıyor mu? Türkiye''deki fiyatlar ve bilimsel kanıtlar',
    'NAD+ tedavisinin arkasındaki bilim, Türkiye''deki fiyat aralıkları ve 2024-2026 yayınlanan klinik çalışmaların özeti.',
    8, true, true, 'Longevo Editör',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=675&fit=crop',
    NOW()
  ),
  (
    'biyobelirtec-testi-rehberi', 'Rehber',
    'Biyobelirteç testi yaptırmadan önce bilmeniz gereken her şey',
    'Hangi paneller gerçekten değerli, sonuçlar nasıl okunur, Türkiye''de güvenilir laboratuvarlar.',
    7, true, true, 'Longevo Editör',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&h=675&fit=crop',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;


-- ── 3. newsletter_subscribers table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  provider_synced BOOLEAN DEFAULT false,
  provider_error TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx
  ON public.newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_subscribed_at_idx
  ON public.newsletter_subscribers (subscribed_at DESC);

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admin can manage subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');


-- ── 4. Verification ──────────────────────────────────────────────────────
SELECT
  'clinics.editorial_summary'   AS check_name,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clinics' AND column_name = 'editorial_summary'
  ) AS present
UNION ALL
SELECT 'articles_table',
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='articles')
UNION ALL
SELECT 'newsletter_subscribers_table',
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='newsletter_subscribers')
UNION ALL
SELECT 'articles_seed_count',
  (SELECT COUNT(*) FROM public.articles WHERE featured = true AND published = true) >= 3;
