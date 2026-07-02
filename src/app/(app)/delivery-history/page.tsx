'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/lib/toast';
import {
  Search, Download, Plus, HelpCircle, Calendar,
  Filter, ChevronLeft, ChevronRight, Trash2, Eye,
  X, Check, Send, Users, AlertCircle
} from 'lucide-react';

// B-1: シナリオ配信（F-10 ステップメール）はPhase 2。MVP時点は一斉配信のみ
const deliveries = [
  {
    id: 1, date: '2025/05/10 10:00', subject: '新サービスのご案内', scenario: '新規開拓（初回）',
    type: '一斉配信', sent: 1245, delivered: 1102, deliveryRate: '88.5%',
    opened: 276, openRate: '22.3%', replied: 28, replyRate: '2.3%',
    stopped: 5, stopRate: '0.4%', status: '配信完了',
  },
  {
    id: 2, date: '2025/05/08 10:00', subject: '【ご提案】課題解決のヒント', scenario: '新規開拓（2通目）',
    type: '一斉配信', sent: 1102, delivered: 974, deliveryRate: '88.4%',
    opened: 211, openRate: '21.7%', replied: 19, replyRate: '1.9%',
    stopped: 4, stopRate: '0.4%', status: '配信完了',
  },
  {
    id: 3, date: '2025/05/06 10:00', subject: '事例のご紹介', scenario: '新規開拓（再送）',
    type: '一斉配信', sent: 856, delivered: 760, deliveryRate: '88.8%',
    opened: 146, openRate: '19.2%', replied: 12, replyRate: '1.6%',
    stopped: 3, stopRate: '0.4%', status: '配信完了',
  },
  {
    id: 4, date: '2025/05/04 10:00', subject: 'サービス資料送付のご案内', scenario: '新規開拓（フォロー）',
    type: '一斉配信', sent: 642, delivered: 567, deliveryRate: '88.3%',
    opened: 98, openRate: '17.3%', replied: 7, replyRate: '1.2%',
    stopped: 2, stopRate: '0.3%', status: '配信完了',
  },
  {
    id: 5, date: '2025/05/02 10:00', subject: '新サービスのご案内', scenario: '新規開拓（初回）',
    type: '一斉配信', sent: 1389, delivered: 1214, deliveryRate: '87.4%',
    opened: 255, openRate: '20.0%', replied: 24, replyRate: '2.0%',
    stopped: 6, stopRate: '0.4%', status: '配信完了',
  },
  {
    id: 6, date: '2025/04/30 10:00', subject: '【ご提案】課題解決のヒント', scenario: '新規開拓（2通目）',
    type: '一斉配信', sent: 1214, delivered: 1062, deliveryRate: '87.5%',
    opened: 223, openRate: '21.0%', replied: 18, replyRate: '1.7%',
    stopped: 4, stopRate: '0.4%', status: '配信完了',
  },
  {
    id: 7, date: '2025/04/28 10:00', subject: '事例のご紹介', scenario: '新規開拓（再送）',
    type: '一斉配信', sent: 923, delivered: 815, deliveryRate: '88.3%',
    opened: 153, openRate: '18.8%', replied: 11, replyRate: '1.3%',
    stopped: 3, stopRate: '0.3%', status: '配信完了',
  },
];


type DraftEmail = {
  id: string; company: string; contact: string; contactTitle: string;
  subject: string; body: string; generatedAt: string; score: number;
};

type ApiDraft = {
  id: string; subject: string | null; body: string | null; status: string | null;
  createdAt: string; recipientEmail: string; recipientName: string | null;
  companyId: string; companyName: string | null;
};

function mapApiDraft(r: ApiDraft): DraftEmail {
  return {
    id: r.id,
    company: r.companyName ?? '',
    contact: r.recipientName ?? r.recipientEmail ?? '',
    contactTitle: '',
    subject: r.subject ?? '',
    body: r.body ?? '',
    generatedAt: r.createdAt ? new Date(r.createdAt).toLocaleString('ja-JP') : '',
    score: 0,
  };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    '配信完了': { bg: '#dcfce7', text: '#16a34a' },
    '配信中': { bg: '#dbeafe', text: '#2563eb' },
    '配信予約': { bg: '#fef9c3', text: '#ca8a04' },
    'エラー': { bg: '#fee2e2', text: '#dc2626' },
  };
  const c = colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
      {type}
    </span>
  );
}

