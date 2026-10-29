# LeakLens — Financial Leak Intelligence for Small Businesses

> **"Find the leaks. Keep more of what you earn."**

LeakLens is a modern SaaS web application that helps small businesses, digital marketing agencies, and freelancers identify hidden financial leaks by analysing expense transaction data.

Users upload expense CSV files from any bank, credit card, or bookkeeping tool. LeakLens automatically detects suspicious or unnecessary spending patterns, explains every finding with supporting transaction evidence, and provides actionable recommendations.

---

## 🌟 Key Features

1. **Deterministic Leak Detection Engine (Zero AI Hallucinations for Arithmetic):**
   - **Rule 1: Possible Duplicate Payments:** Identifies identical charges to the same or similar vendor within a configurable date window (default 3 days). Only counts the incremental extra charge once.
   - **Rule 2: Recurring Expenses & Subscriptions:** Analyzes repeated payments to extract regular billing cadences (weekly, monthly, quarterly, annual) and projects annualized commitments.
   - **Rule 3: Vendor Price Increases:** Compares recent charges against historical merchant baselines, alerting when vendor prices surge above threshold (default: 15%+).
   - **Rule 4: Unusual Expense Surges:** Compares charges against historical medians and category distributions to flag anomalous spikes (default: > 2.2x median).
2. **Transparent Financial Calculations:**
   - Clearly separates **Potential Savings** (eligible non-overlapping findings under review) from **Confirmed Savings** (resolved/refunded issues) and Total Spending.
   - Indian Rupee (`₹` INR) formatting natively supported.
3. **Robust CSV Import Workflow:**
   - Supports multi-format dates (`YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`, etc.).
   - Strips currency symbols (`₹`, `$`, commas, quotes) and normalizes parenthesized negative debits.
   - Interactive column-mapping interface with intelligent automatic header matching.
   - Row-level validation summary highlighting rejected rows with clear error explanations.
4. **Interactive Demo Mode:**
   - Pre-loaded with realistic synthetic agency transactions demonstrating all 4 rules (Adobe duplicate charge, Figma 50% price increase, AWS server bill jump, and recurring subscriptions).
   - Works immediately out-of-the-box with zero setup required.
5. **Interactive Review Workflow:**
   - Detail drawer showing underlying transaction evidence, deterministic calculation breakdown, and recommended next steps.
   - Workflow statuses: `New`, `Investigating`, `Legitimate`, `Resolved`, `Ignored` with action confirmation prompts.
6. **Reporting & Exports:**
   - Downloadable CSV exports for both Leak Findings and Full Transactions Ledger.
   - Clean print-ready / PDF report summary for finance reviews and accountant meetings.
7. **Enterprise Security & Isolation:**
   - Supabase PostgreSQL schema with Row Level Security (RLS) policies.
   - Workspace isolation ensures financial records are strictly partitioned.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS v4 (Deep navy typography, neutral off-white backgrounds, restrained emerald accents)
- **Icons:** Lucide React
- **Charts:** Recharts (Area Trend chart, Category Donut chart)
- **CSV Engine:** Papa Parse
- **Database & Auth:** Supabase (PostgreSQL with RLS policies)
- **Testing:** Native Node.js test runner (`node --test`)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v20.0.0` or higher (`v24.20.0` tested)
- npm `v10.0.0` or higher

### 2. Installation
```bash
cd leaklens
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Visit `/` for the public marketing landing page.
- Click **"Analyse Sample Expenses"** to launch the interactive demo dashboard pre-loaded with synthetic agency records.
- Click **"Upload Expenses"** to upload your own bank or credit card CSV statement.

### 4. Running Automated Tests
Run the deterministic engine and CSV parser test suite:
```bash
npm test
```

### 5. Production Build
Verify the production build:
```bash
npm run build
npm start
```

---

## 🔐 Supabase Configuration & Database Migrations

LeakLens works out-of-the-box in local demo/in-memory mode. To connect to a live Supabase project:

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Set your project URL and anonymous API key:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. In your Supabase dashboard, open the **SQL Editor**, and execute the migration script located at:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   This script creates:
   - `profiles`, `workspaces`, `workspace_members`
   - `import_batches`, `transactions`
   - `findings`, `finding_transactions`, `finding_notes`
   - Performance indexes and Row Level Security (RLS) policies.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Framework Preset to **Next.js**.
4. (Optional) Add your Supabase environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 🧪 Detection Engine Rules Summary

| Rule | Detection Condition | Impact Calculation |
| :--- | :--- | :--- |
| **Possible Duplicate Payments** | Matching merchant & identical amount within configurable window (default 3 days). | Additional duplicate transaction amount (only counted once, not 2x). |
| **Recurring Expenses** | Regular periodic intervals (~7d, ~30d, ~90d, ~365d) with consistent charges. | Typical median charge × annualized frequency multiplier. |
| **Vendor Price Increases** | Historical vendor baseline compared against latest charge, exceeding 15%+. | Monthly delta between new charge and historical median baseline. |
| **Unusual Expense Surges** | Outlier transaction exceeding 2.2x merchant historical median or category baseline. | Delta above normal baseline median. |
