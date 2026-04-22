import { runMigrations } from "@kilocode/app-builder-db";
import { db } from "./index";

const DB_URL = process.env.DB_URL || process.env.TURSO_URL;
const DB_TOKEN = process.env.DB_TOKEN || process.env.TURSO_TOKEN;

if (!DB_URL || !DB_TOKEN) {
  console.log("Skipping migrations: DB_URL and DB_TOKEN not configured");
  process.exit(0);
}

process.env.DB_URL = DB_URL;
process.env.DB_TOKEN = DB_TOKEN;

await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });