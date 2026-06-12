'use client';

import { useState } from 'react';
import { HelpCircle, X, Plus, Save } from 'lucide-react';

const industries = [
  'IT・情報通信', '人材サービス', 'コンサルティング', '製造業', '小売・流通',
  '金融・保険', '不動産', '医療・ヘルスケア', '教育', 'SaaS', 'クラウドサービス',
];

const regions = [
  '北海道', '東北地方', '関東地方', '中部地方', '関西地方', '中国地方', '四国地方', '九州・沖縄',
];

export default function ICPPage() {
  const [selectedIndustries, setSelectedIndustries] = useState(['IT・情報通信', '人材サービス', 'コンサルティング']);
  const [selectedRegions, setSelectedRegions] = useState(['関東地方', '関西地方']);
  const [sizeMin, setSizeMin] = useState('100名以上');
  const [sizeMax, setSizeMax] = useState('200名以下');
  const [revenueMin, setRevenueMin] = useState('10億円以上');
  const [revenueMax, setRevenueMax] = useState('50億円以下');
  const [budget, setBudget] = useState('1,000万円以上');
  const [keywords, setKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');

  const removeIndustry = (ind: string) => setSelectedIndustries(prev => prev.filter(i => i !== ind));
  const removeRegion = (r: string) => setSelectedRegions(prev => prev.filter(i => i !== r));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">ICP設定</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">理想の顧客像（ICP）を設定することで、AIが最適な企業を発掘・スコアリングします</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Save size={14} />
            保存する
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main Form */}
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              基本情報 <span className="text-red-500">（必須項目）</span>
            </h2>

            <div className="space-y-5">
              {/* Industry */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  業種 <span className="text-gray-400 font-normal text-xs">（複数選択可）</span>
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                  onChange={(e) => {
                    if (e.target.value && !selectedIndustries.includes(e.target.value)) {
                      setSelectedIndustries(prev => [...prev, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">業種を選択してください</option>
                  {industries.filter(i => !selectedIndustries.includes(i)).map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map(ind => (
                    <span key={ind} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium">
                      {ind}
                      <button onClick={() => removeIndustry(ind)} className="hover:text-blue-900">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 rounded-full px-3 py-1">
                    <Plus size={11} />
                    追加
                  </button>
                </div>
              </div>

              {/* Company Size */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  企業規模 <span className="text-gray-400 font-normal text-xs">（従業員数）</span>
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={sizeMin}
                    onChange={(e) => setSizeMin(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {['10名以上', '50名以上', '100名以上', '200名以上', '500名以上'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <span className="text-gray-400 text-sm">〜</span>
                  <select
                    value={sizeMax}
                    onChange={(e) => setSizeMax(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {['50名以下', '100名以下', '200名以下', '500名以下', '1000名以下', '制限なし'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  所在地 <span className="text-gray-400 font-normal text-xs">（複数選択可）</span>
                </label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                  onChange={(e) => {
                    if (e.target.value && !selectedRegions.includes(e.target.value)) {
                      setSelectedRegions(prev => [...prev, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">地域を選択してください</option>
                  {regions.filter(r => !selectedRegions.includes(r)).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  {selectedRegions.map(r => (
                    <span key={r} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium">
                      {r}
                      <button onClick={() => removeRegion(r)} className="hover:text-blue-900">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 rounded-full px-3 py-1">
                    <Plus size={11} />
                    追加
                  </button>
                </div>
              </div>

              {/* Revenue */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center font-bold">4</span>
                  年間売上 <span className="text-gray-400 font-normal text-xs">（オプション）</span>
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={revenueMin}
                    onChange={(e) => setRevenueMin(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {['1億円以上', '5億円以上', '10億円以上', '50億円以上', '100億円以上'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <span className="text-gray-400 text-sm">〜</span>
                  <select
                    value={revenueMax}
                    onChange={(e) => setRevenueMax(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {['5億円以下', '10億円以下', '50億円以下', '100億円以下', '制限なし'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center font-bold">5</span>
                  予算規模 <span className="text-gray-400 font-normal text-xs">（オプション）</span>
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {['100万円以上', '500万円以上', '1,000万円以上', '5,000万円以上'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center font-bold">6</span>
                  課題・キーワード <span className="text-gray-400 font-normal text-xs">（オプション）</span>
                </label>
                <div className="relative">
                  <textarea
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="例：営業効率化、DX推進、人材不足、IT導入 など"
                    rows={2}
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400">{keywords.length}/200</span>
                </div>
              </div>

              {/* Exclude */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-xs flex items-center justify-center font-bold">7</span>
                  除外する業種・キーワード <span className="text-gray-400 font-normal text-xs">（オプション）</span>
                </label>
                <div className="relative">
                  <textarea
                    value={excludeKeywords}
                    onChange={(e) => setExcludeKeywords(e.target.value)}
                    placeholder="例：金融、保険、不動産"
                    rows={2}
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400">{excludeKeywords.length}/200</span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              <button className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                リセット
              </button>
              <button className="text-sm rounded-lg px-4 py-2 text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                保存する
              </button>
            </div>
          </div>

          {/* Saved ICPs — hidden in MVP (single ICP per tenant) */}
          {/* Phase 2: 複数ICP管理を追加予定 */}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">ICPプレビュー</h2>
            <h3 className="text-xs font-semibold text-gray-600 mb-3">設定条件のサマリー</h3>

            <div className="space-y-3">
              {[
                { icon: '🏢', label: '業種', value: 'IT・情報通信、人材サービス、コンサルティング' },
                { icon: '👥', label: '従業員数', value: '100名以上 〜 200名以下' },
                { icon: '📍', label: '所在地', value: '関東地方、関西地方' },
                { icon: '💰', label: '年間売上', value: '10億円以上 〜 50億円以下' },
                { icon: '💼', label: '予算規模', value: '1,000万円以上' },
                { icon: '🔑', label: '課題・キーワード', value: '未設定' },
                { icon: '🚫', label: '除外条件', value: '未設定' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="text-xs font-medium text-gray-700 mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 mb-3">
                <span className="text-xs font-semibold text-gray-700">AI予測</span>
                <span className="text-xs text-gray-400">（この条件での市場規模）</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: '対象企業数（推定）', value: '約 12,450 社', color: '#3b82f6' },
                  { label: '月次新規HP企業数（推定）', value: '約 320 社', color: '#10b981' },
                  { label: 'スコア上位企業の割合（推定）', value: '約 18 %', color: '#8b5cf6' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">※ 推定値は変更される可能性があります</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
