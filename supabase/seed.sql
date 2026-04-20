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
  -- academic_head
  ('a0000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  
  -- Pilot A Users
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'scol@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.turing@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'prof.lovelace@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.neo@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'etu.trinity@pilot-a.com', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),

  -- ESGI 1 Students
  ('a0000000-0000-0000-0000-000000e59101', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'o.barret@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59102', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'k.cubahiro@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59103', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.delateyssonniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59104', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a.durant@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59105', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'z.elmaach@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59106', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'r.greuzat@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59107', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm.lamartiniere@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59108', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'd.obiangnkogho@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59109', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.paulus@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59110', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'l.poirier@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.taouni@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a0000000-0000-0000-0000-000000e59112', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 's.dieudonne@berliner.fr', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  
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
  ('a0000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@berliner.fr', 'academic_head', 'Admin', 'BERLINER'),
  ('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'scol@pilot-a.com', 'registrar', 'Sophie', 'Scolarite'),
  ('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.turing@pilot-a.com', 'teacher', 'Alan', 'Turing'),
  ('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380033', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'prof.lovelace@pilot-a.com', 'teacher', 'Ada', 'Lovelace'),
  ('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.neo@pilot-a.com', 'student', 'Thomas', 'Anderson'),
  ('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'etu.trinity@pilot-a.com', 'student', 'Trinity', 'Moss'),
  
  -- ESGI 1 Students
  ('a0000000-0000-0000-0000-000000e59101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'o.barret@berliner.fr', 'student', 'O.', 'Barret'),
  ('a0000000-0000-0000-0000-000000e59102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'k.cubahiro@berliner.fr', 'student', 'K.', 'Cubahiro'),
  ('a0000000-0000-0000-0000-000000e59103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.delateyssonniere@berliner.fr', 'student', 'A.', 'Delateyssonniere'),
  ('a0000000-0000-0000-0000-000000e59104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a.durant@berliner.fr', 'student', 'A.', 'Durant'),
  ('a0000000-0000-0000-0000-000000e59105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'z.elmaach@berliner.fr', 'student', 'Z.', 'Elmaach'),
  ('a0000000-0000-0000-0000-000000e59106', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'r.greuzat@berliner.fr', 'student', 'R.', 'Greuzat'),
  ('a0000000-0000-0000-0000-000000e59107', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm.lamartiniere@berliner.fr', 'student', 'M.', 'Lamartiniere'),
  ('a0000000-0000-0000-0000-000000e59108', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd.obiangnkogho@berliner.fr', 'student', 'D.', 'Obiangnkogho'),
  ('a0000000-0000-0000-0000-000000e59109', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.paulus@berliner.fr', 'student', 'L.', 'Paulus'),
  ('a0000000-0000-0000-0000-000000e59110', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'l.poirier@berliner.fr', 'student', 'L.', 'Poirier'),
  ('a0000000-0000-0000-0000-000000e59111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.taouni@berliner.fr', 'student', 'S.', 'Taouni'),
  ('a0000000-0000-0000-0000-000000e59112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 's.dieudonne@berliner.fr', 'student', 'S.', 'Dieudonne'),
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
  VALUES ('c5000000-0000-0000-0000-0e59130010eb', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5913099-9c0b-4ef8-bb6d-6bb9bd38e593', '51eebc99-9c0b-4ef8-bb6d-6bb9bd380511', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380022')
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
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd38e111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Neo in B3-DEV
  ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd38e112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'), -- Trinity in B3-DEV
  ('e1000000-0000-0000-0000-000000e59101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59101', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59102', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59103', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59104', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59105', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59106', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59106', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59107', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59107', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59108', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59108', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59109', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59109', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59110', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59110', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59111', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591'),
  ('e1000000-0000-0000-0000-000000e59112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59112', 'c5911099-9c0b-4ef8-bb6d-6bb9bd38e591')
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

-- =============================================================================
-- Seed complémentaire (Priorité 4 — étendre seed.sql)
-- Ajoute : student_records, enrollments pending, sessions historique + futures,
-- evaluations, grades, attendance_records, documents pending, companies,
-- apprenticeships. Tout en UUID fixes + ON CONFLICT DO NOTHING pour idempotence.
-- =============================================================================

-- 12. student_records (5700... pattern, un par étudiant ESGI 1 + Neo/Trinity)
INSERT INTO student_records (id, establishment_id, student_id, student_number, admission_date, birth_date)
VALUES
  ('57000000-0000-0000-0000-000000000044', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', 'STU-2023-0044', '2023-09-01', '2001-04-12'),
  ('57000000-0000-0000-0000-000000000055', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', 'STU-2023-0055', '2023-09-01', '2002-07-30'),
  ('57000000-0000-0000-0000-000000e59101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59101', 'STU-2023-0101', '2023-09-01', '2003-02-11'),
  ('57000000-0000-0000-0000-000000e59102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59102', 'STU-2023-0102', '2023-09-01', '2003-05-22'),
  ('57000000-0000-0000-0000-000000e59103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59103', 'STU-2023-0103', '2023-09-01', '2002-11-03'),
  ('57000000-0000-0000-0000-000000e59104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59104', 'STU-2023-0104', '2023-09-01', '2003-08-17'),
  ('57000000-0000-0000-0000-000000e59105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59105', 'STU-2023-0105', '2023-09-01', '2003-01-29'),
  ('57000000-0000-0000-0000-000000e59106', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59106', 'STU-2023-0106', '2023-09-01', '2002-09-14'),
  ('57000000-0000-0000-0000-000000e59107', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59107', 'STU-2023-0107', '2023-09-01', '2003-06-05'),
  ('57000000-0000-0000-0000-000000e59108', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59108', 'STU-2023-0108', '2023-09-01', '2002-12-21'),
  ('57000000-0000-0000-0000-000000e59109', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59109', 'STU-2023-0109', '2023-09-01', '2003-03-08'),
  ('57000000-0000-0000-0000-000000e59110', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59110', 'STU-2023-0110', '2023-09-01', '2003-10-16'),
  ('57000000-0000-0000-0000-000000e59111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59111', 'STU-2023-0111', '2023-09-01', '2002-06-27'),
  ('57000000-0000-0000-0000-000000e59112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59112', 'STU-2023-0112', '2023-09-01', '2003-04-19')
ON CONFLICT (id) DO NOTHING;

-- 13. Enrollments pending (2 demandes de passage vers ESGI 2 en attente)
INSERT INTO enrollments (id, establishment_id, student_id, class_id, status, start_date)
VALUES
  ('e1999999-0000-0000-0000-000000e59201', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59105', 'c5912099-9c0b-4ef8-bb6d-6bb9bd38e592', 'pending', CURRENT_DATE),
  ('e1999999-0000-0000-0000-000000e59202', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59107', 'c5912099-9c0b-4ef8-bb6d-6bb9bd38e592', 'pending', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- 14. Sessions (20 sessions: 10 passées, 10 futures) sur des class_subjects ESGI 1
-- Patterns UUID: 1e900000-0000-0000-0000-000e591xxxxx (xxxxx = num session)
-- Class_subjects retenus: Algo1 (171006), Web1 (171009), C1 (171010), Res1 (171011), Anglais (171001)
INSERT INTO sessions (id, establishment_id, class_subject_id, start_time, end_time, location)
VALUES
  -- Sessions passées (history)
  ('1e900000-0000-0000-0000-000e59100001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171006', (now() - interval '28 day')::date + time '09:00', (now() - interval '28 day')::date + time '12:00', 'Salle 101'),
  ('1e900000-0000-0000-0000-000e59100002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171009', (now() - interval '27 day')::date + time '14:00', (now() - interval '27 day')::date + time '17:00', 'Salle 102'),
  ('1e900000-0000-0000-0000-000e59100003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171010', (now() - interval '25 day')::date + time '09:00', (now() - interval '25 day')::date + time '12:00', 'Salle 103'),
  ('1e900000-0000-0000-0000-000e59100004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171011', (now() - interval '22 day')::date + time '14:00', (now() - interval '22 day')::date + time '17:00', 'Salle 104'),
  ('1e900000-0000-0000-0000-000e59100005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171001', (now() - interval '20 day')::date + time '09:00', (now() - interval '20 day')::date + time '11:00', 'Salle 105'),
  ('1e900000-0000-0000-0000-000e59100006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171006', (now() - interval '18 day')::date + time '09:00', (now() - interval '18 day')::date + time '12:00', 'Salle 101'),
  ('1e900000-0000-0000-0000-000e59100007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171009', (now() - interval '15 day')::date + time '14:00', (now() - interval '15 day')::date + time '17:00', 'Salle 102'),
  ('1e900000-0000-0000-0000-000e59100008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171010', (now() - interval '12 day')::date + time '09:00', (now() - interval '12 day')::date + time '12:00', 'Salle 103'),
  ('1e900000-0000-0000-0000-000e59100009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171011', (now() - interval '8 day')::date + time '14:00', (now() - interval '8 day')::date + time '17:00', 'Salle 104'),
  ('1e900000-0000-0000-0000-000e59100010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171001', (now() - interval '5 day')::date + time '09:00', (now() - interval '5 day')::date + time '11:00', 'Salle 105'),
  -- Sessions futures (planning à venir)
  ('1e900000-0000-0000-0000-000e59100011', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171006', (now() + interval '3 day')::date + time '09:00', (now() + interval '3 day')::date + time '12:00', 'Salle 101'),
  ('1e900000-0000-0000-0000-000e59100012', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171009', (now() + interval '4 day')::date + time '14:00', (now() + interval '4 day')::date + time '17:00', 'Salle 102'),
  ('1e900000-0000-0000-0000-000e59100013', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171010', (now() + interval '5 day')::date + time '09:00', (now() + interval '5 day')::date + time '12:00', 'Salle 103'),
  ('1e900000-0000-0000-0000-000e59100014', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171011', (now() + interval '6 day')::date + time '14:00', (now() + interval '6 day')::date + time '17:00', 'Salle 104'),
  ('1e900000-0000-0000-0000-000e59100015', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171001', (now() + interval '7 day')::date + time '09:00', (now() + interval '7 day')::date + time '11:00', 'Salle 105'),
  ('1e900000-0000-0000-0000-000e59100016', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171006', (now() + interval '10 day')::date + time '09:00', (now() + interval '10 day')::date + time '12:00', 'Salle 101'),
  ('1e900000-0000-0000-0000-000e59100017', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171009', (now() + interval '11 day')::date + time '14:00', (now() + interval '11 day')::date + time '17:00', 'Salle 102'),
  ('1e900000-0000-0000-0000-000e59100018', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171010', (now() + interval '13 day')::date + time '09:00', (now() + interval '13 day')::date + time '12:00', 'Salle 103'),
  ('1e900000-0000-0000-0000-000e59100019', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171011', (now() + interval '14 day')::date + time '14:00', (now() + interval '14 day')::date + time '17:00', 'Salle 104'),
  ('1e900000-0000-0000-0000-000e59100020', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171001', (now() + interval '17 day')::date + time '09:00', (now() + interval '17 day')::date + time '11:00', 'Salle 105')
ON CONFLICT (id) DO NOTHING;

-- 15. Evaluations supplémentaires (6 évaluations: partiels/TP sur les class_subjects ESGI 1)
INSERT INTO evaluations (id, establishment_id, class_subject_id, name, type, coefficient, date)
VALUES
  ('e4900000-0000-0000-0000-000e591a1001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171006', 'Partiel Algo 1', 'exam', 2.0, (now() - interval '15 day')::date),
  ('e4900000-0000-0000-0000-000e591a1002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171009', 'TP Web 1', 'practical', 1.5, (now() - interval '10 day')::date),
  ('e4900000-0000-0000-0000-000e591a1003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171010', 'Partiel C 1', 'exam', 2.0, (now() - interval '8 day')::date),
  ('e4900000-0000-0000-0000-000e591a1004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171011', 'QCM Réseaux 1', 'quiz', 1.0, (now() - interval '6 day')::date),
  ('e4900000-0000-0000-0000-000e591a1005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171001', 'Oral Anglais', 'oral', 1.0, (now() - interval '3 day')::date),
  ('e4900000-0000-0000-0000-000e591a1006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c5000000-0000-0000-0000-000e59171007', 'Projet BDD', 'project', 2.0, (now() - interval '20 day')::date)
ON CONFLICT (id) DO NOTHING;

-- 16. Grades (30 lignes: 6 evaluations x 5 étudiants ESGI 1)
INSERT INTO grades (id, establishment_id, evaluation_id, student_id, score, max_score)
VALUES
  -- Partiel Algo 1
  ('97900000-0000-0000-0000-0001a1001101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1001', 'a0000000-0000-0000-0000-000000e59101', 14, 20),
  ('97900000-0000-0000-0000-0001a1001102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1001', 'a0000000-0000-0000-0000-000000e59102', 12.5, 20),
  ('97900000-0000-0000-0000-0001a1001103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1001', 'a0000000-0000-0000-0000-000000e59103', 17, 20),
  ('97900000-0000-0000-0000-0001a1001104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1001', 'a0000000-0000-0000-0000-000000e59104', 9, 20),
  ('97900000-0000-0000-0000-0001a1001105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1001', 'a0000000-0000-0000-0000-000000e59105', 15.5, 20),
  -- TP Web 1
  ('97900000-0000-0000-0000-0001a1002101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1002', 'a0000000-0000-0000-0000-000000e59101', 18, 20),
  ('97900000-0000-0000-0000-0001a1002102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1002', 'a0000000-0000-0000-0000-000000e59102', 16, 20),
  ('97900000-0000-0000-0000-0001a1002103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1002', 'a0000000-0000-0000-0000-000000e59103', 15, 20),
  ('97900000-0000-0000-0000-0001a1002104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1002', 'a0000000-0000-0000-0000-000000e59104', 13, 20),
  ('97900000-0000-0000-0000-0001a1002105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1002', 'a0000000-0000-0000-0000-000000e59105', 19, 20),
  -- Partiel C 1
  ('97900000-0000-0000-0000-0001a1003101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1003', 'a0000000-0000-0000-0000-000000e59101', 11, 20),
  ('97900000-0000-0000-0000-0001a1003102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1003', 'a0000000-0000-0000-0000-000000e59102', 14, 20),
  ('97900000-0000-0000-0000-0001a1003103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1003', 'a0000000-0000-0000-0000-000000e59103', 16.5, 20),
  ('97900000-0000-0000-0000-0001a1003104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1003', 'a0000000-0000-0000-0000-000000e59104', 10, 20),
  ('97900000-0000-0000-0000-0001a1003105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1003', 'a0000000-0000-0000-0000-000000e59105', 13.5, 20),
  -- QCM Réseaux 1
  ('97900000-0000-0000-0000-0001a1004101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1004', 'a0000000-0000-0000-0000-000000e59101', 17, 20),
  ('97900000-0000-0000-0000-0001a1004102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1004', 'a0000000-0000-0000-0000-000000e59102', 15, 20),
  ('97900000-0000-0000-0000-0001a1004103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1004', 'a0000000-0000-0000-0000-000000e59103', 12, 20),
  ('97900000-0000-0000-0000-0001a1004104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1004', 'a0000000-0000-0000-0000-000000e59104', 14, 20),
  ('97900000-0000-0000-0000-0001a1004105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1004', 'a0000000-0000-0000-0000-000000e59105', 18.5, 20),
  -- Oral Anglais
  ('97900000-0000-0000-0000-0001a1005101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1005', 'a0000000-0000-0000-0000-000000e59101', 15, 20),
  ('97900000-0000-0000-0000-0001a1005102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1005', 'a0000000-0000-0000-0000-000000e59102', 13, 20),
  ('97900000-0000-0000-0000-0001a1005103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1005', 'a0000000-0000-0000-0000-000000e59103', 18, 20),
  ('97900000-0000-0000-0000-0001a1005104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1005', 'a0000000-0000-0000-0000-000000e59104', 16, 20),
  ('97900000-0000-0000-0000-0001a1005105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1005', 'a0000000-0000-0000-0000-000000e59105', 14, 20),
  -- Projet BDD
  ('97900000-0000-0000-0000-0001a1006101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1006', 'a0000000-0000-0000-0000-000000e59101', 16, 20),
  ('97900000-0000-0000-0000-0001a1006102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1006', 'a0000000-0000-0000-0000-000000e59102', 17.5, 20),
  ('97900000-0000-0000-0000-0001a1006103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1006', 'a0000000-0000-0000-0000-000000e59103', 14, 20),
  ('97900000-0000-0000-0000-0001a1006104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1006', 'a0000000-0000-0000-0000-000000e59104', 12, 20),
  ('97900000-0000-0000-0000-0001a1006105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e4900000-0000-0000-0000-000e591a1006', 'a0000000-0000-0000-0000-000000e59105', 19, 20)
ON CONFLICT (id) DO NOTHING;

-- 17. Attendance records (50 lignes: 10 sessions passées x 5 étudiants ESGI 1)
INSERT INTO attendance_records (id, establishment_id, session_id, student_id, status)
VALUES
  -- Session 1 (il y a 28 jours)
  ('a7900000-0000-0000-0000-00a710010101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100001', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710010102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100001', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710010103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100001', 'a0000000-0000-0000-0000-000000e59103', 'late'),
  ('a7900000-0000-0000-0000-00a710010104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100001', 'a0000000-0000-0000-0000-000000e59104', 'absent'),
  ('a7900000-0000-0000-0000-00a710010105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100001', 'a0000000-0000-0000-0000-000000e59105', 'present'),
  -- Session 2
  ('a7900000-0000-0000-0000-00a710020101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100002', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710020102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100002', 'a0000000-0000-0000-0000-000000e59102', 'excused'),
  ('a7900000-0000-0000-0000-00a710020103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100002', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710020104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100002', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710020105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100002', 'a0000000-0000-0000-0000-000000e59105', 'late'),
  -- Session 3
  ('a7900000-0000-0000-0000-00a710030101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100003', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710030102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100003', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710030103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100003', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710030104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100003', 'a0000000-0000-0000-0000-000000e59104', 'pending_justification'),
  ('a7900000-0000-0000-0000-00a710030105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100003', 'a0000000-0000-0000-0000-000000e59105', 'present'),
  -- Session 4
  ('a7900000-0000-0000-0000-00a710040101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100004', 'a0000000-0000-0000-0000-000000e59101', 'late'),
  ('a7900000-0000-0000-0000-00a710040102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100004', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710040103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100004', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710040104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100004', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710040105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100004', 'a0000000-0000-0000-0000-000000e59105', 'excused'),
  -- Session 5
  ('a7900000-0000-0000-0000-00a710050101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100005', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710050102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100005', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710050103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100005', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710050104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100005', 'a0000000-0000-0000-0000-000000e59104', 'late'),
  ('a7900000-0000-0000-0000-00a710050105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100005', 'a0000000-0000-0000-0000-000000e59105', 'present'),
  -- Session 6
  ('a7900000-0000-0000-0000-00a710060101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100006', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710060102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100006', 'a0000000-0000-0000-0000-000000e59102', 'absent'),
  ('a7900000-0000-0000-0000-00a710060103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100006', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710060104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100006', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710060105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100006', 'a0000000-0000-0000-0000-000000e59105', 'present'),
  -- Session 7
  ('a7900000-0000-0000-0000-00a710070101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100007', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710070102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100007', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710070103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100007', 'a0000000-0000-0000-0000-000000e59103', 'excused'),
  ('a7900000-0000-0000-0000-00a710070104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100007', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710070105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100007', 'a0000000-0000-0000-0000-000000e59105', 'late'),
  -- Session 8
  ('a7900000-0000-0000-0000-00a710080101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100008', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710080102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100008', 'a0000000-0000-0000-0000-000000e59102', 'late'),
  ('a7900000-0000-0000-0000-00a710080103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100008', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710080104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100008', 'a0000000-0000-0000-0000-000000e59104', 'pending_justification'),
  ('a7900000-0000-0000-0000-00a710080105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100008', 'a0000000-0000-0000-0000-000000e59105', 'present'),
  -- Session 9
  ('a7900000-0000-0000-0000-00a710090101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100009', 'a0000000-0000-0000-0000-000000e59101', 'present'),
  ('a7900000-0000-0000-0000-00a710090102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100009', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710090103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100009', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710090104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100009', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710090105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100009', 'a0000000-0000-0000-0000-000000e59105', 'absent'),
  -- Session 10
  ('a7900000-0000-0000-0000-00a710100101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100010', 'a0000000-0000-0000-0000-000000e59101', 'late'),
  ('a7900000-0000-0000-0000-00a710100102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100010', 'a0000000-0000-0000-0000-000000e59102', 'present'),
  ('a7900000-0000-0000-0000-00a710100103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100010', 'a0000000-0000-0000-0000-000000e59103', 'present'),
  ('a7900000-0000-0000-0000-00a710100104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100010', 'a0000000-0000-0000-0000-000000e59104', 'present'),
  ('a7900000-0000-0000-0000-00a710100105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1e900000-0000-0000-0000-000e59100010', 'a0000000-0000-0000-0000-000000e59105', 'excused')
ON CONFLICT (id) DO NOTHING;

-- 18. Companies (P1 seed — Suppose que la migration 20260415_company_apprenticeships a tourné)
INSERT INTO companies (id, establishment_id, name, siret)
VALUES
  ('c0000000-0000-0000-0000-000000c0a001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ACME Software',       '12345678900011'),
  ('c0000000-0000-0000-0000-000000c0a002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Wayne Enterprises',   '98765432100022')
ON CONFLICT (id) DO NOTHING;

-- 19. Company contact users (auth.users) + profiles role='company'
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES
  ('c0000000-0000-0000-0000-000000c0ff01', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@acme.test',  crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('c0000000-0000-0000-0000-000000c0ff02', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@wayne.test', crypt('berliner2024', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, establishment_id, email, role, first_name, last_name, company_id)
VALUES
  ('c0000000-0000-0000-0000-000000c0ff01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'contact@acme.test',  'company', 'Alice',  'ACME',  'c0000000-0000-0000-0000-000000c0a001'),
  ('c0000000-0000-0000-0000-000000c0ff02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'contact@wayne.test', 'company', 'Bruce',  'Wayne', 'c0000000-0000-0000-0000-000000c0a002')
ON CONFLICT (id) DO NOTHING;

-- 20. Apprenticeships (4 contrats: 2 actifs, 1 pending, 1 terminé)
INSERT INTO apprenticeships (id, establishment_id, company_id, student_id, start_date, end_date, status)
VALUES
  ('a9000000-0000-0000-0000-000000a90001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0000000-0000-0000-0000-000000c0a001', 'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380044', '2023-09-01', NULL, 'active'),
  ('a9000000-0000-0000-0000-000000a90002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0000000-0000-0000-0000-000000c0a001', 'a0000000-0000-0000-0000-000000e59101', '2023-09-01', NULL, 'active'),
  ('a9000000-0000-0000-0000-000000a90003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0000000-0000-0000-0000-000000c0a002', 'a0000000-0000-0000-0000-000000e59102', CURRENT_DATE, NULL, 'pending'),
  ('a9000000-0000-0000-0000-000000a90004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0000000-0000-0000-0000-000000c0a002', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380055', '2022-09-01', '2023-08-31', 'ended')
ON CONFLICT (id) DO NOTHING;

-- 21. Documents — 5 demandes en attente (P2 seed)
-- file_url null autorisé par la migration 20260415_document_requests.sql
INSERT INTO documents (id, establishment_id, owner_id, requested_by, type, title, file_url, request_type, request_status)
VALUES
  ('d0000000-0000-0000-0000-000000d00001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59101', 'a0000000-0000-0000-0000-000000e59101', 'certificate',          'Certificat de scolarité 2023-2024', NULL, 'certificate',          'pending'),
  ('d0000000-0000-0000-0000-000000d00002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59102', 'a0000000-0000-0000-0000-000000e59102', 'transcript',           'Relevé de notes S1',                  NULL, 'transcript',           'pending'),
  ('d0000000-0000-0000-0000-000000d00003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59103', 'a0000000-0000-0000-0000-000000e59103', 'attestation',          'Attestation de présence',             NULL, 'attestation',          'pending'),
  ('d0000000-0000-0000-0000-000000d00004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59104', 'a0000000-0000-0000-0000-000000e59104', 'internship_agreement', 'Convention de stage ACME',            NULL, 'internship_agreement', 'pending'),
  ('d0000000-0000-0000-0000-000000d00005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000e59105', 'a0000000-0000-0000-0000-000000e59105', 'other',                'Duplicata carte étudiante',           NULL, 'other',                'pending')
ON CONFLICT (id) DO NOTHING;
