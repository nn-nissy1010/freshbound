'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLang } from './LangContext';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard, Building2, Users, Mail, FileText,
  Ban, Plug, BarChart2, Settings, Shield, ChevronDown,
  ChevronRight, Globe, Store, X, Activity, Database,
} from 'lucide-react';

interface NavItem {
  href?: string;
  labelJa: string;
  labelEn: string;
  icon: React.ElementType;
  children?: { href: string; labelJa: string; labelEn: string }[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  { href: '/admin', labelJa: 'ダッシュボード', labelEn: 'Dashboard', icon: LayoutDashboard },
  {
    labelJa: 'テナント管理', labelEn: 'Tenants', icon: Building2,
    children: [
      { href: '/admin/tenants', labelJa: '顧客一覧', labelEn: 'Customer List' },
      { href: '/admin/invoices', labelJa: '請求書', labelEn: 'Invoices' },
    ],
  },
  { href: '/admin/agencies', labelJa: '代理店管理', labelEn: 'Agencies', icon: Store },
  { href: '/admin/companies-master', labelJa: '企業マスタ', labelEn: 'Company Master', icon: Database },
  { href: '/admin/users', labelJa: 'ユーザー管理', labelEn: 'Users', icon: Users },
  { href: '/admin/pipeline', labelJa: 'パイプライン監視', labelEn: 'Pipeline Monitor', icon: Activity },
  {
    labelJa: 'メール配信監視', labelEn: 'Email Delivery', icon: Mail,
    children: [
      { href: '/admin/email-logs', labelJa: 'メールログ', labelEn: 'Email Logs' },
      { href: '/admin/compliance', labelJa: '配信停止', labelEn: 'Unsubscribes' },
    ],
  },
  { href: '/admin/api-monitor', labelJa: 'API監視', labelEn: 'API Monitor', icon: Plug },
  { href: '/admin/analytics', labelJa: '分析', labelEn: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', labelJa: 'システム設定', labelEn: 'System Settings', icon: Settings },
  { href: '/admin/audit', labelJa: '監査ログ', labelEn: 'Audit Logs', icon: Shield },
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const [openGroups, setOpenGroups] = useState<string[]>(['テナント管理', 'メール配信監視']);

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  return (
    <aside
      className={`flex flex-col w-56 text-white flex-shrink-0
        fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out overflow-y-auto
        md:sticky md:top-0 md:h-screen md:bottom-auto md:left-auto md:z-auto md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ backgroundColor: '#0f1629' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold leading-tight">Admin Panel</div>
            <div className="text-xs text-red-300 leading-tight">Control Tower</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Lang Toggle */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs">
          <button
            onClick={() => setLang('ja')}
            className={`flex-1 py-1.5 font-medium transition-colors ${lang === 'ja' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            JP
          </button>
          <button
            onClick={() => setLang('en')}
            className={`flex-1 py-1.5 font-medium transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const label = t(lang, item.labelJa, item.labelEn);
          const groupKey = item.labelJa;

          if (item.children) {
            const isOpen = openGroups.includes(groupKey);
            const isGroupActive = item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'));
            return (
              <div key={groupKey}>
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all ${
                    isGroupActive ? 'text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{label}</span>
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                {isOpen && (
                  <div className="ml-4 mb-1 border-l border-white/10 pl-2">
                    {item.children.map(child => {
                      const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`flex items-center px-3 py-2 rounded-lg mb-0.5 text-xs transition-all ${
                            isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {t(lang, child.labelJa, child.labelEn)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href! + '/'));
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all ${
                isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin User */}
      <div className="px-3 py-3 border-t border-white/10 flex-shrink-0">
        <div className="bg-red-900/30 rounded-lg px-3 py-2 mb-2">
          <div className="text-xs text-red-300 font-medium">Super Admin</div>
          <div className="text-xs text-gray-400">admin@system.internal</div>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">A</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">System Admin</div>
            <div className="text-xs text-gray-400 truncate">{t(lang, '管理者', 'Administrator')}</div>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-white">
            <Globe size={13} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
