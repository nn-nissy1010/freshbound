'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Mail,
  Target,
  Upload,
  Ban,
  Settings,
  ChevronDown,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/companies', label: '企業リスト', icon: Building2 },
  { href: '/delivery-history', label: '配信履歴', icon: Mail },
  { href: '/icp', label: 'ICP設定', icon: Target },
  { href: '/csv-import', label: 'CSV取込', icon: Upload },
  { href: '/unsubscribe', label: '配信停止リスト', icon: Ban },
  { href: '/settings', label: '設定', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-56 min-h-screen text-white flex-shrink-0"
      style={{ backgroundColor: '#0f1629' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.3"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" opacity="0.6"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">AIアウトバウンド</div>
          <div className="text-xs text-blue-300 leading-tight">自動化</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tenant Info */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="bg-white/5 rounded-lg px-3 py-2 mb-3">
          <div className="text-xs text-gray-400">株式会社サンプル</div>
          <div className="text-xs text-gray-400">プラン：スタンダード</div>
          <div className="text-xs text-gray-500">ID: tenant_12345</div>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <User size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">山田 太郎</div>
            <div className="text-xs text-gray-400 truncate">営業部</div>
          </div>
          <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
