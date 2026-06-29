const PROSPEO_API_URL = 'https://api.prospeo.io/domain-search';

export interface ProspeoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  confidence: number; // 0–100
}

export interface ProspeoResult {
  contacts: ProspeoContact[];
  error?: string;
}

// ドメインからメールアドレスを最大3件取得する
export async function findContactsByDomain(domain: string): Promise<ProspeoResult> {
  const apiKey = process.env.PROSPEO_API_KEY;
  if (!apiKey) return { contacts: [], error: 'PROSPEO_API_KEY not set' };

  try {
    const res = await fetch(PROSPEO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KEY': apiKey,
      },
      body: JSON.stringify({ company: domain, limit: 3 }),
    });

    if (!res.ok) {
      return { contacts: [], error: `Prospeo API error: ${res.status}` };
    }

    const data = await res.json();

    // Prospeo のレスポンス構造に合わせてマッピング
    const emailList: ProspeoContact[] = (data.response?.email_list ?? []).map(
      (item: Record<string, unknown>) => ({
        email: String(item.email ?? ''),
        firstName: item.first_name ? String(item.first_name) : undefined,
        lastName: item.last_name ? String(item.last_name) : undefined,
        position: item.position ? String(item.position) : undefined,
        confidence: typeof item.email_confidence === 'number' ? item.email_confidence : 80,
      })
    );

    return { contacts: emailList.slice(0, 3) };
  } catch (err) {
    return { contacts: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// 担当者が見つからない場合のフォールバックメールアドレス
export function buildFallbackContacts(domain: string): ProspeoContact[] {
  return [
    { email: `info@${domain}`, confidence: 30 },
    { email: `contact@${domain}`, confidence: 20 },
  ];
}
