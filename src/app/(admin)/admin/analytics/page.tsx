'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatCard from '@/components/admin/StatCard';
import { TrendingUp, Mail, Users, DollarSign, TrendingDown, UserMinus } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const monthlyData = [
  { month: '12月', tenants: 28, emails: 68000, mrr: 5600000, bounceRate: 3.2, churnRate: 3.8 },
  { month: '1月',  tenants: 32, emails: 78000, mrr: 6400000, bounceRate: 2.9, churnRate: 3.2 },
  { month: '2月',  tenants: 35, emails: 85000, mrr: 7000000, bounceRate: 2.6, churnRate: 2.9 },
  { month: '3月',  tenants: 38, emails: 92000, mrr: 7600000, bounceRate: 2.4, churnRate: 2.5 },
  { month: '4月',  tenants: 42, emails: 105000, mrr: 8400000, bounceRate: 2.2, churnRate: 2.1 },
  { month: '5月',  tenants: 48, emails: 124500, mrr: 9200000, bounceRate: 2.1, churnRate: 1.8 },
];

const planData = [
  { name: 'Trial', value: 6, color: '#8b5cf6' },
  { name: 'Standard', value: 32, color: '#3b82f6' },
  { name: 'Enterprise', value: 10, color: '#f59e0b' },
];

const topTenants = [
  { name: 'グロースSaaS株式会社', plan: 'Enterprise', emails: 38200, openRate: '23.1%', mrr: '¥500,000' },
  { name: '株式会社クラウドビズ', plan: 'Enterprise', emails: 28900, openRate: '21.8%', mrr: '¥500,000' },
  { name: '株式会社セールスブースト', plan: 'Standard', emails: 15300, openRate: '22.5%', mrr: '¥200,000' },
  { name: '株式会社テックスタート', plan: 'Standard', emails: 12450, openRate: '22.3%', mrr: '¥200,000' },
  { name: 'イノベーション合同会社', plan: 'Standard', emails: 5600, openRate: '20.1%', mrr: '¥200,000' },
];

export default function AnalyticsPage() {
  const { lang } = useLang();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{t(lang, '分析', 'Analytics')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'SaaS全体のKPIと成長トレンドを確認します', 'Review SaaS-wide KPIs and growth trends')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label={t(lang, '総テナント数', 'Total Tenants')} value="48" icon={Users} color="#3b82f6" trend="+14.3% MoM" trendUp />
        <StatCard label={t(lang, '月間配信数', 'Monthly Emails')} value="124,500" icon={Mail} color="#10b981" trend="+18.6% MoM" trendUp />
        <StatCard label={t(lang, 'MRR（推定）', 'MRR (est.)')} value="¥9.2M" icon={DollarSign} color="#f59e0b" trend="+9.5% MoM" trendUp />
        <StatCard label={t(lang, '平均開封率', 'Avg Open Rate')} value="21.0%" icon={TrendingUp} color="#8b5cf6" trend="+2.3pt MoM" trendUp />
        <StatCard label={t(lang, 'バウンス率', 'Bounce Rate')} value="2.1%" icon={TrendingDown} color="#ef4444" trend="-0.1pt MoM" trendUp />
        <StatCard label={t(lang, 'チャーン率', 'Churn Rate')} value="1.8%" icon={UserMinus} color="#f97316" trend="-0.3pt MoM" trendUp />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tenant Growth */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'テナント数・配信数の推移', 'Tenant & Email Volume Trend')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Line yAxisId="left" type="monotone" dataKey="tenants" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name={t(lang, 'テナント数', 'Tenants')} />
              <Line yAxisId="right" type="monotone" dataKey="emails" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name={t(lang, '配信数', 'Emails')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution */}
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

      {/* MRR Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'MRR推移（推定）', 'MRR Trend (est.)')}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={v => `¥${(v/1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v) => [`¥${(Number(v)/1000000).toFixed(2)}M`, 'MRR']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="mrr" fill="#3b82f6" radius={[4, 4, 0, 0]} name="MRR" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bounce Rate & Churn Rate Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t(lang, 'バウンス率・チャーン率の推移', 'Bounce Rate & Churn Rate Trend')}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" domain={[0, 6]} />
            <Tooltip formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="bounceRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name={t(lang, 'バウンス率', 'Bounce Rate')} />
            <Line type="monotone" dataKey="churnRate" stroke="#f97316" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} name={t(lang, 'チャーン率', 'Churn Rate')} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-2 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-red-500" /><span className="text-xs text-gray-500">{t(lang, 'バウンス率', 'Bounce Rate')}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-orange-500" /><span className="text-xs text-gray-500">{t(lang, 'チャーン率', 'Churn Rate')}</span></div>
        </div>
      </div>

      {/* Top Tenants */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">{t(lang, 'トップテナント（配信数順）', 'Top Tenants by Email Volume')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-2">{t(lang, 'テナント', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, 'プラン', 'Plan')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '配信数', 'Emails')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '開封率', 'Open Rate')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topTenants.map((tenant, i) => (
                <tr key={tenant.name} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                      <span className="text-sm font-medium text-blue-600">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">{tenant.plan}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 text-right font-medium">{tenant.emails.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{tenant.openRate}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 text-right font-medium">{tenant.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
