'use client';

import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  color?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, sub, icon: Icon, color, trend, trendUp }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex gap-3 min-w-0">
      {Icon && color && (
        <div className="hidden 2xl:flex w-9 h-9 rounded-lg items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18' }}>
          <Icon size={17} style={{ color }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-xs text-gray-500">{label}</span>
        </div>
        <div className="flex items-baseline gap-1 min-w-0">
          <span className="text-2xl font-bold text-gray-900 truncate">{value}</span>
        </div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
        {trend && (
          <div className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '▲' : '▼'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
