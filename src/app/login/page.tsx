'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Globe, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0f1629 0%, #1a2744 50%, #0d2137 100%)' }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
          {/* Grid dots */}
          {Array.from({ length: 8 }).map((_, i) =>
            Array.from({ length: 6 }).map((_, j) => (
              <div
                key={`${i}-${j}`}
                className="absolute w-1 h-1 rounded-full bg-blue-400 opacity-10"
                style={{ top: `${i * 14 + 5}%`, left: `${j * 18 + 5}%` }}
              />
            ))
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.3"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" opacity="0.6"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-lg leading-tight">AIアウトバウンド</div>
            <div className="text-blue-300 text-sm leading-tight">自動化</div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            BtoB新規開拓を、<br />AIで全自動化。
          </h1>
          <p className="text-blue-200 text-sm leading-relaxed mb-10">
            リスト作成からメール配信、反応検知、商談化まで<br />AIが一気通貫でサポートします。
          </p>

          <div className="space-y-5">
            {[
              {
                icon: '🎯',
                color: '#3b82f6',
                title: '高精度なターゲット発掘',
                desc: '新規HP判定や求人情報を活用し、アクティブな企業を抽出',
              },
              {
                icon: '✉️',
                color: '#10b981',
                title: 'AIパーソナライズ配信',
                desc: '企業情報をもとに、AIが最適なメール文面を自動生成',
              },
              {
                icon: '📊',
                color: '#8b5cf6',
                title: '反応検知・次アクション提案',
                desc: '開封・返信を検知し、AIが次のアクションを提案',
              },
              {
                icon: '👥',
                color: '#f59e0b',
                title: 'チームで成果を最大化',
                desc: '複数人での対応・共有が可能なコラボレーション機能',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                  style={{ backgroundColor: item.color + '22', border: `1px solid ${item.color}44` }}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-blue-400 text-xs">
          © 2025 AIアウトバウンド自動化
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Language selector */}
        <div className="flex justify-end p-4">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition-colors">
            <Globe size={14} />
            <span>日本語</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>

        {/* Login form */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Logo (mobile) */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" opacity="0.3"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" opacity="0.6"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">AIアウトバウンド</div>
                  <div className="text-blue-500 text-sm">自動化</div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-center text-gray-800 mb-1">ログイン</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                アカウントにログインしてダッシュボードにアクセスします
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="メールアドレスを入力してください"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="パスワードを入力してください"
                      className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-600">ログインしたままにする</span>
                  </label>
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    パスワードをお忘れですか？
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  ログイン
                </button>
              </form>
            </div>

            {/* Footer links */}
            <div className="mt-6 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <Link href="#" className="hover:text-gray-600">プライバシーポリシー</Link>
                <Link href="#" className="hover:text-gray-600">利用規約</Link>
                <Link href="#" className="hover:text-gray-600">特定商取引法に基づく表記</Link>
                <Link href="#" className="hover:text-gray-600">ヘルプ</Link>
              </div>
              <p className="text-xs text-gray-400">
                © 2025 AIアウトバウンド自動化 All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
