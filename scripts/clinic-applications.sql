-- Longevo — Clinic Applications Table
-- Captures /klinik-kaydi form submissions from clinic owners.

CREATE TABLE IF NOT EXISTS public.clinic_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  treatments TEXT[],
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS clinic_applications_status_idx
  ON public.clinic_applications (status, created_at DESC);
CREATE INDEX IF NOT EXISTS clinic_applications_email_idx
  ON public.clinic_applications (email);

GRANT INSERT ON public.clinic_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.clinic_applications TO authenticated;
GRANT ALL ON public.clinic_applications TO service_role;

ALTER TABLE public.clinic_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can apply" ON public.clinic_applications;
DROP POLICY IF EXISTS "Admin can manage applications" ON public.clinic_applications;

CREATE POLICY "Anyone can apply" ON public.clinic_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can manage applications" ON public.clinic_applications
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

SELECT COUNT(*) AS total_applications FROM public.clinic_applications;
