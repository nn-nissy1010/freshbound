'use client';

import { useState } from 'react';
import { useLang } from '@/components/admin/LangContext';
import { t } from '@/lib/i18n';
import StatusBadge from '@/components/admin/StatusBadge';
import FilterBar from '@/components/admin/FilterBar';
import StatCard from '@/components/admin/StatCard';
import { FileText, AlertTriangle, CheckCircle, RefreshCw, Download, XCircle } from 'lucide-react';

const imports = [
  { id: 'CSV-201', tenant: '株式会社テックスタート', filename: '展示会リード_20250509.csv', rows: 2128, duplicates: 135, failed: 0, status: 'completed', uploaded: '2025/05/09 10:30', mappingErrors: 0 },
  { id: 'CSV-200', tenant: 'グロースSaaS株式会社', filename: '大規模リスト_20250508.csv', rows: 5420, duplicates: 312, failed: 45, status: 'completed', uploaded: '2025/05/08 14:15', mappingErrors: 0 },
  { id: 'CSV-199', tenant: '株式会社デジタルワークス', filename: 'test_import.csv', rows: 120, duplicates: 0, failed: 120, status: 'failed', uploaded: '2025/05/08 09:45', mappingErrors: 3 },
  { id: 'CSV-198', tenant: 'イノベーション合同会社', filename: '営業リスト_20250507.csv', rows: 1856, duplicates: 98, failed: 0, status: 'completed', uploaded: '2025/05/07 16:20', mappingErrors: 0 },
  { id: 'CSV-197', tenant: '株式会社クラウドビズ', filename: 'enterprise_leads.csv', rows: 8900, duplicates: 420, failed: 12, status: 'completed', uploaded: '2025/05/07 11:00', mappingErrors: 0 },
  { id: 'CSV-196', tenant: '株式会社セールスブースト', filename: 'shift_jis_leads.csv', rows: 1342, duplicates: 54, failed: 0, status: 'completed', uploaded: '2025/05/06 09:10', mappingErrors: 0 },
];

export default function CSVPage() {
  const { lang } = useLang();
  const [search, setSearch] = useState('');

  const filtered = imports.filter(i =>
    i.filename.toLowerCase().includes(search.toLowerCase()) ||
    i.tenant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-800">{t(lang, 'CSV取込管理', 'CSV Import Management')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t(lang, '全テナントのCSV取込状況を監視・管理します。UTF-8・Shift-JIS対応', 'Monitor and manage CSV imports across all tenants. Supports UTF-8 and Shift-JIS')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard label={t(lang, '総取込数（今月）', 'Total Imports (Month)')} value="24" icon={FileText} color="#3b82f6" />
        <StatCard label={t(lang, '成功', 'Successful')} value="22" icon={CheckCircle} color="#10b981" />
        <StatCard label={t(lang, '失敗', 'Failed')} value="2" icon={AlertTriangle} color="#ef4444" />
        <StatCard label={t(lang, '総取込行数', 'Total Rows')} value="48,230" icon={FileText} color="#8b5cf6" />
      </div>

      <FilterBar
        searchPlaceholder={t(lang, 'ファイル名・テナントで検索', 'Search by filename or tenant')}
        onSearch={setSearch}
        filters={[
          { label: t(lang, 'テナント', 'Tenant'), options: [t(lang, 'すべて', 'All'), '株式会社テックスタート', 'グロースSaaS株式会社'] },
          { label: t(lang, 'ステータス', 'Status'), options: [t(lang, 'すべて', 'All'), t(lang, '完了', 'Completed'), t(lang, '失敗', 'Failed'), t(lang, '処理中', 'Processing')] },
        ]}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'テナント', 'Tenant')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ファイル名', 'Filename')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '行数', 'Rows')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '重複', 'Dupes')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, '失敗行', 'Failed')}</th>
                <th className="text-right text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'マッピングエラー', 'Map Errors')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'ステータス', 'Status')}</th>
                <th className="text-left text-xs font-medium text-gray-500 px-3 py-3">{t(lang, 'アップロード日時', 'Uploaded')}</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(imp => (
                <tr key={imp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-400">{imp.id}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-600 max-w-[130px] truncate">{imp.tenant}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 max-w-[180px] truncate">{imp.filename}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-700 text-right">{imp.rows.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-sm text-orange-500 text-right font-medium">{imp.duplicates}</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`text-sm font-medium ${imp.failed > 0 ? 'text-red-600' : 'text-gray-700'}`}>{imp.failed}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={`text-sm font-medium ${imp.mappingErrors > 0 ? 'text-red-600' : 'text-gray-400'}`}>{imp.mappingErrors}</span>
                  </td>
                  <td className="px-3 py-2.5"><StatusBadge status={imp.status} /></td>
                  <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{imp.uploaded}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      {imp.status === 'failed' && (
                        <button className="flex items-center gap-1 text-xs border border-blue-200 text-blue-600 rounded px-2 py-0.5 hover:bg-blue-50">
                          <RefreshCw size={10} />{t(lang, '再試行', 'Retry')}
                        </button>
                      )}
                      {imp.failed > 0 && (
                        <button className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 rounded px-2 py-0.5 hover:bg-gray-50">
                          <Download size={10} />{t(lang, 'エラーCSV', 'Error CSV')}
                        </button>
                      )}
                      {imp.status === 'processing' && (
                        <button className="flex items-center gap-1 text-xs border border-red-200 text-red-600 rounded px-2 py-0.5 hover:bg-red-50">
                          <XCircle size={10} />{t(lang, 'キャンセル', 'Cancel')}
                        </button>
                      )}
                    </div>
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
