import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, generatedEmails, generatedEmailRecipients, queueEmails } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const result = await db.select({ tenantId: users.tenantId }).from(users).where(eq(users.authUserId, user.id)).limit(1);
  return result[0]?.tenantId ?? null;
}

const patchSchema = z.union([
  z.object({ action: z.enum(['approve', 'reject']) }),
  z.object({ subject: z.string(), body: z.string() }),
]);

// PATCH /api/emails/[id] — approve/reject or update subject+body
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const [email] = await db
    .select()
    .from(generatedEmails)
    .where(and(eq(generatedEmails.id, id), eq(generatedEmails.tenantId, tenantId)))
    .limit(1);

  if (!email) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data = parsed.data;

  if ('action' in data) {
    if (data.action === 'approve') {
      await db.update(generatedEmails)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(eq(generatedEmails.id, id));

      const recipients = await db
        .select()
        .from(generatedEmailRecipients)
        .where(eq(generatedEmailRecipients.generatedEmailId, id));

      const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? null;

      for (const r of recipients) {
        await db.update(generatedEmailRecipients)
          .set({ status: 'approved', updatedAt: new Date() })
          .where(eq(generatedEmailRecipients.id, r.id));

        await db.insert(queueEmails).values({
          tenantId,
          generatedEmailId: id,
          generatedEmailRecipientId: r.id,
          toEmail: r.recipientEmail,
          fromEmail,
          subject: email.subject,
          body: email.body,
          status: 'queued',
        });
      }

      return NextResponse.json({ ok: true, queued: recipients.length });
    } else {
      await db.update(generatedEmails)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(eq(generatedEmails.id, id));
      await db.update(generatedEmailRecipients)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(eq(generatedEmailRecipients.generatedEmailId, id));
      return NextResponse.json({ ok: true });
    }
  } else {
    // Update subject and body
    await db.update(generatedEmails)
      .set({ subject: data.subject, body: data.body, updatedAt: new Date() })
      .where(eq(generatedEmails.id, id));
    return NextResponse.json({ ok: true });
  }
}
