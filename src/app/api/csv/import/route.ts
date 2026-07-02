import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, companies, csvImports } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function getTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const result = await db.select({ tenantId: users.tenantId }).from(users).where(eq(users.authUserId, user.id)).limit(1);
  return result[0]?.tenantId ?? null;
}

// CSVテキストを行×列の配列にパース（ダブルクォート対応）
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let inQuotes = false;
    let current = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    rows.push(cells);
  }
  return rows;
}

// ヘッダーから企業フィールドへのマッピングを推定
function detectMapping(headers: string[]): Record<string, number> {
  const mapping: Record<string, number> = {};
  const patterns: Record<string, RegExp> = {
    name:         /会社名|企業名|company.*name|name/i,
    domain:       /ドメイン|domain|url|website|hp/i,
    industry:     /業種|業界|industry|sector/i,
    employeeSize: /従業員|社員|employee|staff|人数/i,
    location:     /所在地|住所|都道府県|address|location|prefecture/i,
    corporationNumber: /法人番号|corporation/i,
  };

  headers.forEach((header, index) => {
    for (const [field, pattern] of Object.entries(patterns)) {
      if (pattern.test(header) && !(field in mapping)) {
        mapping[field] = index;
      }
    }
  });

  return mapping;
}

// POST /api/csv/import — CSVファイルを受け取り企業データを一括登録
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) return NextResponse.json({ error: 'ファイルが見つかりません' }, { status: 400 });

  // バリデーション
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'ファイルサイズは10MB以内にしてください' }, { status: 400 });
  }
  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    return NextResponse.json({ error: 'CSVファイルのみ対応しています' }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return NextResponse.json({ error: 'データが空またはヘッダーのみです' }, { status: 400 });
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);
  const mapping = detectMapping(headers);

  if (!('name' in mapping)) {
    return NextResponse.json({
      error: '会社名の列が見つかりませんでした。CSVに「会社名」または「企業名」列を含めてください',
    }, { status: 400 });
  }

  // CSVインポートの記録を作成
  const [importRecord] = await db
    .insert(csvImports)
    .values({
      tenantId,
      fileName: file.name,
      totalRows: dataRows.length,
      successRows: 0,
      failedRows: 0,
      duplicateRows: 0,
      status: 'processing',
      mapping,
    })
    .returning();

  let successRows = 0;
  let failedRows = 0;
  let duplicateRows = 0;

  for (const row of dataRows) {
    const name = row[mapping.name]?.trim();
    if (!name) { failedRows++; continue; }

    const domain = mapping.domain !== undefined ? row[mapping.domain]?.trim() || null : null;
    const industry = mapping.industry !== undefined ? row[mapping.industry]?.trim() || null : null;
    const location = mapping.location !== undefined ? row[mapping.location]?.trim() || null : null;
    const corporationNumber = mapping.corporationNumber !== undefined ? row[mapping.corporationNumber]?.trim() || null : null;

    const rawSize = mapping.employeeSize !== undefined ? row[mapping.employeeSize] : undefined;
    const employeeSize = rawSize ? parseInt(rawSize.replace(/[^0-9]/g, '')) || null : null;

    try {
      // ドメインが既存なら重複とみなす
      if (domain) {
        const existing = await db
          .select({ id: companies.id })
          .from(companies)
          .where(and(eq(companies.tenantId, tenantId), eq(companies.domain, domain)))
          .limit(1);

        if (existing.length > 0) { duplicateRows++; continue; }
      }

      await db.insert(companies).values({
        tenantId,
        name,
        domain,
        industry,
        employeeSize,
        location,
        corporationNumber,
        source: 'csv',
      });

      successRows++;
    } catch {
      failedRows++;
    }
  }

  // インポート記録を更新
  await db
    .update(csvImports)
    .set({ successRows, failedRows, duplicateRows, status: 'completed' })
    .where(eq(csvImports.id, importRecord.id));

  return NextResponse.json({
    importId: importRecord.id,
    totalRows: dataRows.length,
    successRows,
    failedRows,
    duplicateRows,
    status: 'completed',
  });
}

// GET /api/csv/import — インポート履歴一覧
export async function GET() {
  const tenantId = await getTenantId();
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await db
    .select()
    .from(csvImports)
    .where(eq(csvImports.tenantId, tenantId))
    .orderBy(csvImports.createdAt);

  return NextResponse.json(history);
}
