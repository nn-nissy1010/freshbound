const WHOISJSON_API_URL = 'https://whoisjsonapi.com/v1';

export interface WhoisResult {
  domain: string;
  createdDate: Date | null;
  isNewHp: boolean;       // 登録日から6ヶ月以内かどうか
  confidence: number;     // 0–100
  method: string;
  error?: string;
}

// ドメインのWHOIS情報を取得し、新規HP判定を行う
export async function checkNewHp(domain: string): Promise<WhoisResult> {
  const apiKey = process.env.WHOISJSON_API_KEY;
  if (!apiKey) {
    return { domain, createdDate: null, isNewHp: false, confidence: 0, method: 'whoisjson', error: 'WHOISJSON_API_KEY not set' };
  }

  // wwwプレフィックスを除去
  const cleanDomain = domain.replace(/^www\./, '');

  try {
    const res = await fetch(`${WHOISJSON_API_URL}/${encodeURIComponent(cleanDomain)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      return { domain: cleanDomain, createdDate: null, isNewHp: false, confidence: 0, method: 'whoisjson', error: `WhoisJSON API error: ${res.status}` };
    }

    const data = await res.json();

    // 登録日を複数フィールドから取得（APIバージョンにより異なる）
    const rawDate =
      data.creation_date ??
      data.created_date ??
      data.WhoisRecord?.createdDate ??
      null;

    if (!rawDate) {
      return { domain: cleanDomain, createdDate: null, isNewHp: false, confidence: 40, method: 'whoisjson' };
    }

    const createdDate = new Date(rawDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const isNewHp = createdDate > sixMonthsAgo;

    return {
      domain: cleanDomain,
      createdDate,
      isNewHp,
      confidence: 90,
      method: 'whoisjson',
    };
  } catch (err) {
    return {
      domain: cleanDomain,
      createdDate: null,
      isNewHp: false,
      confidence: 0,
      method: 'whoisjson',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
