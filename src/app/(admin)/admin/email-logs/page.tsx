'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import { ChevronLeft, ChevronRight, Download, RefreshCw, AlertCircle } from 'lucide-react';

const logs = [
  { id: 'LOG-9001', tenant: '株式会社テックスタート',    to: 't.tanaka@sample-tech.co.jp',      subject: '新サービスのご案内',        event: 'opened',      time: '2025/05/10 10:45' },
  { id: 'LOG-9002', tenant: 'グロースSaaS株式会社',      to: 'sato@innovations.co.jp',          subject: '【ご提案】課題解決のヒント', event: 'replied',     time: '2025/05/10 10:32' },
  { id: 'LOG-9003', tenant: '株式会社テックスタート',    to: 'suzuki@growth-partner.jp',        subject: '新サービスのご案内',        event: 'sent',        time: '2025/05/10 10:15' },
  { id: 'LOG-9005', tenant: 'イノベーション合同会社',    to: 'yamamoto@future-link.co.jp',      subject: 'サービス資料送付',          event: 'unsubscribed', time: '2025/05/10 09:58' },
  { id: 'LOG-9006', tenant: '株式会社テックスタート',    to: 'nakamura@b-brain.co.jp',          subject: '新サービスのご案内',        event: 'sent',        time: '2025/05/10 09:45' },
  { id: 'LOG-9007', tenant: 'グロースSaaS株式会社',      to: 'ito@cloud-edge.co.jp',            subject: '【ご提案】課題解決のヒント', event: 'opened',     time: '2025/05/10 09:30' },
];

const queueEmails = [
  { id: 'Q-0041', tenant: '株式会社テックスタート',    to: 'yamada@techstart.co.jp',          subject: '新サービスのご案内',         scheduledAt: '2025/05/10 11:00', status: 'pending' },
  { id: 'Q-0042', tenant: 'グロースSaaS株式会社',      to: 'kato@growth-saas.co.jp',          subject: '【ご提案】課題解決のヒント',  scheduledAt: '2025/05/10 11:00', status: 'pending' },
  { id: 'Q-0043', tenant: '株式会社クラウドビズ',       to: 'hasegawa@cloudbiz.co.jp',         subject: '事例のご紹介',               scheduledAt: '2025/05/10 11:30', status: 'processing' },
  { id: 'Q-0044', tenant: 'イノベーション合同会社',    to: 'fujita@innovation-llc.co.jp',     subject: 'サービス資料送付',            scheduledAt: '2025/05/10 12:00', status: 'pending' },
  { id: 'Q-0045', tenant: '株式会社セールスブースト',  to: 'ogawa@salesboost.co.jp',          subject: '新規開拓のご案内',            scheduledAt: '2025/05/10 12:00', status: 'pending' },
];

const errorEmails = [
  { id: 'ERR-0021', tenant: '株式会社クラウドビズ',      to: 'info@unknown-domain.co.jp',       subject: '事例のご紹介',        errorCode: '550', errorMsg: 'Mailbox does not exist',            time: '2025/05/10 10:10', retryable: false },
  { id: 'ERR-0022', tenant: '株式会社セールスブースト',  to: 'kobayashi@advance-system.co.jp',  subject: '新規開拓のご案内',    errorCode: '421', errorMsg: 'Too many connections from sender',  time: '2025/05/10 09:20', retryable: true },
  { id: 'ERR-0023', tenant: 'グロースSaaS株式会社',      to: 'noreply@blocked-domain.jp',       subject: '【ご提案】ご確認ください', errorCode: '554', errorMsg: 'Message rejected as spam',      time: '2025/05/10 08:55', retryable: false },
  { id: 'ERR-0024', tenant: '株式会社テックスタート',    to: 'invalid@@malformed.co.jp',        subject: '新サービスのご案内',  errorCode: '501', errorMsg: 'Invalid email address format',      time: '2025/05/10 08:30', retryable: false },
];

const eventColors: Record<string, { bg: string; text: string }> = {
  sent:         { bg: '#dbeafe', text: '#2563eb' },
  opened:       { bg: '#dcfce7', text: '#16a34a' },
  replied:      { bg: '#ede9fe', text: '#7c3aed' },
  unsubscribed: { bg: '#fef3c7', text: '#d97706' },
};

type Tab = 'queue' | 'log' | 'error';

