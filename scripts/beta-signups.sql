-- ============================================
-- Longevo: Beta Waitlist Tablosu
-- ============================================
-- Dashboard → SQL Editor → paste & run
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new

CREATE TABLE IF NOT EXISTS public.beta_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  interests TEXT[],
  source TEXT DEFAULT 'website',
  invited BOOLEAN DEFAULT false,
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS beta_signups_email_idx ON public.beta_signups (email);
CREATE INDEX IF NOT EXISTS beta_signups_created_at_idx ON public.beta_signups (created_at DESC);

-- Permissions: anon role can INSERT (public signup form)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.beta_signups TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.beta_signups TO authenticated;
GRANT ALL ON public.beta_signups TO service_role;

-- RLS
ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit beta signup" ON public.beta_signups;
DROP POLICY IF EXISTS "Admin can view beta signups" ON public.beta_signups;
DROP POLICY IF EXISTS "Admin can manage beta signups" ON public.beta_signups;

-- Anyone can insert (submit the form)
CREATE POLICY "Anyone can submit beta signup" ON public.beta_signups
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admin can view/update/delete
CREATE POLICY "Admin can manage beta signups" ON public.beta_signups
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

-- Verification
SELECT COUNT(*) AS total_signups FROM public.beta_signups;
