-- ============================================================
-- FreshBound — PostgreSQL Schema (Supabase)
-- ============================================================
-- 作成日: 2026-06-16
-- 対象DB: Supabase (PostgreSQL 15+)
--
-- RLSポリシー方針:
--   - テナントスコープテーブル: tenant_id が auth.users に紐づくユーザーのものと一致する行のみ許可
--   - 管理者専用テーブル (agencies / agency_tenants / invoices): USING (false) で全ロールを拒否
--       → サービスロールキーは RLS をバイパスするため管理者操作は引き続き可能
--   - tenants: 自テナントのレコードのみ SELECT 可、変更はサービスロールのみ
--   - users: 自レコードのみ SELECT 可
-- ============================================================

-- ============================================================
-- Table: tenants
-- ============================================================
CREATE TABLE tenants (
  id                     uuid         NOT NULL DEFAULT gen_random_uuid(),
  name                   varchar(255) NOT NULL,
  plan                   varchar(100),
  stripe_customer_id     varchar(255),
  stripe_subscription_id varchar(255),
  subscription_status    varchar(50)  NOT NULL DEFAULT 'active',
  created_at             timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_tenants PRIMARY KEY (id)
);

CREATE INDEX idx_tenants_stripe_customer     ON tenants (stripe_customer_id);
CREATE INDEX idx_tenants_stripe_subscription ON tenants (stripe_subscription_id);
CREATE INDEX idx_tenants_subscription_status ON tenants (subscription_status);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
-- 自テナントのレコードのみ参照可。作成・更新・削除はサービスロール専用。
CREATE POLICY "tenants_select_own" ON tenants
  FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: agencies  ※管理者専用 — サービスロールのみアクセス可
