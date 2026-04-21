import { runMigrations } from "@kilocode/app-builder-db";
import { db } from "./index";

if (!process.env.DB_URL || !process.env.DB_TOKEN) {
  console.log("Skipping migrations: DB_URL and DB_TOKEN not configured");
  process.exit(0);
}

await runMigrations(db, {}, { migrationsFolder: "./src/db/migrations" });