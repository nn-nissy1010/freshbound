'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import Image from 'next/image';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
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
          <Image src="/logo.png" alt="Freshbound" width={28} height={28} className="rounded-lg" />
          <span className="text-sm font-bold text-white">Freshbound</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
