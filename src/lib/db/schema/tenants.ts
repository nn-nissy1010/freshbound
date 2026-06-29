import { pgTable, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';

export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    plan: varchar('plan', { length: 100 }),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
    subscriptionStatus: varchar('subscription_status', { length: 50 }).notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_tenants_stripe_customer').on(t.stripeCustomerId),
    index('idx_tenants_stripe_subscription').on(t.stripeSubscriptionId),
    index('idx_tenants_subscription_status').on(t.subscriptionStatus),
  ]
);
