'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import { Save, Check, Mail, Cpu, Shield, Bell } from 'lucide-react';

const sections = [
  { id: 'smtp', labelJa: 'SMTP設定', labelEn: 'SMTP Settings', icon: Mail },
  { id: 'sendgrid', labelJa: 'SendGrid設定', labelEn: 'SendGrid Settings', icon: Mail },
  { id: 'openai', labelJa: 'OpenAI設定', labelEn: 'OpenAI Settings', icon: Cpu },
  { id: 'security', labelJa: 'セキュリティ設定', labelEn: 'Security Settings', icon: Shield },
  { id: 'notifications', labelJa: '通知設定', labelEn: 'Notification Settings', icon: Bell },
];

export default function SystemSettingsPage() {
  const { lang } = useLang();
  const [activeSection, setActiveSection] = useState('smtp');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{t(lang, 'システム設定', 'System Settings')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'グローバル設定・API接続・フィーチャーフラグを管理します', 'Manage global config, API connections and feature flags')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible">
              {sections.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors border-r md:border-r-0 md:border-b border-gray-50 last:border-0 whitespace-nowrap md:w-full ${
                      activeSection === s.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={14} className="flex-shrink-0" />
                    {t(lang, s.labelJa, s.labelEn)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'smtp' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">{t(lang, 'SMTP設定', 'SMTP Settings')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t(lang, 'SMTPホスト', 'SMTP Host'), value: 'smtp.sendgrid.net' },
                  { label: t(lang, 'SMTPポート', 'SMTP Port'), value: '587' },
                  { label: t(lang, 'ユーザー名', 'Username'), value: 'apikey' },
                  { label: t(lang, 'パスワード', 'Password'), value: '••••••••••••••••', type: 'password' },
                  { label: t(lang, '送信者名（デフォルト）', 'Default From Name'), value: 'AIアウトバウンド', full: true },
                  { label: t(lang, '送信者住所（デフォルト）', 'Default Sender Address'), value: '東京都渋谷区神宮前1-1-1', full: true },
                  { label: t(lang, '送信者メール（デフォルト）', 'Default From Email'), value: 'noreply@ai-outbound.jp', full: true },
                ].map(f => (
                  <div key={f.label} className={f.full ? 'sm:col-span-2' : ''}>
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

          {(activeSection === 'security' || activeSection === 'notifications') && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">
                {activeSection === 'security' ? t(lang, 'セキュリティ設定', 'Security Settings') : t(lang, '通知設定', 'Notification Settings')}
              </h2>
              <div className="space-y-4">
                {(activeSection === 'security' ? [
                  { label: t(lang, 'セッションタイムアウト（分）', 'Session Timeout (min)'), value: '60' },
                  { label: t(lang, 'ログイン試行上限', 'Max Login Attempts'), value: '5' },
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
