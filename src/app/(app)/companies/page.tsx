'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Download, Plus, Filter, HelpCircle,
  Mail, ChevronLeft, ChevronRight, MoreVertical,
  RefreshCw, Building2, ExternalLink
} from 'lucide-react';

// C-1: メールアドレス単位の送信可否（コンタクト単位制御）
type Company = {
  id: number; name: string; url: string; industry: string; size: string; location: string;
  score: number; hpStatus: 'new' | 'existing' | 'unknown'; newAge?: string;
  contact: string; contactTitle: string;
  emails: { address: string; enabled: boolean }[];
  phone: string; lastUpdated: string;
};

const companies: Company[] = [
  {
    id: 1, name: '株式会社サンプルテック', url: 'https://sample-tech.co.jp',
    industry: 'IT・ソフトウェア', size: '101-200名', location: '東京都渋谷区',
    score: 87, hpStatus: 'new', newAge: '3ヶ月前',
    contact: '田中 太郎', contactTitle: '営業マネージャー',
    emails: [{ address: 't.tanaka@sample-tech.co.jp', enabled: true }],
    phone: '03-1234-5678', lastUpdated: '2025/05/10',
  },
  {
    id: 2, name: '株式会社イノベーションズ', url: 'https://innovations.co.jp',
    industry: 'IT・ソフトウェア', size: '51-100名', location: '大阪府大阪市',
    score: 76, hpStatus: 'new', newAge: '6ヶ月前',
    contact: '佐藤 花子', contactTitle: '営業部長',
    emails: [{ address: 'sato@innovations.co.jp', enabled: true }, { address: 'contact@innovations.co.jp', enabled: true }],
    phone: '06-9876-5432', lastUpdated: '2025/05/09',
  },
  {
    id: 3, name: '株式会社グロースパートナー', url: 'https://growth-partner.co.jp',
    industry: 'コンサルティング', size: '101-200名', location: '東京都千代田区',
    score: 72, hpStatus: 'new', newAge: '2ヶ月前',
    contact: '鈴木 一郎', contactTitle: '代表取締役',
    emails: [{ address: 'suzuki@growth-partner.jp', enabled: true }, { address: 'info@growth-partner.jp', enabled: false }],
    phone: '03-5555-1234', lastUpdated: '2025/05/09',
  },
  {
    id: 4, name: '株式会社デジタルソリューション', url: 'https://ds-solution.co.jp',
    industry: 'IT・ソフトウェア', size: '51-100名', location: '愛知県名古屋市',
    score: 68, hpStatus: 'existing',
    contact: '高橋 健', contactTitle: '営業マネージャー',
    emails: [{ address: 'takahashi@ds-solution.co.jp', enabled: true }],
    phone: '052-111-2222', lastUpdated: '2025/05/08',
  },
  {
    id: 5, name: '株式会社フューチャーリンク', url: 'https://future-link.co.jp',
    industry: 'SaaS', size: '51-100名', location: '福岡県福岡市',
    score: 65, hpStatus: 'new', newAge: '1ヶ月前',
    contact: '山本 美咲', contactTitle: 'セールス',
    emails: [{ address: 'yamamoto@future-link.co.jp', enabled: true }, { address: 'info@future-link.co.jp', enabled: true }],
    phone: '092-333-4444', lastUpdated: '2025/05/08',
  },
  {
    id: 6, name: '株式会社ビジネスブレイン', url: 'https://b-brain.co.jp',
    industry: 'コンサルティング', size: '201-300名', location: '東京都港区',
    score: 62, hpStatus: 'unknown',
    contact: '中村 翔', contactTitle: '執行役員',
    emails: [{ address: 'nakamura@b-brain.co.jp', enabled: true }, { address: 'contact@b-brain.co.jp', enabled: false }],
    phone: '03-7777-8888', lastUpdated: '2025/05/07',
  },
  {
    id: 7, name: '株式会社クラウドエッジ', url: 'https://cloud-edge.co.jp',
    industry: 'クラウドサービス', size: '51-100名', location: '神奈川県横浜市',
    score: 58, hpStatus: 'new', newAge: '5ヶ月前',
    contact: '伊藤 大輔', contactTitle: '営業部長',
    emails: [{ address: 'ito@cloud-edge.co.jp', enabled: true }, { address: 'sales@cloud-edge.co.jp', enabled: true }],
    phone: '045-666-7777', lastUpdated: '2025/05/07',
  },
  {
    id: 8, name: '株式会社アドバンスシステム', url: 'https://advance-system.co.jp',
    industry: 'IT・ソフトウェア', size: '101-200名', location: '埼玉県さいたま市',
    score: 55, hpStatus: 'unknown',
    contact: '小林 直樹', contactTitle: '代表取締役',
    emails: [{ address: 'kobayashi@advance-system.co.jp', enabled: true }],
    phone: '048-888-9999', lastUpdated: '2025/05/06',
  },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-bold text-sm" style={{ color }}>{score}</span>
    </div>
  );
}

