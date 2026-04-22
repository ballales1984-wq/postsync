import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

const mockDb = {
  select: () => ({ from: () => ({ where: () => [], orderBy: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => ({ returning: () => [] }) }),
};

export const db = createDatabase(schema) || mockDb;