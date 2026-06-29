'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Mail,
  Send,
  Target,
  Upload,
  Ban,
  Settings,
  ChevronDown,
  User,
  X,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface MeInfo {
  email: string;
  role: string;
  tenantName: string;
  tenantPlan: string | null;
  tenantId: string;
}

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/companies', label: '企業リスト', icon: Building2 },
  { href: '/delivery-history', label: '配信履歴', icon: Mail },
  { href: '/email-settings', label: 'メール送信設定', icon: Send },
  { href: '/icp', label: 'ICP設定', icon: Target },
  { href: '/csv-import', label: 'CSV取込', icon: Upload },
  { href: '/unsubscribe', label: '配信停止リスト', icon: Ban },
  { href: '/settings', label: '設定', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<MeInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setMe(data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside
      className={`
        flex flex-col w-56 h-screen overflow-y-auto text-white flex-shrink-0
        fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out
        md:sticky md:bottom-auto md:left-auto md:z-auto md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ backgroundColor: '#0f1629' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Freshbound" width={40} height={40} className="rounded-xl" />
          <div className="text-sm font-bold leading-tight">Freshbound</div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>
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
              onClick={onClose}
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
      <div className="px-3 py-3 border-t border-white/10 flex-shrink-0 relative">
        <div className="bg-white/5 rounded-lg px-3 py-2 mb-3">
          <div className="text-xs text-gray-300 font-medium truncate">
            {me ? me.tenantName : '—'}
          </div>
          <div className="text-xs text-gray-400">
            プラン：{me ? (me.tenantPlan ?? 'トライアル') : '—'}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {me ? `ID: ${me.tenantId.slice(0, 8)}…` : '—'}
          </div>
        </div>

        {/* Logout dropdown */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              ログアウト
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-1 w-full hover:bg-white/5 rounded-lg py-1 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <User size={14} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-medium truncate">
              {me ? me.email : '—'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {me ? (me.role === 'admin' ? '管理者' : me.role) : '—'}
            </div>
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 flex-shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
}
