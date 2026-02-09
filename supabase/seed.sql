INSERT INTO establishments (name, slug, type)
VALUES
  ('Etablissement Pilote A', 'pilot-a', 'campus'),
  ('Etablissement Pilote B', 'pilot-b', 'campus'),
  ('Etablissement Pilote C', 'pilot-c', 'campus')
ON CONFLICT (slug) DO NOTHING;
