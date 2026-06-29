import {
  pgTable,
  uuid,
  varchar,
  boolean,
  numeric,
  timestamp,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'restrict' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    role: varchar('role', { length: 255 }),
    confidence: numeric('confidence', { precision: 5, scale: 2 }),
    isVerified: boolean('is_verified').notNull().default(false),
    isDeliverable: boolean('is_deliverable').notNull().default(true),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
    unsubscribeReason: varchar('unsubscribe_reason', { length: 255 }),
    unsubscribeToken: varchar('unsubscribe_token', { length: 255 }),
    source: varchar('source', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_contacts_unsubscribe_token').on(t.unsubscribeToken),
    index('idx_contacts_company_id').on(t.companyId),
    index('idx_contacts_tenant_email').on(t.tenantId, t.email),
    index('idx_contacts_tenant_deliverable').on(t.tenantId, t.isDeliverable),
  ]
);
