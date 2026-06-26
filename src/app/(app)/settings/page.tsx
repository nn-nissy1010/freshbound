'use client';

import { useState } from 'react';
import {
  User, Bell, Shield, CreditCard, Building2,
  ChevronRight, Save, Eye, EyeOff, Check,
} from 'lucide-react';

const sidebarItems = [
  { id: 'profile', label: 'プロフィール', icon: User },
  { id: 'notifications', label: '通知設定', icon: Bell },
  { id: 'security', label: 'セキュリティ', icon: Shield },
  { id: 'billing', label: 'プラン・請求', icon: CreditCard },
  { id: 'company', label: '会社情報', icon: Building2 },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">設定</h1>
        <p className="text-sm text-gray-500 mt-0.5">アカウントとシステムの設定を管理します。</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} />
                    {item.label}
                  </div>
                  <ChevronRight size={13} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeSection === 'profile' && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">プロフィール情報</h2>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    山
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">プロフィール画像</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG、PNG形式。最大2MB。</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50">
                        画像を変更
                      </button>
                      <button className="text-xs border border-red-200 rounded-lg px-3 py-1.5 text-red-500 hover:bg-red-50">
                        削除
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: '姓', placeholder: '山田', value: '山田' },
                    { label: '名', placeholder: '太郎', value: '太郎' },
                    { label: 'メールアドレス', placeholder: 'yamada@example.com', value: 'yamada@sample-tech.co.jp', full: true },
                    { label: '電話番号', placeholder: '03-0000-0000', value: '03-1234-5678' },
                    { label: '部署', placeholder: '営業部', value: '営業部' },
                    { label: '役職', placeholder: '営業マネージャー', value: '営業マネージャー' },
                  ].map((field) => (
                    <div key={field.label} className={field.full ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        placeholder={field.placeholder}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium transition-all"
                    style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                  >
                    {saved ? <><Check size={14} /> 保存しました</> : <><Save size={14} /> 変更を保存</>}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">通知設定</h2>
              <div className="space-y-4">
                {[
                  { label: 'ホットリード通知', desc: '返信・高スコア企業が出た際にLINEで通知', enabled: true },
                  { label: 'メール開封通知', desc: '送信したメールが開封された際に通知', enabled: true },
                  { label: '配信完了通知', desc: 'メール配信が完了した際に通知', enabled: false },
                  { label: 'エラー通知', desc: '配信エラーが発生した際に通知', enabled: true },
                  { label: '週次レポート', desc: '毎週月曜日に週次サマリーをメールで送信', enabled: false },
                  { label: 'システムメンテナンス通知', desc: 'メンテナンス予定の事前通知', enabled: true },
                ].map((item) => (
                  <NotificationToggle key={item.label} {...item} />
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">LINE通知設定</h3>
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-700">LINE連携済み</p>
                    <p className="text-xs text-green-600">山田 太郎のLINEアカウントに通知が届きます</p>
                  </div>
                  <button className="ml-auto text-xs border border-green-300 text-green-700 rounded-lg px-3 py-1.5 hover:bg-green-100">
                    連携解除
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  {saved ? <><Check size={14} /> 保存しました</> : <><Save size={14} /> 変更を保存</>}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">パスワード変更</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">現在のパスワード</label>
                    <div className="relative">
                      <input type={showCurrentPassword ? 'text' : 'password'} placeholder="現在のパスワード"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">新しいパスワード</label>
                    <div className="relative">
                      <input type={showNewPassword ? 'text' : 'password'} placeholder="8文字以上"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">新しいパスワード（確認）</label>
                    <input type="password" placeholder="もう一度入力"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="text-sm rounded-lg px-4 py-2 text-white font-medium"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    パスワードを変更
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">ログイン履歴</h2>
                <div className="space-y-2">
                  {[
                    { date: '2025/05/10 09:15', device: 'Chrome / Windows', ip: '203.0.113.1', current: true },
                    { date: '2025/05/09 18:32', device: 'Safari / iPhone', ip: '203.0.113.2', current: false },
                    { date: '2025/05/08 10:05', device: 'Chrome / Windows', ip: '203.0.113.1', current: false },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{log.device}</span>
                          {log.current && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">現在</span>}
                        </div>
                        <div className="text-xs text-gray-400">{log.date} · IP: {log.ip}</div>
                      </div>
                      {!log.current && (
                        <button className="text-xs text-red-500 hover:text-red-600">ログアウト</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">現在のプラン</h2>
                <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-700">スタンダードプラン</span>
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">現在のプラン</span>
                      </div>
                      <p className="text-sm text-blue-600 mt-1">月額 200,000円（税抜）</p>
                    </div>
                    <button className="text-sm border border-blue-300 text-blue-700 rounded-lg px-4 py-2 hover:bg-blue-100 font-medium">
                      プランを変更
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: '月間配信上限', value: '3,000通/日', used: '1,245通', pct: 41 },
                    { label: '企業発掘上限', value: '1,000社/日', used: '328社', pct: 33 },
                    { label: 'CSV取込上限', value: '10,000件', used: '2,315件', pct: 23 },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="text-sm font-semibold text-gray-700">{item.used}</div>
                      <div className="text-xs text-gray-400">上限：{item.value}</div>
                      <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">請求履歴</h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">請求日</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">内容</th>
                      <th className="text-right text-xs font-medium text-gray-500 pb-2">金額</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2">ステータス</th>
                      <th className="text-left text-xs font-medium text-gray-500 pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { date: '2025/05/01', desc: 'スタンダードプラン 5月分', amount: '¥200,000', status: '支払済' },
                      { date: '2025/04/01', desc: 'スタンダードプラン 4月分', amount: '¥200,000', status: '支払済' },
                      { date: '2025/03/01', desc: 'スタンダードプラン 3月分', amount: '¥200,000', status: '支払済' },
                    ].map((row) => (
                      <tr key={row.date} className="hover:bg-gray-50">
                        <td className="py-2.5 text-sm text-gray-500">{row.date}</td>
                        <td className="py-2.5 text-sm text-gray-700">{row.desc}</td>
                        <td className="py-2.5 text-sm text-gray-700 text-right font-medium">{row.amount}</td>
                        <td className="py-2.5">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{row.status}</span>
                        </td>
                        <td className="py-2.5">
                          <button className="text-xs text-blue-600 hover:text-blue-700">PDF</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'company' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">会社情報</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: '会社名', value: '株式会社サンプル', full: true },
                  { label: 'テナントID', value: 'tenant_12345', disabled: true },
                  { label: '業種', value: 'IT・ソフトウェア' },
                  { label: '従業員数', value: '51-100名' },
                  { label: '郵便番号', value: '150-0001' },
                  { label: '都道府県', value: '東京都' },
                  { label: '住所', value: '渋谷区神宮前1-1-1', full: true },
                  { label: '代表電話番号', value: '03-1234-5678' },
                  { label: '代表メールアドレス', value: 'info@sample.co.jp' },
                  { label: 'Webサイト', value: 'https://sample.co.jp' },
                ].map((field) => (
                  <div key={field.label} className={field.full ? 'col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      disabled={field.disabled}
                      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        field.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'text-gray-700'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={handleSave}
                  className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
                  style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                  {saved ? <><Check size={14} /> 保存しました</> : <><Save size={14} /> 変更を保存</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({ label, desc, enabled: defaultEnabled }: { label: string; desc: string; enabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-0.5' : '-translate-x-4.5'}`} />
      </button>
    </div>
  );
}
