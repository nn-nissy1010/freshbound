'use client';

import {
  createContext, useContext, useState, useCallback,
  useEffect, ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ─── Context & hook ──────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Individual toast item ───────────────────────────────────────────────────

const STYLES: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircle; iconColor: string }> = {
  success: { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800', icon: CheckCircle,   iconColor: 'text-green-500' },
  error:   { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-800',   icon: AlertCircle,   iconColor: 'text-red-500' },
  info:    { bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-800',  icon: Info,          iconColor: 'text-blue-500' },
};

function ToastEntry({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  // スライドイン・フェードイン: マウント直後に1フレーム遅らせてトリガー
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const s = STYLES[item.type];
  const Icon = s.icon;

  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        min-w-72 max-w-sm transition-all duration-300 ease-out
        ${s.bg} ${s.border}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
      `}
    >
      <Icon size={18} className={`${s.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium flex-1 leading-snug ${s.text}`}>{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        className={`${s.iconColor} opacity-60 hover:opacity-100 flex-shrink-0 transition-opacity`}
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* 右上に固定配置 — 新しい通知が上に積み上がる */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(item => (
          <ToastEntry key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
