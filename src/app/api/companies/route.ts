import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { companies, users, contacts, scores, newHpFlags, phoneNumbers } from '@/lib/db/schema';
import { eq, and, ilike, or, desc, sql, inArray } from 'drizzle-orm';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const result = await db
    .select({ tenantId: users.tenantId })
    .from(users)
    .where(eq(users.authUserId, user.id))
    .limit(1);

  return result[0]?.tenantId ?? null;
}

// GET /api/companies — 企業一覧取得（担当者・スコア・HP判定・電話番号を含む）
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '50'));
  const offset = (page - 1) * limit;

  const whereClause = search
    ? and(
        eq(companies.tenantId, tenantId),
        or(
          ilike(companies.name, `%${search}%`),
          ilike(companies.industry, `%${search}%`),
          ilike(companies.location, `%${search}%`)
        )
      )
    : eq(companies.tenantId, tenantId);

  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: companies.id,
        name: companies.name,
        domain: companies.domain,
        industry: companies.industry,
        employeeSize: companies.employeeSize,
        location: companies.location,
        createdAt: companies.createdAt,
      })
      .from(companies)
      .where(whereClause)
      .orderBy(desc(companies.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)` })
      .from(companies)
      .where(whereClause),
  ]);

  if (rows.length === 0) {
    return NextResponse.json({ data: [], total: 0, page, limit });
  }

  const ids = rows.map(r => r.id);

  // バッチで担当者・スコア・HP判定・電話番号を取得
  const [contactRows, scoreRows, hpRows, phoneRows] = await Promise.all([
    db
      .select({ companyId: contacts.companyId, email: contacts.email, name: contacts.name, role: contacts.role })
      .from(contacts)
      .where(and(eq(contacts.tenantId, tenantId), inArray(contacts.companyId, ids))),
    db
      .select({ companyId: scores.companyId, totalScore: scores.totalScore })
      .from(scores)
      .where(and(eq(scores.tenantId, tenantId), inArray(scores.companyId, ids))),
    db
      .select({ companyId: newHpFlags.companyId, isNewHp: newHpFlags.isNewHp, whoisCreatedDate: newHpFlags.whoisCreatedDate })
      .from(newHpFlags)
      .where(and(eq(newHpFlags.tenantId, tenantId), inArray(newHpFlags.companyId, ids))),
    db
      .select({ companyId: phoneNumbers.companyId, phoneNumber: phoneNumbers.phoneNumber })
      .from(phoneNumbers)
      .where(and(eq(phoneNumbers.tenantId, tenantId), inArray(phoneNumbers.companyId, ids))),
  ]);

  // companyId をキーに先頭1件だけ保持するマップを作成
  const contactMap = new Map<string, typeof contactRows[0]>();
  for (const c of contactRows) {
    if (c.companyId && !contactMap.has(c.companyId)) contactMap.set(c.companyId, c);
  }
  const scoreMap = new Map<string, typeof scoreRows[0]>();
  for (const s of scoreRows) {
    if (s.companyId && !scoreMap.has(s.companyId)) scoreMap.set(s.companyId, s);
  }
  const hpMap = new Map<string, typeof hpRows[0]>();
  for (const h of hpRows) {
    if (h.companyId && !hpMap.has(h.companyId)) hpMap.set(h.companyId, h);
  }
  const phoneMap = new Map<string, typeof phoneRows[0]>();
  for (const p of phoneRows) {
    if (p.companyId && !phoneMap.has(p.companyId)) phoneMap.set(p.companyId, p);
  }

  const enriched = rows.map(r => ({
    ...r,
    contact: contactMap.get(r.id) ?? null,
    score: scoreMap.get(r.id) ?? null,
    hp: hpMap.get(r.id) ?? null,
    phone: phoneMap.get(r.id) ?? null,
  }));

  return NextResponse.json({
    data: enriched,
    total: Number(countResult[0]?.count ?? 0),
    page,
    limit,
  });
}

// POST /api/companies — 企業を手動登録
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, domain, industry, employeeSize, location } = body;

  if (!name) return NextResponse.json({ error: '企業名は必須です' }, { status: 400 });

  const [company] = await db
    .insert(companies)
    .values({ tenantId, name, domain, industry, employeeSize, location, source: 'manual' })
    .returning();

  return NextResponse.json(company, { status: 201 });
}
