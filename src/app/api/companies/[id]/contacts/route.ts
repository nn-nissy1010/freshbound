import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, companies, contacts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { findContactsByDomain, buildFallbackContacts } from '@/lib/prospeo';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const result = await db.select({ tenantId: users.tenantId }).from(users).where(eq(users.authUserId, user.id)).limit(1);
  return result[0]?.tenantId ?? null;
}

// POST /api/companies/[id]/contacts — Prospeoで担当者メールを発掘・保存
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: companyId } = await params;
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 対象企業がこのテナントのものか確認
  const [company] = await db
    .select({ id: companies.id, domain: companies.domain })
    .from(companies)
    .where(and(eq(companies.id, companyId), eq(companies.tenantId, tenantId)))
    .limit(1);

  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  if (!company.domain) return NextResponse.json({ error: 'ドメインが登録されていません' }, { status: 400 });

  // Prospeo APIで担当者を検索
  const result = await findContactsByDomain(company.domain);

  // 結果がない場合はフォールバックメールを使用
  const candidates =
    result.contacts.length > 0
      ? result.contacts
      : buildFallbackContacts(company.domain);

  // DBに保存（重複チェック: 同テナント×メール）
  const saved = [];
  for (const c of candidates) {
    const existing = await db
      .select({ id: contacts.id })
      .from(contacts)
      .where(and(eq(contacts.tenantId, tenantId), eq(contacts.email, c.email)))
      .limit(1);

    if (existing.length > 0) {
      saved.push({ ...c, alreadyExisted: true });
      continue;
    }

    const [inserted] = await db
      .insert(contacts)
      .values({
        tenantId,
        companyId,
        email: c.email,
        name: c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : undefined,
        role: c.position,
        confidence: String(c.confidence),
        source: result.contacts.length > 0 ? 'prospeo' : 'fallback',
      })
      .returning();

    saved.push({ ...inserted, alreadyExisted: false });
  }

  return NextResponse.json({ contacts: saved, prospeoError: result.error });
}

// GET /api/companies/[id]/contacts — 保存済み担当者一覧
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: companyId } = await params;
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.companyId, companyId), eq(contacts.tenantId, tenantId)));

  return NextResponse.json(rows);
}
