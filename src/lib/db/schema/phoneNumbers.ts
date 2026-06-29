import { pgTable, uuid, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';

export const phoneNumbers = pgTable(
  'phone_numbers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'restrict' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    phoneNumber: varchar('phone_number', { length: 50 }),
    normalizedNumber: varchar('normalized_number', { length: 50 }),
    source: varchar('source', { length: 100 }),
    isValid: boolean('is_valid').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_phone_numbers_company_id').on(t.companyId),
    index('idx_phone_numbers_tenant_id').on(t.tenantId),
  ]
);
