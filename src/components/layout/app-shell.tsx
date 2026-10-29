'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  SearchAlert,
  Repeat,
  FileBarChart2,
  Settings,
  Upload,
  ChevronDown,
  Bell,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { UploadModal } from '@/components/upload/upload-modal';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Leak Detection', href: '/leaks', icon: SearchAlert, showBadge: true },
  { name: 'Recurring Expenses', href: '/recurring', icon: Repeat },
  { name: 'Reports', href: '/reports', icon: FileBarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { workspace, metrics, isDemoMode, resetToDemoData } = useAppStore();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'Overview';
      case '/transactions':
        return 'Transactions Management';
      case '/leaks':
        return 'Leak Detection Hub';
      case '/recurring':
        return 'Recurring Expenses & Subscriptions';
      case '/reports':
        return 'Financial Reports & Exports';
      case '/settings':
        return 'Workspace Settings & Thresholds';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Upload CSV Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {}}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200 bg-white z-30">
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <SearchAlert className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900">LeakLens</span>
              <span className="block text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Financial Audit
              </span>
            </div>
          </Link>
        </div>

        {/* Workspace Selector Indicator */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Workspace</span>
            {isDemoMode && (
              <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-semibold">
                Demo
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between font-medium text-slate-800 text-xs truncate">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{workspace.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isActive ? 'text-emerald-600' : 'text-slate-400'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.showBadge && metrics.issuesToReviewCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-[11px] h-5 min-w-5 px-1.5 flex items-center justify-center"
                  >
                    {metrics.issuesToReviewCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Demo Reset / Info Footer */}
        {isDemoMode && (
          <div className="p-3 mx-3 mb-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs">
            <div className="flex items-center justify-between text-emerald-800 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Interactive Demo
              </span>
              <button
                onClick={resetToDemoData}
                title="Reset sample data"
                className="text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Pre-loaded with real duplicate, SaaS price jump, and outlier patterns.
            </p>
          </div>
        )}

        {/* User Profile Card */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
              JD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">John Doe</p>
              <p className="text-[10px] text-slate-500 truncate">Agency Director</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100"
            title="Public Landing Page"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-xs flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900">{getPageTitle()}</h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {metrics.issuesToReviewCount > 0 && (
              <Link
                href="/leaks"
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title={`${metrics.issuesToReviewCount} findings to review`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
              </Link>
            )}

            <Button
              onClick={() => setIsUploadOpen(true)}
              className="gap-2 shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Expenses</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                      <SearchAlert className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-slate-900">LeakLens</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium',
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.showBadge && metrics.issuesToReviewCount > 0 && (
                          <Badge variant="destructive">{metrics.issuesToReviewCount}</Badge>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsUploadOpen(true);
                  }}
                  className="w-full gap-2"
                >
                  <Upload className="h-4 w-4" /> Upload Expenses
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
