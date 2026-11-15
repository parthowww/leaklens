import type { Metadata } from 'next';
import './globals.css';
import { AppStoreProvider } from '@/lib/store/app-store';

export const metadata: Metadata = {
  title: 'LeakLens | Expense review',
  description:
    'Review expense CSVs for duplicate payments, recurring costs, vendor price changes and unusual charges, with transaction evidence for every finding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#faf9f6] text-[#1f2a27]">
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
