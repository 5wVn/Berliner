-- -----------------------------------------------------------------------------
-- Seed Data for Berliner MVP (with Auth)
-- -----------------------------------------------------------------------------

-- User UUIDs (Fixed for Postgres)
-- Admin: a0000000-0000-0000-0000-000000000000
-- SCOL:  a1eebc99-9c0b-4ef8-bb6d-6bb9bd380011
-- Prof1: a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022
-- Prof2: a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033
-- Etu1:  a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044
-- Etu2:  a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055

-- 1. Create Users in auth.users
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  -- Super Admin
  ('a0000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  
  -- Pilot A Users
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'scol@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.turing@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.lovelace@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.neo@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.trinity@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),

  -- ESGI 1 Students
  ('a0000000-0000-0000-0000-000000e59i01', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'o.barret@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i02', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.cubahiro@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i03', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.delateyssonniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i04', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.durant@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i05', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'z.elmaach@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i06', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.greuzat@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i07', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm.lamartiniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i08', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd.obiangnkogho@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i09', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.paulus@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i10', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.poirier@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.taouni@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59i12', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.dieudonne@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  
  -- Professors (970f instead of prof)
  ('a0000000-0000-0000-0000-000000970f01', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.aubert@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f02', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c.bruneau@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f03', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.casagrande@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f04', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd.chainet@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f05', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'j.dear@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f06', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'v.duflot@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f07', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b.lacombat@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f08', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'f.marotte@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f09', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'p.martin@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f10', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.nge@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000970f11', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'n.quere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Establishments
INSERT INTO establishments (id, name, slug, type)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Etablissement Pilote A', 'pilot-a', 'campus'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'Etablissement Pilote B', 'pilot-b', 'campus'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'Etablissement Pilote C', 'pilot-c', 'campus')
ON CONFLICT (id) DO NOTHING;

-- 3. Profiles
INSERT INTO profiles (id, establishment_id, email, role, first_name, last_name)
VALUES
  ('a0000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@berliner.fr', 'super_admin', 'Admin', 'BERLINER'),
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'scol@pilot-a.com', 'registrar', 'Sophie', 'Scolarite'),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.turing@pilot-a.com', 'teacher', 'Alan', 'Turing'),
  ('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.lovelace@pilot-a.com', 'teacher', 'Ada', 'Lovelace'),
  ('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.neo@pilot-a.com', 'student', 'Thomas', 'Anderson'),
  ('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.trinity@pilot-a.com', 'student', 'Trinity', 'Moss'),
  
  -- ESGI 1 Students
  ('a0000000-0000-0000-0000-000000e59i01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'o.barret@berliner.fr', 'student', 'O.', 'Barret'),
  ('a0000000-0000-0000-0000-000000e59i02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'k.cubahiro@berliner.fr', 'student', 'K.', 'Cubahiro'),
  ('a0000000-0000-0000-0000-000000e59i03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.delateyssonniere@berliner.fr', 'student', 'A.', 'Delateyssonniere'),
  ('a0000000-0000-0000-0000-000000e59i04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.durant@berliner.fr', 'student', 'A.', 'Durant'),
  ('a0000000-0000-0000-0000-000000e59i05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'z.elmaach@berliner.fr', 'student', 'Z.', 'Elmaach'),
  ('a0000000-0000-0000-0000-000000e59i06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'r.greuzat@berliner.fr', 'student', 'R.', 'Greuzat'),
  ('a0000000-0000-0000-0000-000000e59i07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm.lamartiniere@berliner.fr', 'student', 'M.', 'Lamartiniere'),
  ('a0000000-0000-0000-0000-000000e59i08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd.obiangnkogho@berliner.fr', 'student', 'D.', 'Obiangnkogho'),
  ('a0000000-0000-0000-0000-000000e59i09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.paulus@berliner.fr', 'student', 'L.', 'Paulus'),
  ('a0000000-0000-0000-0000-000000e59i10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.poirier@berliner.fr', 'student', 'L.', 'Poirier'),
  ('a0000000-0000-0000-0000-000000e59i11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.taouni@berliner.fr', 'student', 'S.', 'Taouni'),
  ('a0000000-0000-0000-0000-000000e59i12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.dieudonne@berliner.fr', 'student', 'S.', 'Dieudonne'),
  -- Professors
  ('a0000000-0000-0000-0000-000000970f01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.aubert@berliner.fr', 'teacher', 'Antoine', 'AUBERT'),
  ('a0000000-0000-0000-0000-000000970f02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c.bruneau@berliner.fr', 'teacher', 'Christophe', 'BRUNEAU'),
  ('a0000000-0000-0000-0000-000000970f03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'r.casagrande@berliner.fr', 'teacher', 'Romain', 'CASAGRANDE'),
  ('a0000000-0000-0000-0000-000000970f04', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd.chainet@berliner.fr', 'teacher', 'David', 'CHAINET'),
  ('a0000000-0000-0000-0000-000000970f05', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'j.dear@berliner.fr', 'teacher', 'Jacqueline', 'DEAR'),
  ('a0000000-0000-0000-0000-000000970f06', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'v.duflot@berliner.fr', 'teacher', 'Valentin', 'DUFLOT'),
  ('a0000000-0000-0000-0000-000000970f07', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b.lacombat@berliner.fr', 'teacher', 'Benoit', 'LACOMBAT'),
  ('a0000000-0000-0000-0000-000000970f08', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f.marotte@berliner.fr', 'teacher', 'Fabien', 'MAROTTE'),
  ('a0000000-0000-0000-0000-000000970f09', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'p.martin@berliner.fr', 'teacher', 'Paul-Ernest', 'MARTIN'),
  ('a0000000-0000-0000-0000-000000970f10', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'k.nge@berliner.fr', 'teacher', 'Kim', 'NGE'),
  ('a0000000-0000-0000-0000-000000970f11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n.quere@berliner.fr', 'teacher', 'Nicolas', 'QUERE')
ON CONFLICT (id) DO NOTHING;
-- 4. Programs
INSERT INTO programs (id, establishment_id, name, code, level, duration_years)
VALUES
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Bachelor Informatique', 'B-INFO', 'Bachelor', 3),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mastère Engineering', 'M-ENG', 'Master', 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Classes (esgi -> c591)
INSERT INTO classes (id, establishment_id, program_id, name, academic_year)
VALUES
  ('c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 1', '2023-2024'),
  ('c5912099-9c0b-4ef8-bb6d-6bb9bd38e592', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 2', '2023-2024'),
  ('c5913099-9c0b-4ef8-bb6d-6bb9bd38e593', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ESGI 3', '2023-2024'),
  ('c5914099-9c0b-4ef8-bb6d-6bb9bd38e594', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ESGI 4', '2023-2024'),
  ('c5915099-9c0b-4ef8-bb6d-6bb9bd38e595', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'ESGI 5', '2023-2024'),
  ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'B3-DEV-A', '2023-2024'), 
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'M1-DATA', '2023-2024')
ON CONFLICT (id) DO NOTHING;

-- 6. Subjects (s -> 5)
INSERT INTO subjects (id, establishment_id, program_id, name, code, credits)
VALUES
  ('51eebc99-9c0b-4ef8-bb6d-6bb9bd380511', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Développement Web Avancé', 'WEB3', 4),
  ('52eebc99-9c0b-4ef8-bb6d-6bb9bd380522', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Architecture Logicielle', 'ARCH', 3),
  ('53eebc99-9c0b-4ef8-bb6d-6bb9bd380533', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Machine Learning', 'IA-ML', 6),

  -- ESGI 1 Subjects (Trimester 1)
  ('50000000-0000-0000-0000-000e59171001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Anglais', 'ENG1', 2),
  ('50000000-0000-0000-0000-000e59171002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Expression orale et écrite', 'COM1', 2),
  ('50000000-0000-0000-0000-000e59171003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Développement VBA Excel', 'VBA1', 2),
  ('50000000-0000-0000-0000-000e59171004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Gestion du travail de groupe', 'MGT1', 2),
  ('50000000-0000-0000-0000-000e59171005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Méthodologie et dév. personnel', 'PERS1', 1),
  ('50000000-0000-0000-0000-000e59171006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Algorithmique et structures 1', 'ALG1', 4),
  ('50000000-0000-0000-0000-000e59171007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Modélisation bases de données', 'BDD1', 3),
  ('50000000-0000-0000-0000-000e59171008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Modélisation et IHM', 'IHM1', 3),
  ('50000000-0000-0000-0000-000e59171009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dév. Web 1 (HTML/CSS/PHP)', 'WEB1', 4),
  ('50000000-0000-0000-0000-000e59171010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Langage C 1', 'C1', 4),
  ('50000000-0000-0000-0000-000e59171011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Architecture des réseaux 1', 'RES1', 3),

  -- ESGI 1 Subjects (Trimester 2)
  ('50000000-0000-0000-0000-000e59172001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Algorithmique et structures 2', 'ALG2', 4),
  ('50000000-0000-0000-0000-000e59172002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Langage SQL', 'SQL1', 3),
  ('50000000-0000-0000-0000-000e59172003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Dév. Web 2 (HTML/CSS/PHP)', 'WEB2', 4),
  ('50000000-0000-0000-0000-000e59172004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Langage C 2', 'C2', 4),
  ('50000000-0000-0000-0000-000e59172005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Projet Annuel', 'PROJ1', 6),
  ('50000000-0000-0000-0000-000e59172006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Architecture des réseaux 2', 'RES2', 3),
  ('50000000-0000-0000-0000-000e59172007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Circuits logiques / Archi Ordi', 'ARCH_ORD', 3),
  ('50000000-0000-0000-0000-000e59172008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Linux utilisation avancée', 'LIN1', 3),
  ('50000000-0000-0000-0000-000e59172009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Virtualisation et gestion parcs', 'VIRT1', 3)
ON CONFLICT (id) DO NOTHING;
-- 7. Class Subjects (cs -> c5)
BEGIN;
  -- Web3 to B3-DEV
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('c51ebc99-9c0b-4ef8-bb6d-6bb9bd38c511', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', '51eebc99-9c0b-4ef8-bb6d-6bb9bd380511', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022')
  ON CONFLICT (id) DO NOTHING;

  -- Arch to B3-DEV
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('c52ebc99-9c0b-4ef8-bb6d-6bb9bd38c522', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', '52eebc99-9c0b-4ef8-bb6d-6bb9bd380522', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033')
  ON CONFLICT (id) DO NOTHING;

  -- Web3 to ESGI 3
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('c5000000-0000-0000-0000-00e591300web', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5913099-9c0b-4ef8-bb6d-6bb9bd38e593', '51eebc99-9c0b-4ef8-bb6d-6bb9bd380511', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022')
  ON CONFLICT (id) DO NOTHING;
  
  -- ML to ESGI 5
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES ('c5000000-0000-0000-0000-000e59150001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5915099-9c0b-4ef8-bb6d-6bb9bd38e595', '53eebc99-9c0b-4ef8-bb6d-6bb9bd380533', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033')
  ON CONFLICT (id) DO NOTHING;

  -- ESGI 1 Class Subjects (T1)
  INSERT INTO class_subjects (id, establishment_id, class_id, subject_id, teacher_id)
  VALUES 
    -- Anglais -> J. Dear
    ('c5000000-0000-0000-0000-000e59171001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171001', 'a0000000-0000-0000-0000-000000970f05'),
    -- Com -> J. Dear
    ('c5000000-0000-0000-0000-000e59171002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171002', 'a0000000-0000-0000-0000-000000970f05'),
    -- VBA -> D. Chainet
    ('c5000000-0000-0000-0000-000e59171003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171003', 'a0000000-0000-0000-0000-000000970f04'),
    -- MGT -> P. Martin
    ('c5000000-0000-0000-0000-000e59171004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171004', 'a0000000-0000-0000-0000-000000970f09'),
    -- Perso -> P. Martin
    ('c5000000-0000-0000-0000-000e59171005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171005', 'a0000000-0000-0000-0000-000000970f09'),
    -- Algo 1 -> N. Quere
    ('c5000000-0000-0000-0000-000e59171006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171006', 'a0000000-0000-0000-0000-000000970f11'),
    -- BDD -> V. Duflot
    ('c5000000-0000-0000-0000-000e59171007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171007', 'a0000000-0000-0000-0000-000000970f06'),
    -- IHM -> V. Duflot
    ('c5000000-0000-0000-0000-000e59171008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171008', 'a0000000-0000-0000-0000-000000970f06'),
    -- Web 1 -> B. Lacombat
    ('c5000000-0000-0000-0000-000e59171009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171009', 'a0000000-0000-0000-0000-000000970f07'),
    -- C 1 -> A. Aubert
    ('c5000000-0000-0000-0000-000e59171010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171010', 'a0000000-0000-0000-0000-000000970f01'),
    -- Res 1 -> C. Bruneau
    ('c5000000-0000-0000-0000-000e59171011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59171011', 'a0000000-0000-0000-0000-000000970f02'),

    -- ESGI 1 Class Subjects (T2)
    -- Algo 2 -> N. Quere
    ('c5000000-0000-0000-0000-000e59172001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172001', 'a0000000-0000-0000-0000-000000970f11'),
    -- SQL -> V. Duflot
    ('c5000000-0000-0000-0000-000e59172002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172002', 'a0000000-0000-0000-0000-000000970f06'),
    -- Web 2 -> B. Lacombat
    ('c5000000-0000-0000-0000-000e59172003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172003', 'a0000000-0000-0000-0000-000000970f07'),
    -- C 2 -> A. Aubert
    ('c5000000-0000-0000-0000-000e59172004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172004', 'a0000000-0000-0000-0000-000000970f01'),
    -- Projet -> F. Marotte
    ('c5000000-0000-0000-0000-000e59172005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172005', 'a0000000-0000-0000-0000-000000970f08'),
    -- Res 2 -> C. Bruneau
    ('c5000000-0000-0000-0000-000e59172006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172006', 'a0000000-0000-0000-0000-000000970f02'),
    -- Archi Ordi -> R. Casagrande
    ('c5000000-0000-0000-0000-000e59172007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172007', 'a0000000-0000-0000-0000-000000970f03'),
    -- Linux -> K. Nge
    ('c5000000-0000-0000-0000-000e59172008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172008', 'a0000000-0000-0000-0000-000000970f10'),
    -- Virt -> K. Nge
    ('c5000000-0000-0000-0000-000e59172009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591', '50000000-0000-0000-0000-000e59172009', 'a0000000-0000-0000-0000-000000970f10')
  ON CONFLICT (id) DO NOTHING;
COMMIT;

-- 8. Enrollments (en -> e1)
INSERT INTO enrollments (id, establishment_id, student_id, class_id)
VALUES
  ('e1ebc99-9c0b-4ef8-bb6d-6bb9bd38e111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Neo in B3-DEV
  ('e1ebc99-9c0b-4ef8-bb6d-6bb9bd38e112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Trinity in B3-DEV
  ('e1000000-0000-0000-0000-000000e59101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i01', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i02', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i03', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i04', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i05', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59106', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i06', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59107', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i07', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59108', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i08', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59109', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i09', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59110', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i10', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i11', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59i12', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591')
ON CONFLICT (id) DO NOTHING;

-- 9. Sessions (Planning) (se -> 1e)
INSERT INTO sessions (id, establishment_id, class_subject_id, start_time, end_time, location)
VALUES
  ('1e1ebc99-9c0b-4ef8-bb6d-6bb9bd381e11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c51ebc99-9c0b-4ef8-bb6d-6bb9bd38c511', (now() + interval '1 day')::date + time '09:00', (now() + interval '1 day')::date + time '12:00', 'Salle 101'),
  ('1e2ebc99-9c0b-4ef8-bb6d-6bb9bd381e22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c52ebc99-9c0b-4ef8-bb6d-6bb9bd38c522', (now() + interval '2 day')::date + time '14:00', (now() + interval '2 day')::date + time '17:00', 'Amphi A')
ON CONFLICT (id) DO NOTHING;

-- 10. Evaluations & Grades (ev -> e4, gr -> 97)
INSERT INTO evaluations (id, establishment_id, class_subject_id, name, type, coefficient, date)
VALUES
  ('e41ebc99-9c0b-4ef8-bb6d-6bb9bd38e411', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c51ebc99-9c0b-4ef8-bb6d-6bb9bd38c511', 'Partiel S1', 'exam', 2.0, (now() - interval '1 month')::date)
ON CONFLICT (id) DO NOTHING;

INSERT INTO grades (id, establishment_id, evaluation_id, student_id, score, max_score)
VALUES
  ('971ebc99-9c0b-4ef8-bb6d-6bb9bd389711', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e41ebc99-9c0b-4ef8-bb6d-6bb9bd38e411', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 16, 20),
  ('972ebc99-9c0b-4ef8-bb6d-6bb9bd389722', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e41ebc99-9c0b-4ef8-bb6d-6bb9bd38e411', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 18.5, 20)
ON CONFLICT (id) DO NOTHING;

-- 11. Absences (at -> a7)
INSERT INTO attendance_records (id, establishment_id, session_id, student_id, status)
VALUES
  ('a71ebc99-9c0b-4ef8-bb6d-6bb9bd38a711', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e1ebc99-9c0b-4ef8-bb6d-6bb9bd381e11', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'present'),
  ('a72ebc99-9c0b-4ef8-bb6d-6bb9bd38a722', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e2ebc99-9c0b-4ef8-bb6d-6bb9bd381e22', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'absent')
ON CONFLICT (id) DO NOTHING;
