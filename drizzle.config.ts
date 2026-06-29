import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // マイグレーションは直接接続が必要。POSTGRES_URL_NON_POOLING（Supabase統合）またはローカルの DATABASE_URL を使用。
    url: (process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL)!,
  },
});
