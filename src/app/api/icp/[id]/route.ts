import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { icpProfiles, users } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

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

// DELETE /api/icp/[id] — 指定したICPプロファイルを削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  await db
    .delete(icpProfiles)
    .where(and(eq(icpProfiles.id, id), eq(icpProfiles.tenantId, tenantId)));

  return NextResponse.json({ success: true });
}
