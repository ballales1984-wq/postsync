import { createDatabase } from '@kilocode/app-builder-db';
import * as schema from './schema';

const globalDb = globalThis as unknown as { __db?: ReturnType<typeof createDatabase<typeof schema>> };

export const db = globalDb.__db ?? (globalDb.__db = createDatabase(schema));