-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Enums
-- -----------------------------------------------------------------------------

-- Added 'super_admin' to support global access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'super_admin',
      'student',
      'teacher',
      'registrar',
      'academic_head',
      'company'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
    CREATE TYPE attendance_status AS ENUM (
      'present',
      'absent',
      'late',
      'excused',
      'pending_justification'
    );
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. Tables
-- -----------------------------------------------------------------------------

-- Establishments
CREATE TABLE IF NOT EXISTS establishments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  type text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY, -- Removed REFERENCES auth.users(id) due to permission restrictions on schema 'auth'
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  email text NOT NULL,
  role user_role NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (establishment_id, email)
);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  name text NOT NULL,
  code text NOT NULL,
  level text NOT NULL,
  duration_years int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  program_id uuid NOT NULL REFERENCES programs(id),
  name text NOT NULL,
  academic_year text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  program_id uuid NOT NULL REFERENCES programs(id),
  name text NOT NULL,
  code text NOT NULL,
  credits int NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Class Subjects (Join table for Classes <-> Subjects with assigned Teacher)
CREATE TABLE IF NOT EXISTS class_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  subject_id uuid NOT NULL REFERENCES subjects(id),
  teacher_id uuid REFERENCES profiles(id), -- Nullable if not yet assigned
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  class_subject_id uuid NOT NULL REFERENCES class_subjects(id),
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments (Students in Classes)
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  class_id uuid NOT NULL REFERENCES classes(id),
  status text NOT NULL DEFAULT 'active',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  class_subject_id uuid NOT NULL REFERENCES class_subjects(id),
  name text NOT NULL,
  type text NOT NULL,
  coefficient numeric NOT NULL DEFAULT 1.0,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grades
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  evaluation_id uuid NOT NULL REFERENCES evaluations(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  session_id uuid NOT NULL REFERENCES sessions(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  status attendance_status NOT NULL,
  justification_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  owner_id uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Student Records (Additional info)
CREATE TABLE IF NOT EXISTS student_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid NOT NULL REFERENCES establishments(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  student_number text NOT NULL,
  admission_date date NOT NULL,
  birth_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. Indexes
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_establishment ON profiles(establishment_id);
CREATE INDEX IF NOT EXISTS idx_profiles_establishment_role ON profiles(establishment_id, role);

CREATE INDEX IF NOT EXISTS idx_programs_establishment ON programs(establishment_id);
CREATE INDEX IF NOT EXISTS idx_classes_establishment ON classes(establishment_id);
CREATE INDEX IF NOT EXISTS idx_subjects_establishment ON subjects(establishment_id);

CREATE INDEX IF NOT EXISTS idx_class_subjects_establishment ON class_subjects(establishment_id);
CREATE INDEX IF NOT EXISTS idx_class_subjects_establishment_class ON class_subjects(establishment_id, class_id);

CREATE INDEX IF NOT EXISTS idx_sessions_establishment ON sessions(establishment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_establishment_start ON sessions(establishment_id, start_time);

CREATE INDEX IF NOT EXISTS idx_enrollments_establishment ON enrollments(establishment_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_establishment_student ON enrollments(establishment_id, student_id);

CREATE INDEX IF NOT EXISTS idx_evaluations_establishment ON evaluations(establishment_id);
CREATE INDEX IF NOT EXISTS idx_grades_establishment ON grades(establishment_id);
CREATE INDEX IF NOT EXISTS idx_grades_establishment_student ON grades(establishment_id, student_id);

CREATE INDEX IF NOT EXISTS idx_attendance_records_establishment ON attendance_records(establishment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_establishment_student ON attendance_records(establishment_id, student_id);

CREATE INDEX IF NOT EXISTS idx_documents_establishment ON documents(establishment_id);
CREATE INDEX IF NOT EXISTS idx_student_records_establishment ON student_records(establishment_id);


-- -----------------------------------------------------------------------------
-- 4. RLS & Isolation
-- -----------------------------------------------------------------------------

-- Helper function to get the current user's establishment_id
CREATE OR REPLACE FUNCTION public.user_establishment_id()
RETURNS uuid AS $$
  SELECT establishment_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper function to get the current user's role
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;


-- Enable RLS on all tables
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_records ENABLE ROW LEVEL SECURITY;

-- Note: user_role() is null for unauthenticated or users without profile, so safe to use in OR condition.

-- Policy: Establishments
CREATE POLICY "Users can view their own establishment or super_admin all"
  ON establishments FOR SELECT
  USING (id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Policy: Profiles
CREATE POLICY "Users can view profiles in their establishment or super_admin all"
  ON profiles FOR SELECT
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

CREATE POLICY "Users can update their own profile or super_admin all"
  ON profiles FOR UPDATE
  USING (id = auth.uid() OR public.user_role() = 'super_admin')
  WITH CHECK ((id = auth.uid() AND establishment_id = public.user_establishment_id()) OR public.user_role() = 'super_admin');

-- Generic Isolation Policy for other tables
-- Pattern: establishment_id matches user's OR user is super_admin

-- Programs
CREATE POLICY "Establishment isolation for programs"
  ON programs FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Classes
CREATE POLICY "Establishment isolation for classes"
  ON classes FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Subjects
CREATE POLICY "Establishment isolation for subjects"
  ON subjects FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Class Subjects
CREATE POLICY "Establishment isolation for class_subjects"
  ON class_subjects FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Sessions
CREATE POLICY "Establishment isolation for sessions"
  ON sessions FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Enrollments
CREATE POLICY "Establishment isolation for enrollments"
  ON enrollments FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Evaluations
CREATE POLICY "Establishment isolation for evaluations"
  ON evaluations FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Grades
CREATE POLICY "Establishment isolation for grades"
  ON grades FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Attendance Records
CREATE POLICY "Establishment isolation for attendance_records"
  ON attendance_records FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Documents
CREATE POLICY "Establishment isolation for documents"
  ON documents FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');

-- Student Records
CREATE POLICY "Establishment isolation for student_records"
  ON student_records FOR ALL
  USING (establishment_id = public.user_establishment_id() OR public.user_role() = 'super_admin');
