import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #0f1629 0%, #1a2744 50%, #0d2137 100%)',
        fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
        <div
          className="absolute bottom-20 right-20 w-56 h-56 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Image src="/logo.png" alt="Freshbound" width={40} height={40} className="rounded-xl" />
          <span className="text-white font-bold text-lg">Freshbound</span>
        </div>

        {/* 404 */}
        <div
          className="text-8xl font-bold mb-4 tabular-nums"
          style={{
            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>

        <h1 className="text-white text-xl font-semibold mb-2">
          ページが見つかりません
        </h1>
        <p className="text-blue-300 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
          お探しのページは存在しないか、移動・削除された可能性があります。
        </p>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
        >
          ログインページへ戻る
        </Link>
      </div>

      <div className="absolute bottom-6 text-blue-400 text-xs">
        © 2026 Freshbound
      </div>
    </div>
  );
}
