-- -----------------------------------------------------------------------------
-- P1 — Débloquer le rôle company
-- - table companies (identité entreprise)
-- - profiles.company_id (rattachement des contacts role='company')
-- - table apprenticeships (lien student <-> company, avec historique)
-- -----------------------------------------------------------------------------

-- 1. companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  name text NOT NULL,
  siret text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_companies_establishment ON companies(establishment_id);

-- 2. profiles.company_id (nullable: seuls les profils role='company' y sont rattachés)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_company ON profiles(company_id);

-- 3. apprenticeships (historique possible: un student peut avoir plusieurs contrats successifs)
CREATE TABLE IF NOT EXISTS apprenticeships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid NOT NULL REFERENCES establishments(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','ended','pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_apprenticeships_establishment ON apprenticeships(establishment_id);
CREATE INDEX IF NOT EXISTS idx_apprenticeships_company ON apprenticeships(company_id);
CREATE INDEX IF NOT EXISTS idx_apprenticeships_student ON apprenticeships(student_id);

-- 4. RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE apprenticeships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Establishment isolation for companies"
  ON companies FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

CREATE POLICY "Establishment isolation for apprenticeships"
  ON apprenticeships FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');
