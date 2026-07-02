'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Download, Plus, Filter, HelpCircle,
  Mail, ChevronLeft, ChevronRight, MoreVertical,
  RefreshCw, Building2, ExternalLink, Target, X, Check,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/lib/toast';

// ─── ICP types ───────────────────────────────────────────────────────────────

type IcpProfile = {
  id: string;
  name: string;
  industryCodes: string[] | null;
  employeeSizeMin: number | null;
  employeeSizeMax: number | null;
  regionCodes: string[] | null;
  budgetRange: string | null;
  searchParams: {
    keywords?: string;
    excludeKeywords?: string;
    revenueMin?: string;
    revenueMax?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

function icpSummary(icp: IcpProfile): string {
  const parts: string[] = [];
  if (icp.industryCodes?.length) parts.push(icp.industryCodes.slice(0, 2).join('・'));
  if (icp.regionCodes?.length) parts.push(icp.regionCodes.slice(0, 2).join('・'));
  if (icp.employeeSizeMin || icp.employeeSizeMax) {
    parts.push(`${icp.employeeSizeMin ?? ''}〜${icp.employeeSizeMax ?? ''}名`);
  }
  return parts.join(' · ') || '条件未設定';
}

// ─── Company types ────────────────────────────────────────────────────────────

type Company = {
  id: string; name: string; url: string; industry: string; size: string; location: string;
  score: number; hpStatus: 'new' | 'existing' | 'unknown'; newAge?: string;
  contact: string; contactTitle: string;
  emails: { address: string; enabled: boolean }[];
  phone: string; lastUpdated: string;
};

type ApiCompany = {
  id: string; name: string; domain: string | null; industry: string | null;
  employeeSize: number | null; location: string | null; createdAt: string;
  contact: { email: string | null; name: string | null; role: string | null } | null;
  score: { totalScore: number | null } | null;
  hp: { isNewHp: boolean | null; whoisCreatedDate: string | null } | null;
  phone: { phoneNumber: string | null } | null;
};

function mapApiCompany(r: ApiCompany): Company {
  const hpStatus: 'new' | 'existing' | 'unknown' =
    r.hp?.isNewHp === true ? 'new' :
    r.hp?.isNewHp === false ? 'existing' : 'unknown';

  let newAge: string | undefined;
  if (hpStatus === 'new' && r.hp?.whoisCreatedDate) {
    const months = Math.floor(
      (new Date().getTime() - new Date(r.hp.whoisCreatedDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    newAge = `${months}ヶ月前`;
  }

  return {
    id: r.id,
    name: r.name,
    url: r.domain ? `https://${r.domain}` : '',
    industry: r.industry ?? '',
    size: r.employeeSize ? `${r.employeeSize}名` : '',
    location: r.location ?? '',
    score: r.score?.totalScore ?? 0,
    hpStatus,
    newAge,
    contact: r.contact?.name ?? '',
    contactTitle: r.contact?.role ?? '',
    emails: r.contact?.email ? [{ address: r.contact.email, enabled: true }] : [],
    phone: r.phone?.phoneNumber ?? '',
    lastUpdated: r.createdAt ? new Date(r.createdAt).toLocaleDateString('ja-JP') : '',
  };
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-bold text-sm" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'discover'>('list');
  const [generating, setGenerating] = useState(false);

  // Company list state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailEnabled, setEmailEnabled] = useState<Record<string, boolean>>({});

  // ICP state — loaded from DB
  const [icpList, setIcpList] = useState<IcpProfile[]>([]);
  const [selectedIcp, setSelectedIcp] = useState<IcpProfile | null>(null);
  const [pendingIcp, setPendingIcp] = useState<IcpProfile | null>(null);
  const [discoverIcp, setDiscoverIcp] = useState<IcpProfile | null>(null);
  const [showIcpModal, setShowIcpModal] = useState(false);

  // Fetch ICPs from DB
  useEffect(() => {
    const fetchIcps = async () => {
      try {
        const res = await fetch('/api/icp');
        if (!res.ok) return;
        const data = await res.json() as IcpProfile[];
        setIcpList(data);
        if (data.length > 0) {
          setSelectedIcp(data[0]);
          setPendingIcp(data[0]);
          setDiscoverIcp(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchIcps();
  }, []);

  // Fetch companies
  useEffect(() => {
    const controller = new AbortController();
    const fetchCompanies = async () => {
      try {
        const params = new URLSearchParams({ page: '1', limit: '50' });
        if (searchQuery) params.set('search', searchQuery);
        const res = await fetch(`/api/companies?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json() as { data: ApiCompany[]; total: number };
        const mapped = (data.data ?? []).map(mapApiCompany);
        setCompanies(mapped);
        setTotal(data.total ?? 0);
        setEmailEnabled(prev => {
          const next = { ...prev };
          for (const c of mapped) {
            for (const e of c.emails) {
              const key = `${c.id}:${e.address}`;
              if (!(key in next)) next[key] = e.enabled;
            }
          }
          return next;
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error(err);
      }
    };
    fetchCompanies();
    return () => controller.abort();
  }, [searchQuery]);

  const toggleEmailEnabled = (companyId: string, address: string) => {
    const key = `${companyId}:${address}`;
    setEmailEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === companies.length ? [] : companies.map(c => c.id));
  };

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    try {
      const res = await fetch('/api/companies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyIds: selected }),
      });
      if (!res.ok) throw new Error('削除に失敗しました');
      setCompanies(prev => prev.filter(c => !selected.includes(c.id)));
      setTotal(prev => prev - selected.length);
      setSelected([]);
      toast(`${selected.length}件の企業をリストから削除しました`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : '削除に失敗しました', 'error');
    }
  };

  const generateEmails = async () => {
    if (selected.length === 0 || generating) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/emails/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyIds: selected }),
      });
      const data = await res.json() as { results?: { error?: string }[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? '生成に失敗しました');
      const succeeded = data.results?.filter(r => !r.error).length ?? 0;
      const failed = data.results?.filter(r => r.error).length ?? 0;
      toast(
        `${succeeded}件のメールを生成しました${failed > 0 ? `（${failed}件失敗）` : ''}`,
        succeeded > 0 ? 'success' : 'error'
      );
      setSelected([]);
      if (succeeded > 0) router.push('/delivery-history');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'メール生成に失敗しました', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">企業リスト</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">ICP条件に合致した企業の一覧です。リストを絞り込み、メール配信や詳細確認ができます。</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm mb-5 w-fit">
        {([
          { id: 'list' as const, label: '企業リスト' },
          { id: 'discover' as const, label: '企業発掘' },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 企業リスト tab ──────────────────────────────────────────────────── */}
      {activeTab === 'list' && (<>
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">検索・絞り込み</h3>
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1 flex-1 min-w-48 max-w-xs">
              <span className="text-xs text-transparent select-none">検索</span>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="企業名・URL・担当者名で検索"
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-transparent select-none">ICP</span>
              <button
                onClick={() => { setPendingIcp(selectedIcp); setShowIcpModal(true); }}
                className="flex items-center gap-2 text-sm border border-blue-200 bg-blue-50 text-blue-700 rounded-lg px-3 py-1.5 hover:bg-blue-100 font-medium whitespace-nowrap"
              >
                <Target size={14} />
                ICP：{selectedIcp?.name ?? '未設定'}
              </button>
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
            <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50">
              <Filter size={13} />
              詳細フィルター
            </button>
          </div>
        </div>

        {/* Count row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">該当件数：<strong className="text-gray-700">{total.toLocaleString()}社</strong></span>
          <button className="text-xs text-blue-600 hover:text-blue-700">条件をクリア</button>
        </div>

        {/* ICP Select Modal */}
        {showIcpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowIcpModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-800">ICPを選択</h2>
                <button onClick={() => setShowIcpModal(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <X size={16} />
                </button>
              </div>
              {icpList.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-400">
                  ICPが設定されていません。
                  <Link href="/icp" className="text-blue-600 hover:underline ml-1">ICP設定へ</Link>
                </div>
              ) : (
                <div className="space-y-2 mb-5">
                  {icpList.map((icp) => (
                    <button
                      key={icp.id}
                      onClick={() => setPendingIcp(icp)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                        pendingIcp?.id === icp.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{icp.name}</span>
                        {pendingIcp?.id === icp.id && <Check size={15} className="text-blue-600" />}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{icpSummary(icp)}</div>
                      <div className="text-xs text-gray-300 mt-0.5">更新：{new Date(icp.updatedAt).toLocaleDateString('ja-JP')}</div>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowIcpModal(false)}
                  className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => { setSelectedIcp(pendingIcp); setShowIcpModal(false); }}
                  className="text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  このICPを適用
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{selected.length}件選択中</span>
            {selected.length > 0 && (
              <>
                <button
                  onClick={generateEmails}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                >
                  <Mail size={12} />
                  {generating ? 'AI生成中...' : 'AIメール生成'}
                </button>
                <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600">
                  <Download size={12} />
                  CSVエクスポート
                </button>
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-1.5 text-xs border border-red-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-500">
                  リストから削除
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>1-{companies.length} / {total.toLocaleString()}件</span>
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
            <div className="hidden sm:flex gap-1">
              {[1,2,3,'...',Math.max(1, Math.ceil(total / 50))].map((p, i) => (
                <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                  {p}
                </button>
              ))}
            </div>
            <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
            <select className="hidden sm:block border border-gray-200 rounded px-2 py-1 text-xs bg-white">
              <option>50件表示</option>
              <option>20件表示</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.length === companies.length && companies.length > 0} onChange={toggleAll}
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
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-sm text-gray-400">
                    企業データがありません。CSVを取り込むか、企業を追加してください。
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
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
                ))
              )}
            </tbody>
          </table>
          </div>
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
            <span>データの最終更新：{new Date().toLocaleDateString('ja-JP')}</span>
            <button
              onClick={() => setSearchQuery(q => q)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-2"
            >
              <RefreshCw size={12} />
              更新
            </button>
          </div>
        </div>
      </>)}

      {/* ── 企業発掘 tab ────────────────────────────────────────────────────── */}
      {activeTab === 'discover' && (
        <div className="space-y-5">
          {/* ICP selection — compact, matches filter bar style */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">使用するICP：</span>
              {icpList.length === 0 ? (
                <Link href="/icp" className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 hover:bg-blue-100 font-medium">
                  <Plus size={13} />
                  ICPを作成する
                </Link>
              ) : (
                <select
                  value={discoverIcp?.id ?? ''}
                  onChange={(e) => setDiscoverIcp(icpList.find(i => i.id === e.target.value) ?? null)}
                  className="flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {icpList.map(icp => (
                    <option key={icp.id} value={icp.id}>{icp.name}</option>
                  ))}
                </select>
              )}
              <Link href="/icp" className="text-xs text-gray-400 hover:text-blue-600 hover:underline ml-auto">
                ICP設定を編集 →
              </Link>
            </div>
          </div>

          {/* Selected ICP preview */}
          {discoverIcp && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-3">選択中のICP：{discoverIcp.name}</h2>
              <div className="flex flex-wrap gap-2">
                {discoverIcp.industryCodes?.map(i => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">業種：{i}</span>
                ))}
                {discoverIcp.regionCodes?.map(r => (
                  <span key={r} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">地域：{r}</span>
                ))}
                {(discoverIcp.employeeSizeMin || discoverIcp.employeeSizeMax) && (
                  <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-3 py-1">
                    従業員：{discoverIcp.employeeSizeMin ?? ''}〜{discoverIcp.employeeSizeMax ?? ''}名
                  </span>
                )}
                {discoverIcp.budgetRange && (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1">
                    予算：{discoverIcp.budgetRange}
                  </span>
                )}
                {discoverIcp.searchParams?.keywords && (
                  <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-3 py-1">
                    キーワード：{discoverIcp.searchParams.keywords}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* musubu search placeholder */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-gray-800">musubu 自動検索</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  選択したICPに基づいてmusubuで企業を自動検索し、リストに追加します（1日1回）
                </p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-1 font-medium flex-shrink-0 ml-4">
                連携準備中
              </span>
            </div>
            <button
              disabled
              className="flex items-center gap-2 text-sm rounded-lg px-4 py-2.5 text-white font-medium opacity-40 cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
            >
              <Search size={14} />
              musubu 検索を実行する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
