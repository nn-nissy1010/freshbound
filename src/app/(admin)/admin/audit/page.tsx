'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import FilterBar from '@/components/admin/FilterBar';
import { Download, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const auditLogs = [
  { id: 'AUD-1001', admin: 'System Admin', action: 'impersonate_tenant', target: '株式会社テックスタート (T001)', ip: '203.0.113.1', time: '2025/05/10 11:32', severity: 'high' },
  { id: 'AUD-1000', admin: 'System Admin', action: 'plan_upgrade', target: 'グロースSaaS株式会社 (T002): Standard → Enterprise', ip: '203.0.113.1', time: '2025/05/10 10:15', severity: 'medium' },
  { id: 'AUD-0999', admin: 'Support Admin', action: 'password_reset', target: 'User: yamada@techstart.co.jp', ip: '203.0.113.5', time: '2025/05/10 09:48', severity: 'medium' },
  { id: 'AUD-0998', admin: 'System Admin', action: 'tenant_suspended', target: '株式会社マーケットリンク (T004)', ip: '203.0.113.1', time: '2025/05/09 17:20', severity: 'high' },
  { id: 'AUD-0997', admin: 'System Admin', action: 'settings_changed', target: 'SendGrid daily limit: 50000 → 100000', ip: '203.0.113.1', time: '2025/05/09 14:05', severity: 'medium' },
  { id: 'AUD-0996', admin: 'Support Admin', action: 'quota_reset', target: '株式会社デジタルワークス (T003)', ip: '203.0.113.5', time: '2025/05/09 11:30', severity: 'low' },
  { id: 'AUD-0995', admin: 'System Admin', action: 'feature_flag_changed', target: 'agency_portal: false → true', ip: '203.0.113.1', time: '2025/05/08 16:00', severity: 'medium' },
  { id: 'AUD-0994', admin: 'System Admin', action: 'tenant_deleted', target: '旧テナント株式会社 (T099) — DELETED', ip: '203.0.113.1', time: '2025/05/08 10:22', severity: 'critical' },
  { id: 'AUD-0993', admin: 'Support Admin', action: 'campaign_force_stopped', target: 'Campaign C007 — 株式会社マーケットリンク', ip: '203.0.113.5', time: '2025/05/08 09:10', severity: 'high' },
  { id: 'AUD-0992', admin: 'System Admin', action: 'suppression_added', target: 'Domain: spam-domain.co.jp — blacklisted', ip: '203.0.113.1', time: '2025/05/07 15:45', severity: 'medium' },
];

const severityColors: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#fee2e2', text: '#dc2626' },
  high:     { bg: '#fef3c7', text: '#d97706' },
  medium:   { bg: '#dbeafe', text: '#2563eb' },
  low:      { bg: '#f3f4f6', text: '#6b7280' },
};

const actionLabels: Record<string, { ja: string; en: string }> = {
  impersonate_tenant:    { ja: 'テナントなりすまし', en: 'Tenant Impersonation' },
  plan_upgrade:          { ja: 'プランアップグレード', en: 'Plan Upgrade' },
  password_reset:        { ja: 'パスワードリセット', en: 'Password Reset' },
  tenant_suspended:      { ja: 'テナント停止', en: 'Tenant Suspended' },
  settings_changed:      { ja: 'システム設定変更', en: 'Settings Changed' },
  quota_reset:           { ja: 'クォータリセット', en: 'Quota Reset' },
  feature_flag_changed:  { ja: 'フィーチャーフラグ変更', en: 'Feature Flag Changed' },
  tenant_deleted:        { ja: 'テナント削除', en: 'Tenant Deleted' },
  campaign_force_stopped:{ ja: 'キャンペーン強制停止', en: 'Campaign Force Stopped' },
  suppression_added:     { ja: '抑制リスト追加', en: 'Suppression Added' },
};

export default function AuditLogsPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase()) ||
    l.admin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">{t(lang, '監査ログ', 'Audit Logs')}</h1>
            <Shield size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '管理者操作の全履歴を記録・追跡します', 'Track and record all admin operations')}</p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 w-fit">
          <Download size={14} />{t(lang, 'ログをエクスポート', 'Export Logs')}
        </button>
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: t(lang, 'クリティカル', 'Critical'), count: 1, color: '#dc2626', bg: '#fee2e2' },
          { label: t(lang, '高', 'High'), count: 3, color: '#d97706', bg: '#fef3c7' },
          { label: t(lang, '中', 'Medium'), count: 5, color: '#2563eb', bg: '#dbeafe' },
          { label: t(lang, '低', 'Low'), count: 1, color: '#6b7280', bg: '#f3f4f6' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
            <div className="text-xs text-gray-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.count}</div>
            <div className="text-xs text-gray-400">{t(lang, '件（今日）', 'today')}</div>
          </div>
        ))}
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'アクション・対象・管理者で検索', 'Search by action, target or admin')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, '管理者', 'Admin'), options: [t(lang, 'すべて', 'All'), 'System Admin', 'Support Admin'] },
          { label: t(lang, '重要度', 'Severity'), options: [t(lang, 'すべて', 'All'), t(lang, 'クリティカル', 'Critical'), t(lang, '高', 'High'), t(lang, '中', 'Medium'), t(lang, '低', 'Low')] },
          { label: t(lang, '期間', 'Date'), options: [t(lang, '本日', 'Today'), t(lang, '過去7日', 'Last 7 days'), t(lang, '過去30日', 'Last 30 days')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '管理者', 'Admin')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'アクション', 'Action')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '対象', 'Target')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '重要度', 'Severity')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">IP</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '時刻', 'Time')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(log => {
                const sc = severityColors[log.severity] || severityColors.low;
                const actionLabel = actionLabels[log.action]?.[lang] ?? log.action;
                return (
                  <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${log.severity === 'critical' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{log.id}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${log.admin === 'System Admin' ? 'bg-red-500' : 'bg-blue-500'}`}>
                          {log.admin[0]}
                        </div>
                        <span className="text-xs text-gray-700">{log.admin}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-medium text-gray-700">{actionLabel}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[220px] truncate">{log.target}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-gray-400">{log.ip}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{log.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>1-20 / 1,024 {t(lang, '件', 'records')}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <div className="hidden sm:flex gap-1">
            {[1,2,3,'...',52].map((p, i) => (
              <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
            ))}
          </div>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