export default function CompaniesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // C-1: メール単位の送信可否をローカル状態で管理
  const [emailEnabled, setEmailEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(
      companies.flatMap(c => c.emails.map(e => [`${c.id}:${e.address}`, e.enabled]))
    )
  );

  const toggleEmailEnabled = (companyId: number, address: string) => {
    const key = `${companyId}:${address}`;
    setEmailEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === companies.length ? [] : companies.map(c => c.id));
  };

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.emails.some(e => e.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">企業リスト</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">ICP条件に合致した企業の一覧です。リストを絞り込み、メール配信や詳細確認ができます。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />
            リストをエクスポート
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />
            企業を追加
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">検索・絞り込み</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="企業名・URL・担当者名で検索"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {[
            { label: '業種', options: ['すべて', 'IT・ソフトウェア', 'コンサルティング', 'SaaS'] },
            { label: '企業規模', options: ['すべて', '1-50名', '51-100名', '101-200名', '201-300名'] },
            { label: 'スコア', options: ['すべて', '80点以上', '60-79点', '40-59点', '39以下'] },
            { label: '新規HP', options: ['すべて', '新規', '既存', '不明'] },
          ].map((filter) => (
            <div key={filter.label} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{filter.label}</span>
              <select className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {filter.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 mt-4">
            <Filter size={13} />
            詳細フィルター
          </button>
        </div>
      </div>

      {/* ICP Tag + Count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">選択中のICP：</span>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2.5 py-0.5 font-medium">
            IT企業_成長フェーズ
          </span>
          <Link
            href="/icp"
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-0.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
          >
            変更する
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>該当件数：<strong className="text-gray-700">1,248社</strong></span>
          <button className="text-blue-600 hover:text-blue-700">条件をクリア</button>
        </div>
      </div>

      {/* Table Actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{selected.length}件選択中</span>
          {selected.length > 0 && (
            <>
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600">
                <Mail size={12} />
                メール配信
              </button>
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600">
                <Download size={12} />
                CSVエクスポート
              </button>
              <button className="flex items-center gap-1.5 text-xs border border-red-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-500">
                リストから削除
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>1-20 / 1,248件</span>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <div className="flex gap-1">
            {[1,2,3,'...',63].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
          <select className="border border-gray-200 rounded px-2 py-1 text-xs bg-white">
            <option>20件表示</option>
            <option>50件表示</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === companies.length} onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300" />
              </th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">企業名</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">業種</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">企業規模</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">所在地</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">スコア ↓</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">新規HP</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">担当者</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">メールアドレス</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">電話番号</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">最終更新日</th>
              <th className="w-10 px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((company) => (
              <tr key={company.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(company.id) ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(company.id)} onChange={() => toggleSelect(company.id)}
                    className="w-4 h-4 rounded border-gray-300" />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={13} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{company.name}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <ExternalLink size={10} />
                        {company.url}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{company.industry}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{company.size}</td>
                <td className="px-3 py-3 text-sm text-gray-600">{company.location}</td>
                <td className="px-3 py-3"><ScoreBadge score={company.score} /></td>
                <td className="px-3 py-3">
                  {company.hpStatus === 'new' ? (
                    <div>
                      <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">新規</span>
                      <div className="text-xs text-gray-400 mt-0.5">（{company.newAge}）</div>
                    </div>
                  ) : company.hpStatus === 'existing' ? (
                    <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">既存</span>
                  ) : (
                    <span className="inline-block bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs px-2 py-0.5 rounded-full" title="WHOIS非公開等により登録日が取得できませんでした">不明</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <div className="text-sm text-gray-700">{company.contact}</div>
                  <div className="text-xs text-gray-400">{company.contactTitle}</div>
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    {company.emails.map((e) => {
                      const key = `${company.id}:${e.address}`;
                      const on = emailEnabled[key] ?? e.enabled;
                      return (
                        <div key={e.address} className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleEmailEnabled(company.id, e.address)}
                            title={on ? '送信ON（クリックで無効化）' : '送信OFF（クリックで有効化）'}
                            style={{ backgroundColor: on ? '#3b82f6' : '#d1d5db' }}
                            className="relative w-7 h-4 rounded-full flex-shrink-0 transition-colors"
                          >
                            <span
                              className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform"
                              style={{ transform: on ? 'translateX(0px)' : 'translateX(-12px)' }}
                            />
                          </button>
                          <span className={`text-xs truncate max-w-[140px] ${on ? 'text-gray-600' : 'text-gray-400 line-through'}`}>{e.address}</span>
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">{company.phone}</td>
                <td className="px-3 py-3 text-xs text-gray-400">{company.lastUpdated}</td>
                <td className="px-3 py-3">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span>スコアの目安：</span>
        {[
          { color: '#10b981', label: '80以上' },
          { color: '#3b82f6', label: '60-79' },
          { color: '#f59e0b', label: '40-59' },
          { color: '#ef4444', label: '39以下' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1 text-gray-400">
          <span>データの最終更新：2025/05/10 10:30</span>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-2">
            <RefreshCw size={12} />
            更新
          </button>
        </div>
      </div>
    </div>
  );
}