export default function DeliveryHistoryPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [sendMode, setSendMode] = useState<'review' | 'auto'>('review');
  const [activeTab, setActiveTab] = useState<'sent' | 'draft'>('sent');
  const [draftPreview, setDraftPreview] = useState<DraftEmail | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [approvedDrafts, setApprovedDrafts] = useState<string[]>([]);
  const [rejectedDrafts, setRejectedDrafts] = useState<string[]>([]);
  const [draftEmails, setDraftEmails] = useState<DraftEmail[]>([]);
  const { toast } = useToast();

  const approveDraft = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (!res.ok) throw new Error('Failed');
      setApprovedDrafts(prev => [...prev, id]);
      toast('メールを配信キューに追加しました', 'success');
    } catch {
      toast('承認に失敗しました', 'error');
    }
  }, [toast]);

  const rejectDraft = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/emails/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      if (!res.ok) throw new Error('Failed');
      setRejectedDrafts(prev => [...prev, id]);
      toast('メールを却下しました', 'info');
    } catch {
      toast('却下に失敗しました', 'error');
    }
  }, [toast]);

  const approveAll = useCallback(async () => {
    const pending = draftEmails.filter(d => !approvedDrafts.includes(d.id) && !rejectedDrafts.includes(d.id));
    let succeeded = 0;
    for (const draft of pending) {
      try {
        const res = await fetch(`/api/emails/${draft.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approve' }),
        });
        if (res.ok) { setApprovedDrafts(prev => [...prev, draft.id]); succeeded++; }
      } catch { /* continue */ }
    }
    toast(`${succeeded}件のメールを配信キューに追加しました`, 'success');
  }, [draftEmails, approvedDrafts, rejectedDrafts, toast]);

  useEffect(() => {
    if (draftPreview) {
      setEditSubject(draftPreview.subject);
      setEditBody(draftPreview.body);
    }
  }, [draftPreview]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetch('/api/emails/generate');
        if (res.ok) {
          const data = await res.json() as ApiDraft[];
          setDraftEmails(data.map(mapApiDraft));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDrafts();
  }, []);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === deliveries.length ? [] : deliveries.map(d => d.id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">配信履歴</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">メール配信の履歴と反応状況を確認できます。</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />
            レポートをエクスポート
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button
            onClick={() => { setShowNewModal(true); setModalStep(1); setSendMode('review'); }}
            className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />
            新規配信
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm mb-4 w-fit">
        {([
          { id: 'sent' as const, label: '配信済み', count: 0 },
          { id: 'draft' as const, label: '下書き（レビュー待ち）', count: draftEmails.filter(d => !approvedDrafts.includes(d.id) && !rejectedDrafts.includes(d.id)).length },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-500' : 'bg-red-100 text-red-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'sent' && (<>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="件名・シナリオ名・送信先で検索"
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
            <Calendar size={14} />
            <span>期間を選択</span>
          </div>
          {[
            { label: 'ステータス', options: ['すべて', '配信完了', '配信中', '配信予約', 'エラー'] },
            { label: '種別', options: ['すべて', '一斉配信'] },
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {[
          { label: '配信総数', value: '12,450', unit: '通', sub: '前月比 +15.2%', color: '#3b82f6', up: true },
          { label: '到達数', value: '10,862', unit: '通', sub: '到達率 87.3%', color: '#10b981' },
          { label: '開封数', value: '2,174', unit: '通', sub: '開封率 20.0%', color: '#8b5cf6' },
          { label: '返信数', value: '187', unit: '通', sub: '返信率 1.7%', color: '#f59e0b' },
          { label: '配信停止数', value: '32', unit: '通', sub: '停止率 0.3%', color: '#ef4444' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-xs text-gray-500">{stat.unit}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Table Actions */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{selected.length}件選択中</span>
          {selected.length > 0 && (
            <button className="flex items-center gap-1.5 text-xs border border-red-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-500">
              <Trash2 size={12} />
              選択した配信を削除
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>1-20 / 156件</span>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <div className="hidden sm:flex gap-1">
            {[1,2,3,'...',8].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
          <select className="hidden sm:block border border-gray-200 rounded px-2 py-1 text-xs bg-white">
            <option>20件表示</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={selected.length === deliveries.length} onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300" />
              </th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">配信日</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">件名／シナリオ名</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">種別</th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">配信数</th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">到達数<br/><span className="font-normal text-gray-400">到達率</span></th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">開封数<br/><span className="font-normal text-gray-400">開封率</span></th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">返信数<br/><span className="font-normal text-gray-400">返信率</span></th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">配信停止数<br/><span className="font-normal text-gray-400">停止率</span></th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">ステータス</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deliveries.map((d) => (
              <tr key={d.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(d.id) ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSelect(d.id)}
                    className="w-4 h-4 rounded border-gray-300" />
                </td>
                <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{d.date}</td>
                <td className="px-3 py-3">
                  <div className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{d.subject}</div>
                  <div className="text-xs text-gray-400">{d.scenario}</div>
                </td>
                <td className="px-3 py-3"><TypeBadge type={d.type} /></td>
                <td className="px-3 py-3 text-right text-sm text-gray-700">{d.sent.toLocaleString()}</td>
                <td className="px-3 py-3 text-right">
                  <div className="text-sm text-gray-700">{d.delivered.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{d.deliveryRate}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="text-sm text-gray-700">{d.opened}</div>
                  <div className="text-xs text-gray-400">{d.openRate}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="text-sm text-gray-700">{d.replied}</div>
                  <div className="text-xs text-gray-400">{d.replyRate}</div>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="text-sm text-gray-700">{d.stopped}</div>
                  <div className="text-xs text-gray-400">{d.stopRate}</div>
                </td>
                <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-gray-600">
                      <Eye size={11} />
                      詳細
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">※ 指標の定義についてはヘルプをご参照ください。</p>
      </>)}

      {activeTab === 'draft' && (<>
        {/* Draft stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>レビュー待ち：<strong className="text-gray-800">{draftEmails.filter(d => !approvedDrafts.includes(d.id) && !rejectedDrafts.includes(d.id)).length}件</strong></span>
            <span className="text-gray-400">承認済み：{approvedDrafts.length}件</span>
            <span className="text-gray-400">却下：{rejectedDrafts.length}件</span>
          </div>
          <button
            onClick={approveAll}
            className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <Send size={14} />
            レビュー待ち全件を承認して送信
          </button>
        </div>

        {/* Draft table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">企業名 / 担当者</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">件名</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">スコア</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">生成日時</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">ステータス</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {draftEmails.map((draft) => {
                const isApproved = approvedDrafts.includes(draft.id);
                const isRejected = rejectedDrafts.includes(draft.id);
                return (
                  <tr key={draft.id} className={`hover:bg-gray-50 transition-colors ${isApproved || isRejected ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{draft.company}</div>
                      <div className="text-xs text-gray-400">{draft.contact}　{draft.contactTitle}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 max-w-xs truncate">{draft.subject}</td>
                    <td className="px-3 py-3">
                      <span className={`text-sm font-bold ${draft.score >= 80 ? 'text-green-600' : draft.score >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {draft.score}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{draft.generatedAt}</td>
                    <td className="px-3 py-3">
                      {isApproved
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">承認済み</span>
                        : isRejected
                        ? <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">却下</span>
                        : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">レビュー待ち</span>
                      }
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDraftPreview(draft)}
                          className="flex items-center gap-1 text-xs border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-gray-600">
                          <Eye size={11} />確認・編集
                        </button>
                        {!isApproved && !isRejected && (<>
                          <button onClick={() => approveDraft(draft.id)}
                            className="flex items-center gap-1 text-xs border border-green-200 rounded px-2 py-1 hover:bg-green-50 text-green-600">
                            <Check size={11} />承認
                          </button>
                          <button onClick={() => rejectDraft(draft.id)}
                            className="flex items-center gap-1 text-xs border border-red-200 rounded px-2 py-1 hover:bg-red-50 text-red-500">
                            <X size={11} />却下
                          </button>
                        </>)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </>)}

      {/* Draft Preview Modal */}
      {draftPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-800">メールプレビュー・編集</h2>
                <p className="text-xs text-gray-400 mt-0.5">{draftPreview.company} / {draftPreview.contact}</p>
              </div>
              <button onClick={() => setDraftPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">件名</label>
                <input type="text" value={editSubject} onChange={e => setEditSubject(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">本文</label>
                <textarea rows={12} value={editBody} onChange={e => setEditBody(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed" />
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button onClick={() => setDraftPreview(null)}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                閉じる
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { rejectDraft(draftPreview.id); setDraftPreview(null); }}
                  className="text-sm border border-red-200 rounded-lg px-4 py-2 text-red-500 hover:bg-red-50">
                  却下
                </button>
                <button
                  onClick={async () => {
                    // 編集内容を保存してから承認
                    await fetch(`/api/emails/${draftPreview.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ subject: editSubject, body: editBody }),
                    });
                    setDraftEmails(prev => prev.map(d =>
                      d.id === draftPreview.id ? { ...d, subject: editSubject, body: editBody } : d
                    ));
                    await approveDraft(draftPreview.id);
                    setDraftPreview(null);
                  }}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  <Send size={14} />承認して送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Delivery Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-800">新規配信</h2>
                <div className="flex items-center gap-1 mt-2">
                  {(['配信設定', '下書き確認', '最終確認'] as const).map((label, i) => {
                    const s = i + 1;
                    return (
                      <div key={s} className="flex items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          s < modalStep ? 'bg-green-500 text-white' : s === modalStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {s < modalStep ? <Check size={12} /> : s}
                        </div>
                        <span className={`text-xs ${s === modalStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{label}</span>
                        {s < 3 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setShowNewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Step 1: 配信設定 */}
            {modalStep === 1 && (
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">配信対象リスト</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>新規開拓リスト（ICP抽出）- 1,245社</option>
                    <option>CSV取込リスト（2025/05/10）- 856社</option>
                    <option>CSV取込リスト（2025/05/01）- 412社</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">メールテンプレート</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>新規開拓（初回）- AIパーソナライズ生成</option>
                    <option>課題解決ヒント（2通目）</option>
                    <option>事例紹介（再送）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">送信モード</label>
                  <div className="flex gap-3">
                    {([
                      { id: 'review', label: 'レビューあり（推奨）', desc: '送信前にメール文面を確認・編集できます' },
                      { id: 'auto',   label: '自動配信',             desc: 'AIが生成したメールをそのまま一括配信します' },
                    ] as const).map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSendMode(mode.id)}
                        className={`flex-1 text-left p-3 rounded-xl border-2 transition-colors ${
                          sendMode === mode.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`text-sm font-medium ${sendMode === mode.id ? 'text-blue-700' : 'text-gray-700'}`}>{mode.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                  {sendMode === 'auto' && (
                    <div className="flex items-start gap-2 mt-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-700">自動配信を選択すると、AIが生成したメールが確認なしで送信されます。</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">配信スケジュール</label>
                  <div className="flex gap-2">
                    {['今すぐ送信', '日時指定'].map((opt, i) => (
                      <button key={opt} className={`px-4 py-2 rounded-lg text-sm border ${
                        i === 0 ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 下書き確認 */}
            {modalStep === 2 && (
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users size={14} className="text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-700">配信対象：<strong>1,245社</strong>（配信停止済み・重複除外済み）</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">件名</label>
                    <span className="text-xs text-gray-400">企業ごとにAIが最適化</span>
                  </div>
                  <input
                    type="text"
                    defaultValue="【株式会社○○様へ】新しい営業支援サービスのご案内"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">本文（下書きプレビュー）</label>
                    <button className="text-xs text-blue-600 hover:text-blue-700">全件プレビュー</button>
                  </div>
                  <textarea
                    rows={10}
                    defaultValue={`株式会社○○\n山田様\n\nはじめてご連絡いたします。\n株式会社FreshBoundの田中と申します。\n\n貴社のWebサイトを拝見し、○○業界での取り組みに大変関心を持ちました。弊社では、BtoB営業のリスト作成から商談化までをAIで自動化する「Freshbound」をご提供しております。\n\n一度、詳細をご説明させていただく機会をいただけますでしょうか。15分程度のオンライン相談も承っております。\n\n配信停止をご希望の場合はこちら：[配信停止リンク]\n\n---\n送信者：田中 太郎\n住所：東京都渋谷区神宮前1-1-1\n株式会社FreshBound`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
                  />
                  <p className="text-xs text-gray-400 mt-1">※ ○○は企業ごとにAIが自動置換。特電法必須項目（住所・配信停止リンク）は自動付与されます。</p>
                </div>
              </div>
            )}

            {/* Step 3: 最終確認 */}
            {modalStep === 3 && (
              <div className="px-6 py-5 space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">配信内容の確認</h3>
                  {[
                    { label: '配信対象', value: '新規開拓リスト（ICP抽出）' },
                    { label: '配信件数', value: '1,245通' },
                    { label: 'テンプレート', value: '新規開拓（初回）- AIパーソナライズ生成' },
                    { label: '送信モード', value: sendMode === 'review' ? 'レビューあり' : '自動配信' },
                    { label: '配信スケジュール', value: '今すぐ送信' },
                    { label: '送信者名', value: '山田 太郎（株式会社サンプル）' },
                    { label: '送信ドメイン', value: 'mail.freshbound.jp（共有）' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-medium text-gray-700">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    '配信停止リストを除外済み',
                    '特定電子メール法必須項目（住所・配信停止リンク）が含まれています',
                    'SPF/DKIM認証が設定されています',
                    '1日の配信上限（3,000通）以内です',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => modalStep > 1 ? setModalStep((prev) => prev - 1) : setShowNewModal(false)}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                {modalStep === 1 ? 'キャンセル' : '戻る'}
              </button>
              <button
                onClick={() => {
                  if (modalStep < 3) {
                    setModalStep((prev) => prev + 1);
                  } else {
                    setShowNewModal(false);
                    toast('配信を開始しました', 'success');
                  }
                }}
                className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                {modalStep === 3
                  ? <><Send size={14} /> 配信を開始する</>
                  : <>次へ <ChevronRight size={14} /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
