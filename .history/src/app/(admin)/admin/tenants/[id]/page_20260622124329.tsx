'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import StatCard from '@/components/admin/StatCard';
import { useState } from 'react';
import {
  ArrowLeft, Mail, Users, Building2, Activity,
  AlertTriangle, StopCircle, RefreshCw, Trash2,
  UserCheck, Key, CreditCard, FileText, Clock,
  Pencil, CheckCircle, X,
} from 'lucide-react';
import Link from 'next/link';

const activityLog = [
  { time: '2025/05/10 10:30', action: 'Campaign started', detail: '新規開拓シナリオA — 1,245 recipients', type: 'info' },
  { time: '2025/05/09 15:22', action: 'CSV imported', detail: '展示会リード_20250509.csv — 2,128 rows', type: 'success' },
  { time: '2025/05/08 09:10', action: 'ICP updated', detail: 'IT企業_成長フェーズ — conditions changed', type: 'info' },
  { time: '2025/05/07 14:05', action: 'SendGrid error', detail: 'Rate limit exceeded — 45 emails failed', type: 'error' },
  { time: '2025/05/06 11:00', action: 'User added', detail: 'sato@techstart.co.jp joined as member', type: 'info' },
];

const campaigns = [
  { name: '新規開拓シナリオA', status: 'running', sent: 1245, openRate: '22.3%', replyRate: '2.3%' },
  { name: '新規開拓シナリオB', status: 'completed', sent: 856, openRate: '19.2%', replyRate: '1.6%' },
  { name: 'フォローアップシナリオ', status: 'queued', sent: 0, openRate: '—', replyRate: '—' },
];

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const { lang } = useLang();
  const [editing, setEditing] = useState(false);
  const tenantStatus = 'active';

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Link href="/admin/tenants" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-800">株式会社テックスタート</h1>
            <StatusBadge status="active" />
            <StatusBadge status="standard" />
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">ID: T001 · {t(lang, '作成日', 'Created')}: 2025/01/15</p>
        </div>
        {/* Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setEditing(!editing)} className={`flex items-center gap-1.5 text-xs border rounded-lg px-3 py-2 bg-white ${editing ? 'border-blue-400 text-blue-600 hover:bg-blue-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Pencil size={13} />{editing ? t(lang, '編集中', 'Editing') : t(lang, '編集', 'Edit')}
          </button>
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <UserCheck size={13} />{t(lang, 'なりすまし', 'Impersonate')}
          </button>
          {tenantStatus === 'suspended' ? (
            <button className="flex items-center gap-1.5 text-xs border border-green-200 rounded-lg px-3 py-2 bg-white hover:bg-green-50 text-green-600">
              <CheckCircle size={13} />{t(lang, 'アクティブに戻す', 'Activate')}
            </button>
          ) : (
            <button className="flex items-center gap-1.5 text-xs border border-orange-200 rounded-lg px-3 py-2 bg-white hover:bg-orange-50 text-orange-600">
              <StopCircle size={13} />{t(lang, 'キャンペーン停止', 'Force Stop')}
            </button>
          )}
          <button className="flex items-center gap-1.5 text-xs border border-blue-200 rounded-lg px-3 py-2 bg-white hover:bg-blue-50 text-blue-600">
            <RefreshCw size={13} />{t(lang, '送信制限リセット', 'Reset Limits')}
          </button>
          <button className="flex items-center gap-1.5 text-xs border border-red-200 rounded-lg px-3 py-2 bg-white hover:bg-red-50 text-red-600">
            <Trash2 size={13} />{t(lang, 'テナント削除', 'Delete Tenant')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard label={t(lang, '総配信数', 'Total Emails')} value="12,450" icon={Mail} color="#3b82f6" />
        <StatCard label={t(lang, 'ユーザー数', 'Users')} value="5" icon={Users} color="#10b981" />
        <StatCard label={t(lang, 'キャンペーン数', 'Campaigns')} value="3" icon={Activity} color="#8b5cf6" />
        <StatCard label={t(lang, '開封率', 'Open Rate')} value="22.3%" icon={Mail} color="#f59e0b" />
        <StatCard label={t(lang, 'エラー数', 'Errors')} value="7" icon={AlertTriangle} color="#ef4444" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: Profile + Usage */}
        <div className="col-span-2 space-y-4">
          {/* Company Profile */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Building2 size={15} className="text-gray-500" />{t(lang, '企業プロフィール', 'Company Profile')}
              </h2>
              {editing && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 text-gray-500"><X size={11} />{t(lang, 'キャンセル', 'Cancel')}</button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs rounded-lg px-2 py-1 text-white font-medium" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}><CheckCircle size={11} />{t(lang, '保存', 'Save')}</button>
                </div>
              )}
            </div>
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t(lang, '企業名', 'Company Name'), value: '株式会社テックスタート', key: 'name' },
                  { label: t(lang, '業種', 'Industry'), value: 'IT・ソフトウェア', key: 'industry' },
                  { label: t(lang, '従業員数', 'Employees'), value: '51-100名', key: 'employees' },
                  { label: t(lang, '代表メール', 'Email'), value: 'admin@techstart.co.jp', key: 'email' },
                  { label: t(lang, '電話番号', 'Phone'), value: '03-1234-5678', key: 'phone' },
                  { label: t(lang, '代理店', 'Reseller'), value: 'Agency A', key: 'reseller' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                    <input defaultValue={f.value} className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t(lang, 'プラン', 'Plan')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="trial">Trial</option>
                    <option value="standard" selected>Standard</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">{t(lang, 'ステータス', 'Status')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="active" selected>Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t(lang, '企業名', 'Company Name'), value: '株式会社テックスタート' },
                  { label: t(lang, 'テナントID', 'Tenant ID'), value: 'T001', mono: true },
                  { label: t(lang, '業種', 'Industry'), value: 'IT・ソフトウェア' },
                  { label: t(lang, '従業員数', 'Employees'), value: '51-100名' },
                  { label: t(lang, '代表メール', 'Email'), value: 'admin@techstart.co.jp' },
                  { label: t(lang, '電話番号', 'Phone'), value: '03-1234-5678' },
                  { label: t(lang, 'プラン', 'Plan'), value: 'Standard' },
                  { label: t(lang, '代理店', 'Reseller'), value: 'Agency A' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-xs text-gray-500 mb-0.5">{f.label}</div>
                    <div className={`text-sm text-gray-800 ${f.mono ? 'font-mono' : ''}`}>{f.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campaigns */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">{t(lang, '最近のキャンペーン', 'Recent Campaigns')}</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-2">{t(lang, 'キャンペーン名', 'Campaign')}</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, 'ステータス', 'Status')}</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '配信数', 'Sent')}</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '開封率', 'Open')}</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '返信率', 'Reply')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {campaigns.map(c => (
                  <tr key={c.name} className="hover:bg-gray-50">
                    <td className="px-5 py-2.5 text-sm text-gray-700">{c.name}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{c.sent.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{c.openRate}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{c.replyRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={15} className="text-gray-500" />{t(lang, '活動ログ', 'Activity Log')}
            </h2>
            <div className="space-y-3">
              {activityLog.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.type === 'error' ? 'bg-red-500' : log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{log.action}</span>
                      <span className="text-xs text-gray-400">{log.time}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{log.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* SendGrid Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">{t(lang, 'SendGrid状態', 'SendGrid Status')}</h3>
            <div className="space-y-2">
              {[
                { label: t(lang, '接続状態', 'Connection'), value: t(lang, '正常', 'Connected'), ok: true },
                { label: 'SPF/DKIM', value: t(lang, '設定済み', 'Configured'), ok: true },
                { label: t(lang, '本日の送信数', 'Today Sent'), value: '1,245' },
                { label: t(lang, '日次上限', 'Daily Limit'), value: '3,000' },
                { label: t(lang, 'バウンス率', 'Bounce Rate'), value: '1.2%' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className={`text-xs font-medium ${item.ok === true ? 'text-green-600' : item.ok === false ? 'text-red-600' : 'text-gray-700'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-xs border border-blue-200 text-blue-600 rounded-lg py-1.5 hover:bg-blue-50 flex items-center justify-center gap-1">
              <RefreshCw size={11} />{t(lang, 'API再接続', 'Reconnect API')}
            </button>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Key size={14} className="text-gray-500" />{t(lang, 'APIキー', 'API Keys')}
            </h3>
            <div className="space-y-2">
              {['SendGrid', 'musubu', 'Hunter.io', 'OpenAI'].map(api => (
                <div key={api} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{api}</span>
                  <span className="text-xs font-mono text-gray-400">••••••••••••3f2a</span>
                </div>
              ))}
            </div>
          </div>

          {/* Billing / Stripe */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CreditCard size={14} className="text-gray-500" />{t(lang, '請求情報 (Stripe)', 'Billing (Stripe)')}
            </h3>
            <div className="space-y-2">
              {[
                { label: 'stripe_customer_id', value: 'cus_Abc123XyzDemo', mono: true },
                { label: 'stripe_subscription_id', value: 'sub_Xyz789AbcDemo', mono: true },
                { label: 'subscription_status', value: 'active', highlight: true },
                { label: t(lang, 'プラン', 'Plan'), value: 'Standard' },
                { label: t(lang, '月額', 'Monthly'), value: '¥200,000' },
                { label: t(lang, '次回請求日', 'Next Billing'), value: '2025/06/01' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500 shrink-0">{item.label}</span>
                  <span className={`text-xs font-medium truncate ${item.mono ? 'font-mono text-gray-500' : item.highlight ? 'text-green-600' : 'text-gray-700'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CSV Imports */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-gray-500" />{t(lang, '最近のCSV取込', 'Recent CSV Imports')}
            </h3>
            <div className="space-y-2">
              {[
                { file: '展示会リード_20250509.csv', rows: 2128, status: 'completed' },
                { file: '営業リスト_20250502.csv', rows: 1856, status: 'completed' },
                { file: 'エラーファイル.csv', rows: 0, status: 'failed' },
              ].map(item => (
                <div key={item.file} className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-700 truncate">{item.file}</div>
                    <div className="text-xs text-gray-400">{item.rows.toLocaleString()} rows</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
