import { pgTable, uuid, varchar, date, boolean, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';

export const newHpFlags = pgTable(
  'new_hp_flags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'restrict' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    domain: varchar('domain', { length: 255 }),
    whoisCreatedDate: date('whois_created_date'),
    isNewHp: boolean('is_new_hp'),
    confidence: numeric('confidence', { precision: 5, scale: 2 }),
    method: varchar('method', { length: 50 }),
    status: varchar('status', { length: 50 }).notNull().default('unknown'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_new_hp_flags_company_id').on(t.companyId),
    index('idx_new_hp_flags_tenant_id').on(t.tenantId),
  ]
);
