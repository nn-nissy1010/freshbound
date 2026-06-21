'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import StatCard from '@/components/admin/StatCard';
import { Store, Users, DollarSign, Plus, MoreVertical, LogIn, Pencil, X, CheckCircle } from 'lucide-react';

const agencies = [
  { id: 'AG001', name: 'Agency A 株式会社', contact: 'agency-a@example.com', tenants: 12, revenue: '¥2,400,000', commission: '10%', status: 'active', joined: '2024/10/01' },
  { id: 'AG002', name: 'Agency B 合同会社', contact: 'agency-b@example.com', tenants: 8, revenue: '¥1,600,000', commission: '10%', status: 'active', joined: '2024/11/15' },
  { id: 'AG003', name: 'Agency C 株式会社', contact: 'agency-c@example.com', tenants: 5, revenue: '¥1,000,000', commission: '12%', status: 'active', joined: '2025/01/20' },
  { id: 'AG004', name: 'Agency D 株式会社', contact: 'agency-d@example.com', tenants: 2, revenue: '¥400,000', commission: '10%', status: 'inactive', joined: '2025/03/01' },
];

type Agency = typeof agencies[number];

export default function AgenciesPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [modalAgency, setModalAgency] = useState<Agency | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, '代理店管理', 'Agency Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '販売代理店・リセラーの管理と収益追跡', 'Manage resellers and track revenue')}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium w-fit"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <Plus size={14} />{t(lang, '代理店追加', 'Add Agency')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
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
                    <button onClick={() => setModalAgency(agency)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Agency Modal */}
      {modalAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">{t(lang, '代理店を編集', 'Edit Agency')}</h2>
              <button onClick={() => setModalAgency(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '代理店名', 'Agency Name')} *</label>
                <input defaultValue={modalAgency.name} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '連絡先メール', 'Contact Email')} *</label>
                <input defaultValue={modalAgency.contact} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, 'コミッション率', 'Commission')}</label>
                  <input defaultValue={modalAgency.commission} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, 'ステータス', 'Status')}</label>
                  <select defaultValue={modalAgency.status} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active">{t(lang, 'アクティブ', 'Active')}</option>
                    <option value="inactive">{t(lang, '非アクティブ', 'Inactive')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">{t(lang, '管理テナント', 'Managed Tenants')}</label>
                <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-36 overflow-y-auto">
                  {['株式会社テックスタート', 'イノベーション合同会社', '株式会社セールスブースト', 'グロースSaaS株式会社'].map(name => (
                    <label key={name} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked={name !== 'グロースSaaS株式会社'} className="rounded" />
                      <span className="text-xs text-gray-700">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setModalAgency(null)} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{t(lang, 'キャンセル', 'Cancel')}</button>
              <button onClick={() => setModalAgency(null)} className="text-sm px-4 py-2 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>{t(lang, '保存する', 'Save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Agency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">{t(lang, '代理店追加', 'Add Agency')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '代理店名', 'Agency Name')} *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Agency X 株式会社" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '連絡先メール', 'Contact Email')} *</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="contact@agency.com" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, 'コミッション率', 'Commission Rate')}</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10%" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{t(lang, 'キャンセル', 'Cancel')}</button>
              <button onClick={() => setShowAddModal(false)} className="text-sm px-4 py-2 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>{t(lang, '追加する', 'Add Agency')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
