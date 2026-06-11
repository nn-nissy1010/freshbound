'use client';

import { useState } from 'react';
import {
  Send, Mail, Eye, Reply, Star, TrendingUp, TrendingDown,
  ChevronRight, Calendar, Settings2, HelpCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const trendData = [
  { date: '05/04', 配信: 980, 開封: 210, 返信: 18 },
  { date: '05/05', 配信: 1120, 開封: 248, 返信: 21 },
  { date: '05/06', 配信: 1310, 開封: 287, 返信: 25 },
  { date: '05/07', 配信: 1150, 開封: 241, 返信: 19 },
  { date: '05/08', 配信: 1280, 開封: 265, 返信: 22 },
  { date: '05/09', 配信: 1380, 開封: 302, 返信: 26 },
  { date: '05/10', 配信: 1245, 開封: 276, 返信: 28 },
];

const pieData = [
  { name: '配信済み', value: 8715, color: '#3b82f6' },
  { name: '配信中', value: 628, color: '#60a5fa' },
  { name: '配信予約', value: 142, color: '#93c5fd' },
  { name: 'エラー', value: 138, color: '#ef4444' },
];

// B-1: Phase 2機能はダミー表示（実際には動かない）
// - Web閲覧チャネル（F-13 匿名トラッキング）→ 準備中
// - 電話推奨/商談打診アクション（F-11 AI次アクション）→ 返信あり表示のみ
const hotLeads = [
  { rank: 1, name: '株式会社イノベーションズ', score: 92, action: 'メール開封（2回）', time: '5分前' },
  { rank: 2, name: '株式会社グロースパートナー', score: 88, action: 'メール開封（2回）', time: '18分前' },
  { rank: 3, name: '株式会社デジタルソリューション', score: 85, action: 'メール開封', time: '25分前' },
  { rank: 4, name: '株式会社フューチャーリンク', score: 82, action: 'メール開封', time: '1時間前' },
  { rank: 5, name: '株式会社クラウドエッジ', score: 79, action: 'メール返信あり', time: '2時間前' },
];

const channelData = [
  { channel: 'メール', icon: Mail, count: '8,715', openRate: '21.0%', replyRate: '2.1%' },
];

// B-1: AI次アクション提案（F-11）はPhase 2。MVP段階では返信通知のみ表示
const insights = [
  {
    type: 'success',
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: '開封率が向上しています',
    desc: '今週の開封率は21.0%で、前週比 +2.3ptです。件名のパーソナライズが効果的です。',
    action: '詳細を確認',
  },
  {
    type: 'warning',
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    title: '返信があった企業を確認',
    desc: '今週28件の返信がありました。早めにご確認・フォローアップをお勧めします。',
    action: '返信一覧を見る',
  },
];

const hpScoreData = [
  { label: '80点以上', count: 48, pct: 14.6, color: '#10b981' },
  { label: '60-79点', count: 122, pct: 37.2, color: '#3b82f6' },
  { label: '40-59点', count: 108, pct: 32.9, color: '#f59e0b' },
  { label: '40点未満', count: 50, pct: 15.3, color: '#ef4444' },
];

// 新規HP判定ステータスの内訳（新規／既存／不明）
// '不明' = WHOIS非公開等で登録日が取得できなかった企業
const hpStatusData = [
  { label: '新規', count: 328, color: '#10b981' },
  { label: '既存', count: 856, color: '#9ca3af' },
  { label: '不明', count: 64, color: '#f59e0b' },
];

export default function DashboardPage() {
  const [dateRange] = useState('2025/05/04 - 2025/05/10');

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">ダッシュボード</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">本日の活動状況と成果のサマリーです。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Calendar size={14} />
            {dateRange}
          </button>
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            比較：前週
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Settings2 size={14} />
            カスタマイズ
          </button>
        </div>
      </div>

      {/* Today's Summary */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">今日のサマリー <span className="text-gray-400 font-normal">（2025/05/10）</span></h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: '配信数', value: '1,245', unit: '通', icon: Send, color: '#3b82f6', change: '+12.5%', up: true },
            { label: '到達数', value: '1,102', unit: '通', icon: Mail, color: '#10b981', sub: '到達率 88.5%', change: null },
            { label: '開封数', value: '276', unit: '通', icon: Eye, color: '#8b5cf6', sub: '開封率 22.3%', change: null },
            { label: '返信数', value: '28', unit: '通', icon: Reply, color: '#f59e0b', sub: '返信率 2.3%', change: null },
            { label: 'ホットリード', value: '12', unit: '件', icon: Star, color: '#ef4444', change: '+3件', up: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: item.color + '15' }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800">{item.value}</span>
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>
                {item.change && (
                  <div className={`flex items-center gap-1 mt-1 text-xs ${item.up ? 'text-green-600' : 'text-red-500'}`}>
                    {item.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    前日比 {item.change}
                  </div>
                )}
                {item.sub && (
                  <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Trend Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-700">主要指標の推移</h3>
              <HelpCircle size={13} className="text-gray-400" />
            </div>
            <button className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              過去7日間
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="配信" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="開封" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="返信" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            {[{ label: '配信', color: '#3b82f6' }, { label: '開封', color: '#10b981' }, { label: '返信', color: '#8b5cf6' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">ホットリード TOP 5</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              すべて見る <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {hotLeads.map((lead) => (
              <div key={lead.rank} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{lead.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 truncate">{lead.name}</div>
                  <div className="text-xs text-gray-400">{lead.action} · {lead.time}</div>
                </div>
                <span className="text-xs font-bold text-gray-700 flex-shrink-0">{lead.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">配信ステータス内訳 <span className="text-gray-400 font-normal text-xs">（今週）</span></h3>
          </div>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.value.toLocaleString()}通</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="text-xs text-gray-400">合計 </span>
            <span className="text-sm font-bold text-gray-700">8,715通</span>
          </div>
        </div>

        {/* New HP Companies */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-semibold text-gray-700">新規HP企業 <span className="text-gray-400 font-normal text-xs">（今週）</span></h3>
              <HelpCircle size={13} className="text-gray-400" />
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              すべて見る <ChevronRight size={12} />
            </button>
          </div>
          <div className="mb-3">
            <div className="text-3xl font-bold text-gray-800">328<span className="text-base font-normal text-gray-500 ml-1">社</span></div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-0.5">
              <TrendingUp size={11} />
              前週比 +32社 (+10.8%)
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">スコア帯別内訳</div>
          <div className="space-y-1.5">
            {hpScoreData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-16">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
                <span className="text-xs font-medium text-gray-700 w-8 text-right">{item.count}社</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">判定ステータス</div>
            <div className="flex gap-2">
              {hpStatusData.map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Results */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">チャネル別成果 <span className="text-gray-400 font-normal text-xs">（今週）</span></h3>
            <button className="text-xs text-blue-600 hover:text-blue-700">すべて</button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-gray-400 font-normal pb-2">チャネル</th>
                <th className="text-right text-xs text-gray-400 font-normal pb-2">配信数</th>
                <th className="text-right text-xs text-gray-400 font-normal pb-2">開封率</th>
                <th className="text-right text-xs text-gray-400 font-normal pb-2">返信率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {channelData.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.channel}>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className="text-gray-400" />
                        <span className="text-xs text-gray-700">{row.channel}</span>
                      </div>
                    </td>
                    <td className="text-right text-xs text-gray-700 py-2">{row.count}</td>
                    <td className="text-right text-xs text-gray-700 py-2">{row.openRate}</td>
                    <td className="text-right text-xs text-gray-700 py-2">{row.replyRate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🤖</span>
          <h3 className="text-sm font-semibold text-gray-700">AIからのインサイト・次のアクション提案</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {insights.map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4 border"
              style={{ backgroundColor: item.bg, borderColor: item.border }}
            >
              <div className="text-sm font-semibold mb-1.5" style={{ color: item.color }}>
                {item.title}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{item.desc}</p>
              <button className="text-xs font-medium flex items-center gap-1" style={{ color: item.color }}>
                {item.action} <ChevronRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
