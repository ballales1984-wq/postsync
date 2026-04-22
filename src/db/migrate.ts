import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { readFileSync } from "fs";
import { join } from "path";

const TURSO_URL = process.env.TURSO_URL || process.env.DB_URL;
const TURSO_TOKEN = process.env.TURSO_TOKEN || process.env.DB_TOKEN;

async function migrate() {
  if (!TURSO_URL || !TURSO_TOKEN) {
    console.log("Skipping migrations: TURSO_URL or TURSO_TOKEN not configured");
    return;
  }

  const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
  const db = drizzle(client, { schema });

  try {
    await db.run({ sql: `CREATE TABLE IF NOT EXISTS analytics_events (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      event_type text NOT NULL,
      source text,
      url_path text,
      session_id text,
      user_agent text,
      referrer text,
      metadata text,
      timestamp integer
    )` });
    console.log("Migration completed: analytics_events table created");
  } catch (e) {
    console.error("Migration error:", e);
  }
}

migrate();