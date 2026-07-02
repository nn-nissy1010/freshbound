'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import StatCard from '@/components/admin/StatCard';
import {
  Building2, Download, Upload, Plus, MoreVertical,
  ChevronLeft, ChevronRight, X, Check, Database,
  Globe, MapPin, Users,
} from 'lucide-react';

type Company = {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeSize: string;
  location: string;
  source: 'csv' | 'musubu' | 'manual';
  tenantCount: number;
  createdAt: string;
};

const companies: Company[] = [
  { id: 'C001', name: '株式会社テックスタート', domain: 'techstart.co.jp', industry: 'IT・ソフトウェア', employeeSize: '51-100', location: '東京都渋谷区', source: 'musubu', tenantCount: 2, createdAt: '2025/05/01' },
  { id: 'C002', name: 'グロースSaaS株式会社', domain: 'growthsaas.co.jp', industry: 'IT・ソフトウェア', employeeSize: '11-50', location: '大阪府大阪市', source: 'csv', tenantCount: 1, createdAt: '2025/05/02' },
  { id: 'C003', name: '株式会社デジタルワークス', domain: 'digitalworks.co.jp', industry: 'コンサルティング', employeeSize: '11-50', location: '東京都新宿区', source: 'manual', tenantCount: 1, createdAt: '2025/05/03' },
  { id: 'C004', name: 'イノベーション合同会社', domain: 'innovation.co.jp', industry: '製造業', employeeSize: '101-300', location: '愛知県名古屋市', source: 'musubu', tenantCount: 3, createdAt: '2025/05/04' },
  { id: 'C005', name: '株式会社マーケットリンク', domain: 'marketlink.co.jp', industry: 'マーケティング', employeeSize: '11-50', location: '東京都港区', source: 'csv', tenantCount: 1, createdAt: '2025/05/05' },
  { id: 'C006', name: '株式会社クラウドビズ', domain: 'cloudbiz.co.jp', industry: 'IT・ソフトウェア', employeeSize: '51-100', location: '福岡県福岡市', source: 'musubu', tenantCount: 2, createdAt: '2025/05/06' },
  { id: 'C007', name: '株式会社セールスブースト', domain: 'salesboost.co.jp', industry: 'コンサルティング', employeeSize: '11-50', location: '東京都千代田区', source: 'csv', tenantCount: 1, createdAt: '2025/05/07' },
  { id: 'C008', name: '合同会社フューチャーズ', domain: 'futures.co.jp', industry: 'IT・ソフトウェア', employeeSize: '1-10', location: '神奈川県横浜市', source: 'manual', tenantCount: 0, createdAt: '2025/05/08' },
];

const sourceLabel: Record<string, { ja: string; en: string }> = {
  csv:    { ja: 'CSVインポート', en: 'CSV Import' },
  musubu: { ja: 'musubu', en: 'musubu' },
  manual: { ja: '手動登録', en: 'Manual' },
};

const emptyForm = { name: '', domain: '', industry: '', employeeSize: '', location: '' };

