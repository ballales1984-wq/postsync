import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const globalDb = globalThis as unknown as { __db?: ReturnType<typeof drizzle> };

const TURSO_URL = process.env.TURSO_URL || process.env.DB_URL;
const TURSO_TOKEN = process.env.TURSO_TOKEN || process.env.DB_TOKEN;

function isBuildTime(): boolean {
  return (process.env as any).NEXT_PHASE === 'phase-production-build';
}

export function getDb() {
  if (isBuildTime()) {
    return null as unknown as ReturnType<typeof drizzle>;
  }
  if (!globalDb.__db && TURSO_URL) {
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    globalDb.__db = drizzle(client, { schema });
  }
  return globalDb.__db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const database = getDb();
    if (!database) {
      const mock = {
        select: () => ({ from: () => ({ where: () => [], orderBy: () => [] }) }),
        insert: () => ({ values: () => ({ returning: () => [] }) }),
        update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
        delete: () => ({ where: () => ({ returning: () => [] }) }),
      };
      return (mock as any)[prop];
    }
    const value = database[prop as keyof typeof database];
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});