-- =========================================================================
-- Longevo — Articles (Editorial) Table
-- =========================================================================
-- Creates the `articles` table for the Longevo Rehber editorial system.
--
-- Pipeline:
--   1. Freelance medical content writers draft full articles (markdown)
--   2. Merve reviews, edits, and flips `published = true` + sets `published_at`
--   3. `featured = true` surfaces on home page EditorialSection (max 3)
--
-- Run in: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new
-- =========================================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Rehber', 'Bilimsel', 'Röportaj')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,                         -- full body, markdown
  reading_time INTEGER,                 -- minutes
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  author TEXT,
  cover_image TEXT,                     -- url
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles (slug);
CREATE INDEX IF NOT EXISTS articles_featured_published_idx
  ON public.articles (featured, published, published_at DESC);

-- 2. Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;

-- 3. RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Admin can manage articles" ON public.articles;

-- Public sees only published ones
CREATE POLICY "Public can view published articles" ON public.articles
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- Admin (app.longevo@outlook.com) can manage all
CREATE POLICY "Admin can manage articles" ON public.articles
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

-- 4. Seed 3 launch articles (featured placeholders — body empty until
--    the freelance medical writer delivers the drafts)
INSERT INTO public.articles
  (slug, category, title, excerpt, reading_time, featured, published, author, cover_image, published_at)
VALUES
  (
    'longevity-klinigi-secerken-7-soru',
    'Rehber',
    'Longevity kliniği seçerken sormanız gereken 7 soru',
    'Ruhsat, doktor deneyimi, tedavi protokolü ve fiyatlandırma — doğru klinik seçimi için kritik kontrol listesi.',
    5,
    true,
    true,
    'Longevo Editör',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=675&fit=crop',
    NOW()
  ),
  (
    'nad-terapisi-gercek-mi',
    'Bilimsel',
    'NAD+ terapisi gerçekten işe yarıyor mu? Türkiye''deki fiyatlar ve bilimsel kanıtlar',
    'NAD+ tedavisinin arkasındaki bilim, Türkiye''deki fiyat aralıkları ve 2024-2026 yayınlanan klinik çalışmaların özeti.',
    8,
    true,
    true,
    'Longevo Editör',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=675&fit=crop',
    NOW()
  ),
  (
    'biyobelirtec-testi-rehberi',
    'Rehber',
    'Biyobelirteç testi yaptırmadan önce bilmeniz gereken her şey',
    'Hangi paneller gerçekten değerli, sonuçlar nasıl okunur, Türkiye''de güvenilir laboratuvarlar.',
    7,
    true,
    true,
    'Longevo Editör',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&h=675&fit=crop',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- 5. Verification
SELECT slug, category, title, featured, published, published_at
FROM public.articles
ORDER BY published_at DESC;