-- ============================================================
CREATE TABLE agencies (
  id         uuid         NOT NULL DEFAULT gen_random_uuid(),
  name       varchar(255) NOT NULL,
  created_at timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_agencies PRIMARY KEY (id)
);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agencies_deny_all" ON agencies FOR ALL USING (false);

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE users (
  id           uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id    uuid         NOT NULL,
  auth_user_id uuid         NOT NULL,
  email        varchar(255) NOT NULL,
  role         varchar(50)  NOT NULL DEFAULT 'user',
  created_at   timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_users           PRIMARY KEY (id),
  CONSTRAINT uq_users_email     UNIQUE (email),
  CONSTRAINT uq_users_auth_user UNIQUE (auth_user_id),
  CONSTRAINT fk_users_tenant    FOREIGN KEY (tenant_id)    REFERENCES tenants (id)    ON DELETE RESTRICT,
  CONSTRAINT fk_users_auth      FOREIGN KEY (auth_user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE INDEX idx_users_tenant_id    ON users (tenant_id);
CREATE INDEX idx_users_auth_user_id ON users (auth_user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 自レコードのみ参照可
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth_user_id = auth.uid());

-- ============================================================
-- Table: agency_tenants  ※管理者専用
-- ============================================================
CREATE TABLE agency_tenants (
  id         uuid        NOT NULL DEFAULT gen_random_uuid(),
  agency_id  uuid        NOT NULL,
  tenant_id  uuid        NOT NULL,
  role       varchar(50) NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_agency_tenants        PRIMARY KEY (id),
  CONSTRAINT uq_agency_tenants_pair   UNIQUE (agency_id, tenant_id),
  CONSTRAINT uq_agency_tenants_tenant UNIQUE (tenant_id),
  CONSTRAINT fk_agency_tenants_agency FOREIGN KEY (agency_id) REFERENCES agencies (id) ON DELETE CASCADE,
  CONSTRAINT fk_agency_tenants_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id)  ON DELETE CASCADE
);

CREATE INDEX idx_agency_tenants_agency_id ON agency_tenants (agency_id);
CREATE INDEX idx_agency_tenants_tenant_id ON agency_tenants (tenant_id);

ALTER TABLE agency_tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agency_tenants_deny_all" ON agency_tenants FOR ALL USING (false);

-- ============================================================
-- Table: icp_profiles
-- ============================================================
CREATE TABLE icp_profiles (
  id                uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id         uuid         NOT NULL,
  name              varchar(255) NOT NULL,
  industry_codes    jsonb,
  employee_size_min integer,
  employee_size_max integer,
  region_codes      jsonb,
  budget_range      varchar(100),
  target_roles      jsonb,
  search_params     jsonb,
  created_at        timestamptz  NOT NULL DEFAULT now(),
  updated_at        timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_icp_profiles       PRIMARY KEY (id),
  CONSTRAINT fk_icp_profiles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_icp_profiles_tenant_id ON icp_profiles (tenant_id);

ALTER TABLE icp_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "icp_profiles_tenant_isolation" ON icp_profiles
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: companies
-- ============================================================
CREATE TABLE companies (
  id                 uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id          uuid         NOT NULL,
  icp_profile_id     uuid,
  name               varchar(255) NOT NULL,
  domain             varchar(255),
  website            varchar(255),
  industry           varchar(255),
  employee_size      integer,
  location           varchar(255),
  corporation_number varchar(100),
  source             varchar(100),
  raw                jsonb,
  ai_delivery_flag   boolean      NOT NULL DEFAULT false,
  created_at         timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_companies              PRIMARY KEY (id),
  CONSTRAINT uq_companies_tenant_domain UNIQUE (tenant_id, domain),
  CONSTRAINT fk_companies_tenant        FOREIGN KEY (tenant_id)      REFERENCES tenants     (id) ON DELETE RESTRICT,
  CONSTRAINT fk_companies_icp_profile   FOREIGN KEY (icp_profile_id) REFERENCES icp_profiles(id) ON DELETE RESTRICT
);

CREATE INDEX idx_companies_icp_profile_id ON companies (icp_profile_id);
CREATE INDEX idx_companies_tenant_id      ON companies (tenant_id);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies_tenant_isolation" ON companies
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: contacts
-- ============================================================
CREATE TABLE contacts (
  id                 uuid         NOT NULL DEFAULT gen_random_uuid(),
  company_id         uuid,
  tenant_id          uuid         NOT NULL,
  name               varchar(255),
  email              varchar(255),
  role               varchar(255),
  confidence         numeric(5,2),
  is_verified        boolean      NOT NULL DEFAULT false,
  is_deliverable     boolean      NOT NULL DEFAULT true,
  unsubscribed_at    timestamptz,
  unsubscribe_reason varchar(255),
  unsubscribe_token  varchar(255),
  source             varchar(100),
  created_at         timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_contacts                   PRIMARY KEY (id),
  CONSTRAINT uq_contacts_unsubscribe_token UNIQUE (unsubscribe_token),
  CONSTRAINT fk_contacts_company           FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
  CONSTRAINT fk_contacts_tenant            FOREIGN KEY (tenant_id)  REFERENCES tenants   (id) ON DELETE RESTRICT
);

CREATE INDEX idx_contacts_company_id         ON contacts (company_id);
CREATE INDEX idx_contacts_tenant_email       ON contacts (tenant_id, email);
CREATE INDEX idx_contacts_tenant_deliverable ON contacts (tenant_id, is_deliverable);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_tenant_isolation" ON contacts
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: phone_numbers
-- ============================================================
CREATE TABLE phone_numbers (
  id                uuid        NOT NULL DEFAULT gen_random_uuid(),
  company_id        uuid,
  tenant_id         uuid        NOT NULL,
  phone_number      varchar(50),
  normalized_number varchar(50),
  source            varchar(100),
  is_valid          boolean     NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_phone_numbers  PRIMARY KEY (id),
  CONSTRAINT fk_phone_company  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
  CONSTRAINT fk_phone_tenant   FOREIGN KEY (tenant_id)  REFERENCES tenants   (id) ON DELETE RESTRICT
);

CREATE INDEX idx_phone_numbers_company_id ON phone_numbers (company_id);
CREATE INDEX idx_phone_numbers_tenant_id  ON phone_numbers (tenant_id);

ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phone_numbers_tenant_isolation" ON phone_numbers
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: new_hp_flags
-- ============================================================
CREATE TABLE new_hp_flags (
  id                 uuid         NOT NULL DEFAULT gen_random_uuid(),
  company_id         uuid,
  tenant_id          uuid         NOT NULL,
  domain             varchar(255),
  whois_created_date date,
  is_new_hp          boolean,
  confidence         numeric(5,2),
  method             varchar(50),
  status             varchar(50)  NOT NULL DEFAULT 'unknown',
  created_at         timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_new_hp_flags   PRIMARY KEY (id),
  CONSTRAINT fk_new_hp_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
  CONSTRAINT fk_new_hp_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants   (id) ON DELETE RESTRICT
);

CREATE INDEX idx_new_hp_flags_company_id ON new_hp_flags (company_id);
CREATE INDEX idx_new_hp_flags_tenant_id  ON new_hp_flags (tenant_id);

ALTER TABLE new_hp_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "new_hp_flags_tenant_isolation" ON new_hp_flags
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: scores
-- ============================================================
CREATE TABLE scores (
  id              uuid        NOT NULL DEFAULT gen_random_uuid(),
  company_id      uuid,
  tenant_id       uuid        NOT NULL,
  icp_match_score integer,
  new_hp_bonus    integer,
  total_score     integer,
  computed_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_scores         PRIMARY KEY (id),
  CONSTRAINT fk_scores_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE RESTRICT,
  CONSTRAINT fk_scores_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants   (id) ON DELETE RESTRICT
);

CREATE INDEX idx_scores_company_id ON scores (company_id);
CREATE INDEX idx_scores_tenant_id  ON scores (tenant_id);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores_tenant_isolation" ON scores
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: generated_emails
-- ============================================================
CREATE TABLE generated_emails (
  id                uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id         uuid         NOT NULL,
  email_type        varchar(50)  NOT NULL DEFAULT 'outbound',
  subject           text,
  body              text,
  generation_prompt text,
  status            varchar(50),
  model             varchar(100),
  tokens            integer,
  metadata          jsonb,
  message_id        varchar(255),
  created_at        timestamptz  NOT NULL DEFAULT now(),
  updated_at        timestamptz,
  CONSTRAINT pk_generated_emails  PRIMARY KEY (id),
  CONSTRAINT fk_generated_tenant  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_generated_emails_tenant_status ON generated_emails (tenant_id, status);

ALTER TABLE generated_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "generated_emails_tenant_isolation" ON generated_emails
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: generated_email_recipients
-- ============================================================
CREATE TABLE generated_email_recipients (
  id                 uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id          uuid         NOT NULL,
  generated_email_id uuid         NOT NULL,
  company_id         uuid         NOT NULL,
  contact_id         uuid,
  recipient_email    varchar(255) NOT NULL,
  recipient_name     varchar(255),
  status             varchar(50)  NOT NULL DEFAULT 'created',
  created_at         timestamptz  NOT NULL DEFAULT now(),
  updated_at         timestamptz,
  CONSTRAINT pk_ger              PRIMARY KEY (id),
  CONSTRAINT uq_ger_email        UNIQUE (generated_email_id, recipient_email),
  CONSTRAINT fk_ger_tenant       FOREIGN KEY (tenant_id)          REFERENCES tenants                   (id) ON DELETE CASCADE,
  CONSTRAINT fk_ger_gen_email    FOREIGN KEY (generated_email_id) REFERENCES generated_emails          (id) ON DELETE CASCADE,
  CONSTRAINT fk_ger_company      FOREIGN KEY (company_id)         REFERENCES companies                 (id) ON DELETE CASCADE,
  CONSTRAINT fk_ger_contact      FOREIGN KEY (contact_id)         REFERENCES contacts                  (id) ON DELETE SET NULL
);

CREATE INDEX idx_ger_tenant_status      ON generated_email_recipients (tenant_id, status);
CREATE INDEX idx_ger_generated_email_id ON generated_email_recipients (generated_email_id);
CREATE INDEX idx_ger_company_id         ON generated_email_recipients (company_id);
CREATE INDEX idx_ger_contact_id         ON generated_email_recipients (contact_id);
CREATE INDEX idx_ger_recipient_email    ON generated_email_recipients (recipient_email);

ALTER TABLE generated_email_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ger_tenant_isolation" ON generated_email_recipients
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: queue_emails
-- ============================================================
CREATE TABLE queue_emails (
  id                           uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id                    uuid         NOT NULL,
  generated_email_id           uuid         NOT NULL,
  generated_email_recipient_id uuid         NOT NULL,
  provider                     varchar(50)  NOT NULL DEFAULT 'sendgrid',
  to_email                     varchar(255) NOT NULL,
  from_email                   varchar(255),
  subject                      text,
  body                         text,
  scheduled_at                 timestamptz,
  status                       varchar(50)  NOT NULL DEFAULT 'queued',
  retry_count                  integer      NOT NULL DEFAULT 0,
  last_error                   text,
  created_at                   timestamptz  NOT NULL DEFAULT now(),
  updated_at                   timestamptz,
  CONSTRAINT pk_queue_emails      PRIMARY KEY (id),
  CONSTRAINT fk_queue_tenant      FOREIGN KEY (tenant_id)                    REFERENCES tenants                   (id) ON DELETE CASCADE,
  CONSTRAINT fk_queue_gen_email   FOREIGN KEY (generated_email_id)           REFERENCES generated_emails          (id) ON DELETE CASCADE,
  CONSTRAINT fk_queue_ger         FOREIGN KEY (generated_email_recipient_id) REFERENCES generated_email_recipients(id) ON DELETE CASCADE
);

CREATE INDEX idx_queue_tenant_status_scheduled ON queue_emails (tenant_id, status, scheduled_at);
CREATE INDEX idx_queue_generated_email_id      ON queue_emails (generated_email_id);
CREATE INDEX idx_queue_ger_id                  ON queue_emails (generated_email_recipient_id);

ALTER TABLE queue_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "queue_emails_tenant_isolation" ON queue_emails
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: delivery_logs
-- ============================================================
CREATE TABLE delivery_logs (
  id                           uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id                    uuid         NOT NULL,
  queue_email_id               uuid,
  generated_email_recipient_id uuid,
  provider                     varchar(50),
  provider_message_id          varchar(255),
  status                       varchar(50),
  sent_at                      timestamptz  NOT NULL DEFAULT now(),
  delivered_at                 timestamptz,
  response                     jsonb,
  CONSTRAINT pk_delivery_logs  PRIMARY KEY (id),
  CONSTRAINT fk_delivery_tenant FOREIGN KEY (tenant_id)                    REFERENCES tenants                   (id) ON DELETE RESTRICT,
  CONSTRAINT fk_delivery_queue  FOREIGN KEY (queue_email_id)               REFERENCES queue_emails              (id) ON DELETE SET NULL,
  CONSTRAINT fk_delivery_ger    FOREIGN KEY (generated_email_recipient_id) REFERENCES generated_email_recipients(id) ON DELETE SET NULL
);

CREATE INDEX idx_delivery_logs_tenant_sent_at ON delivery_logs (tenant_id, sent_at);
CREATE INDEX idx_delivery_logs_queue_id        ON delivery_logs (queue_email_id);
CREATE INDEX idx_delivery_logs_ger_id          ON delivery_logs (generated_email_recipient_id);

ALTER TABLE delivery_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "delivery_logs_tenant_isolation" ON delivery_logs
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: failed_logs
-- ============================================================
CREATE TABLE failed_logs (
  id                           uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id                    uuid         NOT NULL,
  queue_email_id               uuid,
  generated_email_id           uuid         NOT NULL,
  generated_email_recipient_id uuid,
  provider                     varchar(50)  NOT NULL DEFAULT 'sendgrid',
  error_code                   varchar(100),
  error_message                text,
  response                     jsonb,
  failed_at                    timestamptz  NOT NULL DEFAULT now(),
  retryable                    boolean      NOT NULL DEFAULT true,
  CONSTRAINT pk_failed_logs            PRIMARY KEY (id),
  CONSTRAINT fk_failed_tenant          FOREIGN KEY (tenant_id)                    REFERENCES tenants                   (id) ON DELETE CASCADE,
  CONSTRAINT fk_failed_queue_email     FOREIGN KEY (queue_email_id)               REFERENCES queue_emails              (id) ON DELETE SET NULL,
  CONSTRAINT fk_failed_generated_email FOREIGN KEY (generated_email_id)           REFERENCES generated_emails          (id) ON DELETE CASCADE,
  CONSTRAINT fk_failed_ger             FOREIGN KEY (generated_email_recipient_id) REFERENCES generated_email_recipients(id) ON DELETE SET NULL
);

CREATE INDEX idx_failed_logs_tenant_failed_at ON failed_logs (tenant_id, failed_at);
CREATE INDEX idx_failed_logs_queue_id          ON failed_logs (queue_email_id);
CREATE INDEX idx_failed_logs_generated_id      ON failed_logs (generated_email_id);
CREATE INDEX idx_failed_logs_ger_id            ON failed_logs (generated_email_recipient_id);

ALTER TABLE failed_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "failed_logs_tenant_isolation" ON failed_logs
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: reactions
-- ============================================================
CREATE TABLE reactions (
  id                           uuid        NOT NULL DEFAULT gen_random_uuid(),
  tenant_id                    uuid        NOT NULL,
  company_id                   uuid,
  contact_id                   uuid,
  email_id                     uuid,
  generated_email_recipient_id uuid,
  queue_email_id               uuid,
  type                         varchar(50),
  body                         text,
  in_reply_to                  varchar(255),
  occurred_at                  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_reactions         PRIMARY KEY (id),
  CONSTRAINT fk_reactions_tenant  FOREIGN KEY (tenant_id)                    REFERENCES tenants                   (id) ON DELETE RESTRICT,
  CONSTRAINT fk_reactions_company FOREIGN KEY (company_id)                   REFERENCES companies                 (id) ON DELETE RESTRICT,
  CONSTRAINT fk_reactions_contact FOREIGN KEY (contact_id)                   REFERENCES contacts                  (id) ON DELETE RESTRICT,
  CONSTRAINT fk_reactions_email   FOREIGN KEY (email_id)                     REFERENCES generated_emails          (id) ON DELETE RESTRICT,
  CONSTRAINT fk_reactions_ger     FOREIGN KEY (generated_email_recipient_id) REFERENCES generated_email_recipients(id) ON DELETE SET NULL,
  CONSTRAINT fk_reactions_queue   FOREIGN KEY (queue_email_id)               REFERENCES queue_emails              (id) ON DELETE SET NULL
);

CREATE INDEX idx_reactions_tenant_id  ON reactions (tenant_id);
CREATE INDEX idx_reactions_company_id ON reactions (company_id);
CREATE INDEX idx_reactions_contact_id ON reactions (contact_id);
CREATE INDEX idx_reactions_email_id   ON reactions (email_id);
CREATE INDEX idx_reactions_ger_id     ON reactions (generated_email_recipient_id);
CREATE INDEX idx_reactions_queue_id   ON reactions (queue_email_id);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reactions_tenant_isolation" ON reactions
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: csv_imports
-- ============================================================
CREATE TABLE csv_imports (
  id             uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id      uuid         NOT NULL,
  file_name      varchar(255),
  total_rows     integer,
  success_rows   integer,
  failed_rows    integer,
  duplicate_rows integer,
  mapping        jsonb,
  status         varchar(50),
  created_at     timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_csv_imports PRIMARY KEY (id),
  CONSTRAINT fk_csv_tenant  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_csv_imports_tenant_id ON csv_imports (tenant_id);

ALTER TABLE csv_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "csv_imports_tenant_isolation" ON csv_imports
  FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.users WHERE auth_user_id = auth.uid()
    )
  );

-- ============================================================
-- Table: invoices  ※管理者専用 — サービスロールのみアクセス可
-- ============================================================
CREATE TABLE invoices (
  id                uuid         NOT NULL DEFAULT gen_random_uuid(),
  tenant_id         uuid         NOT NULL,
  stripe_invoice_id varchar(255),
  amount            integer      NOT NULL,
  currency          varchar(10)  NOT NULL DEFAULT 'jpy',
  status            varchar(50)  NOT NULL,
  billing_reason    varchar(100),
  paid_at           timestamptz,
  created_at        timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT pk_invoices        PRIMARY KEY (id),
  CONSTRAINT uq_invoices_stripe UNIQUE (stripe_invoice_id),
  CONSTRAINT fk_invoices_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE RESTRICT
);

CREATE INDEX idx_invoices_tenant_id  ON invoices (tenant_id);
CREATE INDEX idx_invoices_status     ON invoices (status);
CREATE INDEX idx_invoices_paid_at    ON invoices (paid_at);
CREATE INDEX idx_invoices_created_at ON invoices (created_at);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_deny_all" ON invoices FOR ALL USING (false);
