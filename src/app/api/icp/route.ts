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

// GET /api/icp — テナントの全ICPプロファイルを返す
export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const profiles = await db
    .select()
    .from(icpProfiles)
    .where(eq(icpProfiles.tenantId, tenantId))
    .orderBy(icpProfiles.createdAt);

  return NextResponse.json(profiles);
}

// POST /api/icp — id あり→更新、id なし→新規作成
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as {
    id?: string;
    name?: string;
    industries?: string[];
    employeeSizeMin?: number | null;
    employeeSizeMax?: number | null;
    regions?: string[];
    budgetRange?: string;
    searchParams?: Record<string, unknown>;
  };

  const values = {
    tenantId,
    name: body.name || 'デフォルトICP',
    industryCodes: body.industries ?? [],
    employeeSizeMin: body.employeeSizeMin ?? null,
    employeeSizeMax: body.employeeSizeMax ?? null,
    regionCodes: body.regions ?? [],
    budgetRange: body.budgetRange ?? null,
    searchParams: body.searchParams ?? {},
    updatedAt: new Date(),
  };

  let profile;
  if (body.id) {
    [profile] = await db
      .update(icpProfiles)
      .set(values)
      .where(and(eq(icpProfiles.id, body.id), eq(icpProfiles.tenantId, tenantId)))
      .returning();
  } else {
    [profile] = await db
      .insert(icpProfiles)
      .values(values)
      .returning();
  }

  return NextResponse.json(profile);
}
