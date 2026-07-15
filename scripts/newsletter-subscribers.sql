-- =========================================================================
-- Longevo — Newsletter Subscribers Table
-- =========================================================================
-- Stores email subscribers from the home-page newsletter form. The API
-- route (/api/newsletter/subscribe) always writes here so we own the list.
-- If NEWSLETTER_PROVIDER env is configured (beehiiv/convertkit), the same
-- API also forwards to the external provider — provider_synced flips true.
--
-- Run in: Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new
-- =========================================================================

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

GRANT USAGE ON SCHEMA public TO anon, authenticated;
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

SELECT COUNT(*) AS total_subscribers FROM public.newsletter_subscribers;
