'use client';

import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import {
  RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle,
  ChevronDown, PlayCircle, List, Building2, Globe, UserSearch,
  Star, Mail, ChevronRight,
} from 'lucide-react';

type StepStatus = 'success' | 'failed' | 'running' | 'pending' | 'warning';

interface PipelineStep {
  id: number;
  labelJa: string;
  labelEn: string;
  features: string;
  descJa: string;
  descEn: string;
  icon: React.ElementType;
  status: StepStatus;
  successCount: number;
  failCount: number;
  lastRun: string;
  duration: string;
}

const steps: PipelineStep[] = [
  {
    id: 1,
    labelJa: 'リスト抽出・取込',
    labelEn: 'List Extraction & Import',
    features: 'F-01 / F-02B',
    descJa: 'ICP条件による企業抽出 / CSVインポート',
    descEn: 'ICP-based company extraction / CSV import',
    icon: List,
    status: 'success',
    successCount: 1243,
    failCount: 0,
    lastRun: '06:00',
    duration: '3m 42s',
  },
  {
    id: 2,
    labelJa: '企業発掘・電話番号取得',
    labelEn: 'Company Discovery & Phone Numbers',
    features: 'F-02 / F-03A',
    descJa: 'musubu経由で企業リスト取得・電話番号付与',
    descEn: 'Company list via musubu + phone number enrichment',
    icon: Building2,
    status: 'warning',
    successCount: 1198,
    failCount: 45,
    lastRun: '06:04',
    duration: '8m 11s',
  },
  {
    id: 3,
    labelJa: '新規HP判定',
    labelEn: 'New HP Detection',
    features: 'F-02A',
    descJa: 'WhoisJSONでドメイン登録日を判定・フラグ付与',
    descEn: 'Domain registration date check via WhoisJSON',
    icon: Globe,
    status: 'success',
    successCount: 1198,
    failCount: 0,
    lastRun: '06:12',
    duration: '2m 05s',
  },
  {
    id: 4,
    labelJa: '担当者発掘',
    labelEn: 'Contact Discovery',
    features: 'F-03',
    descJa: 'Prospeo APIで担当者メールアドレスを特定',
    descEn: 'Find contact emails via Prospeo API',
    icon: UserSearch,
    status: 'success',
    successCount: 1034,
    failCount: 164,
    lastRun: '06:14',
    duration: '11m 38s',
  },
  {
    id: 5,
    labelJa: 'AIスコアリング',
    labelEn: 'AI Scoring',
    features: 'F-04',
    descJa: 'ICPマッチ度・新規HPフラグをもとにスコア算出（0〜100点）',
    descEn: 'Score companies 0–100 based on ICP match + HP flag',
    icon: Star,
    status: 'success',
    successCount: 1034,
    failCount: 0,
    lastRun: '06:26',
    duration: '1m 52s',
  },
  {
    id: 6,
    labelJa: 'AIメール生成',
    labelEn: 'AI Email Generation',
    features: 'F-05',
    descJa: 'GPT-4o-miniでパーソナライズメールを自動生成・下書き保存',
    descEn: 'Generate personalized emails via GPT-4o-mini',
    icon: Mail,
    status: 'success',
    successCount: 1034,
    failCount: 0,
    lastRun: '06:28',
    duration: '9m 17s',
  },
];

const recentRuns = [
  { date: '2025/05/10', startTime: '06:00', endTime: '06:38', totalProcessed: 1243, totalFailed: 45, status: 'warning' },
  { date: '2025/05/09', startTime: '06:00', endTime: '06:35', totalProcessed: 1180, totalFailed: 12, status: 'success' },
  { date: '2025/05/08', startTime: '06:00', endTime: '06:42', totalProcessed: 1320, totalFailed: 0,  status: 'success' },
  { date: '2025/05/07', startTime: '06:00', endTime: '06:31', totalProcessed: 990,  totalFailed: 88, status: 'warning' },
  { date: '2025/05/06', startTime: '06:00', endTime: '—',     totalProcessed: 0,    totalFailed: 0,  status: 'failed' },
];

const statusConfig: Record<StepStatus, { bg: string; border: string; dot: string; badge: string; badgeText: string; label: string; labelEn: string }> = {
  success: { bg: 'bg-white', border: 'border-gray-100', dot: 'bg-green-500', badge: 'bg-green-100', badgeText: 'text-green-700', label: '正常完了', labelEn: 'Success' },
  warning: { bg: 'bg-white', border: 'border-yellow-200', dot: 'bg-yellow-500', badge: 'bg-yellow-100', badgeText: 'text-yellow-700', label: '警告あり', labelEn: 'Warning' },
  failed:  { bg: 'bg-red-50', border: 'border-red-200',    dot: 'bg-red-500',    badge: 'bg-red-100',    badgeText: 'text-red-700',    label: '失敗',     labelEn: 'Failed' },
  running: { bg: 'bg-blue-50', border: 'border-blue-200',  dot: 'bg-blue-500 animate-pulse', badge: 'bg-blue-100', badgeText: 'text-blue-700', label: '実行中', labelEn: 'Running' },
  pending: { bg: 'bg-white', border: 'border-gray-100',    dot: 'bg-gray-300',   badge: 'bg-gray-100',   badgeText: 'text-gray-500',   label: '待機中',   labelEn: 'Pending' },
};

