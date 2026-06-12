'use client';

import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
  trendUp?: boolean;
}

export default function StatCard({ label, value, sub, icon: Icon, color = '#3b82f6', trend, trendUp }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{label}</span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
          <Icon size={14} style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      {trend && (
        <div className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? '▲' : '▼'} {trend}
        </div>
      )}
    </div>
  );
}
