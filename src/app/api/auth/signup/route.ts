import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { tenants, users } from '@/lib/db/schema';
import { signupSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'バリデーションエラー';
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { email, password, companyName } = parsed.data;
  const supabase = await createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    const message =
      authError?.message?.includes('already been registered') ||
      authError?.message?.includes('already exists')
        ? 'このメールアドレスは既に登録されています'
        : 'アカウント作成に失敗しました';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const [tenant] = await db
      .insert(tenants)
      .values({ name: companyName, plan: 'trial', subscriptionStatus: 'active' })
      .returning();

    await db.insert(users).values({
      tenantId: tenant.id,
      authUserId: authData.user.id,
      email,
      role: 'admin',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    console.error('Signup rollback:', err);
    return NextResponse.json({ error: 'アカウント作成に失敗しました' }, { status: 500 });
  }
}
