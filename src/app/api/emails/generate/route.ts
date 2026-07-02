import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, companies, contacts, generatedEmails, generatedEmailRecipients } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { generateEmail } from '@/lib/openai';
import { z } from 'zod';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const result = await db.select({ tenantId: users.tenantId }).from(users).where(eq(users.authUserId, user.id)).limit(1);
  return result[0]?.tenantId ?? null;
}

const bodySchema = z.object({
  // 単一企業 または 複数企業IDを指定
  companyIds: z.array(z.string().uuid()).min(1).max(50),
});

// POST /api/emails/generate — 指定企業のパーソナライズメールをOpenAIで生成
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { companyIds } = parsed.data;

  // 対象企業をDBから取得（テナント確認込み）
  const targetCompanies = await db
    .select()
    .from(companies)
    .where(and(eq(companies.tenantId, tenantId), inArray(companies.id, companyIds)));

  if (targetCompanies.length === 0) {
    return NextResponse.json({ error: 'No companies found' }, { status: 404 });
  }

  const results = [];

  for (const company of targetCompanies) {
    // 担当者情報を取得（存在すれば使用）
    const [contact] = await db
      .select({ name: contacts.name, role: contacts.role, email: contacts.email })
      .from(contacts)
      .where(and(eq(contacts.companyId, company.id), eq(contacts.tenantId, tenantId)))
      .limit(1);

    try {
      const generated = await generateEmail({
        companyName: company.name,
        industry: company.industry,
        employeeSize: company.employeeSize,
        location: company.location,
        domain: company.domain,
        contactName: contact?.name,
        contactRole: contact?.role,
      });

      // generated_emails テーブルに保存
      const [emailRecord] = await db
        .insert(generatedEmails)
        .values({
          tenantId,
          subject: generated.subject,
          body: generated.body,
          model: 'gpt-4o-mini',
          tokens: generated.tokensUsed,
          status: 'draft',
          emailType: 'outbound',
        })
        .returning();

      // 宛先レコードを保存
      const recipientEmail = contact?.email ?? (company.domain ? `info@${company.domain}` : null);
      if (recipientEmail) {
        await db.insert(generatedEmailRecipients).values({
          tenantId,
          generatedEmailId: emailRecord.id,
          companyId: company.id,
          contactId: contact ? undefined : undefined,
          recipientEmail,
          recipientName: contact?.name ?? undefined,
          status: 'created',
        });
      }

      results.push({
        companyId: company.id,
        companyName: company.name,
        emailId: emailRecord.id,
        subject: generated.subject,
        body: generated.body,
        tokensUsed: generated.tokensUsed,
        recipientEmail,
      });
    } catch (err) {
      results.push({
        companyId: company.id,
        companyName: company.name,
        error: err instanceof Error ? err.message : 'Generation failed',
      });
    }
  }

  return NextResponse.json({ results });
}

// GET /api/emails/generate — ドラフト一覧取得（企業名含む）
export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const drafts = await db
    .select({
      id: generatedEmails.id,
      subject: generatedEmails.subject,
      body: generatedEmails.body,
      status: generatedEmails.status,
      createdAt: generatedEmails.createdAt,
      recipientEmail: generatedEmailRecipients.recipientEmail,
      recipientName: generatedEmailRecipients.recipientName,
      companyId: generatedEmailRecipients.companyId,
      companyName: companies.name,
    })
    .from(generatedEmails)
    .leftJoin(generatedEmailRecipients, eq(generatedEmails.id, generatedEmailRecipients.generatedEmailId))
    .leftJoin(companies, eq(generatedEmailRecipients.companyId, companies.id))
    .where(eq(generatedEmails.tenantId, tenantId))
    .orderBy(generatedEmails.createdAt);

  return NextResponse.json(drafts);
}
