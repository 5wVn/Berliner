#!/usr/bin/env node
import "dotenv/config";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL");
  process.exit(1);
}

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
const seedFile = path.join(process.cwd(), "supabase", "seed.sql");

async function runSql(client, sql, label) {
  if (!sql.trim()) return;
  try {
    await client.query(sql);
    console.log(`Applied: ${label}`);
  } catch (err) {
    console.error(`Error in ${label}: ${err.message}`);
    // Continue even on error (e.g. 'already exists')
  }
}

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const migrationFiles = existsSync(migrationsDir)
    ? readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort()
    : [];

  for (const file of migrationFiles) {
    const fullPath = path.join(migrationsDir, file);
    const sql = readFileSync(fullPath, "utf8").replace(/^\uFEFF/, "");
    await runSql(client, sql, file);
  }

  if (existsSync(seedFile)) {
    const seedSql = readFileSync(seedFile, "utf8").replace(/^\uFEFF/, "");
    await runSql(client, seedSql, "seed.sql");
  }

  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
