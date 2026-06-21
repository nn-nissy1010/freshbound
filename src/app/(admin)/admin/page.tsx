'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import {
  Building2, Users, Mail, Eye, TrendingDown, AlertCircle,
  RefreshCw, Calendar, ChevronDown, CheckCircle,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

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

const apiUsageData = [
  { date: '05/04', usage: 180000 },
  { date: '05/05', usage: 220000 },
  { date: '05/06', usage: 260000 },
  { date: '05/07', usage: 230000 },
  { date: '05/08', usage: 310000 },
  { date: '05/09', usage: 390000 },
  { date: '05/10', usage: 420000 },
];

const tenantActivity = [
  { name: '株式会社イノベーションズ', plan: 'プロ',       action: 'キャンペーン作成', time: '10分前' },
  { name: '株式会社グロースパートナー', plan: 'スタンダード', action: 'CSV取込完了',   time: '25分前' },
  { name: '株式会社デジタルソリューション', plan: 'プロ',  action: 'ユーザー追加',   time: '1時間前' },
  { name: '株式会社フューチャーリンク',  plan: 'スタンダード', action: '配信開始',   time: '2時間前' },
  { name: '株式会社クラウドエッジ',     plan: 'ベーシック',  action: '配信停止設定', time: '3時間前' },
];

const failedJobs = [
  { type: 'error',   tenant: '株式会社サンプルテック',      content: 'SendGrid送信失敗',  time: '10分前' },
  { type: 'warning', tenant: '株式会社ベータソリューション', content: 'Hunter APIエラー',  time: '30分前' },
  { type: 'error',   tenant: '株式会社アルファドライブ',    content: 'メールバウンス多発', time: '45分前' },
  { type: 'error',   tenant: '株式会社ガンマリンク',        content: 'CSV取込失敗',       time: '1時間前' },
  { type: 'warning', tenant: '株式会社デルタパートナー',    content: '開封率低下',         time: '2時間前' },
];

const csvImports = [
  { tenant: '株式会社グロースパートナー',      file: 'list_20250510.csv',     rows: 2450, status: 'completed', time: '15分前' },
  { tenant: '株式会社デジタルソリューション',  file: 'contacts_0510.csv',     rows: 5780, status: 'running',   time: '1時間前' },
  { tenant: '株式会社フューチャーリンク',      file: 'new_list_0510.csv',     rows: 1250, status: 'running',   time: '1時間前' },
  { tenant: '株式会社クラウドエッジ',          file: 'target_0510.csv',       rows: 3210, status: 'completed', time: '2時間前' },
  { tenant: '株式会社イノベーションズ',        file: 'import_0510.csv',       rows: 4890, status: 'failed',    time: '3時間前' },
];

const systemServices = [
  'APIサービス', 'データベース', 'メール送信キュー', 'Webトラッキング', 'ストレージ', 'バックアップ',
];

const planColors: Record<string, { bg: string; text: string }> = {
  'プロ':        { bg: '#ede9fe', text: '#7c3aed' },
  'スタンダード':{ bg: '#dbeafe', text: '#2563eb' },
  'ベーシック':  { bg: '#f3f4f6', text: '#6b7280' },
};

