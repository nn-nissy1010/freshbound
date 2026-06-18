'use client';

import { useState, useRef } from 'react';
import {
  HelpCircle, Download, Plus, Upload, Shield,
  CheckCircle, ChevronRight, MoreVertical,
  FileText, BarChart2, AlertTriangle, UserPlus,
} from 'lucide-react';

const importHistory = [
  { date: '2025/05/08 10:30', filename: '展示会リード_20250508.csv', count: 2128, status: '完了' },
  { date: '2025/05/02 14:15', filename: '展示会リード_20250502.csv', count: 1856, status: '完了' },
  { date: '2025/04/28 09:45', filename: '取引先一覧_20250428.csv', count: 3102, status: '完了' },
  { date: '2025/04/20 16:20', filename: '営業リスト_20250420.csv', count: 1245, status: '完了' },
];

const columnMappings = [
  { csvCol: '会社名', systemField: '企業名', required: true, sample: '株式会社サンプルテック、株式会社イノベーションズ、...' },
  { csvCol: '担当者名', systemField: '担当者名', required: false, sample: '田中 太郎、佐藤 花子、鈴木 一郎' },
  { csvCol: 'メールアドレス', systemField: 'メールアドレス', required: true, sample: 't.tanaka@sample-tech.co.jp, sato@innovations.co.jp, ...' },
  { csvCol: '電話番号', systemField: '電話番号', required: false, sample: '03-1234-5678, 06-9876-5432, 052-111-2222' },
  { csvCol: '所在地', systemField: '所在地', required: false, sample: '東京都渋谷区、大阪府大阪市、愛知県名古屋市' },
  { csvCol: 'メモ', systemField: 'メモ（任意）', required: false, sample: '既存顧客、展示会リード、パートナー紹介' },
];

const systemFields = ['企業名', '担当者名', 'メールアドレス', '電話番号', '所在地', '業種', '企業規模', 'メモ（任意）', 'スキップ'];

const steps = ['ファイルアップロード', 'カラムマッピング', 'データ確認', '取込実行'];

export default function CSVImportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>('existing_list_20250510.csv');
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">CSV取込</h1>
            <HelpCircle size={16} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">お持ちの既存リストをCSVで取り込み、AI配信の対象に追加できます。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 text-gray-600">
            <Download size={14} />
            取込テンプレートをダウンロード
          </button>
          <button className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Plus size={14} />
            新規取込
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="col-span-2 space-y-4">
          {/* Steps */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-0 mb-6">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i + 1 === currentStep
                          ? 'bg-blue-600 text-white'
                          : i + 1 < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {i + 1 < currentStep ? <CheckCircle size={14} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${i + 1 === currentStep ? 'text-blue-600' : i + 1 < currentStep ? 'text-green-600' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 ${i + 1 < currentStep ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
                onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0].name)} />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">CSVファイルをドラッグ＆ドロップ</p>
                  <p className="text-xs text-gray-400 mt-1">または</p>
                </div>
                <button
                  type="button"
                  className="text-sm border border-blue-300 text-blue-600 rounded-lg px-4 py-2 hover:bg-blue-50 font-medium"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  ファイルを選択
                </button>
                <p className="text-xs text-gray-400">対応形式：CSV（UTF-8 / Shift-JIS）　最大ファイルサイズ：10MB</p>
                <p className="text-xs text-gray-400">文字コードは自動判定されます</p>
              </div>
            </div>
          </div>

          {/* Column Mapping */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-gray-800 mb-1">
                カラムマッピング <span className="text-red-500 text-xs">必須</span>
              </h2>
              <p className="text-xs text-gray-500">CSVの列をシステムの項目にマッピングしてください。<span className="text-red-500">*</span> は必須項目です。</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-xs font-medium text-gray-500">CSVの列（サンプル）</div>
              <div className="text-xs font-medium text-gray-500">システムの項目</div>
              <div className="text-xs font-medium text-gray-500">サンプルデータ（先頭3行）</div>
            </div>

            <div className="space-y-2">
              {columnMappings.map((mapping) => (
                <div key={mapping.csvCol} className="grid grid-cols-3 gap-2 items-center">
                  <select className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>{mapping.csvCol}</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                    <select className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" defaultValue={mapping.systemField}>
                      {systemFields.map(f => (
                        <option key={f}>{f}{mapping.required && f === mapping.systemField ? ' *' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-400 truncate">{mapping.sample}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                id="skipDuplicates"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="skipDuplicates" className="text-sm text-gray-600 flex items-center gap-1">
                重複データをスキップする（メールアドレスで重複チェック）
                <HelpCircle size={13} className="text-gray-400" />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button className="text-sm border border-gray-200 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50">
                戻る
              </button>
              <button
                className="text-sm rounded-lg px-4 py-2 text-white font-medium"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                onClick={() => setCurrentStep(3)}
              >
                次へ：データ確認
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Import Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-4">取込サマリー</h2>
            <div className="space-y-3">
              {([
                { icon: FileText,       iconBg: 'bg-gray-100',   iconColor: 'text-gray-500',  label: 'ファイル名',             value: 'existing_list_20250510.csv', valueClass: 'text-gray-700 text-xs' },
                { icon: BarChart2,      iconBg: 'bg-blue-50',    iconColor: 'text-blue-500',  label: '取込予定件数',           value: '2,450件',                    valueClass: 'text-gray-800 font-semibold text-sm' },
                { icon: CheckCircle,    iconBg: 'bg-green-50',   iconColor: 'text-green-500', label: '必須項目の入力率',        value: null,                         progress: 98.6 },
                { icon: AlertTriangle,  iconBg: 'bg-amber-50',   iconColor: 'text-amber-500', label: '重複件数（スキップ予定）', value: '135件',                      valueClass: 'text-orange-500 font-medium text-sm' },
                { icon: UserPlus,       iconBg: 'bg-blue-50',    iconColor: 'text-blue-500',  label: '新規登録予定件数',        value: '2,315件',                    valueClass: 'text-blue-600 font-bold text-sm' },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                          <Icon size={12} className={item.iconColor} />
                        </div>
                        <span className="text-xs text-gray-500">{item.label}</span>
                      </div>
                      {'value' in item && item.value && <span className={item.valueClass}>{item.value}</span>}
                      {'progress' in item && item.progress && <span className="text-sm font-semibold text-gray-700">{item.progress}%</span>}
                    </div>
                    {'progress' in item && item.progress && (
                      <div className="mt-1 ml-7 bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${item.progress}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-green-700">データの安全性</div>
                  <div className="text-xs text-green-600 mt-0.5">
                    取込データは暗号化され、安全に保存されます。第三者に共有されることはありません。
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Import History */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800">最近の取込履歴</h2>
              <button className="text-xs text-blue-600 hover:text-blue-700">すべて見る</button>
            </div>
            <div className="space-y-3">
              {importHistory.map((item) => (
                <div key={item.filename} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400">{item.date}</div>
                    <div className="text-xs font-medium text-gray-700 truncate">{item.filename}</div>
                    <div className="text-xs text-gray-500">{item.count.toLocaleString()}件</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {item.status}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <Download size={12} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
