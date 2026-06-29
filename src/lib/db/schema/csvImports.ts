import { pgTable, uuid, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const csvImports = pgTable(
  'csv_imports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    fileName: varchar('file_name', { length: 255 }),
    totalRows: integer('total_rows'),
    successRows: integer('success_rows'),
    failedRows: integer('failed_rows'),
    duplicateRows: integer('duplicate_rows'),
    mapping: jsonb('mapping'),
    status: varchar('status', { length: 50 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_csv_imports_tenant_id').on(t.tenantId)]
);
