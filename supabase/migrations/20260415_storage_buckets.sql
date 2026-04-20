-- -----------------------------------------------------------------------------
-- P3 — Supabase Storage : buckets + policies multi-tenant
--
-- Convention d'écriture des fichiers :
--   <bucket>/<establishment_id>/<subpath...>
-- ex:  documents/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11/transcripts/xyz.pdf
-- La première foldername() (préfixe) porte l'establishment_id, ce qui permet
-- d'appliquer une RLS stricte par tenant même côté storage.
-- -----------------------------------------------------------------------------

-- 1. Buckets privés
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('justifications', 'justifications', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies — documents
--    SELECT: tout utilisateur authentifié du même establishment
--    INSERT/UPDATE/DELETE: le propriétaire (auth.uid() = owner) OU un registrar / academic_head du tenant
CREATE POLICY "documents bucket: read within establishment"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
  );

CREATE POLICY "documents bucket: write within establishment"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND (
      auth.uid() = owner
      OR public.user_role() IN ('registrar','academic_head','super_admin')
    )
  );

CREATE POLICY "documents bucket: update within establishment"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND (
      auth.uid() = owner
      OR public.user_role() IN ('registrar','academic_head','super_admin')
    )
  );

CREATE POLICY "documents bucket: delete within establishment"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND (
      auth.uid() = owner
      OR public.user_role() IN ('registrar','academic_head','super_admin')
    )
  );

-- 3. Policies — justifications
--    SELECT: l'étudiant propriétaire + staff du tenant (registrar/academic_head/teacher)
--    INSERT: l'étudiant propriétaire uniquement
CREATE POLICY "justifications bucket: read within establishment"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'justifications'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND (
      auth.uid() = owner
      OR public.user_role() IN ('teacher','registrar','academic_head','super_admin')
    )
  );

CREATE POLICY "justifications bucket: write by owner"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'justifications'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND auth.uid() = owner
  );

CREATE POLICY "justifications bucket: delete by owner or registrar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'justifications'
    AND (storage.foldername(name))[1] = public.user_establishment_id()::text
    AND (
      auth.uid() = owner
      OR public.user_role() IN ('registrar','academic_head','super_admin')
    )
  );
