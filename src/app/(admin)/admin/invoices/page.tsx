'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { Download, ChevronLeft, ChevronRight, CreditCard, DollarSign, FileText, AlertCircle } from 'lucide-react';

const invoices = [
  { id: 'INV-2025-0510', tenant: 'グロースSaaS株式会社', stripeInvoiceId: 'in_1PaXxYAbc123', amount: '¥500,000', currency: 'JPY', status: 'paid', plan: 'enterprise', billingReason: 'subscription_cycle', paidAt: '2025/05/10 09:15', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0509', tenant: '株式会社クラウドビズ', stripeInvoiceId: 'in_1PaXxYDef456', amount: '¥500,000', currency: 'JPY', status: 'paid', plan: 'enterprise', billingReason: 'subscription_cycle', paidAt: '2025/05/09 10:22', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0508', tenant: '株式会社テックスタート', stripeInvoiceId: 'in_1PaXxYGhi789', amount: '¥200,000', currency: 'JPY', status: 'paid', plan: 'standard', billingReason: 'subscription_cycle', paidAt: '2025/05/08 14:05', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0507', tenant: 'イノベーション合同会社', stripeInvoiceId: 'in_1PaXxYJkl012', amount: '¥200,000', currency: 'JPY', status: 'paid', plan: 'standard', billingReason: 'subscription_cycle', paidAt: '2025/05/07 11:30', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0506', tenant: '株式会社マーケットリンク', stripeInvoiceId: 'in_1PaXxYMno345', amount: '¥200,000', currency: 'JPY', status: 'past_due', plan: 'standard', billingReason: 'subscription_cycle', paidAt: '—', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0505', tenant: '株式会社セールスブースト', stripeInvoiceId: 'in_1PaXxYPqr678', amount: '¥200,000', currency: 'JPY', status: 'paid', plan: 'standard', billingReason: 'subscription_cycle', paidAt: '2025/05/05 08:44', period: '2025/05/01 〜 2025/05/31' },
  { id: 'INV-2025-0504', tenant: '株式会社デジタルワークス', stripeInvoiceId: 'in_1PaXxYStu901', amount: '¥0', currency: 'JPY', status: 'paid', plan: 'trial', billingReason: 'subscription_create', paidAt: '2025/05/01 09:00', period: '2025/05/01 〜 2025/05/14' },
  { id: 'INV-2025-0503', tenant: '合同会社フューチャーズ', stripeInvoiceId: 'in_1PaXxYVwx234', amount: '¥200,000', currency: 'JPY', status: 'canceled', plan: 'standard', billingReason: 'subscription_update', paidAt: '—', period: '2025/04/01 〜 2025/04/30' },
];

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  paid:     { label: 'paid',     bg: '#dcfce7', text: '#16a34a' },
  past_due: { label: 'past_due', bg: '#fee2e2', text: '#dc2626' },
  canceled: { label: 'canceled', bg: '#f3f4f6', text: '#6b7280' },
  open:     { label: 'open',     bg: '#dbeafe', text: '#2563eb' },
};

export default function InvoicesPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv =>
    inv.tenant.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.stripeInvoiceId.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, '')), 0);
  const pastDueCount = invoices.filter(i => i.status === 'past_due').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, '請求書管理', 'Invoice Management')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'Stripe経由の請求履歴を管理します', 'Manage billing history via Stripe')}</p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 w-fit">
          <Download size={14} />{t(lang, 'CSVエクスポート', 'Export CSV')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500" /></div>
            <span className="text-xs text-gray-500">{t(lang, '総請求数', 'Total Invoices')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center"><DollarSign size={14} className="text-green-500" /></div>
            <span className="text-xs text-gray-500">{t(lang, '今月の収益', 'Revenue (Month)')}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">¥{(totalMRR / 10000).toFixed(0)}<span className="text-sm font-normal text-gray-500">万</span></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><AlertCircle size={14} className="text-red-500" /></div>
            <span className="text-xs text-gray-500">{t(lang, '未払い', 'Past Due')}</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{pastDueCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center"><CreditCard size={14} className="text-purple-500" /></div>
            <span className="text-xs text-gray-500">{t(lang, '支払い済み', 'Paid')}</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{invoices.filter(i => i.status === 'paid').length}</div>
        </div>
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'テナント名・請求書ID・Stripe IDで検索', 'Search by tenant, invoice ID or Stripe ID')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), 'paid', 'past_due', 'canceled', 'open'] },
          { label: t(lang, 'プラン', 'Plan'), options: [t(lang, 'すべて', 'All'), 'Trial', 'Standard', 'Enterprise'] },
          { label: t(lang, '期間', 'Period'), options: [t(lang, '今月', 'This Month'), t(lang, '過去3ヶ月', 'Last 3 months'), t(lang, '過去12ヶ月', 'Last 12 months')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, '請求書ID', 'Invoice ID')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">Stripe Invoice ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'プラン', 'Plan')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '金額', 'Amount')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '請求理由', 'Billing Reason')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '支払日時', 'Paid At')}</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(inv => {
                const s = statusMap[inv.status] ?? statusMap.open;
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-xs font-mono text-gray-700">{inv.id}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{inv.period}</div>
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{inv.tenant}</td>
                    <td className="px-3 py-3 text-xs font-mono text-gray-400">{inv.stripeInvoiceId}</td>
                    <td className="px-3 py-3"><StatusBadge status={inv.plan} /></td>
                    <td className="px-3 py-3 text-sm font-bold text-gray-800 text-right">{inv.amount}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{inv.billingReason}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{inv.paidAt}</td>
                    <td className="px-3 py-3">
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                        <Download size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{t(lang, `${filtered.length}件表示`, `Showing ${filtered.length} results`)}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <div className="hidden sm:flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
            ))}
          </div>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
