import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase-Vercel統合は POSTGRES_URL（pooler）を注入する。ローカルは DATABASE_URL にフォールバック。
const connectionString = (process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!;

// Vercel等のサーバーレス環境ではSupabaseのConnection Pooler（port 6543）を使用する。
// pgbouncer の transaction モードでは prepare: false が必須。
const client = postgres(connectionString, {
  max: 1,
  prepare: false,
});

export const db = drizzle(client, { schema });

export type DB = typeof db;
