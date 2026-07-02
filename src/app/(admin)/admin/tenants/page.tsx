'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import {
  Plus, Download, MoreVertical, ChevronLeft, ChevronRight,
  Eye, UserCheck, Ban, TrendingUp, RefreshCw, CheckCircle, X, Building2, Clock,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

const tenants = [
  { id: 'T001', name: '株式会社テックスタート', plan: 'standard', users: 5, status: 'active', subscriptionStatus: 'active', emailsSent: 12450, created: '2025/01/15', lastActive: '2025/05/10', reseller: 'Agency A' },
  { id: 'T002', name: 'グロースSaaS株式会社', plan: 'enterprise', users: 12, status: 'active', subscriptionStatus: 'active', emailsSent: 38200, created: '2024/11/02', lastActive: '2025/05/10', reseller: '—' },
  { id: 'T003', name: '株式会社デジタルワークス', plan: 'trial', users: 2, status: 'active', subscriptionStatus: 'trialing', emailsSent: 1200, created: '2025/05/01', lastActive: '2025/05/09', reseller: 'Agency B' },
  { id: 'T004', name: '株式会社マーケットリンク', plan: 'standard', users: 4, status: 'suspended', subscriptionStatus: 'past_due', emailsSent: 9800, created: '2024/12/20', lastActive: '2025/05/08', reseller: '—' },
  { id: 'T005', name: 'イノベーション合同会社', plan: 'standard', users: 3, status: 'active', subscriptionStatus: 'active', emailsSent: 5600, created: '2025/02/10', lastActive: '2025/05/10', reseller: 'Agency A' },
  { id: 'T006', name: '株式会社クラウドビズ', plan: 'enterprise', users: 8, status: 'active', subscriptionStatus: 'active', emailsSent: 28900, created: '2024/09/05', lastActive: '2025/05/10', reseller: '—' },
  { id: 'T007', name: '株式会社セールスブースト', plan: 'standard', users: 6, status: 'active', subscriptionStatus: 'active', emailsSent: 15300, created: '2025/03/18', lastActive: '2025/05/09', reseller: 'Agency C' },
  { id: 'T008', name: '合同会社フューチャーズ', plan: 'trial', users: 1, status: 'inactive', subscriptionStatus: 'canceled', emailsSent: 0, created: '2025/05/08', lastActive: '2025/05/08', reseller: '—' },
];


export default function TenantsPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'テナント管理', 'Tenant Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントの管理・監視・操作を行います', 'Manage, monitor and operate all tenants')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />{t(lang, 'エクスポート', 'Export')}
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />{t(lang, 'テナント追加', 'Add Tenant')}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label={t(lang, '総テナント', 'Total')}    value="48" icon={Building2}    color="#3b82f6" />
        <StatCard label={t(lang, 'アクティブ', 'Active')}   value="44" icon={CheckCircle}  color="#10b981" />
        <StatCard label={t(lang, '停止中', 'Suspended')}    value="2"  icon={Ban}           color="#ef4444" />
        <StatCard label={t(lang, 'トライアル', 'Trial')}    value="6"  icon={Clock}         color="#f59e0b" />
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'テナント名・IDで検索', 'Search by name or ID')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'プラン', 'Plan'), options: [t(lang, 'すべて', 'All'), 'Trial', 'Standard', 'Enterprise'] },
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, 'アクティブ', 'Active'), t(lang, '停止中', 'Suspended'), t(lang, '非アクティブ', 'Inactive')] },
          { label: t(lang, '代理店', 'Reseller'), options: [t(lang, 'すべて', 'All'), 'Agency A', 'Agency B', 'Agency C'] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, '企業名', 'Company')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'プラン', 'Plan')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ユーザー数', 'Users')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'Stripe', 'Stripe')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '配信数', 'Emails Sent')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '作成日', 'Created')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '最終活動', 'Last Active')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '代理店', 'Reseller')}</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(tenant => (
                <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <a href={`/admin/tenants/${tenant.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">{tenant.name}</a>
                      <div className="text-xs text-gray-400 font-mono">{tenant.id}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3"><StatusBadge status={tenant.plan} /></td>
                  <td className="px-3 py-3 text-sm text-gray-700 text-right">{tenant.users}</td>
                  <td className="px-3 py-3"><StatusBadge status={tenant.status} /></td>
                  <td className="px-3 py-3">
                    <StatusBadge status={tenant.subscriptionStatus} />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-700 text-right">{tenant.emailsSent.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{tenant.created}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{tenant.lastActive}</td>
                  <td className="px-3 py-3 text-xs text-gray-500">{tenant.reseller}</td>
                  <td className="px-3 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === tenant.id ? null : tenant.id)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {actionMenu === tenant.id && (
                        <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44">
                          <a href={`/admin/tenants/${tenant.id}`} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                            <Eye size={12} />{t(lang, '詳細を見る', 'View Detail')}
                          </a>
                          <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full">
                            <UserCheck size={12} />{t(lang, 'アクセス', 'Impersonate')}
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full">
                            <TrendingUp size={12} />{t(lang, 'プランアップグレード', 'Upgrade Plan')}
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full">
                            <RefreshCw size={12} />{t(lang, 'クォータリセット', 'Reset Quota')}
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          {tenant.status === 'suspended' ? (
                            <button className="flex items-center gap-2 px-3 py-2 text-xs text-green-600 hover:bg-green-50 w-full">
                              <CheckCircle size={12} />{t(lang, 'アクティブに戻す', 'Activate')}
                            </button>
                          ) : (
                            <button className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full">
                              <Ban size={12} />{t(lang, '停止する', 'Suspend')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{t(lang, `${filtered.length}件表示`, `Showing ${filtered.length} results`)}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <div className="hidden sm:flex gap-1">
            {[1,2,3].map(p => (
              <button key={p} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
            ))}
          </div>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">{t(lang, 'テナント追加', 'Add Tenant')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '企業名', 'Company Name')} *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t(lang, '株式会社〇〇', 'Company name')} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '管理者メール', 'Admin Email')} *</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, 'プラン', 'Plan')} *</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="trial">Trial</option>
                    <option value="standard">Standard</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t(lang, '代理店', 'Reseller')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">—</option>
                    <option value="AG001">Agency A</option>
                    <option value="AG002">Agency B</option>
                    <option value="AG003">Agency C</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Stripe Customer ID</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="cus_xxxxxxxxxxxxxxxx" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">{t(lang, 'キャンセル', 'Cancel')}</button>
              <button className="text-sm px-4 py-2 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>{t(lang, '追加する', 'Add Tenant')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
