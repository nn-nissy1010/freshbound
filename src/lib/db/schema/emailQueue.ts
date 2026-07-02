import { pgTable, uuid, varchar, text, integer, boolean, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { generatedEmails, generatedEmailRecipients } from './generatedEmails';

export const queueEmails = pgTable(
  'queue_emails',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    generatedEmailId: uuid('generated_email_id')
      .notNull()
      .references(() => generatedEmails.id, { onDelete: 'cascade' }),
    generatedEmailRecipientId: uuid('generated_email_recipient_id')
      .notNull()
      .references(() => generatedEmailRecipients.id, { onDelete: 'cascade' }),
    provider: varchar('provider', { length: 50 }).notNull().default('sendgrid'),
    toEmail: varchar('to_email', { length: 255 }).notNull(),
    fromEmail: varchar('from_email', { length: 255 }),
    subject: text('subject'),
    body: text('body'),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
    status: varchar('status', { length: 50 }).notNull().default('queued'),
    retryCount: integer('retry_count').notNull().default(0),
    lastError: text('last_error'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_queue_tenant_status_scheduled').on(t.tenantId, t.status, t.scheduledAt),
    index('idx_queue_generated_email_id').on(t.generatedEmailId),
    index('idx_queue_ger_id').on(t.generatedEmailRecipientId),
  ]
);

export const deliveryLogs = pgTable(
  'delivery_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'restrict' }),
    queueEmailId: uuid('queue_email_id').references(() => queueEmails.id, { onDelete: 'set null' }),
    generatedEmailRecipientId: uuid('generated_email_recipient_id').references(
      () => generatedEmailRecipients.id,
      { onDelete: 'set null' }
    ),
    provider: varchar('provider', { length: 50 }),
    providerMessageId: varchar('provider_message_id', { length: 255 }),
    status: varchar('status', { length: 50 }),
    sentAt: timestamp('sent_at', { withTimezone: true }).notNull().defaultNow(),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    response: jsonb('response'),
  },
  (t) => [
    index('idx_delivery_logs_tenant_sent_at').on(t.tenantId, t.sentAt),
    index('idx_delivery_logs_queue_id').on(t.queueEmailId),
    index('idx_delivery_logs_ger_id').on(t.generatedEmailRecipientId),
  ]
);

export const failedLogs = pgTable(
  'failed_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    queueEmailId: uuid('queue_email_id').references(() => queueEmails.id, { onDelete: 'set null' }),
    generatedEmailId: uuid('generated_email_id')
      .notNull()
      .references(() => generatedEmails.id, { onDelete: 'cascade' }),
    generatedEmailRecipientId: uuid('generated_email_recipient_id').references(
      () => generatedEmailRecipients.id,
      { onDelete: 'set null' }
    ),
    provider: varchar('provider', { length: 50 }).notNull().default('sendgrid'),
    errorCode: varchar('error_code', { length: 100 }),
    errorMessage: text('error_message'),
    response: jsonb('response'),
    failedAt: timestamp('failed_at', { withTimezone: true }).notNull().defaultNow(),
    retryable: boolean('retryable').notNull().default(true),
  },
  (t) => [
    index('idx_failed_logs_tenant_failed_at').on(t.tenantId, t.failedAt),
    index('idx_failed_logs_queue_id').on(t.queueEmailId),
    index('idx_failed_logs_generated_id').on(t.generatedEmailId),
    index('idx_failed_logs_ger_id').on(t.generatedEmailRecipientId),
  ]
);
