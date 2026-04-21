import { runMigrations } from "@kilocode/app-builder-db";
import { db } from "./index";

const url = process.env.DB_URL;
const token = process.env.DB_TOKEN;

if (!url || !token) {
  console.log("Skipping migrations: DB_URL or DB_TOKEN not set");
  process.exit(0);
}

await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });