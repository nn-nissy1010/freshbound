const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface CompanyContext {
  companyName: string;
  industry?: string | null;
  employeeSize?: number | null;
  location?: string | null;
  domain?: string | null;
  contactName?: string | null;
  contactRole?: string | null;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  tokensUsed: number;
}

// ハルシネーション防止プロンプト付きでパーソナライズメールを生成する
export async function generateEmail(company: CompanyContext): Promise<GeneratedEmail> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const employeeLabel = company.employeeSize
    ? `${company.employeeSize}名規模`
    : '規模不明';

  const systemPrompt = `あなたはBtoB営業メールのプロライターです。
以下のルールを必ず守ってください：
- 提供された企業情報のみを使用する（存在しない情報を作り出さない）
- 押しつけがましくなく、読みやすい日本語で書く
- 件名は25文字以内
- 本文は200〜300文字程度
- 署名は含めない
- JSONのみを返す（他のテキストは不要）`;

  const userPrompt = `以下の企業向けにアウトバウンド営業メールを生成してください。

企業名: ${company.companyName}
業種: ${company.industry ?? '不明'}
従業員数: ${employeeLabel}
所在地: ${company.location ?? '不明'}
${company.contactName ? `担当者名: ${company.contactName}` : ''}
${company.contactRole ? `役職: ${company.contactRole}` : ''}

JSON形式で返してください：
{"subject": "件名", "body": "本文"}`;

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${res.status} — ${JSON.stringify(err)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(content) as { subject?: string; body?: string };

  return {
    subject: parsed.subject ?? '（件名なし）',
    body: parsed.body ?? '（本文なし）',
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}
