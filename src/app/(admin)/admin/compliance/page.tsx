'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { Download, Plus, AlertTriangle, Shield, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

const suppressions = [
  { email: 't.tanaka@sample-tech.co.jp', tenant: '株式会社テックスタート', reason: 'unsubscribe_link', date: '2025/05/10 10:23', domain: 'sample-tech.co.jp', status: 'active' },
  { email: 'sato@innovations.co.jp', tenant: 'グロースSaaS株式会社', reason: 'spam_complaint', date: '2025/05/09 15:44', domain: 'innovations.co.jp', status: 'active' },
  { email: 'info@growth-partner.jp', tenant: '株式会社テックスタート', reason: 'bounce_hard', date: '2025/05/08 11:12', domain: 'growth-partner.jp', status: 'active' },
  { email: 'yamamoto@future-link.co.jp', tenant: 'イノベーション合同会社', reason: 'manual', date: '2025/05/07 09:35', domain: 'future-link.co.jp', status: 'active' },
  { email: 'contact@ds-solution.co.jp', tenant: '株式会社クラウドビズ', reason: 'unsubscribe_link', date: '2025/05/06 16:20', domain: 'ds-solution.co.jp', status: 'active' },
  { email: 'hello@cloud-edge.co.jp', tenant: '株式会社セールスブースト', reason: 'spam_complaint', date: '2025/05/04 14:08', domain: 'cloud-edge.co.jp', status: 'active' },
];

const domainWarnings = [
  { domain: 'unknown-domain.co.jp', tenant: '株式会社クラウドビズ', issue: t('ja', 'ドメイン評判低下', 'Domain reputation drop'), severity: 'high', date: '2025/05/10' },
  { domain: 'old-company.jp', tenant: 'グロースSaaS株式会社', issue: t('ja', 'バウンス率高騰', 'High bounce rate'), severity: 'medium', date: '2025/05/09' },
];

const reasonLabels: Record<string, { ja: string; en: string }> = {
  unsubscribe_link: { ja: '配信停止リンク', en: 'Unsubscribe Link' },
  spam_complaint:   { ja: 'スパム報告', en: 'Spam Complaint' },
  bounce_hard:      { ja: 'ハードバウンス', en: 'Hard Bounce' },
  manual:           { ja: '手動追加', en: 'Manual' },
};

export default function CompliancePage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = suppressions.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'コンプライアンス・配信停止管理', 'Compliance & Unsubscribe Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'グローバル配信停止リスト・スパム報告・ドメイン評判を管理します', 'Manage global suppression list, spam reports and domain reputation')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />{t(lang, '抑制リストをエクスポート', 'Export Suppression List')}
          </button>
          <button className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />{t(lang, '手動追加', 'Manual Add')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label={t(lang, '総抑制数', 'Total Suppressed')} value="2,315" icon={Ban} color="#ef4444" />
        <StatCard label={t(lang, 'スパム報告', 'Spam Complaints')} value="48" icon={AlertTriangle} color="#f59e0b" trend="+3 today" trendUp={false} />
        <StatCard label={t(lang, 'ドメイン警告', 'Domain Warnings')} value="2" icon={Shield} color="#8b5cf6" />
        <StatCard label={t(lang, '今月の追加数', 'Added This Month')} value="187" icon={Ban} color="#6b7280" />
      </div>

      {/* Domain Warnings */}
      {domainWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-red-600" />
            <h3 className="text-sm font-semibold text-red-700">{t(lang, 'ドメイン評判警告', 'Domain Reputation Warnings')}</h3>
          </div>
          <div className="space-y-2">
            {domainWarnings.map(w => (
              <div key={w.domain} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${w.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm font-medium text-gray-700">{w.domain}</span>
                  <span className="text-xs text-gray-500">{w.tenant}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-red-600">{w.issue}</span>
                  <button className="text-xs border border-red-200 text-red-600 rounded px-2 py-0.5 hover:bg-red-50">
                    {t(lang, 'ドメインをブラックリスト', 'Blacklist Domain')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FilterBar
        searchPlaceholder={t(lang, 'メール・テナントで検索', 'Search by email or tenant')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
          { label: t(lang, '理由', 'Reason'), options: [t(lang, 'すべて', 'All'), t(lang, '配信停止リンク', 'Unsubscribe'), t(lang, 'スパム報告', 'Spam'), t(lang, 'バウンス', 'Bounce'), t(lang, '手動', 'Manual')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, 'メールアドレス', 'Email')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '理由', 'Reason')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '追加日', 'Date Added')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ドメイン', 'Domain')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(s => (
              <tr key={s.email} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-700">{s.email}</td>
                <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[140px] truncate">{s.tenant}</td>
                <td className="px-3 py-2.5">
                  <span className="text-xs text-gray-600">{reasonLabels[s.reason]?.[lang] ?? s.reason}</span>
                </td>
                <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{s.date}</td>
                <td className="px-3 py-2.5 text-xs text-gray-500">{s.domain}</td>
                <td className="px-3 py-2.5"><StatusBadge status={s.status} /></td>
                <td className="px-3 py-2.5">
                  <button className="text-xs text-red-500 hover:text-red-600 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50">
                    {t(lang, '削除', 'Remove')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>1-20 / 2,315 {t(lang, '件', 'records')}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          {[1,2,3,'...',116].map((p, i) => (
            <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
          ))}
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
