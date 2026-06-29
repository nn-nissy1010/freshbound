import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, tenants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await db
    .select({
      email: users.email,
      role: users.role,
      tenantName: tenants.name,
      tenantPlan: tenants.plan,
      tenantId: tenants.id,
    })
    .from(users)
    .innerJoin(tenants, eq(users.tenantId, tenants.id))
    .where(eq(users.authUserId, user.id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
