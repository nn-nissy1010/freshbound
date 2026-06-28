import { pgTable, uuid, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';

export const scores = pgTable(
  'scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'restrict' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    icpMatchScore: integer('icp_match_score'),
    newHpBonus: integer('new_hp_bonus'),
    totalScore: integer('total_score'),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_scores_company_id').on(t.companyId),
    index('idx_scores_tenant_id').on(t.tenantId),
  ]
);
