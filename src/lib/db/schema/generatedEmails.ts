import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { companies } from './companies';
import { contacts } from './contacts';

export const generatedEmails = pgTable(
  'generated_emails',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    emailType: varchar('email_type', { length: 50 }).notNull().default('outbound'),
    subject: text('subject'),
    body: text('body'),
    generationPrompt: text('generation_prompt'),
    status: varchar('status', { length: 50 }),
    model: varchar('model', { length: 100 }),
    tokens: integer('tokens'),
    metadata: jsonb('metadata'),
    messageId: varchar('message_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (t) => [index('idx_generated_emails_tenant_status').on(t.tenantId, t.status)]
);

export const generatedEmailRecipients = pgTable(
  'generated_email_recipients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    generatedEmailId: uuid('generated_email_id')
      .notNull()
      .references(() => generatedEmails.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
    recipientEmail: varchar('recipient_email', { length: 255 }).notNull(),
    recipientName: varchar('recipient_name', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull().default('created'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_ger_tenant_status').on(t.tenantId, t.status),
    index('idx_ger_generated_email_id').on(t.generatedEmailId),
    index('idx_ger_company_id').on(t.companyId),
    index('idx_ger_contact_id').on(t.contactId),
    index('idx_ger_recipient_email').on(t.recipientEmail),
  ]
);
