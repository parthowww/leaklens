'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchAlert, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store/app-store';

export default function LoginPage() {
  const router = useRouter();
  const { resetToDemoData } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }

    // Default route to dashboard
    router.push('/dashboard');
  };

  const handleContinueAsDemo = () => {
    resetToDemoData();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <SearchAlert className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">LeakLens</span>
        </Link>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Audit your expense statements and track confirmed savings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10 space-y-6">
          {errorMsg && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@agency.com"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full text-xs font-semibold h-9">
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="border-t border-slate-200" />
            <span className="bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider absolute top-[-9px] left-1/2 -translate-x-1/2">
              or explore instantly
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleContinueAsDemo}
            className="w-full text-xs font-semibold border-emerald-300 text-emerald-900 hover:bg-emerald-50 gap-2 h-9"
          >
            <Sparkles className="h-4 w-4 text-emerald-600" /> Continue with Interactive Demo
          </Button>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-emerald-600 hover:underline">
              Create workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
