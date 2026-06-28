import { pgTable, uuid, varchar, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    authUserId: uuid('auth_user_id').notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('user'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique('uq_users_email').on(t.email),
    unique('uq_users_auth_user').on(t.authUserId),
    index('idx_users_tenant_id').on(t.tenantId),
    index('idx_users_auth_user_id').on(t.authUserId),
  ]
);
