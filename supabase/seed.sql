-- -----------------------------------------------------------------------------
-- Seed Data for Berliner MVP (with Auth)
-- -----------------------------------------------------------------------------

-- User UUIDs (Pre-generated for linking)
-- Admin: a0000000-0000-0000-0000-000000000000
-- SCOL:  u1eebc99-9c0b-4ef8-bb6d-6bb9bd380u11
-- Prof1: u2eebc99-9c0b-4ef8-bb6d-6bb9bd380u22
-- Prof2: u3eebc99-9c0b-4ef8-bb6d-6bb9bd380u33
-- Etu1:  u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44
-- Etu2:  u5eebc99-9c0b-4ef8-bb6d-6bb9bd380u55
-- ESGI1-12: u_esgi1_01 to u_esgi1_12

-- 1. Create Users in auth.users
-- Password for all: 'berliner2024'
-- Hash is generated via pgcrypto: crypt('berliner2024', gen_salt('bf'))

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  -- Super Admin
  ('a0000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  
  -- Pilot A Users
  ('u1eebc99-9c0b-4ef8-bb6d-6bb9bd380u11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'scol@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u2eebc99-9c0b-4ef8-bb6d-6bb9bd380u22', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.turing@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u3eebc99-9c0b-4ef8-bb6d-6bb9bd380u33', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.lovelace@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.neo@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u5eebc99-9c0b-4ef8-bb6d-6bb9bd380u55', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.trinity@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),

  -- ESGI 1 Students
  ('u0000000-0000-0000-0000-000000esgi01', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'o.barret@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi02', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.cubahiro@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi03', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.delateyssonniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi04', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.durant@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi05', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'z.elmaach@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi06', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.greuzat@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi07', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm.lamartiniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi08', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd.obiangnkogho@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi09', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.paulus@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi10', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.poirier@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.taouni@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000esgi12', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.dieudonne@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  -- Professors
  ('u0000000-0000-0000-0000-000000prof01', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.aubert@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof02', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c.bruneau@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof03', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.casagrande@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof04', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd.chainet@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof05', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'j.dear@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof06', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'v.duflot@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof07', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b.lacombat@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof08', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f.marotte@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof09', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'p.martin@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof10', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.nge@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('u0000000-0000-0000-0000-000000prof11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'n.quere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Establishments
INSERT INTO establishments (id, name, slug, type)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Etablissement Pilote A', 'pilot-a', 'campus'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Etablissement Pilote B', 'pilot-b', 'campus'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Etablissement Pilote C', 'pilot-c', 'campus')
ON CONFLICT (id) DO NOTHING;

-- 3. Profiles (Linked to auth.users)
INSERT INTO profiles (id, establishment_id, email, role, first_name, last_name)
VALUES
  ('a0000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@berliner.fr', 'super_admin', 'Admin', 'BERLINER'),
  ('u1eebc99-9c0b-4ef8-bb6d-6bb9bd380u11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'scol@pilot-a.com', 'registrar', 'Sophie', 'Scolarite'),
  ('u2eebc99-9c0b-4ef8-bb6d-6bb9bd380u22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.turing@pilot-a.com', 'teacher', 'Alan', 'Turing'),
  ('u3eebc99-9c0b-4ef8-bb6d-6bb9bd380u33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.lovelace@pilot-a.com', 'teacher', 'Ada', 'Lovelace'),
  ('u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.neo@pilot-a.com', 'student', 'Thomas', 'Anderson'),
  ('u5eebc99-9c0b-4ef8-bb6d-6bb9bd380u55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.trinity@pilot-a.com', 'student', 'Trinity', 'Moss'),
  
  -- ESGI 1 Students
  ('u0000000-0000-0000-0000-000000esgi01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'o.barret@berliner.fr', 'student', 'O.', 'Barret'),
  ('u0000000-0000-0000-0000-000000esgi02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'k.cubahiro@berliner.fr', 'student', 'K.', 'Cubahiro'),
  ('u0000000-0000-0000-0000-000000esgi03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.delateyssonniere@berliner.fr', 'student', 'A.', 'Delateyssonniere'),
  ('u0000000-0000-0000-0000-000000esgi04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.durant@berliner.fr', 'student', 'A.', 'Durant'),
  ('u0000000-0000-0000-0000-000000esgi05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'z.elmaach@berliner.fr', 'student', 'Z.', 'Elmaach'),
  ('u0000000-0000-0000-0000-000000esgi06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'r.greuzat@berliner.fr', 'student', 'R.', 'Greuzat'),
  ('u0000000-0000-0000-0000-000000esgi07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm.lamartiniere@berliner.fr', 'student', 'M.', 'Lamartiniere'),
  ('u0000000-0000-0000-0000-000000esgi08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd.obiangnkogho@berliner.fr', 'student', 'D.', 'Obiangnkogho'),
  ('u0000000-0000-0000-0000-000000esgi09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.paulus@berliner.fr', 'student', 'L.', 'Paulus'),
  ('u0000000-0000-0000-0000-000000esgi10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.poirier@berliner.fr', 'student', 'L.', 'Poirier'),
  ('u0000000-0000-0000-0000-000000esgi11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.taouni@berliner.fr', 'student', 'S.', 'Taouni'),
  ('u0000000-0000-0000-0000-000000esgi12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.dieudonne@berliner.fr', 'student', 'S.', 'Dieudonne'),
  -- Professors
  ('u0000000-0000-0000-0000-000000prof01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.aubert@berliner.fr', 'teacher', 'Antoine', 'AUBERT'),
  ('u0000000-0000-0000-0000-000000prof02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c.bruneau@berliner.fr', 'teacher', 'Christophe', 'BRUNEAU'),
  ('u0000000-0000-0000-0000-000000prof03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'r.casagrande@berliner.fr', 'teacher', 'Romain', 'CASAGRANDE'),
  ('u0000000-0000-0000-0000-000000prof04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd.chainet@berliner.fr', 'teacher', 'David', 'CHAINET'),
  ('u0000000-0000-0000-0000-000000prof05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'j.dear@berliner.fr', 'teacher', 'Jacqueline', 'DEAR'),
  ('u0000000-0000-0000-0000-000000prof06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v.duflot@berliner.fr', 'teacher', 'Valentin', 'DUFLOT'),
  ('u0000000-0000-0000-0000-000000prof07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b.lacombat@berliner.fr', 'teacher', 'Benoit', 'LACOMBAT'),
  ('u0000000-0000-0000-0000-000000prof08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f.marotte@berliner.fr', 'teacher', 'Fabien', 'MAROTTE'),
  ('u0000000-0000-0000-0000-000000prof09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p.martin@berliner.fr', 'teacher', 'Paul-Ernest', 'MARTIN'),
  ('u0000000-0000-0000-0000-000000prof10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'k.nge@berliner.fr', 'teacher', 'Kim', 'NGE'),
  ('u0000000-0000-0000-0000-000000prof11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n.quere@berliner.fr', 'teacher', 'Nicolas', 'QUERE')
ON CONFLICT (id) DO NOTHING;

-- 4. Programs
INSERT INTO programs (id, establishment_id, name, code, level, duration_years)
VALUES
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bachelor Informatique', 'B-INFO', 'Bachelor', 3),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mastère Engineering', 'M-ENG', 'Master', 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Classes
INSERT INTO classes (id, establishment_id, program_id, name, academic_year)
VALUES
  ('esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 1', '2023-2024'),
  ('esgi2-99-9c0b-4ef8-bb6d-6bb9bd38esg2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 2', '2023-2024'),
  ('esgi3-99-9c0b-4ef8-bb6d-6bb9bd38esg3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 3', '2023-2024'),
  ('esgi4-99-9c0b-4ef8-bb6d-6bb9bd38esg4', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ESGI 4', '2023-2024'),
  ('esgi5-99-9c0b-4ef8-bb6d-6bb9bd38esg5', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ESGI 5', '2023-2024'),
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'B3-DEV-A', '2023-2024'), 
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'M1-DATA', '2023-2024')
ON CONFLICT (id) DO NOTHING;

-- 6. Subjects
INSERT INTO subjects (id, establishment_id, program_id, name, code, credits)
VALUES
  ('s1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Développement Web Avancé', 'WEB3', 4),
  ('s2eebc99-9c0b-4ef8-bb6d-6bb9bd380s22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Architecture Logicielle', 'ARCH', 3),
  ('s3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Machine Learning', 'IA-ML', 6)
ON CONFLICT (id) DO NOTHING;

-- 7. Class Subjects
BEGIN;
  -- Web3 to B3-DEV
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('cs1ebc99-9c0b-4ef8-bb6d-6bb9bd38cs11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'u2eebc99-9c0b-4ef8-bb6d-6bb9bd380u22')
  ON CONFLICT (id) DO NOTHING;

  -- Arch to B3-DEV
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('cs2ebc99-9c0b-4ef8-bb6d-6bb9bd38cs22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 's2eebc99-9c0b-4ef8-bb6d-6bb9bd380s22', 'u3eebc99-9c0b-4ef8-bb6d-6bb9bd380u33')
  ON CONFLICT (id) DO NOTHING;

  -- Web3 to ESGI 3
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('cs_esgi3_web', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi3-99-9c0b-4ef8-bb6d-6bb9bd38esg3', 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'u2eebc99-9c0b-4ef8-bb6d-6bb9bd380u22')
  ON CONFLICT (id) DO NOTHING;
  
  -- ML to ESGI 5
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('cs_esgi5_ml', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi5-99-9c0b-4ef8-bb6d-6bb9bd38esg5', 's3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'u3eebc99-9c0b-4ef8-bb6d-6bb9bd380u33')
  ON CONFLICT (id) DO NOTHING;

  -- ESGI 1 Class Subjects (T1)
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES 
    -- Anglais -> J. Dear
    ('cs_esgi1_t1_01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_01', 'u0000000-0000-0000-0000-000000prof05'),
    -- Com -> J. Dear
    ('cs_esgi1_t1_02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_02', 'u0000000-0000-0000-0000-000000prof05'),
    -- VBA -> D. Chainet
    ('cs_esgi1_t1_03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_03', 'u0000000-0000-0000-0000-000000prof04'),
    -- MGT -> P. Martin
    ('cs_esgi1_t1_04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_04', 'u0000000-0000-0000-0000-000000prof09'),
    -- Perso -> P. Martin
    ('cs_esgi1_t1_05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_05', 'u0000000-0000-0000-0000-000000prof09'),
    -- Algo 1 -> N. Quere
    ('cs_esgi1_t1_06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_06', 'u0000000-0000-0000-0000-000000prof11'),
    -- BDD -> V. Duflot
    ('cs_esgi1_t1_07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_07', 'u0000000-0000-0000-0000-000000prof06'),
    -- IHM -> V. Duflot
    ('cs_esgi1_t1_08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_08', 'u0000000-0000-0000-0000-000000prof06'),
    -- Web 1 -> B. Lacombat
    ('cs_esgi1_t1_09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_09', 'u0000000-0000-0000-0000-000000prof07'),
    -- C 1 -> A. Aubert
    ('cs_esgi1_t1_10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_10', 'u0000000-0000-0000-0000-000000prof01'),
    -- Res 1 -> C. Bruneau
    ('cs_esgi1_t1_11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t1_11', 'u0000000-0000-0000-0000-000000prof02'),

    -- ESGI 1 Class Subjects (T2)
    -- Algo 2 -> N. Quere
    ('cs_esgi1_t2_01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_01', 'u0000000-0000-0000-0000-000000prof11'),
    -- SQL -> V. Duflot
    ('cs_esgi1_t2_02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_02', 'u0000000-0000-0000-0000-000000prof06'),
    -- Web 2 -> B. Lacombat
    ('cs_esgi1_t2_03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_03', 'u0000000-0000-0000-0000-000000prof07'),
    -- C 2 -> A. Aubert
    ('cs_esgi1_t2_04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_04', 'u0000000-0000-0000-0000-000000prof01'),
    -- Projet -> F. Marotte
    ('cs_esgi1_t2_05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_05', 'u0000000-0000-0000-0000-000000prof08'),
    -- Res 2 -> C. Bruneau
    ('cs_esgi1_t2_06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_06', 'u0000000-0000-0000-0000-000000prof02'),
    -- Archi Ordi -> R. Casagrande
    ('cs_esgi1_t2_07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_07', 'u0000000-0000-0000-0000-000000prof03'),
    -- Linux -> K. Nge
    ('cs_esgi1_t2_08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_08', 'u0000000-0000-0000-0000-000000prof10'),
    -- Virt -> K. Nge
    ('cs_esgi1_t2_09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1', 's_esgi1_t2_09', 'u0000000-0000-0000-0000-000000prof10')
  ON CONFLICT (id) DO NOTHING;
COMMIT;

-- 8. Enrollments
INSERT INTO enrollments (id, establishment_id, student_id, class_id)
VALUES
  ('en1ebc99-9c0b-4ef8-bb6d-6bb9bd38en11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Neo in B3-DEV
  ('en2ebc99-9c0b-4ef8-bb6d-6bb9bd38en22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u5eebc99-9c0b-4ef8-bb6d-6bb9bd380u55', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Trinity in B3-DEV
  ('en_esgi1_01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi01', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi02', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi03', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi04', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi05', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi06', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi07', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi08', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi09', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi10', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi11', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1'),
  ('en_esgi1_12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'u0000000-0000-0000-0000-000000esgi12', 'esgi1-99-9c0b-4ef8-bb6d-6bb9bd38esg1')
ON CONFLICT (id) DO NOTHING;

-- 9. Sessions (Planning)
INSERT INTO sessions (id, establishment_id, class_subject_id, start_time, end_time, location)
VALUES
  ('se1ebc99-9c0b-4ef8-bb6d-6bb9bd38se11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cs1ebc99-9c0b-4ef8-bb6d-6bb9bd38cs11', (now() + interval '1 day')::date + time '09:00', (now() + interval '1 day')::date + time '12:00', 'Salle 101'),
  ('se2ebc99-9c0b-4ef8-bb6d-6bb9bd38se22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cs2ebc99-9c0b-4ef8-bb6d-6bb9bd38cs22', (now() + interval '2 day')::date + time '14:00', (now() + interval '2 day')::date + time '17:00', 'Amphi A')
ON CONFLICT (id) DO NOTHING;

-- 10. Evaluations & Grades
INSERT INTO evaluations (id, establishment_id, class_subject_id, name, type, coefficient, date)
VALUES
  ('ev1ebc99-9c0b-4ef8-bb6d-6bb9bd38ev11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cs1ebc99-9c0b-4ef8-bb6d-6bb9bd38cs11', 'Partiel S1', 'exam', 2.0, (now() - interval '1 month')::date)
ON CONFLICT (id) DO NOTHING;

INSERT INTO grades (id, establishment_id, evaluation_id, student_id, score, max_score)
VALUES
  ('gr1ebc99-9c0b-4ef8-bb6d-6bb9bd38gr11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ev1ebc99-9c0b-4ef8-bb6d-6bb9bd38ev11', 'u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', 16, 20),
  ('gr2ebc99-9c0b-4ef8-bb6d-6bb9bd38gr22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ev1ebc99-9c0b-4ef8-bb6d-6bb9bd38ev11', 'u5eebc99-9c0b-4ef8-bb6d-6bb9bd380u55', 18.5, 20)
ON CONFLICT (id) DO NOTHING;

-- 11. Absences
INSERT INTO attendance_records (id, establishment_id, session_id, student_id, status)
VALUES
  ('at1ebc99-9c0b-4ef8-bb6d-6bb9bd38at11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'se1ebc99-9c0b-4ef8-bb6d-6bb9bd38se11', 'u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', 'present'),
  ('at2ebc99-9c0b-4ef8-bb6d-6bb9bd38at22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'se2ebc99-9c0b-4ef8-bb6d-6bb9bd38se22', 'u4eebc99-9c0b-4ef8-bb6d-6bb9bd380u44', 'absent')
ON CONFLICT (id) DO NOTHING;
