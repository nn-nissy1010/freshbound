'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, Plus, Save, Building2, Users, MapPin, Banknote, Briefcase, Tag, Ban, Trash2 } from 'lucide-react';
import { useToast } from '@/lib/toast';

const industries = [
  'IT・情報通信', '人材サービス', 'コンサルティング', '製造業', '小売・流通',
  '金融・保険', '不動産', '医療・ヘルスケア', '教育', 'SaaS', 'クラウドサービス',
];

const regions = [
  '北海道', '東北地方', '関東地方', '中部地方', '関西地方', '中国地方', '四国地方', '九州・沖縄',
];

type IcpProfile = {
  id: string;
  name: string;
  industryCodes: string[] | null;
  employeeSizeMin: number | null;
  employeeSizeMax: number | null;
  regionCodes: string[] | null;
  budgetRange: string | null;
  searchParams: {
    keywords?: string;
    excludeKeywords?: string;
    revenueMin?: string;
    revenueMax?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};

// "100名以上" → 100、"制限なし" → null
function parseSize(label: string): number | null {
  const n = parseInt(label.replace(/[^0-9]/g, ''));
  return isNaN(n) ? null : n;
}

export default function ICPPage() {
  const [icpName, setIcpName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [icpList, setIcpList] = useState<IcpProfile[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sizeMin, setSizeMin] = useState('100名以上');
  const [sizeMax, setSizeMax] = useState('200名以下');
  const [revenueMin, setRevenueMin] = useState('10億円以上');
  const [revenueMax, setRevenueMax] = useState('50億円以下');
  const [budget, setBudget] = useState('1,000万円以上');
  const [keywords, setKeywords] = useState('');
  const [excludeKeywords, setExcludeKeywords] = useState('');
  const [industrySelectValue, setIndustrySelectValue] = useState('');
  const [regionSelectValue, setRegionSelectValue] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadIntoForm = (icp: IcpProfile) => {
    setEditingId(icp.id);
    setIcpName(icp.name);
    setSelectedIndustries(icp.industryCodes ?? []);
    setSelectedRegions(icp.regionCodes ?? []);
    if (icp.employeeSizeMin) setSizeMin(`${icp.employeeSizeMin}名以上`);
    if (icp.employeeSizeMax) setSizeMax(`${icp.employeeSizeMax}名以下`);
    if (icp.budgetRange) setBudget(icp.budgetRange);
    setKeywords(icp.searchParams?.keywords ?? '');
    setExcludeKeywords(icp.searchParams?.excludeKeywords ?? '');
    if (icp.searchParams?.revenueMin) setRevenueMin(icp.searchParams.revenueMin);
    if (icp.searchParams?.revenueMax) setRevenueMax(icp.searchParams.revenueMax);
  };

  const resetForm = () => {
    setEditingId(null);
    setIcpName('');
    setSelectedIndustries([]);
    setSelectedRegions([]);
    setSizeMin('100名以上');
    setSizeMax('200名以下');
    setRevenueMin('10億円以上');
    setRevenueMax('50億円以下');
    setBudget('1,000万円以上');
    setKeywords('');
    setExcludeKeywords('');
  };

  // 全ICPを取得し、先頭をフォームに読み込む
  useEffect(() => {
    const load = async () => {
      setLoadingList(true);
      try {
        const res = await fetch('/api/icp');
        if (!res.ok) return;
        const data = await res.json() as IcpProfile[];
        setIcpList(data);
        if (data.length > 0) loadIntoForm(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/icp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId ?? undefined,
          name: icpName || 'デフォルトICP',
          industries: selectedIndustries,
          employeeSizeMin: parseSize(sizeMin),
          employeeSizeMax: parseSize(sizeMax),
          regions: selectedRegions,
          budgetRange: budget,
          searchParams: { keywords, excludeKeywords, revenueMin, revenueMax },
        }),
      });
      if (res.ok) {
        const saved = await res.json() as IcpProfile;
        setIcpList(prev =>
          editingId
            ? prev.map(p => p.id === saved.id ? saved : p)
            : [...prev, saved]
        );
        if (!editingId) setEditingId(saved.id);
        toast('ICP設定を保存しました', 'success');
      } else {
        toast('ICP設定の保存に失敗しました', 'error');
      }
    } catch {
      toast('ICP設定の保存に失敗しました', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/icp/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const newList = icpList.filter(p => p.id !== id);
        setIcpList(newList);
        if (editingId === id) {
          if (newList.length > 0) {
            loadIntoForm(newList[0]);
          } else {
            resetForm();
          }
        }
        toast('ICPを削除しました', 'info');
      }
    } catch {
      toast('ICPの削除に失敗しました', 'error');
    }
  };

  const removeIndustry = (ind: string) => setSelectedIndustries(prev => prev.filter(i => i !== ind));
  const removeRegion = (r: string) => setSelectedRegions(prev => prev.filter(i => i !== r));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">ICP設定</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">理想の顧客像（ICP）を設定することで、AIが最適な企業を発掘・スコアリングします</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetForm}
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            <Plus size={14} />
            新規ICPを作成
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 text-sm rounded-lg px-4 py-2 text-white font-medium disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Save size={14} />
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Form */}
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-800">
                基本情報 <span className="text-red-500">（必須項目）</span>
              </h2>
              {editingId && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">編集中</span>
              )}
            </div>

            <div className="space-y-5">
              {/* ICP Name */}
              <div className="pb-4 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ICP名 <span className="text-gray-400 font-normal text-xs">（管理用の識別名）</span>
                </label>
                <input
                  type="text"
                  value={icpName}
                  onChange={(e) => setIcpName(e.target.value)}
                  placeholder="例：IT企業_成長フェーズ"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  業種 <span className="text-gray-400 font-normal text-xs">（複数選択可）</span>
                </label>
                <select
                  value={industrySelectValue}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !selectedIndustries.includes(val)) {
                      setSelectedIndustries(prev => [...prev, val]);
                    }
                    setIndustrySelectValue('');
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
                  value={regionSelectValue}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-2"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !selectedRegions.includes(val)) {
                      setSelectedRegions(prev => [...prev, val]);
                    }
                    setRegionSelectValue('');
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
              <button
                onClick={resetForm}
                className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                リセット
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm rounded-lg px-4 py-2 text-white font-medium disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                {saving ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel + Saved ICP list */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-1">ICPプレビュー</h2>
            {icpName && <p className="text-xs text-blue-600 font-medium mb-3">{icpName}</p>}
            <h3 className="text-xs font-semibold text-gray-600 mb-3">設定条件のサマリー</h3>

            <div className="space-y-3">
              {[
                { icon: Building2,  label: '業種',           value: selectedIndustries.length > 0 ? selectedIndustries.join('、') : '未設定' },
                { icon: Users,      label: '従業員数',        value: `${sizeMin} 〜 ${sizeMax}` },
                { icon: MapPin,     label: '所在地',          value: selectedRegions.length > 0 ? selectedRegions.join('、') : '未設定' },
                { icon: Banknote,   label: '年間売上',        value: `${revenueMin} 〜 ${revenueMax}` },
                { icon: Briefcase,  label: '予算規模',        value: budget },
                { icon: Tag,        label: '課題・キーワード', value: keywords || '未設定' },
                { icon: Ban,        label: '除外条件',        value: excludeKeywords || '未設定' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={12} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="text-xs font-medium text-gray-700 mt-0.5">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved ICP list — compact, sits below preview panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-xs font-bold text-gray-700">保存済みICP</h2>
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Plus size={11} />
                新規
              </button>
            </div>
            {loadingList ? (
              <div className="p-4 text-xs text-center text-gray-400">読み込み中...</div>
            ) : icpList.length === 0 ? (
              <div className="p-4 text-xs text-center text-gray-400">保存済みICPなし</div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {icpList.map((icp) => (
                  <div
                    key={icp.id}
                    className={`px-4 py-2.5 ${editingId === icp.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 flex-wrap mb-0.5">
                          {editingId === icp.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded leading-tight flex-shrink-0">編集中</span>
                          )}
                          <span className="text-xs font-medium text-gray-800 truncate">{icp.name}</span>
                        </div>
                        {icp.industryCodes?.length ? (
                          <div className="text-xs text-gray-400 truncate">{icp.industryCodes.slice(0, 2).join('・')}</div>
                        ) : null}
                        <div className="text-xs text-gray-300 mt-0.5">{new Date(icp.updatedAt).toLocaleDateString('ja-JP')}</div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                        <button onClick={() => loadIntoForm(icp)} className="text-xs text-blue-600 hover:text-blue-700">編集</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => handleDelete(icp.id)} className="text-xs text-red-500 hover:text-red-600">削除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
