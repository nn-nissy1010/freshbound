'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import StatCard from '@/components/admin/StatCard';
import { Mail, AlertTriangle, Clock, CheckCircle, PauseCircle, Eye, StopCircle } from 'lucide-react';

const campaigns = [
  { id: 'C001', tenant: '株式会社テックスタート', name: '新規開拓シナリオA（初回）', status: 'running', sent: 1245, failed: 12, bounceRate: '1.2%', spamRisk: 'low', queued: 234, started: '2025/05/10 10:00' },
  { id: 'C002', tenant: 'グロースSaaS株式会社', name: 'エンタープライズ向けシナリオ', status: 'running', sent: 3820, failed: 45, bounceRate: '1.8%', spamRisk: 'medium', queued: 580, started: '2025/05/10 09:30' },
  { id: 'C003', tenant: '株式会社デジタルワークス', name: 'トライアル配信テスト', status: 'queued', sent: 0, failed: 0, bounceRate: '—', spamRisk: 'low', queued: 120, started: '—' },
  { id: 'C004', tenant: 'イノベーション合同会社', name: 'フォローアップシナリオB', status: 'paused', sent: 560, failed: 8, bounceRate: '0.9%', spamRisk: 'low', queued: 0, started: '2025/05/09 14:00' },
  { id: 'C005', tenant: '株式会社クラウドビズ', name: '大規模一斉配信', status: 'running', sent: 8900, failed: 120, bounceRate: '2.8%', spamRisk: 'high', queued: 1200, started: '2025/05/10 08:00' },
  { id: 'C006', tenant: '株式会社セールスブースト', name: '新規開拓シナリオC', status: 'completed', sent: 2100, failed: 18, bounceRate: '1.1%', spamRisk: 'low', queued: 0, started: '2025/05/09 10:00' },
  { id: 'C007', tenant: '株式会社マーケットリンク', name: '停止前最終配信', status: 'failed', sent: 320, failed: 320, bounceRate: '—', spamRisk: 'high', queued: 0, started: '2025/05/08 11:00' },
];

const spamColors: Record<string, { bg: string; text: string }> = {
  low:    { bg: '#dcfce7', text: '#16a34a' },
  medium: { bg: '#fef3c7', text: '#d97706' },
  high:   { bg: '#fee2e2', text: '#dc2626' },
};

export default function CampaignsPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">{t(lang, 'キャンペーン監視', 'Campaign Monitoring')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントの配信キャンペーンをリアルタイム監視します', 'Real-time monitoring of all tenant campaigns')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <StatCard label={t(lang, '実行中', 'Running')} value="3" icon={Mail} color="#3b82f6" />
        <StatCard label={t(lang, 'キュー待機', 'Queued')} value="2,134" sub={t(lang, 'ジョブ', 'jobs')} icon={Clock} color="#f59e0b" />
        <StatCard label={t(lang, '失敗', 'Failed')} value="1" icon={AlertTriangle} color="#ef4444" />
        <StatCard label={t(lang, '一時停止', 'Paused')} value="1" icon={PauseCircle} color="#6b7280" />
        <StatCard label={t(lang, '完了（本日）', 'Completed Today')} value="1" icon={CheckCircle} color="#10b981" />
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'キャンペーン名・テナントで検索', 'Search by campaign or tenant')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社', '株式会社クラウドビズ'] },
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, '実行中', 'Running'), t(lang, 'キュー', 'Queued'), t(lang, '失敗', 'Failed'), t(lang, '一時停止', 'Paused'), t(lang, '完了', 'Completed')] },
          { label: t(lang, 'スパムリスク', 'Spam Risk'), options: [t(lang, 'すべて', 'All'), t(lang, '低', 'Low'), t(lang, '中', 'Medium'), t(lang, '高', 'High')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, 'キャンペーン', 'Campaign')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '配信数', 'Sent')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '失敗数', 'Failed')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'バウンス率', 'Bounce')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'スパムリスク', 'Spam Risk')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'キュー', 'Queue')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '開始時刻', 'Started')}</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => {
                const sc = spamColors[c.spamRisk] || spamColors.low;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{c.id}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 max-w-[140px] truncate">{c.tenant}</td>
                    <td className="px-3 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-right">{c.sent.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">
                      <span className={`text-sm font-medium ${c.failed > 0 ? 'text-red-600' : 'text-gray-700'}`}>{c.failed}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-right">{c.bounceRate}</td>
                    <td className="px-3 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {c.spamRisk === 'low' ? t(lang, '低', 'Low') : c.spamRisk === 'medium' ? t(lang, '中', 'Medium') : t(lang, '高', 'High')}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-700 text-right">{c.queued.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{c.started}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded text-gray-400" title={t(lang, '詳細', 'Detail')}>
                          <Eye size={13} />
                        </button>
                        {c.status === 'running' && (
                          <button className="p-1 hover:bg-red-50 rounded text-red-400" title={t(lang, '停止', 'Stop')}>
                            <StopCircle size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
