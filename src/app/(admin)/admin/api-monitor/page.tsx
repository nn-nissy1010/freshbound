'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import StatCard from '@/components/admin/StatCard';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
const services = [
  {
    name: 'SendGrid',
    status: 'healthy',
    latency: '45ms',
    dailyUsage: 12450,
    dailyLimit: 50000,
    usagePct: 24.9,
    errors: 12,
    errorRate: '0.1%',
    lastCheck: '1分前',
    color: '#3b82f6',
  },
  {
    name: 'OpenAI (GPT-4)',
    status: 'healthy',
    latency: '320ms',
    dailyUsage: 4820,
    dailyLimit: 10000,
    usagePct: 48.2,
    errors: 3,
    errorRate: '0.06%',
    lastCheck: '1分前',
    color: '#10b981',
  },
  {
    name: 'Prospeo',
    status: 'healthy',
    latency: '88ms',
    dailyUsage: 3500,
    dailyLimit: 10000,
    usagePct: 35.0,
    errors: 0,
    errorRate: '0%',
    lastCheck: '1分前',
    color: '#8b5cf6',
  },
  {
    name: 'WhoisJSON',
    status: 'healthy',
    latency: '120ms',
    dailyUsage: 1200,
    dailyLimit: 5000,
    usagePct: 24.0,
    errors: 0,
    errorRate: '0%',
    lastCheck: '2分前',
    color: '#6366f1',
  },
  {
    name: 'Supabase',
    status: 'healthy',
    latency: '12ms',
    dailyUsage: 28000,
    dailyLimit: 100000,
    usagePct: 28.0,
    errors: 0,
    errorRate: '0%',
    lastCheck: '30秒前',
    color: '#10b981',
  },
  {
    name: 'LINE Notify',
    status: 'healthy',
    latency: '65ms',
    dailyUsage: 320,
    dailyLimit: 1000,
    usagePct: 32.0,
    errors: 0,
    errorRate: '0%',
    lastCheck: '2分前',
    color: '#22c55e',
  },
];

export default function APIMonitorPage() {
  const { lang } = useLang();

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'API・外部サービス監視', 'API & External Service Monitor')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, '依存する全APIの稼働状況・使用量・レイテンシを監視します', 'Monitor uptime, usage and latency of all dependent APIs')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {degradedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
              <AlertTriangle size={13} />
              {degradedCount} {t(lang, 'サービス低下中', 'service(s) degraded')}
            </div>
          )}
          {downCount === 0 && degradedCount === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <CheckCircle size={13} />
              {t(lang, '全サービス正常', 'All Services Operational')}
            </div>
          )}
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <RefreshCw size={13} />{t(lang, '更新', 'Refresh')}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label={t(lang, '正常稼働中', 'Healthy')}  value={healthyCount}  icon={CheckCircle}  color="#10b981" />
        <StatCard label={t(lang, '低下中', 'Degraded')}     value={degradedCount} icon={AlertTriangle} color="#f59e0b" />
        <StatCard label={t(lang, 'ダウン', 'Down')}         value={downCount}     icon={XCircle}      color="#ef4444" />
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map(svc => (
          <div key={svc.name} className={`bg-white rounded-xl border shadow-sm p-4 ${svc.status === 'degraded' ? 'border-yellow-200' : svc.status === 'down' ? 'border-red-200' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${svc.status === 'healthy' ? 'bg-green-500' : svc.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm font-semibold text-gray-800">{svc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={svc.status} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={10} />{svc.lastCheck}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">{t(lang, 'レイテンシ', 'Latency')}</div>
                <div className={`text-sm font-bold ${parseInt(svc.latency) > 500 ? 'text-yellow-600' : 'text-gray-800'}`}>{svc.latency}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{t(lang, 'エラー数', 'Errors')}</div>
                <div className={`text-sm font-bold ${svc.errors > 0 ? 'text-red-600' : 'text-gray-800'}`}>{svc.errors}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">{t(lang, 'エラー率', 'Error Rate')}</div>
                <div className="text-sm font-bold text-gray-800">{svc.errorRate}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{t(lang, '本日の使用量', 'Daily Usage')}</span>
                <span className="text-xs font-medium text-gray-700">{svc.dailyUsage.toLocaleString()} / {svc.dailyLimit.toLocaleString()}</span>
              </div>
              <div className="bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${svc.usagePct}%`,
                    backgroundColor: svc.usagePct > 85 ? '#ef4444' : svc.usagePct > 60 ? '#f59e0b' : svc.color,
                  }}
                />
              </div>
              <div className="text-right text-xs text-gray-400 mt-0.5">{svc.usagePct}%</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