export default function EmailLogsPage() {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(l =>
    l.to.toLowerCase().includes(search.toLowerCase()) ||
    l.tenant.toLowerCase().includes(search.toLowerCase()) ||
    l.subject.toLowerCase().includes(search.toLowerCase())
  );

  const filteredQueue = queueEmails.filter(q =>
    q.to.toLowerCase().includes(search.toLowerCase()) ||
    q.tenant.toLowerCase().includes(search.toLowerCase())
  );

  const filteredErrors = errorEmails.filter(e =>
    e.to.toLowerCase().includes(search.toLowerCase()) ||
    e.tenant.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { id: Tab; labelJa: string; labelEn: string; count: number }[] = [
    { id: 'queue', labelJa: 'キュー',   labelEn: 'Queue',  count: queueEmails.length },
    { id: 'log',   labelJa: 'ログ',     labelEn: 'Log',    count: logs.length },
    { id: 'error', labelJa: 'エラー',   labelEn: 'Errors', count: errorEmails.length },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'メール配信監視', 'Email Delivery Monitor')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントのメール配信状況を横断確認できます', 'Monitor email delivery status across all tenants')}</p>
        </div>
        <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 w-fit">
          <Download size={14} />{t(lang, 'ログをエクスポート', 'Export Logs')}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="text-xs text-gray-500">{t(lang, 'キュー（配信前）', 'Queue (Pending)')}</div>
          <div className="text-xl font-bold mt-1 text-yellow-500">{queueEmails.length.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="text-xs text-gray-500">{t(lang, '配信成功', 'Delivered')}</div>
          <div className="text-xl font-bold mt-1 text-blue-500">12,307</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="text-xs text-gray-500">{t(lang, '開封', 'Opened')}</div>
          <div className="text-xl font-bold mt-1 text-green-500">2,614</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
          <div className="text-xs text-gray-500">{t(lang, 'エラー（未着）', 'Errors (Undelivered)')}</div>
          <div className="text-xl font-bold mt-1 text-red-500">{errorEmails.length.toLocaleString()}</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t(lang, tab.labelJa, tab.labelEn)}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Queue tab */}
      {activeTab === 'queue' && (
        <>
          <FilterBar
            searchPlaceholder={t(lang, 'メール・テナントで検索', 'Search by email or tenant')}
            onSearch={setSearch}
            filters={[
              { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
              { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, '待機中', 'Pending'), t(lang, '処理中', 'Processing')] },
            ]}
          />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">{t(lang, '配信待ちメール', 'Queued Emails')}</h3>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded px-2.5 py-1.5 hover:bg-gray-50">
                <RefreshCw size={11} />{t(lang, '更新', 'Refresh')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '送信先', 'To')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '件名', 'Subject')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '配信予定時刻', 'Scheduled At')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredQueue.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{q.id}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[140px] truncate">{q.tenant}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700">{q.to}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700 max-w-[200px] truncate">{q.subject}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{q.scheduledAt}</td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {q.status === 'processing' ? t(lang, '処理中', 'Processing') : t(lang, '待機中', 'Pending')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Log tab */}
      {activeTab === 'log' && (
        <>
          <FilterBar
            searchPlaceholder={t(lang, 'メール・テナント・件名で検索', 'Search by email, tenant or subject')}
            onSearch={setSearch}
            filters={[
              { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
              { label: t(lang, 'イベント', 'Event'), options: [t(lang, 'すべて', 'All'), t(lang, '送信', 'Sent'), t(lang, '開封', 'Opened'), t(lang, '返信', 'Replied'), t(lang, '配信停止', 'Unsubscribed')] },
              { label: t(lang, '期間', 'Date'), options: [t(lang, '本日', 'Today'), t(lang, '過去7日', 'Last 7 days'), t(lang, '過去30日', 'Last 30 days')] },
            ]}
          />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
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
                  {filteredLogs.map(log => {
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
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>1-20 / 12,307 {t(lang, '件', 'records')}</span>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
              <div className="hidden sm:flex gap-1">
                {[1, 2, 3, '...', 616].map((p, i) => (
                  <button key={i} className={`w-7 h-7 rounded text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-600'}`}>{p}</button>
                ))}
              </div>
              <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
            </div>
          </div>
        </>
      )}

      {/* Error tab */}
      {activeTab === 'error' && (
        <>
          <FilterBar
            searchPlaceholder={t(lang, 'メール・テナントで検索', 'Search by email or tenant')}
            onSearch={setSearch}
            filters={[
              { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社', '株式会社クラウドビズ'] },
              { label: t(lang, 'エラーコード', 'Error Code'), options: [t(lang, 'すべて', 'All'), '550', '421', '554', '501'] },
            ]}
          />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <h3 className="text-sm font-semibold text-gray-700">{t(lang, '配信失敗メール', 'Undelivered Emails')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '送信先', 'To')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '件名', 'Subject')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'エラー', 'Error')}</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '時刻', 'Time')}</th>
                    <th className="px-3 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredErrors.map(err => (
                    <tr key={err.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{err.id}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[130px] truncate">{err.tenant}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700">{err.to}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-700 max-w-[180px] truncate">{err.subject}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono bg-red-50 text-red-600 px-1.5 py-0.5 rounded">{err.errorCode}</span>
                          <span className="text-xs text-red-500 max-w-[180px] truncate">{err.errorMsg}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{err.time}</td>
                      <td className="px-3 py-2.5">
                        {err.retryable && (
                          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">
                            <RefreshCw size={10} />{t(lang, '再試行', 'Retry')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
