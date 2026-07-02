import { pgTable, uuid, varchar, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { agencies } from './agencies';
import { tenants } from './tenants';

export const agencyTenants = pgTable(
  'agency_tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    agencyId: uuid('agency_id')
      .notNull()
      .references(() => agencies.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).notNull().default('owner'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_agency_tenants_pair').on(t.agencyId, t.tenantId),
    unique('uq_agency_tenants_tenant').on(t.tenantId),
    index('idx_agency_tenants_agency_id').on(t.agencyId),
    index('idx_agency_tenants_tenant_id').on(t.tenantId),
  ]
);
