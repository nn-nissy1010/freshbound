'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import { Save, Check, Mail, Cpu, Database, Shield, Bell, Sliders } from 'lucide-react';

const sections = [
  { id: 'smtp', labelJa: 'SMTP設定', labelEn: 'SMTP Settings', icon: Mail },
  { id: 'sendgrid', labelJa: 'SendGrid設定', labelEn: 'SendGrid Settings', icon: Mail },
  { id: 'openai', labelJa: 'OpenAI設定', labelEn: 'OpenAI Settings', icon: Cpu },
  { id: 'queue', labelJa: 'キュー設定', labelEn: 'Queue Settings', icon: Database },
  { id: 'security', labelJa: 'セキュリティ設定', labelEn: 'Security Settings', icon: Shield },
  { id: 'notifications', labelJa: '通知設定', labelEn: 'Notification Settings', icon: Bell },
  { id: 'features', labelJa: 'フィーチャーフラグ', labelEn: 'Feature Flags', icon: Sliders },
];

const featureFlags = [
  { key: 'ai_personalization', labelJa: 'AIパーソナライズ配信', labelEn: 'AI Personalization', enabled: true },
  { key: 'icp_auto_scan', labelJa: 'ICP自動スキャン', labelEn: 'ICP Auto Scan', enabled: true },
  { key: 'line_notifications', labelJa: 'LINE通知', labelEn: 'LINE Notifications', enabled: true },
  { key: 'csv_import', labelJa: 'CSV取込機能', labelEn: 'CSV Import', enabled: true },
  { key: 'agency_portal', labelJa: '代理店ポータル', labelEn: 'Agency Portal', enabled: false },
  { key: 'advanced_analytics', labelJa: '高度な分析', labelEn: 'Advanced Analytics', enabled: false },
  { key: 'ab_testing', labelJa: 'A/Bテスト', labelEn: 'A/B Testing', enabled: false },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-0.5' : '-translate-x-4.5'}`} />
    </button>
  );
}

export default function SystemSettingsPage() {
  const { lang } = useLang();
  const [activeSection, setActiveSection] = useState('smtp');
  const [saved, setSaved] = useState(false);
  const [flags, setFlags] = useState(featureFlags);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleFlag = (key: string) => {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">{t(lang, 'システム設定', 'System Settings')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'グローバル設定・API接続・フィーチャーフラグを管理します', 'Manage global config, API connections and feature flags')}</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                    activeSection === s.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={14} />
                  {t(lang, s.labelJa, s.labelEn)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'smtp' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">{t(lang, 'SMTP設定', 'SMTP Settings')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t(lang, 'SMTPホスト', 'SMTP Host'), value: 'smtp.sendgrid.net' },
                  { label: t(lang, 'SMTPポート', 'SMTP Port'), value: '587' },
                  { label: t(lang, 'ユーザー名', 'Username'), value: 'apikey' },
                  { label: t(lang, 'パスワード', 'Password'), value: '••••••••••••••••', type: 'password' },
                  { label: t(lang, '送信者名（デフォルト）', 'Default From Name'), value: 'AIアウトバウンド', full: true },
                  { label: t(lang, '送信者住所（デフォルト）', 'Default Sender Address'), value: '東京都渋谷区神宮前1-1-1', full: true },
                  { label: t(lang, '送信者メール（デフォルト）', 'Default From Email'), value: 'noreply@ai-outbound.jp', full: true },
                ].map(f => (
                  <div key={f.label} className={f.full ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type={f.type || 'text'} defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium transition-all"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'sendgrid' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">{t(lang, 'SendGrid設定', 'SendGrid Settings')}</h2>
              <div className="space-y-4">
                {[
                  { label: 'API Key', value: 'SG.••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••' },
                  { label: t(lang, 'グローバル日次上限', 'Global Daily Limit'), value: '100000' },
                  { label: t(lang, 'テナントデフォルト上限', 'Tenant Default Limit'), value: '3000' },
                  { label: t(lang, 'バウンス閾値（警告）', 'Bounce Threshold (Warning)'), value: '5' },
                  { label: t(lang, 'スパム率閾値（警告）', 'Spam Rate Threshold'), value: '0.1' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type="text" defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'openai' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">{t(lang, 'OpenAI設定', 'OpenAI Settings')}</h2>
              <div className="space-y-4">
                {[
                  { label: 'API Key', value: 'sk-••••••••••••••••••••••••••••••••••••••••••••••••' },
                  { label: t(lang, 'モデル', 'Model'), value: 'gpt-4o' },
                  { label: t(lang, '日次トークン上限', 'Daily Token Limit'), value: '1000000' },
                  { label: t(lang, 'テナントデフォルト上限', 'Tenant Default Limit'), value: '50000' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type="text" defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{t(lang, 'デフォルトシステムプロンプト', 'Default System Prompt')}</label>
                  <textarea rows={4} defaultValue="あなたはBtoB営業のプロフェッショナルです。企業情報をもとに、パーソナライズされた営業メールを作成してください。"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'queue' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">{t(lang, 'キュー設定', 'Queue Settings')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t(lang, '最大同時ワーカー数', 'Max Concurrent Workers'), value: '5' },
                  { label: t(lang, 'ジョブタイムアウト（秒）', 'Job Timeout (sec)'), value: '300' },
                  { label: t(lang, '最大リトライ回数', 'Max Retries'), value: '3' },
                  { label: t(lang, 'リトライ間隔（秒）', 'Retry Interval (sec)'), value: '60' },
                  { label: t(lang, '配信間隔（ミリ秒）', 'Send Interval (ms)'), value: '100' },
                  { label: t(lang, 'バッチサイズ', 'Batch Size'), value: '50' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type="number" defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'features' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-1">{t(lang, 'フィーチャーフラグ', 'Feature Flags')}</h2>
              <p className="text-xs text-gray-500 mb-4">{t(lang, '機能のON/OFFを全テナントに一括適用します', 'Toggle features globally across all tenants')}</p>
              <div className="space-y-3">
                {flags.map(flag => (
                  <div key={flag.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t(lang, flag.labelJa, flag.labelEn)}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{flag.key}</p>
                    </div>
                    <Toggle enabled={flag.enabled} onChange={() => toggleFlag(flag.key)} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}

          {(activeSection === 'security' || activeSection === 'notifications') && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                {activeSection === 'security' ? t(lang, 'セキュリティ設定', 'Security Settings') : t(lang, '通知設定', 'Notification Settings')}
              </h2>
              <div className="space-y-4">
                {(activeSection === 'security' ? [
                  { label: t(lang, 'セッションタイムアウト（分）', 'Session Timeout (min)'), value: '60' },
                  { label: t(lang, 'ログイン試行上限', 'Max Login Attempts'), value: '5' },
                  { label: t(lang, 'IPホワイトリスト', 'IP Whitelist'), value: '0.0.0.0/0' },
                  { label: t(lang, '2FA強制（管理者）', 'Force 2FA (Admin)'), value: 'true' },
                ] : [
                  { label: t(lang, 'Slack Webhook URL', 'Slack Webhook URL'), value: 'https://hooks.slack.com/...' },
                  { label: t(lang, 'アラートメール', 'Alert Email'), value: 'admin@system.internal' },
                  { label: t(lang, 'エラー通知閾値', 'Error Alert Threshold'), value: '10' },
                  { label: t(lang, 'API使用率警告閾値（%）', 'API Usage Warning Threshold (%)'), value: '80' },
                ]).map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    <input type="text" defaultValue={f.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} />{t(lang, '保存しました', 'Saved')}</> : <><Save size={14} />{t(lang, '変更を保存', 'Save Changes')}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
