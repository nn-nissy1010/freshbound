'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import {
  Building2, Users, Mail, Eye, TrendingDown, MessageSquare, Bot,
  RefreshCw, Calendar, ChevronDown, CheckCircle,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import StatCard from '@/components/admin/StatCard';

/* ── data ── */
const emailTrendData = [
  { date: '05/04', value: 82000 },
  { date: '05/05', value: 95000 },
  { date: '05/06', value: 108000 },
  { date: '05/07', value: 91000 },
  { date: '05/08', value: 115000 },
  { date: '05/09', value: 122000 },
  { date: '05/10', value: 128456 },
];

const rateData = [
  { date: '05/04', open: 20.1, reply: 1.8 },
  { date: '05/05', open: 21.3, reply: 2.0 },
  { date: '05/06', open: 22.0, reply: 2.2 },
  { date: '05/07', open: 20.8, reply: 1.9 },
  { date: '05/08', open: 21.5, reply: 2.1 },
  { date: '05/09', open: 22.1, reply: 2.8 },
  { date: '05/10', open: 21.8, reply: 3.2 },
];

const systemServices = [
  'SendGrid', 'OpenAI', 'WhoisJSON', 'Prospeo', 'Supabase', 'LINE',
];

export default function AdminDashboard() {
  const { lang } = useLang();

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {t(lang, 'ダッシュボード', 'Dashboard')}
            <span className="text-gray-400 cursor-help" title="Help">?</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t(lang, 'システム全体の状況をリアルタイムで監視できます。', 'Monitor the entire system status in real time.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Calendar size={13} /> 2025/05/10 <ChevronDown size={12} />
          </button>
          <button className="hidden sm:flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            {t(lang, '比較：前日', 'Compare: Yesterday')} <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <RefreshCw size={13} /> {t(lang, '更新', 'Refresh')}
          </button>
        </div>
      </div>

      {/* ── Row 1: 7 KPI cards ── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <StatCard label={t(lang, 'テナント総数', 'Total Tenants')} value="23" icon={Building2} color="#3b82f6" trend="+1" trendUp />
        <StatCard label={t(lang, 'アクティブ', 'Active')}          value="18" icon={Users}      color="#10b981" trend="+2" trendUp />
        <StatCard label={t(lang, '今日の配信数', 'Sent Today')}     value="128,456" icon={Mail}  color="#3b82f6" trend="+12.4%" trendUp />
        <StatCard label={t(lang, '開封数', 'Opens')}               value="27,983" icon={Eye}     color="#10b981" trend="+1,203" trendUp />
        <StatCard label={t(lang, '返信数', 'Replies')}             value="412"    icon={MessageSquare} color="#3b82f6" trend="+38" trendUp />
        <StatCard label={t(lang, 'バウンス数', 'Bounces')}         value="2,697"  icon={TrendingDown}  color="#ef4444" trend="+256" trendUp={false} />
        <StatCard label={t(lang, 'AI抽出件数', 'AI Extracted')}    value="3,840"  icon={Bot}     color="#10b981" trend="+520" trendUp />
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* 送信数の推移 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">{t(lang, '送信数の推移', 'Email Volume Trend')}</h3>
            <button className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              {t(lang, '過去7日間', 'Last 7 days')} <ChevronDown size={10} />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-blue-500" />
              <span className="text-xs text-gray-500">{t(lang, '送信数（通）', 'Emails')}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={emailTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [Number(v).toLocaleString(), t(lang, '送信数', 'Emails')]}
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 開封率・返信率の推移 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">{t(lang, '開封率・返信率の推移', 'Open & Reply Rate Trend')}</h3>
            <button className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              {t(lang, '過去7日間', 'Last 7 days')} <ChevronDown size={10} />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-blue-500" />
              <span className="text-xs text-gray-500">{t(lang, '開封率（%）', 'Open Rate (%)')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-green-500" style={{ borderTop: '2px dashed #10b981', background: 'none' }} />
              <span className="text-xs text-gray-500">{t(lang, '返信率（%）', 'Reply Rate (%)')}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={rateData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 40]} />
              <Tooltip
                formatter={(v, name) => [`${Number(v)}%`, name]}
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="open" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} name={t(lang, '開封率', 'Open Rate')} />
              <Line type="monotone" dataKey="reply" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#10b981' }} name={t(lang, '返信率', 'Reply Rate')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── Row 3: System Status Bar ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-sm font-semibold text-gray-700">{t(lang, 'システムステータス', 'System Status')}</span>
          {systemServices.map(svc => (
            <div key={svc} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600">{svc}</span>
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">{t(lang, '正常', 'OK')}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <CheckCircle size={13} className="text-green-500" />
            {t(lang, '最終チェック：2025/05/10 10:30:45', 'Last check: 2025/05/10 10:30:45')}
          </div>
        </div>
      </div>

    </div>
  );
}
