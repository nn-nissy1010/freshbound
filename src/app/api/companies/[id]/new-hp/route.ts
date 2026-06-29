import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, companies, newHpFlags } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { checkNewHp } from '@/lib/whoisjson';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const result = await db.select({ tenantId: users.tenantId }).from(users).where(eq(users.authUserId, user.id)).limit(1);
  return result[0]?.tenantId ?? null;
}

// POST /api/companies/[id]/new-hp — WhoisJSONで新規HP判定・保存
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: companyId } = await params;
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [company] = await db
    .select({ id: companies.id, domain: companies.domain })
    .from(companies)
    .where(and(eq(companies.id, companyId), eq(companies.tenantId, tenantId)))
    .limit(1);

  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  if (!company.domain) return NextResponse.json({ error: 'ドメインが登録されていません' }, { status: 400 });

  const result = await checkNewHp(company.domain);

  // 既存レコードがあれば更新、なければ挿入
  const existing = await db
    .select({ id: newHpFlags.id })
    .from(newHpFlags)
    .where(and(eq(newHpFlags.companyId, companyId), eq(newHpFlags.tenantId, tenantId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(newHpFlags)
      .set({
        isNewHp: result.isNewHp,
        whoisCreatedDate: result.createdDate ? result.createdDate.toISOString().split('T')[0] : null,
        confidence: String(result.confidence),
        method: result.method,
        status: result.error ? 'error' : 'checked',
      })
      .where(eq(newHpFlags.id, existing[0].id));
  } else {
    await db.insert(newHpFlags).values({
      tenantId,
      companyId,
      domain: result.domain,
      isNewHp: result.isNewHp,
      whoisCreatedDate: result.createdDate ? result.createdDate.toISOString().split('T')[0] : null,
      confidence: String(result.confidence),
      method: result.method,
      status: result.error ? 'error' : 'checked',
    });
  }

  return NextResponse.json({
    isNewHp: result.isNewHp,
    createdDate: result.createdDate,
    confidence: result.confidence,
    error: result.error,
  });
}