export default function CompaniesMasterPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.domain.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setEditingCompany(null); setShowAddModal(true); };
  const openEdit = (c: Company) => {
    setForm({ name: c.name, domain: c.domain, industry: c.industry, employeeSize: c.employeeSize, location: c.location });
    setEditingCompany(c);
    setShowAddModal(true);
    setActionMenu(null);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-800">
                {editingCompany ? t(lang, '企業を編集', 'Edit Company') : t(lang, '企業を追加', 'Add Company')}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={15} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {([
                { key: 'name',         label: t(lang, '企業名', 'Company Name'),   placeholder: '株式会社〇〇', required: true  },
                { key: 'domain',       label: t(lang, 'ドメイン', 'Domain'),        placeholder: 'example.co.jp', required: false },
                { key: 'industry',     label: t(lang, '業種', 'Industry'),          placeholder: 'IT・ソフトウェア', required: false },
                { key: 'employeeSize', label: t(lang, '従業員規模', 'Employees'),   placeholder: '51-100', required: false },
                { key: 'location',     label: t(lang, '所在地', 'Location'),        placeholder: '東京都渋谷区', required: false },
              ] as const).map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <input
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                {t(lang, 'キャンセル', 'Cancel')}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-sm rounded-lg px-4 py-2 text-white font-medium flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                <Check size={13} />
                {editingCompany ? t(lang, '保存', 'Save') : t(lang, '追加', 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-2">{t(lang, '企業を削除しますか？', 'Delete this company?')}</h2>
            <p className="text-xs text-gray-500 mb-5">
              {t(lang, 'この操作は取り消せません。テナントに紐づいている場合は削除できません。', 'This cannot be undone. Companies linked to tenants cannot be deleted.')}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                {t(lang, 'キャンセル', 'Cancel')}
              </button>
              <button onClick={() => setShowDeleteConfirm(null)} className="text-sm rounded-lg px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-700">
                {t(lang, '削除する', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t(lang, '企業マスタ', 'Company Master')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t(lang, 'システム共通の企業データを管理します', 'Manage system-wide company master data')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />{t(lang, 'エクスポート', 'Export CSV')}
          </button>
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Upload size={14} />{t(lang, 'CSVインポート', 'Import CSV')}
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <Plus size={14} />{t(lang, '企業を追加', 'Add Company')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label={t(lang, '総企業数', 'Total Companies')}       value={companies.length.toLocaleString()} icon={Database}  color="#3b82f6" />
        <StatCard label={t(lang, 'musubu取得', 'From musubu')}         value={companies.filter(c => c.source === 'musubu').length} icon={Globe} color="#10b981" />
        <StatCard label={t(lang, 'CSVインポート', 'CSV Import')}        value={companies.filter(c => c.source === 'csv').length}    icon={Upload} color="#8b5cf6" />
        <StatCard label={t(lang, '手動登録', 'Manual')}                 value={companies.filter(c => c.source === 'manual').length} icon={Users} color="#f59e0b" />
      </div>

      <FilterBar
        searchPlaceholder={t(lang, '企業名・ドメイン・業種で検索', 'Search by name, domain or industry')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, '業種', 'Industry'), options: [t(lang, 'すべて', 'All'), 'IT・ソフトウェア', 'コンサルティング', '製造業', 'マーケティング'] },
          { label: t(lang, '取得元', 'Source'), options: [t(lang, 'すべて', 'All'), 'musubu', t(lang, 'CSVインポート', 'CSV Import'), t(lang, '手動登録', 'Manual')] },
          { label: t(lang, '従業員規模', 'Employees'), options: [t(lang, 'すべて', 'All'), '1-10', '11-50', '51-100', '101-300', '300+'] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">{t(lang, '企業名', 'Company')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '業種', 'Industry')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '従業員', 'Employees')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '所在地', 'Location')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '取得元', 'Source')}</th>
                <th className="text-center text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '利用テナント', 'Tenants')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '登録日', 'Created')}</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{c.name}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Globe size={10} />{c.domain}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600">{c.industry}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">{c.employeeSize}名</td>
                  <td className="px-3 py-3 text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={10} className="flex-shrink-0" />{c.location}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge
                      status={c.source}
                      label={sourceLabel[c.source]?.[lang] ?? c.source}
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs font-semibold ${c.tenantCount > 0 ? 'text-blue-600' : 'text-gray-300'}`}>
                      {c.tenantCount}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-400">{c.createdAt}</td>
                  <td className="px-3 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === c.id ? null : c.id)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {actionMenu === c.id && (
                        <div className="absolute right-0 top-7 bg-white border border-gray-100 rounded-xl shadow-lg z-10 w-36 py-1">
                          <button onClick={() => openEdit(c)} className="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 text-gray-700">
                            {t(lang, '編集', 'Edit')}
                          </button>
                          <button
                            onClick={() => { setShowDeleteConfirm(c.id); setActionMenu(null); }}
                            className="w-full text-left text-xs px-3 py-2 hover:bg-red-50 text-red-600"
                            disabled={c.tenantCount > 0}
                          >
                            {t(lang, '削除', 'Delete')}
                            {c.tenantCount > 0 && <span className="ml-1 text-gray-400">({t(lang, '利用中', 'In use')})</span>}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{filtered.length} / {companies.length} {t(lang, '件', 'records')}</span>
        <div className="flex items-center gap-1">
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={14} /></button>
          <button className="w-7 h-7 rounded text-xs bg-blue-600 text-white">1</button>
          <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
