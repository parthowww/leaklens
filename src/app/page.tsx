'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  SearchAlert,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Repeat,
  TrendingUp,
  AlertTriangle,
  Lock,
  EyeOff,
  Server,
  HelpCircle,
  Sparkles,
  Layers,
  ChevronDown,
  DollarSign,
  AlertOctagon,
  ArrowUpRight,
  Zap,
  Activity,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth interpolation from 0 (top of page) to 1 (scrolled 160px)
  const p = Math.min(Math.max(scrollY / 160, 0), 1);
  const isDocked = p > 0.85;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden relative">
      {/* Background Scattered Ambient Grid & Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.35]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/4 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl" />
      </div>

      {/* FIXED TOP NAVBAR BACKGROUND & ACTIONS */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          scrollY > 40
            ? 'h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
            : 'h-20 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Empty placeholder reserved for the flying logo docking zone */}
          <div className="w-36 sm:w-44 h-8" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#problem" className="hover:text-emerald-600 transition-colors">
              The Leaks
            </a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-emerald-600 transition-colors">
              Security & Privacy
            </a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Top Right Action Button */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs text-xs font-medium cursor-pointer"
              >
                Analyse Sample Expenses <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* FLYING CONTINUOUS LOGO: STARTS BIG IN THE CENTER & SHRINKS TO DOCK AT THE TOP */}
      <div
        className="fixed z-50 pointer-events-auto transition-transform duration-75 ease-out will-change-transform"
        style={{
          // Left position smoothly glides from 50% (center) to the left margin (1.5rem)
          left: `calc(${50 * (1 - p)}% + ${1.5 * p}rem)`,
          // Top position glides from hero vertical spot (~110px) to top bar vertical alignment (14px)
          top: `${110 * (1 - p) + 14 * p}px`,
          // Transform scales from 1.35x down to 0.72x, and un-centers from -50% to 0
          transform: `translateX(-${50 * (1 - p)}%) scale(${1.35 * (1 - p) + 0.75 * p})`,
          transformOrigin: 'top left',
        }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo Emblem Icon */}
          <div
            className={`rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl ring-4 ring-white/90 transition-all duration-300 ${
              isDocked ? 'h-10 w-10 rounded-lg shadow-xs' : 'h-16 w-16'
            }`}
          >
            <SearchAlert className={isDocked ? 'h-6 w-6' : 'h-9 w-9'} />
          </div>

          {/* Logo Brand Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`font-black tracking-tight text-slate-900 transition-all duration-300 ${
                  isDocked ? 'text-xl' : 'text-3xl'
                }`}
              >
                LeakLens
              </span>
              {!isDocked && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Audit AI
                </span>
              )}
            </div>
            {/* Tagline disappears as it docks */}
            <span
              className="text-[11px] font-semibold text-emerald-700 tracking-wide transition-opacity duration-200"
              style={{
                opacity: Math.max(1 - p * 2.5, 0),
                display: p > 0.6 ? 'none' : 'block',
              }}
            >
              Financial Leak Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* HERO SECTION WITH DYNAMIC SCATTERED FINTECH CANVAS */}
      <section className="relative pt-44 pb-20 sm:pt-52 sm:pb-28">
        {/* SCATTERED FLOATING FINANCIAL LEAK WIDGETS ACROSS THE CANVAS */}

        {/* 1. Left Upper Widget: Duplicate Alert Badge */}
        <div
          className="hidden xl:flex absolute top-36 left-8 2xl:left-16 z-20 flex-col gap-1 p-3.5 rounded-2xl bg-white border border-rose-200 shadow-xl shadow-rose-900/5 -rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default max-w-xs"
          style={{ transform: `translateY(${scrollY * 0.1}px) rotate(-3deg)` }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold text-rose-900">Duplicate Charge Detected</span>
            </div>
            <Badge variant="destructive" className="text-[9px] py-0 px-1.5 font-bold">
              High
            </Badge>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-1">Adobe Systems Inc</p>
          <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md mt-1">
            <span>2x charges (Oct 12 & 13)</span>
            <span className="font-bold text-rose-600">₹5,400</span>
          </div>
        </div>

        {/* 2. Right Upper Widget: Price Hike Surge Card */}
        <div
          className="hidden xl:flex absolute top-40 right-8 2xl:right-16 z-20 flex-col gap-1 p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xl shadow-amber-900/5 rotate-3 hover:rotate-0 transition-transform duration-300 cursor-default max-w-xs"
          style={{ transform: `translateY(${scrollY * 0.08}px) rotate(3deg)` }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[11px] font-bold text-amber-900">50% Price Increase</span>
            </div>
            <Badge variant="warning" className="text-[9px] py-0 px-1.5 font-bold">
              Warning
            </Badge>
          </div>
          <p className="text-xs font-semibold text-slate-800 mt-1">Figma Design Seats</p>
          <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md mt-1">
            <span>₹1,200 → ₹1,800/mo</span>
            <span className="font-bold text-amber-700">+₹7,200/yr</span>
          </div>
        </div>

        {/* 3. Left Mid Widget: AWS Cloud Outlier Spikes */}
        <div
          className="hidden lg:flex absolute top-[28rem] left-4 2xl:left-12 z-20 items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-lg -rotate-1 hover:rotate-0 transition-transform cursor-default"
          style={{ transform: `translateY(${scrollY * 0.05}px) rotate(-1.5deg)` }}
        >
          <div className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-900">AWS Infrastructure</span>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded">
                +492% Surge
              </span>
            </div>
            <p className="text-[11px] text-slate-500">₹24,850 vs typical ₹4,200 median</p>
          </div>
        </div>

        {/* 4. Right Mid Widget: Recurring SaaS Commitments */}
        <div
          className="hidden lg:flex absolute top-[27rem] right-4 2xl:right-12 z-20 items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-lg rotate-2 hover:rotate-0 transition-transform cursor-default"
          style={{ transform: `translateY(${scrollY * 0.06}px) rotate(2deg)` }}
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
            <Repeat className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-900">Recurring Commitments</span>
            <p className="text-[11px] text-slate-500">
              <strong className="text-slate-800">₹94,200/yr</strong> across 6 software tools
            </p>
          </div>
        </div>

        {/* 5. Scattered Floating Feature Pills */}
        <div className="hidden sm:block absolute top-72 left-1/4 -translate-x-32 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800 shadow-2xs rotate-[-6deg]">
            <Zap className="h-3 w-3 text-emerald-600" /> Deterministic Detection
          </span>
        </div>

        <div className="hidden sm:block absolute top-64 right-1/4 translate-x-36 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-800 shadow-2xs rotate-[5deg]">
            <Lock className="h-3 w-3 text-blue-600" /> 0 Banking Passwords Needed
          </span>
        </div>

        {/* MAIN HERO CONTENT */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Turn raw expense CSVs into clear money-saving evidence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Your business has money leaks.{' '}
            <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-8">
              Let&apos;s find them.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Upload any expense CSV statement. Uncover duplicate charges, stealthy subscription price
            hikes, and unexplained spending surges — with 100% deterministic arithmetic evidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm font-semibold px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 gap-2 cursor-pointer h-12"
              >
                Analyse Sample Expenses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm font-semibold px-8 border-slate-300 bg-white hover:bg-slate-50 cursor-pointer h-12 shadow-2xs"
              >
                See How It Works
              </Button>
            </a>
          </div>

          <p className="text-xs text-slate-400">
            Free interactive demo • No credit card required • Works with all Indian & Global bank CSVs
          </p>
        </div>

        {/* SCATTERED ASYMMETRIC DASHBOARD PREVIEW CANVAS */}
        <div className="mt-14 max-w-6xl mx-auto px-4 sm:px-6 relative z-20">
          <div className="relative rounded-2xl border border-slate-200 bg-white p-3 sm:p-5 shadow-2xl">
            {/* Top Pill Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono font-semibold text-slate-500">
                  LeakLens Financial Intelligence Studio
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-50">
                Interactive Agency Preview
              </Badge>
            </div>

            {/* Asymmetrical Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
              {/* Left Column: Metrics Staggered */}
              <div className="md:col-span-4 space-y-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
                  <div className="flex justify-between items-center text-xs font-semibold text-emerald-800">
                    <span>Potential Savings</span>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-950 mt-1">₹30,850</p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    3 non-overlapping issues to investigate
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-2xs">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Total Expenses Audited</span>
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹2,84,390</p>
                  <p className="text-[11px] text-slate-500 mt-1">32 transactions across Q3-Q4</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-2xs">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Annualized SaaS Subscriptions</span>
                    <Repeat className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-1">₹94,200/yr</p>
                  <p className="text-[11px] text-slate-500 mt-1">Google Workspace, Slack, Figma</p>
                </div>
              </div>

              {/* Right Column: Live Finding Cards */}
              <div className="md:col-span-8 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Adobe Systems Inc</span>
                        <Badge variant="destructive" className="text-[10px]">
                          Duplicate Charge
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Two identical charges of ₹5,400 debited within 24 hours on Oct 12 and Oct 13.
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Leak Amount
                      </span>
                      <span className="text-sm font-bold text-slate-900">₹5,400</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Evidence: ADB-99281-A & ADB-99281-B</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      Refund claim ready <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Figma Inc</span>
                        <Badge variant="warning" className="text-[10px]">
                          Price Increase (+50%)
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Medium Priority
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Monthly subscription increased from ₹1,200 baseline to ₹1,800 (+₹600/mo).
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Annual Impact
                      </span>
                      <span className="text-sm font-bold text-slate-900">₹7,200/yr</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Baseline: ₹1,200 (Jul & Aug 2026)</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      Tier review recommended <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Amazon Web Services</span>
                        <Badge variant="destructive" className="text-[10px]">
                          Unusual Outlier Surge
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          High Priority
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        October charge of ₹24,850 is 492% higher than vendor median baseline (₹4,200).
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Surge Delta
                      </span>
                      <span className="text-sm font-bold text-slate-900">₹20,650</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Baseline: 3 historical charges ~₹4,200</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      Uncapped instance alert <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: SCATTERED BENTO GRID OF LEAKS & PROBLEMS */}
      <section id="problem" className="py-20 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Hidden Profit Drain
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
                The 4 Ways Small Businesses Bleed Cash
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Without dedicated financial analysts, subscription sprawl and statement clutter hide
              unnecessary expenses in plain sight.
            </p>
          </div>

          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento Card 1: Wide Duplicate Box */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900">Accidental Duplicate Charges</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Payment gateway retry spikes, parallel auto-debits, and duplicate invoice approvals
                  frequently trigger twin debits. We flag matching amounts within configurable day
                  windows and count only the extra charge.
                </p>
              </div>
              <div className="mt-6 rounded-xl bg-rose-50/50 border border-rose-100 p-3.5 flex items-center justify-between text-xs">
                <span className="font-medium text-rose-950">
                  Example: Adobe billed twice within 24 hours
                </span>
                <span className="font-bold text-rose-700">₹5,400 leak</span>
              </div>
            </div>

            {/* Bento Card 2: Price Hike Box */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900">Stealth Price Increases</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Vendors raising subscription tier pricing by 15% to 50% without clear warnings.
                  We compare recent debits to historical merchant medians.
                </p>
              </div>
              <div className="mt-6 rounded-xl bg-amber-50/60 border border-amber-100 p-3.5 flex items-center justify-between text-xs">
                <span className="font-medium text-amber-950">Example: Figma +50% hike</span>
                <span className="font-bold text-amber-800">+₹7,200/yr</span>
              </div>
            </div>

            {/* Bento Card 3: Forgotten Subscriptions */}
            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900">Forgotten Subscriptions</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Software tools activated for one-off projects or departed staff that continue
                  quietly charging cards every month.
                </p>
              </div>
              <div className="mt-6 rounded-xl bg-blue-50/60 border border-blue-100 p-3.5 flex items-center justify-between text-xs">
                <span className="font-medium text-blue-950">Automatic cadence detection</span>
                <span className="font-bold text-blue-700">Annualized totals</span>
              </div>
            </div>

            {/* Bento Card 4: Wide Outlier Surge Box */}
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900">Unusual Outlier Surges</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Uncapped cloud infrastructure instances, variable API consumption jumps, or
                  unauthorized team spending. We calculate deviation from historical medians.
                </p>
              </div>
              <div className="mt-6 rounded-xl bg-emerald-50/60 border border-emerald-100 p-3.5 flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-950">
                  Example: AWS jumps 492% above normal median
                </span>
                <span className="font-bold text-emerald-800">₹20,650 spike</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              4-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
              From Raw Statement to Recovered Cash
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Step 01</span>
              <h4 className="text-base font-bold text-slate-900">Upload CSV</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export from HDFC, ICICI, SBI, Stripe, or QuickBooks. Our column mapping interface
                auto-detects Date, Merchant, and Amount.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Step 02</span>
              <h4 className="text-base font-bold text-slate-900">Deterministic Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematical rules scan for duplicate charges, subscription cadences, price bumps,
                and statistical deviations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Step 03</span>
              <h4 className="text-base font-bold text-slate-900">Review Findings</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect supporting transaction evidence, baseline calculations, and suggested
                investigation steps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Step 04</span>
              <h4 className="text-base font-bold text-slate-900">Take Action</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claim vendor refunds, cancel dormant seats, negotiate lock-ins, and export print-ready
                audit summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & SECURITY SECTION */}
      <section id="security" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-800 px-3.5 py-1 text-xs font-semibold text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Strict Financial Privacy & RLS</span>
            </div>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for absolute confidentiality
            </h3>
            <p className="mt-3 text-sm text-slate-400">
              We never ask for your bank credentials, banking passwords, or card numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 space-y-3">
              <EyeOff className="h-6 w-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">No Bank Logins Required</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You only upload the exported CSV records you choose to inspect. No credentials or
                direct account access needed.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 space-y-3">
              <Server className="h-6 w-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">PostgreSQL Row Level Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every transaction and leak finding is secured with PostgreSQL RLS. Cross-workspace
                leakage is blocked by database policies.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 space-y-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h4 className="text-base font-bold text-white">1-Click Workspace Wipe</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permanently purge all ledger records and leak findings at any time directly from the
                workspace settings panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">FAQ</span>
          <h3 className="mt-1 text-3xl font-bold text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-slate-900">
              Does LeakLens make up numbers or use generative AI for arithmetic?
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              No. Every single calculation — duplicates, percentage increases, and historical
              medians — is computed deterministically in tested code. There are zero AI hallucinations.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-slate-900">
              How does LeakLens avoid double-counting savings?
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              When a duplicate charge is flagged, only the second suspected transaction is counted
              towards potential savings (not 2x). Transactions flagged across multiple rules are
              de-duplicated in the savings calculator.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-slate-900">
              Can I try LeakLens without signing up?
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Yes. Click &quot;Analyse Sample Expenses&quot; to test our interactive demo pre-loaded with
              synthetic agency transactions.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="text-3xl font-extrabold">Find the leaks. Keep more of what you earn.</h3>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Audit your expense transactions for duplicates, surges, and recurring software costs in
            under 2 minutes.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold shadow-lg text-sm px-8 cursor-pointer"
              >
                Analyse Sample Expenses Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-[10px]">
              L
            </div>
            <span className="font-bold text-slate-900">LeakLens</span>
            <span>• Financial Leak Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-900">
              Demo Dashboard
            </Link>
            <Link href="/transactions" className="hover:text-slate-900">
              Transactions
            </Link>
            <Link href="/leaks" className="hover:text-slate-900">
              Leak Detection
            </Link>
            <span className="text-slate-300">|</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
