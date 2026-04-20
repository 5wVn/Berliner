-- -----------------------------------------------------------------------------
-- P2 — Workflow demandes de documents
-- Distingue sur la même table `documents` :
--  - une demande (file_url encore vide, request_status='pending')
--  - une pièce déposée et validée (request_status='fulfilled', file_url rempli)
-- -----------------------------------------------------------------------------

-- 0. file_url doit pouvoir être null pendant la phase de demande
ALTER TABLE documents
  ALTER COLUMN file_url DROP NOT NULL;

-- 1. Colonnes workflow
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS request_type text
    CHECK (request_type IN ('certificate','transcript','attestation','internship_agreement','other')),
  ADD COLUMN IF NOT EXISTS request_status text
    CHECK (request_status IN ('pending','approved','rejected','fulfilled'))
    DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS requested_by uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- 2. Index pour la page registrar (filtre sur request_status='pending')
CREATE INDEX IF NOT EXISTS idx_documents_request_status ON documents(request_status);
CREATE INDEX IF NOT EXISTS idx_documents_requested_by ON documents(requested_by);
