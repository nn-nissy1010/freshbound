'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const logs = [
  { id: 'LOG-9001', tenant: '株式会社テックスタート', to: 't.tanaka@sample-tech.co.jp', subject: '新サービスのご案内', event: 'opened', time: '2025/05/10 10:45', domain: 'sample-tech.co.jp' },
  { id: 'LOG-9002', tenant: 'グロースSaaS株式会社', to: 'sato@innovations.co.jp', subject: '【ご提案】課題解決のヒント', event: 'replied', time: '2025/05/10 10:32', domain: 'innovations.co.jp' },
  { id: 'LOG-9003', tenant: '株式会社テックスタート', to: 'suzuki@growth-partner.jp', subject: '新サービスのご案内', event: 'sent', time: '2025/05/10 10:15', domain: 'growth-partner.jp' },
  { id: 'LOG-9004', tenant: '株式会社クラウドビズ', to: 'info@unknown-domain.co.jp', subject: '事例のご紹介', event: 'failed', time: '2025/05/10 10:10', domain: 'unknown-domain.co.jp' },
  { id: 'LOG-9005', tenant: 'イノベーション合同会社', to: 'yamamoto@future-link.co.jp', subject: 'サービス資料送付', event: 'unsubscribed', time: '2025/05/10 09:58', domain: 'future-link.co.jp' },
  { id: 'LOG-9006', tenant: '株式会社テックスタート', to: 'nakamura@b-brain.co.jp', subject: '新サービスのご案内', event: 'sent', time: '2025/05/10 09:45', domain: 'b-brain.co.jp' },
  { id: 'LOG-9007', tenant: 'グロースSaaS株式会社', to: 'ito@cloud-edge.co.jp', subject: '【ご提案】課題解決のヒント', event: 'opened', time: '2025/05/10 09:30', domain: 'cloud-edge.co.jp' },
  { id: 'LOG-9008', tenant: '株式会社セールスブースト', to: 'kobayashi@advance-system.co.jp', subject: '新規開拓のご案内', event: 'failed', time: '2025/05/10 09:20', domain: 'advance-system.co.jp' },
];

const eventColors: Record<string, { bg: string; text: string }> = {
  sent:        { bg: '#dbeafe', text: '#2563eb' },
  opened:      { bg: '#dcfce7', text: '#16a34a' },
  replied:     { bg: '#ede9fe', text: '#7c3aed' },
  failed:      { bg: '#fee2e2', text: '#dc2626' },
  unsubscribed:{ bg: '#fef3c7', text: '#d97706' },
};

export default function EmailLogsPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l =>
    l.to.toLowerCase().includes(search.toLowerCase()) ||
    l.tenant.toLowerCase().includes(search.toLowerCase()) ||
    l.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'メールログ', 'Email Logs')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントのメール送受信ログを横断検索できます', 'Search email activity logs across all tenants')}</p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
          <Download size={14} />{t(lang, 'ログをエクスポート', 'Export Logs')}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {[
          { label: t(lang, '送信', 'Sent'), value: '12,450', color: '#3b82f6' },
          { label: t(lang, '開封', 'Opened'), value: '2,614', color: '#10b981' },
          { label: t(lang, '返信', 'Replied'), value: '261', color: '#8b5cf6' },
          { label: t(lang, '失敗', 'Failed'), value: '143', color: '#ef4444' },
          { label: t(lang, '配信停止', 'Unsubscribed'), value: '32', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'メール・テナント・件名で検索', 'Search by email, tenant or subject')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
          { label: t(lang, 'イベント', 'Event'), options: [t(lang, 'すべて', 'All'), t(lang, '送信', 'Sent'), t(lang, '開封', 'Opened'), t(lang, '返信', 'Replied'), t(lang, '失敗', 'Failed'), t(lang, '配信停止', 'Unsubscribed')] },
          { label: t(lang, 'ドメイン', 'Domain'), options: [t(lang, 'すべて', 'All'), 'sample-tech.co.jp', 'innovations.co.jp'] },
          { label: t(lang, '期間', 'Date'), options: [t(lang, '本日', 'Today'), t(lang, '過去7日', 'Last 7 days'), t(lang, '過去30日', 'Last 30 days')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '送信先', 'To')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '件名', 'Subject')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'イベント', 'Event')}</th>
              <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '時刻', 'Time')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(log => {
              const ec = eventColors[log.event] || { bg: '#f3f4f6', text: '#6b7280' };
              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{log.id}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[140px] truncate">{log.tenant}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-700">{log.to}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-700 max-w-[200px] truncate">{log.subject}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: ec.bg, color: ec.text }}>
                      {log.event}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{log.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>1-20 / 12,450 {t(lang, '件', 'records')}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          {[1,2,3,'...',623].map((p, i) => (
            <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
          ))}
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
