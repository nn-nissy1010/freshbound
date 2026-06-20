'use client';

import { useState } from 'react';
import { Save, Check, HelpCircle, CheckCircle } from 'lucide-react';

type SettingsTab = 'settings' | 'generation';
type GenMode = 'template' | 'hybrid' | 'ai';

const VARIABLES = [
  { key: '{{企業名}}', desc: '企業名' },
  { key: '{{担当者名}}', desc: '担当者名' },
  { key: '{{役職}}', desc: '担当者役職' },
  { key: '{{業種}}', desc: '業種' },
  { key: '{{所在地}}', desc: '所在地' },
  { key: '{{新規HP}}', desc: '新規HP判定' },
];

export default function EmailSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('settings');
  const [saved, setSaved] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [genMode, setGenMode] = useState<GenMode>('hybrid');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-xl font-bold text-gray-800">メール送信設定</h1>
        <HelpCircle size={16} className="text-gray-400" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm mb-5 w-fit">
        {([
          { id: 'settings', label: '送信設定' },
          { id: 'generation', label: '生成設定' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'settings' && (
        <>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* 送信者情報 */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">送信者情報</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">送信者名</label>
                    <input type="text" defaultValue="山田 太郎（株式会社サンプル）"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      送信者住所 <span className="text-red-500">*</span>
                    </label>
                    <input type="text" defaultValue="東京都渋谷区神宮前1-1-1"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-orange-600 mt-1">
                      特定電子メール法により、送信者の住所をメール本文に表示することが義務付けられています。
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">送信元メールアドレス</label>
                    <input type="email" defaultValue="yamada@sample-tech.co.jp"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">返信先メールアドレス（Reply-To）</label>
                    <input type="email" defaultValue="sales@sample-tech.co.jp"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* 配信設定 */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">配信設定</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">1日の最大配信数</label>
                    <select defaultValue="3,000通"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>1,000通</option>
                      <option>3,000通</option>
                      <option>5,000通</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">※ プランの上限内で設定できます（現在のプラン上限：3,000通/日）</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">配信時間帯</label>
                    <div className="flex items-center gap-3">
                      <select defaultValue="09:00"
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        {Array.from({ length: 24 }, (_, i) => <option key={i}>{String(i).padStart(2, '0')}:00</option>)}
                      </select>
                      <span className="text-gray-400">〜</span>
                      <select defaultValue="18:00"
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        {Array.from({ length: 24 }, (_, i) => <option key={i}>{String(i).padStart(2, '0')}:00</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">自動送信（レビューなし）</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          ONにすると、AI生成メールを確認なしで自動送信します。デフォルトはOFF（下書き保存→要レビュー）です。
                        </p>
                      </div>
                      <button
                        onClick={() => setAutoSend(!autoSend)}
                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-4 ${autoSend ? 'bg-blue-600' : 'bg-gray-200'}`}
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                          style={{ transform: autoSend ? 'translateX(22px)' : 'translateX(2px)' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 送信ドメイン */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-1">送信ドメイン</h2>
              <p className="text-xs text-gray-400 mb-4">FreshBoundの共有基盤（SendGrid）を使用して送信します。</p>
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">共有ドメインを使用中</p>
                  <p className="text-xs text-green-600 mt-0.5">
                    送信元ドメイン：<span className="font-mono font-medium">mail.freshbound.jp</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    SPF / DKIM / DMARC はFreshBound側で設定済みです。追加のDNS設定は不要です。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={handleSave}
              className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
              style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              {saved ? <><Check size={14} /> 保存しました</> : <><Save size={14} /> 変更を保存</>}
            </button>
          </div>
        </>
      )}

      {activeTab === 'generation' && (
        <div>
          {/* Mode selector */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm mb-4 w-fit">
            {([
              { id: 'template', label: '完全テンプレート', desc: '固定文面' },
              { id: 'hybrid',   label: 'ハイブリッド',     desc: '変数＋AI' },
              { id: 'ai',       label: '完全AI生成',       desc: 'AIが全文生成' },
            ] as const).map((m) => (
              <button key={m.id} onClick={() => setGenMode(m.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  genMode === m.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {m.label}
                <span className={`block text-xs font-normal mt-0.5 ${genMode === m.id ? 'text-blue-200' : 'text-gray-400'}`}>
                  {m.desc}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              {/* Subject — hidden for full AI mode */}
              {genMode !== 'ai' && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-800 mb-3">件名テンプレート</h2>
                  <input type="text"
                    defaultValue="【{{企業名}}様へ】{{業種}}向け新規開拓支援のご提案"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {genMode === 'template' && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-800 mb-3">本文テンプレート</h2>
                  <textarea rows={12}
                    defaultValue={`{{担当者名}} 様\n\nはじめてご連絡いたします。\n山田と申します。\n\n{{企業名}}様の{{業種}}における取り組みを拝見し、\n弊社サービスがお役に立てると思いご連絡いたしました。\n\n——\n\n（本文続く）\n\n配信停止はこちら：[配信停止リンク]\n山田 太郎 / 株式会社サンプル / 東京都渋谷区神宮前1-1-1`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none" />
                </div>
              )}

              {genMode === 'hybrid' && (
                <>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-800 mb-1">ロジックで挿入する変数</h2>
                    <p className="text-xs text-gray-400 mb-3">AIへ渡す前にシステムが値を確定します。</p>
                    <div className="space-y-1">
                      {[
                        { var: '{{企業名}}',   src: 'companies.name' },
                        { var: '{{担当者名}}', src: 'contacts.name' },
                        { var: '{{役職}}',     src: 'contacts.title' },
                        { var: '{{業種}}',     src: 'companies.industry' },
                        { var: '{{新規HP}}',   src: 'new_hp_flags.is_new_hp' },
                      ].map((v) => (
                        <div key={v.var} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <code className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{v.var}</code>
                          <span className="text-xs text-gray-400 font-mono">{v.src}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">有効</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-800 mb-1">AI生成プロンプト（本文）</h2>
                    <p className="text-xs text-gray-400 mb-3">変数挿入後、本文をAIに生成させるプロンプトです。</p>
                    <textarea rows={10}
                      defaultValue={`以下の情報をもとに、BtoB営業メールの本文を日本語で生成してください。\n\n企業名：{{企業名}}\n担当者名：{{担当者名}}\n役職：{{役職}}\n業種：{{業種}}\n新規HP：{{新規HP}}\n\n【条件】\n- 冒頭は「{{担当者名}} 様」から始める\n- 300〜400文字程度\n- 架空の情報を含めない\n- 末尾署名・配信停止リンクは不要（システムが自動付与）`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none" />
                  </div>
                </>
              )}

              {genMode === 'ai' && (
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-800 mb-1">AI生成プロンプト（件名＋本文）</h2>
                  <p className="text-xs text-gray-400 mb-3">件名・本文をすべてAIに生成させます。</p>
                  <textarea rows={14}
                    defaultValue={`以下の情報をもとに、BtoB営業メールの件名と本文を日本語で生成してください。\n\n企業名：{{企業名}}\n担当者名：{{担当者名}}\n役職：{{役職}}\n業種：{{業種}}\n所在地：{{所在地}}\n新規HP：{{新規HP}}\n\n【出力形式】\n件名：（件名テキスト）\n本文：（本文テキスト、300〜400文字）\n\n【条件】\n- 架空の情報を含めない\n- 末尾署名・配信停止リンクは不要（システムが自動付与）\n- 自然な日本語ビジネスメールのトーンで`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none" />
                </div>
              )}
            </div>

            {/* Right — variable reference */}
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">利用可能な変数</h3>
                <div className="space-y-2">
                  {VARIABLES.map((v) => (
                    <div key={v.key} className="flex items-center justify-between">
                      <code className="text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{v.key}</code>
                      <span className="text-xs text-gray-400">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">ハルシネーション防止</p>
                <p className="text-xs text-amber-600">
                  プロンプトに「架空の情報を含めない」旨を必ず明記してください。存在しない情報の生成リスクを低減できます。
                </p>
              </div>
            </div>
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
  );
}
