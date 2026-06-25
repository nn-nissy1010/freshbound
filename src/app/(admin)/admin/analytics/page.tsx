'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { TrendingUp, Users, TrendingDown } from 'lucide-react';

const monthlyData = [
  { month: '12月', newSignups: 4, mrr: 5600000, churnRate: 3.8 },
  { month: '1月',  newSignups: 5, mrr: 6400000, churnRate: 3.2 },
  { month: '2月',  newSignups: 3, mrr: 7000000, churnRate: 2.9 },
  { month: '3月',  newSignups: 6, mrr: 7600000, churnRate: 2.5 },
  { month: '4月',  newSignups: 7, mrr: 8400000, churnRate: 2.1 },
  { month: '5月',  newSignups: 8, mrr: 9200000, churnRate: 1.8 },
];

const planData = [
  { name: 'Trial',      value: 6,  color: '#f59e0b', status: 'trial' },
  { name: 'Standard',   value: 32, color: '#3b82f6', status: 'standard' },
  { name: 'Enterprise', value: 10, color: '#10b981', status: 'enterprise' },
];

const tenantActivity = [
  { name: '株式会社イノベーションズ', plan: 'プロ', action: 'キャンペーン作成', emails: 12450, time: '10分前' },
  { name: '株式会社グロースパートナー', plan: 'スタンダード', action: 'CSV取込完了', emails: 5780, time: '25分前' },
  { name: '株式会社デジタルソリューション', plan: 'プロ', action: 'ユーザー追加', emails: 28900, time: '1時間前' },
  { name: '株式会社フューチャーリンク', plan: 'スタンダード', action: '配信開始', emails: 15300, time: '2時間前' },
  { name: '株式会社クラウドエッジ', plan: 'ベーシック', action: '配信停止設定', emails: 3200, time: '3時間前' },
];

const planStatusMap: Record<string, string> = {
  'プロ':         'enterprise',
  'スタンダード': 'standard',
  'ベーシック':   'trial',
};

export default function AnalyticsPage() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'financial' | 'usage'>('financial');

  const latestMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const mrrGrowth = (((latestMonth.mrr - prevMonth.mrr) / prevMonth.mrr) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{t(lang, '分析', 'Analytics')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'SaaS全体のKPIと成長トレンドを確認します', 'Review SaaS-wide KPIs and growth trends')}</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'financial' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t(lang, '財務', 'Financial')}
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'usage' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t(lang, '利用状況', 'Usage')}
        </button>
      </div>

      {activeTab === 'financial' && (
        <>
          {/* Financial KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard label={t(lang, 'MRR（推定）', 'MRR (est.)')}               value={`¥${(latestMonth.mrr / 1000000).toFixed(1)}M`} icon={TrendingUp}   color="#10b981" trend={`+${mrrGrowth}% MoM`} trendUp />
            <StatCard label={t(lang, '新規サインアップ（今月）', 'New Signups')}   value={latestMonth.newSignups}                         icon={Users}        color="#3b82f6" trend={`+${latestMonth.newSignups - prevMonth.newSignups} ${t(lang, '前月比', 'MoM')}`} trendUp />
            <StatCard label={t(lang, 'チャーン率', 'Churn Rate')}                 value={`${latestMonth.churnRate}%`}                    icon={TrendingDown} color="#ef4444" trend={`-${(prevMonth.churnRate - latestMonth.churnRate).toFixed(1)}pt MoM`} trendUp />
          </div>

          {/* MRR trend + Plan distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'MRR推移（推定）', 'MRR Trend (est.)')}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `¥${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v) => [`¥${(Number(v)/1000000).toFixed(2)}M`, 'MRR']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="mrr" fill="#3b82f6" radius={[4, 4, 0, 0]} name="MRR" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'プラン別テナント分布', 'Plan Distribution')}</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {planData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {planData.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-gray-600">{p.name}</span>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{p.value} {t(lang, 'テナント', 'tenants')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Churn trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'チャーン率の推移', 'Churn Rate Trend')}</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" domain={[0, 6]} />
                <Tooltip formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="churnRate" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name={t(lang, 'チャーン率', 'Churn Rate')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {activeTab === 'usage' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">{t(lang, 'テナントアクティビティ', 'Tenant Activity')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2">{t(lang, 'テナント', 'Tenant')}</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, 'プラン', 'Plan')}</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '最新アクション', 'Latest Action')}</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '配信数', 'Emails')}</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '時間', 'Time')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tenantActivity.map((row, i) => {
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-2.5 text-sm font-medium text-blue-600">{row.name}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={planStatusMap[row.plan] ?? 'inactive'} label={row.plan} />
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-600">{row.action}</td>
                      <td className="px-3 py-2.5 text-sm text-gray-700 text-right font-medium">{row.emails.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{row.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
