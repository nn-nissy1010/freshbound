'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { MoreVertical, ChevronLeft, ChevronRight, KeyRound, Ban, Eye, LogIn } from 'lucide-react';

const users = [
  { id: 'U001', name: '山田 太郎', email: 'yamada@techstart.co.jp', tenant: '株式会社テックスタート', agency: null, role: 'super_admin', lastLogin: '2025/05/10 09:15', status: 'active' },
  { id: 'U002', name: '佐藤 花子', email: 'sato@techstart.co.jp', tenant: '株式会社テックスタート', agency: null, role: 'support', lastLogin: '2025/05/09 18:32', status: 'active' },
  { id: 'U003', name: '鈴木 一郎', email: 'suzuki@growthsaas.co.jp', tenant: 'グロースSaaS株式会社', agency: null, role: 'super_admin', lastLogin: '2025/05/10 08:45', status: 'active' },
  { id: 'U004', name: '高橋 健', email: 'takahashi@digitalworks.co.jp', tenant: '株式会社デジタルワークス', agency: null, role: 'support', lastLogin: '2025/05/08 14:20', status: 'active' },
  { id: 'U005', name: '中村 翔', email: 'nakamura@marketlink.co.jp', tenant: '株式会社マーケットリンク', agency: null, role: 'support', lastLogin: '2025/05/01 10:00', status: 'suspended' },
  { id: 'U006', name: '伊藤 大輔', email: 'ito@innovation.co.jp', tenant: 'イノベーション合同会社', agency: null, role: 'super_admin', lastLogin: '2025/05/10 11:30', status: 'active' },
  { id: 'U007', name: '小林 直樹', email: 'kobayashi@cloudbiz.co.jp', tenant: '株式会社クラウドビズ', agency: null, role: 'support', lastLogin: '2025/05/09 16:00', status: 'active' },
  { id: 'U008', name: '山本 美咲', email: 'yamamoto@salesboost.co.jp', tenant: '株式会社セールスブースト', agency: null, role: 'super_admin', lastLogin: '2025/05/10 07:55', status: 'active' },
  // C-2: 代理店スタッフ — 担当テナントのみアクセス可（impersonate_tenant経由）
  { id: 'AG-U001', name: '田中 エージェント', email: 'tanaka@agency-a.co.jp', tenant: '（代理店）', agency: 'Agency A', role: 'agency_staff', lastLogin: '2025/05/10 10:00', status: 'active' },
  { id: 'AG-U002', name: '西村 サポート', email: 'nishimura@agency-b.co.jp', tenant: '（代理店）', agency: 'Agency B', role: 'agency_staff', lastLogin: '2025/05/09 14:30', status: 'active' },
];

export default function UsersPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'ユーザー管理', 'User Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントのユーザーを横断管理します', 'Manage users across all tenants')}</p>
        </div>
      </div>

      <FilterBar
        searchPlaceholder={t(lang, '名前・メール・テナントで検索', 'Search by name, email or tenant')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'ロール', 'Role'), options: [t(lang, 'すべて', 'All'), t(lang, 'テナント管理者', 'Tenant Admin'), t(lang, 'サポート', 'Support'), t(lang, '代理店スタッフ', 'Agency Staff')] },
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, 'アクティブ', 'Active'), t(lang, '停止中', 'Suspended')] },
          { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, 'ユーザー', 'User')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント / 代理店', 'Tenant / Agency')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ロール', 'Role')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '最終ログイン', 'Last Login')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {user.role === 'agency_staff' ? (
                    <div>
                      <div className="text-xs font-medium text-amber-700">{user.agency}</div>
                      <div className="text-xs text-gray-400">{t(lang, '代理店アカウント', 'Agency account')}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600">{user.tenant}</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  {user.role === 'agency_staff' ? (
                    <StatusBadge status="agency_staff" label={t(lang, '代理店スタッフ', 'Agency Staff')} />
                  ) : (
                    <StatusBadge
                      status={user.role === 'super_admin' ? 'tenant_admin' : 'support'}
                      label={user.role === 'super_admin' ? t(lang, 'テナント管理者', 'Tenant Admin') : t(lang, 'サポート', 'Support')}
                    />
                  )}
                </td>
                <td className="px-3 py-3 text-xs text-gray-500">{user.lastLogin}</td>
                <td className="px-3 py-3"><StatusBadge status={user.status} /></td>
                <td className="px-3 py-3">
                  <div className="relative">
                    <button
                      onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                      className="p-1 hover:bg-gray-100 rounded text-gray-400"
                    >
                      <MoreVertical size={14} />
                    </button>
                    {actionMenu === user.id && (
                      <div className="absolute right-0 top-7 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-48">
                        <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full">
                          <Eye size={12} />{t(lang, '詳細を見る', 'View Detail')}
                        </button>
                        {user.role === 'agency_staff' && (
                          <button className="flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 w-full">
                            <LogIn size={12} />{t(lang, '担当テナントを確認', 'View Assigned Tenants')}
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full">
                          <KeyRound size={12} />{t(lang, 'パスワードリセット', 'Reset Password')}
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full">
                          <Ban size={12} />{t(lang, 'ユーザー停止', 'Suspend User')}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{t(lang, `${filtered.length}件表示`, `Showing ${filtered.length} results`)}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          {[1,2,3].map(p => (
            <button key={p} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
          ))}
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        ※ {t(lang, '代理店スタッフは担当テナントへの「なりすましログイン」経由でのみアクセス可能です（監査ログに記録されます）', 'Agency staff access assigned tenants via impersonation only (logged in audit trail)')}
      </p>
    </div>
  );
}
