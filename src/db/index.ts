import * as schema from "./schema";

const mockDb = {
  select: () => ({ from: () => ({ where: () => [], orderBy: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => ({ returning: () => [] }) }),
};

let _db: any = null;

function isBuildTime(): boolean {
  return (process.env as any).NEXT_PHASE === "phase-production-build";
}

export function getDb() {
  if (isBuildTime()) return mockDb;
  if (!_db) {
    const { createDatabase } = require("@kilocode/app-builder-db");
    if (process.env.DB_URL && process.env.DB_TOKEN) {
      _db = createDatabase(schema);
    } else {
      _db = mockDb;
    }
  }
  return _db;
}

export const db = new Proxy({} as any, {
  get(_target, prop) {
    const database = getDb();
    const value = database[prop as keyof typeof database];
    if (typeof value === "function") return value.bind(database);
    return value;
  },
});