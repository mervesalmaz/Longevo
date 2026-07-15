-- ============================================
-- Longevo: Dummy Data Temizleme + Admin Permissions
-- ============================================
-- Supabase Dashboard → SQL Editor → paste & run
-- https://supabase.com/dashboard/project/ywjgksxbsrlyqifokcxj/sql/new

-- 1. Dummy seed datayı sil (FK sırasına göre)
DELETE FROM public.reviews;
DELETE FROM public.clinic_treatments;
DELETE FROM public.doctors;
DELETE FROM public.clinics;
DELETE FROM public.treatments;

-- 2. service_role'a tam yetki ver (gelecekteki admin işlemleri için)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 3. authenticated role'a admin panel için DELETE/UPDATE yetkisi ver
GRANT INSERT, UPDATE, DELETE ON public.clinics TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.doctors TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.treatments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.clinic_treatments TO authenticated;

-- 4. RLS policy: sadece admin email'i olan kullanıcılar CRUD yapabilsin
-- (önce mevcut policy'leri sil, yoksa çakışır)
DROP POLICY IF EXISTS "Admin can manage clinics" ON public.clinics;
DROP POLICY IF EXISTS "Admin can manage doctors" ON public.doctors;
DROP POLICY IF EXISTS "Admin can manage treatments" ON public.treatments;
DROP POLICY IF EXISTS "Admin can manage clinic_treatments" ON public.clinic_treatments;

CREATE POLICY "Admin can manage clinics" ON public.clinics
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

CREATE POLICY "Admin can manage doctors" ON public.doctors
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

CREATE POLICY "Admin can manage treatments" ON public.treatments
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

CREATE POLICY "Admin can manage clinic_treatments" ON public.clinic_treatments
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'app.longevo@outlook.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'app.longevo@outlook.com');

-- 5. Supabase Storage Bucket (clinic/doctor resimleri için)
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic-images', 'clinic-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies: Admin yükleyebilir, herkes görebilir
DROP POLICY IF EXISTS "Public can view clinic images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload clinic images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update clinic images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete clinic images" ON storage.objects;

CREATE POLICY "Public can view clinic images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'clinic-images');

CREATE POLICY "Admin can upload clinic images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'clinic-images'
    AND auth.jwt() ->> 'email' = 'app.longevo@outlook.com'
  );

CREATE POLICY "Admin can update clinic images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'clinic-images'
    AND auth.jwt() ->> 'email' = 'app.longevo@outlook.com'
  );

CREATE POLICY "Admin can delete clinic images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'clinic-images'
    AND auth.jwt() ->> 'email' = 'app.longevo@outlook.com'
  );

-- 6. Doğrulama
SELECT 'reviews' AS table_name, COUNT(*) AS rows FROM public.reviews
UNION ALL SELECT 'clinic_treatments', COUNT(*) FROM public.clinic_treatments
UNION ALL SELECT 'doctors', COUNT(*) FROM public.doctors
UNION ALL SELECT 'clinics', COUNT(*) FROM public.clinics
UNION ALL SELECT 'treatments', COUNT(*) FROM public.treatments;
