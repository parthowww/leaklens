'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/app-store';

export default function DemoPage() {
  const router = useRouter();
  const { resetToDemoData } = useAppStore();

  useEffect(() => {
    resetToDemoData();
    router.replace('/dashboard');
  }, [resetToDemoData, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-medium text-slate-700">Loading interactive demo dataset...</p>
      </div>
    </div>
  );
}
