'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import StatCard from '@/components/admin/StatCard';
import { Store, Users, DollarSign, Plus, MoreVertical, LogIn } from 'lucide-react';

const agencies = [
  { id: 'AG001', name: 'Agency A 株式会社', contact: 'agency-a@example.com', tenants: 12, revenue: '¥2,400,000', commission: '10%', status: 'active', joined: '2024/10/01' },
  { id: 'AG002', name: 'Agency B 合同会社', contact: 'agency-b@example.com', tenants: 8, revenue: '¥1,600,000', commission: '10%', status: 'active', joined: '2024/11/15' },
  { id: 'AG003', name: 'Agency C 株式会社', contact: 'agency-c@example.com', tenants: 5, revenue: '¥1,000,000', commission: '12%', status: 'active', joined: '2025/01/20' },
  { id: 'AG004', name: 'Agency D 株式会社', contact: 'agency-d@example.com', tenants: 2, revenue: '¥400,000', commission: '10%', status: 'inactive', joined: '2025/03/01' },
];

export default function AgenciesPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, '代理店管理', 'Agency Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '販売代理店・リセラーの管理と収益追跡', 'Manage resellers and track revenue')}</p>
        </div>
        <button className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <Plus size={14} />{t(lang, '代理店追加', 'Add Agency')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label={t(lang, '総代理店数', 'Total Agencies')} value="4" icon={Store} color="#3b82f6" />
        <StatCard label={t(lang, '管理テナント数', 'Managed Tenants')} value="27" icon={Users} color="#10b981" />
        <StatCard label={t(lang, '代理店経由MRR', 'Agency MRR')} value="¥5.4M" icon={DollarSign} color="#f59e0b" />
      </div>

      <FilterBar
        searchPlaceholder={t(lang, '代理店名で検索', 'Search by agency name')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, 'アクティブ', 'Active'), t(lang, '非アクティブ', 'Inactive')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, '代理店名', 'Agency')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '連絡先', 'Contact')}</th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '管理テナント数', 'Tenants')}</th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '月間収益', 'Monthly Revenue')}</th>
              <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'コミッション率', 'Commission')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '登録日', 'Joined')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ポータルアクセス', 'Portal Access')}</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(agency => (
              <tr key={agency.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{agency.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{agency.id}</div>
                </td>
                <td className="px-3 py-3 text-xs text-gray-600">{agency.contact}</td>
                <td className="px-3 py-3 text-sm text-gray-700 text-right font-medium">{agency.tenants}</td>
                <td className="px-3 py-3 text-sm text-gray-700 text-right font-medium">{agency.revenue}</td>
                <td className="px-3 py-3 text-sm text-gray-700 text-right">{agency.commission}</td>
                <td className="px-3 py-3"><StatusBadge status={agency.status} /></td>
                <td className="px-3 py-3 text-xs text-gray-500">{agency.joined}</td>
                <td className="px-3 py-3">
                  {agency.status === 'active' ? (
                    <button className="flex items-center gap-1 text-xs border border-amber-200 text-amber-700 rounded-lg px-2 py-1 hover:bg-amber-50 font-medium">
                      <LogIn size={11} />
                      {t(lang, 'なりすまし', 'Impersonate')}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
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
  );
}
