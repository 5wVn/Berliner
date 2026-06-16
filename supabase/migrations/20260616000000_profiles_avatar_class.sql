-- Ajoute les colonnes utilisées par l'app mais absentes du schéma initial.
-- avatar_url : photo de profil (édition profil).
-- class_id   : classe de l'élève (raccourci ; sinon déduit via enrollments).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id);