const csvStatusMap: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: '完了',   bg: '#dcfce7', text: '#16a34a' },
  running:   { label: '処理中', bg: '#dbeafe', text: '#2563eb' },
  failed:    { label: '失敗',   bg: '#fee2e2', text: '#dc2626' },
};

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

      {/* ── Row 1: 6 KPI cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* テナント総数 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2 size={14} className="text-blue-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, 'テナント総数', 'Total Tenants')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">23 <span className="text-sm font-normal text-gray-500">{t(lang, '社', '')}</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-green-600 font-medium">+1</span></div>
        </div>

        {/* アクティブテナント */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
              <Users size={14} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, 'アクティブテナント', 'Active Tenants')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">18 <span className="text-sm font-normal text-gray-500">{t(lang, '社', '')}</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-green-600 font-medium">+2</span></div>
        </div>

        {/* 本日の送信数 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Mail size={14} className="text-purple-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, '本日の送信数', 'Emails Today')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">128,456 <span className="text-sm font-normal text-gray-500">{t(lang, '通', '')}</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-green-600 font-medium">+12.4%</span></div>
        </div>

        {/* 本日の開封率 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Eye size={14} className="text-cyan-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, '本日の開封率', 'Open Rate Today')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">21.8 <span className="text-sm font-normal text-gray-500">%</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-green-600 font-medium">+1.6pt</span></div>
        </div>

        {/* バウンス率 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
              <TrendingDown size={14} className="text-orange-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, 'バウンス率', 'Bounce Rate')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">2.1 <span className="text-sm font-normal text-gray-500">%</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-red-500 font-medium">+0.2pt</span></div>
        </div>

        {/* エラー数 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertCircle size={14} className="text-red-500" />
            </div>
            <span className="text-xs text-gray-500">{t(lang, 'エラー数', 'Error Count')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">18 <span className="text-sm font-normal text-gray-500">{t(lang, '件', '')}</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '前日比', 'vs yesterday')} <span className="text-red-500 font-medium">+3</span></div>
        </div>
      </div>

      {/* ── Row 2: 5 secondary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* API使用量 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm col-span-1">
          <div className="text-xs text-gray-500 mb-1">{t(lang, 'API使用量（本日）', 'API Usage (Today)')}</div>
          <div className="text-lg font-bold text-gray-800">256,783 <span className="text-xs font-normal text-gray-400">/ 500,000</span></div>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '51.4%' }} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-400">51.4%</span>
            <span className="text-xs text-green-600 font-medium">{t(lang, '前日比 +8.7%', '+8.7% vs yesterday')}</span>
          </div>
        </div>

        {/* MRR */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, 'MRR（推定）', 'MRR (est.)')}</div>
          <div className="text-lg font-bold text-gray-800">¥ 6,420,000</div>
          <div className="text-xs text-green-600 font-medium mt-1">{t(lang, '前月比 +¥320,000 (+5.2%)', '+¥320,000 (+5.2%) MoM')}</div>
        </div>

        {/* 新規サインアップ */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, '新規サインアップ（今月）', 'New Signups (Month)')}</div>
          <div className="text-lg font-bold text-gray-800">7 <span className="text-sm font-normal text-gray-500">{t(lang, '社', '')}</span></div>
          <div className="text-xs text-green-600 font-medium mt-1">{t(lang, '前月比 +3', '+3 vs last month')}</div>
        </div>

        {/* システム稼働率 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, 'システム稼働率', 'System Uptime')}</div>
          <div className="text-lg font-bold text-gray-800">99.92 <span className="text-sm font-normal text-gray-500">%</span></div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '過去30日間', 'Last 30 days')}</div>
        </div>

        {/* キューの状態 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">{t(lang, 'キューの状態', 'Queue Status')}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-600">{t(lang, '正常', 'Normal')}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t(lang, '遅延なし', 'No delay')}</div>
            </div>
            <CheckCircle size={28} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* ── Row 3: 3 Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

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

        {/* API使用量の推移 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">{t(lang, 'API使用量の推移', 'API Usage Trend')}</h3>
            <button className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500 hover:bg-gray-50 flex items-center gap-1">
              {t(lang, '過去7日間', 'Last 7 days')} <ChevronDown size={10} />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-blue-500" />
              <span className="text-xs text-gray-500">{t(lang, '使用量', 'Usage')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ borderTop: '2px dashed #93c5fd', background: 'none' }} />
              <span className="text-xs text-gray-500">{t(lang, '上限', 'Limit')}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={apiUsageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v) => [Number(v).toLocaleString(), t(lang, '使用量', 'Usage')]}
                contentStyle={{ fontSize: 11, borderRadius: 6, border: '1px solid #e5e7eb' }}
              />
              <ReferenceLine y={500000} stroke="#93c5fd" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 4: 3 Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* テナントアクティビティ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              {t(lang, 'テナントアクティビティ', 'Tenant Activity')}
              <span className="text-xs text-gray-400 font-normal ml-1">{t(lang, '（最新5件）', '(Latest 5)')}</span>
            </h3>
            <a href="/admin/tenants" className="text-xs text-blue-600 hover:text-blue-700">{t(lang, 'すべて見る', 'View all')}</a>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">{t(lang, 'テナント名', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, 'プラン', 'Plan')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, 'アクション', 'Action')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, '時間', 'Time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenantActivity.map((row, i) => {
                const pc = planColors[row.plan] || { bg: '#f3f4f6', text: '#6b7280' };
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer max-w-[110px] truncate">{row.name}</td>
                    <td className="px-2 py-2.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: pc.bg, color: pc.text }}>{row.plan}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-gray-600">{row.action}</td>
                    <td className="px-2 py-2.5 text-xs text-gray-400 whitespace-nowrap">{row.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* エラー・失敗ジョブ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              {t(lang, 'エラー・失敗ジョブ', 'Errors & Failed Jobs')}
              <span className="text-xs text-gray-400 font-normal ml-1">{t(lang, '（最新5件）', '(Latest 5)')}</span>
            </h3>
            <a href="/admin/campaigns" className="text-xs text-blue-600 hover:text-blue-700">{t(lang, 'すべて見る', 'View all')}</a>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">{t(lang, '種別', 'Type')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, 'テナント', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, '内容', 'Content')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, '時間', 'Time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {failedJobs.map((job, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${job.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {job.type === 'error' ? t(lang, 'エラー', 'Error') : t(lang, '警告', 'Warning')}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-xs text-gray-600 max-w-[90px] truncate">{job.tenant}</td>
                  <td className="px-2 py-2.5 text-xs text-gray-700 max-w-[100px] truncate">{job.content}</td>
                  <td className="px-2 py-2.5 text-xs text-gray-400 whitespace-nowrap">{job.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* CSVインポート */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              {t(lang, 'CSVインポート', 'CSV Imports')}
              <span className="text-xs text-gray-400 font-normal ml-1">{t(lang, '（最新5件）', '(Latest 5)')}</span>
            </h3>
            <a href="/admin/csv" className="text-xs text-blue-600 hover:text-blue-700">{t(lang, 'すべて見る', 'View all')}</a>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-2">{t(lang, 'テナント名', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, 'ファイル名', 'File')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-2 py-2">{t(lang, '件数', 'Rows')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, 'ステータス', 'Status')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-2 py-2">{t(lang, '時間', 'Time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {csvImports.map((row, i) => {
                const sc = csvStatusMap[row.status] || csvStatusMap.completed;
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-xs text-gray-700 max-w-[90px] truncate">{row.tenant}</td>
                    <td className="px-2 py-2.5 text-xs text-gray-500 max-w-[100px] truncate">{row.file}</td>
                    <td className="px-2 py-2.5 text-xs text-gray-700 text-right">{row.rows.toLocaleString()}</td>
                    <td className="px-2 py-2.5">
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                    </td>
                    <td className="px-2 py-2.5 text-xs text-gray-400 whitespace-nowrap">{row.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* ── Row 5: System Status Bar ── */}
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
