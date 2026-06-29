import { pgTable, uuid, varchar, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const icpProfiles = pgTable(
  'icp_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    industryCodes: jsonb('industry_codes'),
    employeeSizeMin: integer('employee_size_min'),
    employeeSizeMax: integer('employee_size_max'),
    regionCodes: jsonb('region_codes'),
    budgetRange: varchar('budget_range', { length: 100 }),
    targetRoles: jsonb('target_roles'),
    searchParams: jsonb('search_params'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_icp_profiles_tenant_id').on(t.tenantId)]
);
