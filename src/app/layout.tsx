import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'freshbound',
  description: 'BtoB新規開拓を、AIで全自動化。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