function RunStatusIcon({ status }: { status: string }) {
  if (status === 'success') return <CheckCircle size={14} className="text-green-500" />;
  if (status === 'warning') return <AlertTriangle size={14} className="text-yellow-500" />;
  if (status === 'failed')  return <XCircle size={14} className="text-red-500" />;
  return <PlayCircle size={14} className="text-blue-500" />;
}

export default function PipelineMonitorPage() {
  const { lang } = useLang();

  const totalProcessed = steps[0].successCount;
  const totalFailed = steps.reduce((sum, s) => sum + s.failCount, 0);
  const successSteps = steps.filter(s => s.status === 'success').length;
  const warningSteps = steps.filter(s => s.status === 'warning').length;
  const failedSteps  = steps.filter(s => s.status === 'failed').length;

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, 'パイプライン監視', 'Pipeline Monitor')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t(lang, '毎日06:00に実行される6ステップのバッチ処理を監視します', 'Monitor the 6-step daily batch pipeline (runs at 06:00)')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {warningSteps > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
              <AlertTriangle size={13} />
              {warningSteps} {t(lang, 'ステップで警告', 'step(s) with warnings')}
            </div>
          )}
          {failedSteps > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
              <XCircle size={13} />
              {failedSteps} {t(lang, 'ステップが失敗', 'step(s) failed')}
            </div>
          )}
          {warningSteps === 0 && failedSteps === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <CheckCircle size={13} />
              {t(lang, '全ステップ正常完了', 'All Steps Completed Successfully')}
            </div>
          )}
          <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <RefreshCw size={13} /> {t(lang, '更新', 'Refresh')}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, '本日の処理件数', 'Processed Today')}</div>
          <div className="text-2xl font-bold text-gray-800">{totalProcessed.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '企業', 'companies')}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, '失敗件数', 'Failed')}</div>
          <div className={`text-2xl font-bold ${totalFailed > 0 ? 'text-yellow-600' : 'text-gray-800'}`}>{totalFailed.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{t(lang, '件', 'records')}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, 'パイプライン時間', 'Total Duration')}</div>
          <div className="text-2xl font-bold text-gray-800">38<span className="text-sm font-normal text-gray-500">m</span></div>
          <div className="text-xs text-gray-400 mt-1">06:00 → 06:38</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">{t(lang, '最終実行', 'Last Run')}</div>
          <div className="text-2xl font-bold text-gray-800">06:00</div>
          <div className="text-xs text-gray-400 mt-1">2025/05/10</div>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            {t(lang, '本日のバッチ実行ステータス', "Today's Batch Run Status")}
          </h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> 2025/05/10 06:00 実行
          </span>
        </div>

        <div className="divide-y divide-gray-50">
          {steps.map((step, idx) => {
            const cfg = statusConfig[step.status];
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative">
                <div className={`flex items-start gap-4 px-5 py-4 ${step.status === 'failed' ? 'bg-red-50' : step.status === 'warning' ? 'bg-yellow-50/40' : ''}`}>

                  {/* Step number + connector */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                      step.status === 'success' ? 'bg-green-500' :
                      step.status === 'warning' ? 'bg-yellow-500' :
                      step.status === 'failed'  ? 'bg-red-500' :
                      step.status === 'running' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {step.status === 'success' ? <CheckCircle size={15} /> :
                       step.status === 'failed'  ? <XCircle size={15} /> :
                       step.status === 'warning' ? <AlertTriangle size={15} /> :
                       step.id}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-px h-6 bg-gray-200 mt-1" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-800">
                          {t(lang, step.labelJa, step.labelEn)}
                        </span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{step.features}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cfg.badge} ${cfg.badgeText}`}>
                        {t(lang, cfg.label, cfg.labelEn)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{t(lang, step.descJa, step.descEn)}</p>

                    <div className="flex flex-wrap gap-4">
                      <div>
                        <span className="text-xs text-gray-400">{t(lang, '成功', 'Success')}: </span>
                        <span className="text-xs font-semibold text-green-600">{step.successCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">{t(lang, '失敗', 'Failed')}: </span>
                        <span className={`text-xs font-semibold ${step.failCount > 0 ? 'text-red-500' : 'text-gray-500'}`}>{step.failCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">{t(lang, '開始', 'Start')}: </span>
                        <span className="text-xs font-medium text-gray-600">{step.lastRun}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">{t(lang, '所要時間', 'Duration')}: </span>
                        <span className="text-xs font-medium text-gray-600">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Run History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">{t(lang, '直近の実行履歴', 'Recent Run History')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-2">{t(lang, '実行日', 'Date')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '開始', 'Start')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '終了', 'End')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '処理件数', 'Processed')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-2">{t(lang, '失敗件数', 'Failed')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-2">{t(lang, 'ステータス', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRuns.map((run, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5 text-sm font-medium text-gray-700">{run.date}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">{run.startTime}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">{run.endTime}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 text-right font-medium">{run.totalProcessed > 0 ? run.totalProcessed.toLocaleString() : '—'}</td>
                  <td className="px-3 py-2.5 text-sm text-right font-medium">
                    <span className={run.totalFailed > 0 ? 'text-red-500' : 'text-gray-400'}>{run.totalProcessed > 0 ? run.totalFailed : '—'}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                      run.status === 'success' ? 'bg-green-100 text-green-700' :
                      run.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <RunStatusIcon status={run.status} />
                      {run.status === 'success' ? t(lang, '正常完了', 'Success') :
                       run.status === 'warning' ? t(lang, '警告あり', 'Warning') :
                       t(lang, '失敗', 'Failed')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
