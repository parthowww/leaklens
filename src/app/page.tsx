
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  FileSpreadsheet,
  Repeat,
  SearchAlert,
  ShieldCheck,
  TrendingUp,
  Upload,
} from 'lucide-react';

const findings = [
  { label: 'Possible duplicate', vendor: 'Adobe Creative Cloud', detail: 'Two charges · 1 day apart', amount: '₹5,400' },
  { label: 'Price increase', vendor: 'Figma Professional', detail: 'Monthly plan · up 50%', amount: '+₹7,200 / yr' },
  { label: 'Unusual spike', vendor: 'AWS Infrastructure', detail: '₹24,850 vs typical ₹4,200', amount: '+₹20,650' },
];

const rules = [
  { icon: SearchAlert, title: 'Duplicate payments', text: 'Spot repeat charges to the same vendor, with the extra payment counted only once.' },
  { icon: Repeat, title: 'Recurring costs', text: 'See subscriptions and annual commitments in one clear view.' },
  { icon: TrendingUp, title: 'Price changes', text: 'Compare recent charges with the vendor’s own history.' },
  { icon: CircleDollarSign, title: 'Unusual spend', text: 'Find sharp increases against your normal transaction patterns.' },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] text-[#1f2a27]">
      <header className="border-b border-[#e8e7e1] bg-[#faf9f6]">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="LeakLens home">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#21664f] text-sm font-semibold text-white">L</span>
            <span className="text-[17px] font-semibold tracking-[-0.04em]">LeakLens</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-[#5f6864] md:flex">
            <a className="transition-colors hover:text-[#21664f]" href="#how-it-works">How it works</a>
            <a className="transition-colors hover:text-[#21664f]" href="#what-we-find">What we find</a>
            <a className="transition-colors hover:text-[#21664f]" href="#privacy">Data and privacy</a>
          </nav>
          <Link href="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-md bg-[#21664f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#184f3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21664f]">
            View sample audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:pb-28">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#21664f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#21664f]" />
            Expense review for small teams
          </p>
          <h1 className="text-[clamp(2.7rem,5vw,4.55rem)] font-medium leading-[1.04] tracking-[-0.065em] text-[#1f2a27]">
            Find the spend that should have stopped.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#5f6864] sm:text-lg sm:leading-8">
            LeakLens reviews an expense CSV for duplicate payments, rising prices, recurring costs and unusual charges—then shows the transactions behind every finding.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#21664f] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#184f3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21664f]">
              Explore the sample audit <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="inline-flex h-12 items-center justify-center rounded-md px-5 text-sm font-medium text-[#46514c] transition-colors hover:bg-[#efeee9]">
              See how it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#68716d]">
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#21664f]" /> No bank connection</span>
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#21664f]" /> Review before you act</span>
            <span className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#21664f]" /> Synthetic sample data</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-xl bg-[#eeede7]" />
          <div className="overflow-hidden rounded-lg border border-[#e2e2dc] bg-white shadow-[0_12px_40px_rgba(31,42,39,0.06)]">
            <div className="flex items-center justify-between border-b border-[#ecece7] px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-semibold tracking-[-0.02em]">Sample expense review</p>
                <p className="mt-1 text-xs text-[#77807b]">Agency workspace · Example findings</p>
              </div>
              <span className="rounded-full border border-[#d9e8df] bg-[#f2f8f3] px-2.5 py-1 text-[11px] font-medium text-[#21664f]">Sample data</span>
            </div>
            <div className="grid grid-cols-2 gap-3 px-5 py-5 sm:px-6">
              <div className="rounded-md border border-[#ecece7] bg-[#fcfcfa] p-4">
                <p className="text-xs text-[#77807b]">Potential savings</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.05em]">Needs review</p>
                <p className="mt-1 text-[11px] text-[#77807b]">Not confirmed savings</p>
              </div>
              <div className="rounded-md border border-[#ecece7] bg-[#fcfcfa] p-4">
                <p className="text-xs text-[#77807b]">Checks</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.05em]">4 patterns</p>
                <p className="mt-1 text-[11px] text-[#77807b]">Duplicate · recurring · price · spike</p>
              </div>
            </div>
            <div className="px-5 pb-5 sm:px-6">
              <div className="flex items-center justify-between border-b border-[#ecece7] pb-3">
                <p className="text-xs font-semibold text-[#69736e]">EXAMPLE FINDINGS</p>
                <Link href="/leaks" className="inline-flex items-center gap-1 text-xs font-medium text-[#21664f] hover:underline">View findings <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </div>
              <div className="divide-y divide-[#ecece7]">
                {findings.map((finding) => (
                  <div key={finding.label} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{finding.vendor}</p>
                      <p className="mt-1 truncate text-xs text-[#77807b]">{finding.label} <span className="px-1">·</span> {finding.detail}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">{finding.amount}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-[#ecece7] bg-[#fcfcfa] px-5 py-3 text-xs text-[#68716d] sm:px-6">
              <ShieldCheck className="h-4 w-4 text-[#21664f]" />
              Open a finding to see its source transactions and calculation.
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-[#e8e7e1] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#21664f]">A clear review, start to finish</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Start with the statement you already have.</h2>
            <p className="mt-4 text-sm leading-6 text-[#68716d] sm:text-base">No new bank connection to set up. Upload a CSV, check the column matches and accepted rows, then decide what deserves a follow-up.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {[
              { number: '01', icon: FileSpreadsheet, title: 'Export expenses', text: 'Download a CSV from your bank, card or bookkeeping tool.' },
              { number: '02', icon: Upload, title: 'Upload and map', text: 'LeakLens reads the file in your browser. Confirm the date, merchant and amount columns before importing.' },
              { number: '03', icon: SearchAlert, title: 'Review the evidence', text: 'Open a finding to see the transactions and calculation behind it. Mark it for follow-up, or dismiss it.' },
            ].map((step) => (
              <article key={step.number} className="border-t border-[#dcded8] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tabular-nums text-[#8a918d]">{step.number}</span>
                  <step.icon className="h-4 w-4 text-[#21664f]" />
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#68716d]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="what-we-find" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#21664f]">Four focused checks</p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Useful signals. Clear receipts.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#68716d]">The calculations are rule based. A finding is a prompt to verify a charge, not an instruction to cancel or dispute it.</p>
        </div>
        <div className="mt-10 grid border-l border-t border-[#e5e5df] sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((rule) => (
            <article key={rule.title} className="border-b border-r border-[#e5e5df] bg-[#faf9f6] p-5 sm:p-6">
              <rule.icon className="h-5 w-5 text-[#21664f]" />
              <h3 className="mt-8 text-sm font-semibold">{rule.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68716d]">{rule.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy" className="border-y border-[#e8e7e1] bg-[#f1f1eb]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_1fr] md:items-center md:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#21664f]">Data and privacy</p>
            <h2 className="mt-3 max-w-lg text-3xl font-medium tracking-[-0.05em] sm:text-4xl">Your CSV is handled in your browser.</h2>
          </div>
          <ul className="space-y-4 text-sm leading-6 text-[#4f5b55]">
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#21664f]" /><span>The file is read in the browser. You do not need to connect a bank account or share a banking password.</span></li>
            <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#21664f]" /><span>Imported transactions and review notes are saved in this browser’s local storage so they remain after you return.</span></li>
            <li className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#21664f]" /><span>Remove saved app data from Settings, or clear this site’s browser storage. Use synthetic data if you do not want to store financial records here.</span></li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col justify-between gap-8 rounded-lg border border-[#e4e4de] bg-white p-6 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#21664f]">Ready when you are</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.045em] sm:text-3xl">See what a good review looks like.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#68716d]">Explore the sample audit first, then upload an expense CSV from your dashboard if you choose.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link href="/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#21664f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#184f3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21664f]">Open sample audit <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/dashboard" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#dcded8] px-4 text-sm font-medium text-[#46514c] transition-colors hover:bg-[#f7f7f2]"><Upload className="h-4 w-4" /> Go to dashboard</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e8e7e1] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-xs text-[#77807b] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-[#1f2a27]">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#21664f] text-[10px] font-semibold text-white">L</span>
            <span className="font-semibold">LeakLens</span>
            <span className="text-[#a0a6a2]">· Expense review</span>
          </Link>
          <p>Example figures use synthetic transactions. Review findings before taking action.</p>
          <nav aria-label="Footer navigation" className="flex gap-5">
            <Link className="hover:text-[#21664f]" href="/dashboard">Sample audit</Link>
            <a className="hover:text-[#21664f]" href="#privacy">Data and privacy</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
