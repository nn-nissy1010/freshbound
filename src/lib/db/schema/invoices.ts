import { pgTable, uuid, varchar, integer, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
    amount: integer('amount').notNull(),
    currency: varchar('currency', { length: 10 }).notNull().default('jpy'),
    status: varchar('status', { length: 50 }).notNull(),
    billingReason: varchar('billing_reason', { length: 100 }),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_invoices_stripe').on(t.stripeInvoiceId),
    index('idx_invoices_tenant_id').on(t.tenantId),
    index('idx_invoices_status').on(t.status),
    index('idx_invoices_paid_at').on(t.paidAt),
    index('idx_invoices_created_at').on(t.createdAt),
  ]
);
