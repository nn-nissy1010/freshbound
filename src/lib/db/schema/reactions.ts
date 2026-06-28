import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';
import { contacts } from './contacts';
import { generatedEmails, generatedEmailRecipients } from './generatedEmails';
import { queueEmails } from './emailQueue';

export const reactions = pgTable(
  'reactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'restrict' }),
    contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'restrict' }),
    emailId: uuid('email_id').references(() => generatedEmails.id, { onDelete: 'restrict' }),
    generatedEmailRecipientId: uuid('generated_email_recipient_id').references(
      () => generatedEmailRecipients.id,
      { onDelete: 'set null' }
    ),
    queueEmailId: uuid('queue_email_id').references(() => queueEmails.id, {
      onDelete: 'set null',
    }),
    type: varchar('type', { length: 50 }),
    body: text('body'),
    inReplyTo: varchar('in_reply_to', { length: 255 }),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_reactions_tenant_id').on(t.tenantId),
    index('idx_reactions_company_id').on(t.companyId),
    index('idx_reactions_contact_id').on(t.contactId),
    index('idx_reactions_email_id').on(t.emailId),
    index('idx_reactions_ger_id').on(t.generatedEmailRecipientId),
    index('idx_reactions_queue_id').on(t.queueEmailId),
  ]
);
