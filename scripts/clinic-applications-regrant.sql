-- Re-apply grants for clinic_applications (schema-level grant can reset)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.clinic_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.clinic_applications TO authenticated;
GRANT ALL ON public.clinic_applications TO service_role;

-- Verify
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'clinic_applications'
ORDER BY grantee, privilege_type;
