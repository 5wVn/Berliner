#!/usr/bin/env node
import "dotenv/config";
import { Client } from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  const tables = await client.query(
    "select table_name from information_schema.tables where table_schema='public' order by table_name"
  );

  console.log("Tables:", tables.rows.map((row) => row.table_name));

  for (const { table_name: tableName } of tables.rows) {
    const columns = await client.query(
      "select column_name, data_type from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position",
      [tableName]
    );
    console.log(`\n${tableName}:`);
    console.log(
      columns.rows
        .map((row) => `${row.column_name} (${row.data_type})`)
        .join(", ")
    );
  }

  await client.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
