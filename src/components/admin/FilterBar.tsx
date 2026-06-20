'use client';

import { Search } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterSelect { label: string; options: string[]; }

interface Props {
  searchPlaceholder?: string;
  onSearch?: (v: string) => void;
  filters?: FilterSelect[];
  actions?: ReactNode;
}

export default function FilterBar({ searchPlaceholder, onSearch, filters = [], actions }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3 flex-wrap">
        {searchPlaceholder !== undefined && (
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={e => onSearch?.(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {filters.map(f => (
          <div key={f.label} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{f.label}</span>
            <select className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
