'use client';

import { useState } from 'react';
import {
  Search, Download, Plus, HelpCircle, Calendar,
  ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react';
const unsubscribeData = [
  {
    id: 1, email: 't.tanaka@sample-tech.co.jp', company: '株式会社サンプルテック',
    contact: '田中 太郎', date: '2025/05/10 10:23', reason: '配信停止リンク',
    method: '自動（リンク）', status: '有効',
  },
  {
    id: 2, email: 'sato@innovations.co.jp', company: '株式会社イノベーションズ',
    contact: '佐藤 花子子', date: '2025/05/09 15:44', reason: '興味なし',
    method: '自動（リンク）', status: '有効',
  },
  {
    id: 3, email: 'info@growth-partner.jp', company: '株式会社グロースパートナー',
    contact: '鈴木 一郎', date: '2025/05/08 11:12', reason: '配信頻度が多い',
    method: '自動（リンク）', status: '有効',
  },
  {
    id: 4, email: 'yamada@future-link.co.jp', company: '株式会社フューチャーリンク',
    contact: '山本 美咲', date: '2025/05/07 09:35', reason: '不要・迷惑メール',
    method: '手動追加', status: '有効',
  },
  {
    id: 5, email: 'contact@ds-solution.co.jp', company: '株式会社デジタルソリューション',
    contact: '高橋 健', date: '2025/05/06 16:20', reason: 'その他',
    method: 'バウンス経由', status: '有効',
  },
  {
    id: 6, email: 'hello@cloud-edge.co.jp', company: '株式会社クラウドエッジ',
    contact: '伊藤 大輔', date: '2025/05/04 14:08', reason: '配信停止リンク',
    method: '自動（リンク）', status: '有効',
  },
  {
    id: 7, email: 'nakamura@b-brain.co.jp', company: '株式会社ビジネスブレイン',
    contact: '中村 翔', date: '2025/05/03 10:57', reason: '興味なし',
    method: '手動追加', status: '有効',
  },
  {
    id: 8, email: 'koba@advance-system.co.jp', company: '株式会社アドバンスシステム',
    contact: '小林 直樹', date: '2025/05/02 08:41', reason: '配信頻度が多い',
    method: '自動（リンク）', status: '有効',
  },
];

const reasonColors: Record<string, { bg: string; text: string }> = {
  '配信停止リンク': { bg: '#ede9fe', text: '#7c3aed' },
  '興味なし': { bg: '#dbeafe', text: '#2563eb' },
  '配信頻度が多い': { bg: '#dcfce7', text: '#16a34a' },
  '不要・迷惑メール': { bg: '#fef3c7', text: '#d97706' },
  'その他': { bg: '#f3f4f6', text: '#6b7280' },
};

function ReasonBadge({ reason }: { reason: string }) {
  const c = reasonColors[reason] || { bg: '#f3f4f6', text: '#6b7280' };
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      {reason}
    </span>
  );
}

export default function UnsubscribePage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    setSelected(selected.length === unsubscribeData.length ? [] : unsubscribeData.map(d => d.id));
  };

  const tabs = [
    { id: 'all', label: 'すべて', count: 2315 },
    { id: 'link', label: '配信停止リンク', count: 1982 },
    { id: 'manual', label: '手動追加', count: 198 },
    { id: 'bounce', label: 'バウンス経由', count: 135 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">配信停止リスト管理</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">配信停止されたメールアドレスを管理し、再配信を防止します。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />
            リストをエクスポート（CSV）
          </button>
          <button className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />
            手動で追加
          </button>
        </div>
      </div>

      <div>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="メールアドレス・企業名・担当者名で検索"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">配信停止日</span>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 bg-white cursor-pointer hover:bg-gray-50">
                  <span>開始日</span>
                  <span className="text-gray-300 mx-1">〜</span>
                  <span>終了日</span>
                  <Calendar size={13} className="ml-1 text-gray-400" />
                </div>
              </div>
              {[
                { label: '理由', options: ['すべて', '配信停止リンク', '興味なし', '配信頻度が多い', '不要・迷惑メール', 'その他'] },
                { label: 'ステータス', options: ['すべて', '有効', '無効'] },
                { label: '追加方法', options: ['すべて', '自動（リンク）', '手動追加', 'バウンス経由'] },
              ].map((filter) => (
                <div key={filter.label} className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">{filter.label}</span>
                  <select className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {filter.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>

          {/* Table Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {selected.length > 0 && (
                <button className="flex items-center gap-1.5 text-xs border border-red-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-red-50 text-red-500">
                  選択したリストを削除（{selected.length}件）
                </button>
              )}
              <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600">
                ステータス更新
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>1-20 / 2,315件</span>
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
              <div className="flex gap-1">
                {[1,2,3,4,5,'...',116].map((p, i) => (
                  <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
              <select className="border border-gray-200 rounded px-2 py-1 text-xs bg-white">
                <option>20件表示</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={selected.length === unsubscribeData.length} onChange={toggleAll}
                      className="w-4 h-4 rounded border-gray-300" />
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">メールアドレス</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">企業名</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">担当者名</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">配信停止日 ↓</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">理由</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">追加方法</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">ステータス</th>
                  <th className="w-10 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {unsubscribeData.map((row) => (
                  <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${selected.includes(row.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4 rounded border-gray-300" />
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700">{row.email}</td>
                    <td className="px-3 py-3 text-sm text-gray-700">{row.company}</td>
                    <td className="px-3 py-3 text-sm text-gray-600">{row.contact}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-3"><ReasonBadge reason={row.reason} /></td>
                    <td className="px-3 py-3 text-xs text-gray-500">{row.method}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{row.status}</span>
                    </td>
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

      </div>
    </div>
  );
}
