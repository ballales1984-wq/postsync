import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

const globalDb = globalThis as unknown as { __db?: ReturnType<typeof createDatabase<typeof schema>> };

const mockDb = {
  select: () => ({ from: () => ({ where: () => [], orderBy: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => ({ returning: () => [] }) }),
};

function isBuildTime(): boolean {
  return (process.env as any).NEXT_PHASE === 'phase-production-build';
}

export function getDb() {
  if (isBuildTime()) {
    return mockDb as any;
  }
  if (!globalDb.__db) {
    globalDb.__db = createDatabase(schema);
  }
  return globalDb.__db;
}

export const db = new Proxy({} as ReturnType<typeof createDatabase<typeof schema>>, {
  get(_target, prop) {
    const database = getDb();
    const value = database[prop as keyof typeof database];
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});