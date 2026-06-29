import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { icpProfiles } from './icpProfiles';

export const companies = pgTable(
  'companies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    icpProfileId: uuid('icp_profile_id').references(() => icpProfiles.id, {
      onDelete: 'restrict',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    domain: varchar('domain', { length: 255 }),
    website: varchar('website', { length: 255 }),
    industry: varchar('industry', { length: 255 }),
    employeeSize: integer('employee_size'),
    location: varchar('location', { length: 255 }),
    corporationNumber: varchar('corporation_number', { length: 100 }),
    source: varchar('source', { length: 100 }),
    raw: jsonb('raw'),
    aiDeliveryFlag: boolean('ai_delivery_flag').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_companies_tenant_domain').on(t.tenantId, t.domain),
    index('idx_companies_icp_profile_id').on(t.icpProfileId),
    index('idx_companies_tenant_id').on(t.tenantId),
  ]
);
