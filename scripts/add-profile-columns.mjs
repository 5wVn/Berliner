#!/usr/bin/env node
// Ajoute les colonnes que le code attend mais qui manquent dans profiles :
//   - avatar_url (photo de profil)
//   - class_id   (classe de l'élève)
// Idempotent (IF NOT EXISTS). Lit DATABASE_URL depuis .env.
import "dotenv/config";
import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Manque DATABASE_URL dans .env");
  process.exit(1);
}

const sql = `
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES classes(id);
`;

const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

(async () => {
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='profiles' ORDER BY ordinal_position"
  );
  console.log("OK — colonnes profiles:", rows.map((r) => r.column_name).join(", "));
  await client.end();
})().catch((e) => {
  console.error("ERR:", e.message);
  process.exit(1);
});
