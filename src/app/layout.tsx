import type { Metadata } from 'next';
import './globals.css';
import { AppStoreProvider } from '@/lib/store/app-store';

export const metadata: Metadata = {
  title: 'LeakLens — Find the leaks. Keep more of what you earn.',
  description:
    'Modern financial intelligence SaaS helping small businesses uncover duplicate payments, recurring software subscriptions, and suspicious expense surges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
