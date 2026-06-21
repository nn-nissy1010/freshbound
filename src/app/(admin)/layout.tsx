'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { LangProvider } from '@/components/admin/LangContext';
import { Menu, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LangProvider>
      <div className="flex min-h-screen bg-gray-50">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 min-w-0">
          <header
            className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30 flex-shrink-0"
            style={{ backgroundColor: '#0f1629' }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
            >
              <Menu size={20} />
            </button>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}
            >
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </LangProvider>
  );
}
