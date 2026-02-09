# Data Model (PostgreSQL)

## Conventions
- Toutes les tables contiennent `establishment_id` (UUID)
- PK en UUID, `created_at`, `updated_at`
- RLS activee sur toutes les tables
- Soft delete optionnel (non MVP)

## Enums
```sql
CREATE TYPE user_role AS ENUM (
  'student',
  'teacher',
  'registrar',
  'academic_head',
  'company'
);

CREATE TYPE attendance_status AS ENUM (
  'present',
  'absent',
  'late',
  'excused',
  'pending_justification'
);
```

## Tables

### establishments
- id (uuid, pk)
- name (text)
- slug (text, unique)
- type (text)
- settings (jsonb)
- created_at, updated_at

### profiles
- id (uuid, pk, references auth.users)
- establishment_id (uuid, fk -> establishments.id)
- email (text, unique within establishment)
- role (user_role)
- first_name, last_name (text)
- phone (text, nullable)
- created_at, updated_at

### programs
- id (uuid, pk)
- establishment_id (uuid, fk)
- name (text)
- code (text)
- level (text)
- duration_years (int)

### classes
- id (uuid, pk)
- establishment_id (uuid, fk)
- program_id (uuid, fk -> programs.id)
- name (text)
- academic_year (text)

### subjects
- id (uuid, pk)
- establishment_id (uuid, fk)
- program_id (uuid, fk -> programs.id)
- name (text)
- code (text)
- credits (int)

### class_subjects
- id (uuid, pk)
- establishment_id (uuid, fk)
- class_id (uuid, fk -> classes.id)
- subject_id (uuid, fk -> subjects.id)
- teacher_id (uuid, fk -> profiles.id)

### sessions
- id (uuid, pk)
- establishment_id (uuid, fk)
- class_subject_id (uuid, fk -> class_subjects.id)
- start_time (timestamptz)
- end_time (timestamptz)
- location (text)
- notes (text, nullable)

### enrollments
- id (uuid, pk)
- establishment_id (uuid, fk)
- student_id (uuid, fk -> profiles.id)
- class_id (uuid, fk -> classes.id)
- status (text)
- start_date, end_date (date)

### evaluations
- id (uuid, pk)
- establishment_id (uuid, fk)
- class_subject_id (uuid, fk -> class_subjects.id)
- name (text)
- type (text)
- coefficient (numeric)
- date (date)

### grades
- id (uuid, pk)
- establishment_id (uuid, fk)
- evaluation_id (uuid, fk -> evaluations.id)
- student_id (uuid, fk -> profiles.id)
- score (numeric)
- max_score (numeric)

### attendance_records
- id (uuid, pk)
- establishment_id (uuid, fk)
- session_id (uuid, fk -> sessions.id)
- student_id (uuid, fk -> profiles.id)
- status (attendance_status)
- justification_url (text, nullable)

### documents
- id (uuid, pk)
- establishment_id (uuid, fk)
- owner_id (uuid, fk -> profiles.id)
- type (text)
- title (text)
- file_url (text)
- created_at

### student_records
- id (uuid, pk)
- establishment_id (uuid, fk)
- student_id (uuid, fk -> profiles.id)
- student_number (text)
- admission_date (date)
- birth_date (date)

## Relations principales
- establishments 1--N profiles
- programs 1--N classes, subjects
- classes 1--N class_subjects
- subjects 1--N class_subjects
- class_subjects 1--N sessions, evaluations
- evaluations 1--N grades
- sessions 1--N attendance_records
- profiles (student) 1--N enrollments, grades, attendance_records, documents
- profiles (teacher) 1--N class_subjects

## Indexes recommandes
- (establishment_id) sur toutes les tables
- (establishment_id, role) sur profiles
- (establishment_id, class_id) sur class_subjects
- (establishment_id, student_id) sur enrollments, grades, attendance_records
- (establishment_id, start_time) sur sessions

## RLS et isolation
- RLS activee sur toutes les tables
- Policy par defaut: isoler par establishment_id
- Helper: `auth.user_establishment_id()`

```sql
CREATE OR REPLACE FUNCTION auth.user_establishment_id()
RETURNS uuid AS $$
  SELECT establishment_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Establishment isolation for profiles"
  ON profiles FOR ALL
  USING (establishment_id = auth.user_establishment_id());
```

## Storage
- Bucket `documents` prive
- URL signee pour telechargement
- Path: `{establishment_id}/{owner_id}/{document_id}`
