-- ==============================================================================
-- LEAKLENS DATABASE MIGRATION: INITIAL SCHEMA & ROW LEVEL SECURITY
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Workspaces Table
create table if not exists public.workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade not null,
  currency text default 'INR' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Workspace Members Table
create table if not exists public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner' check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (workspace_id, user_id)
);

-- 4. Import Batches Table
create table if not exists public.import_batches (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  filename text not null,
  row_count integer default 0 not null,
  valid_row_count integer default 0 not null,
  rejected_row_count integer default 0 not null,
  status text default 'completed' check (status in ('completed', 'failed', 'partial')),
  imported_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Transactions Table
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  import_batch_id uuid references public.import_batches(id) on delete set null,
  transaction_date date not null,
  merchant text not null,
  description text not null,
  amount numeric(14, 2) not null,
  category text default 'General' not null,
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Findings Table
create table if not exists public.findings (
  id text primary key, -- formatted id e.g. dup-tx1-tx2
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  rule_type text not null check (rule_type in ('duplicate_payment', 'recurring_expense', 'price_increase', 'unusual_expense')),
  title text not null,
  merchant text not null,
  explanation text not null,
  priority text default 'medium' check (priority in ('high', 'medium', 'low')),
  evidence_strength text default 'medium' check (evidence_strength in ('high', 'medium', 'low')),
  estimated_impact numeric(14, 2) default 0.00 not null,
  review_status text default 'new' check (review_status in ('new', 'investigating', 'legitimate', 'resolved', 'ignored')),
  details jsonb default '{}'::jsonb,
  user_notes text,
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Finding Transactions Join Table
create table if not exists public.finding_transactions (
  finding_id text references public.findings(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete cascade not null,
  primary key (finding_id, transaction_id)
);

-- 8. Finding Notes Table
create table if not exists public.finding_notes (
  id uuid default gen_random_uuid() primary key,
  finding_id text references public.findings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  note text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_transactions_workspace_date on public.transactions (workspace_id, transaction_date desc);
create index if not exists idx_transactions_merchant on public.transactions (workspace_id, merchant);
create index if not exists idx_findings_workspace_status on public.findings (workspace_id, review_status);
create index if not exists idx_findings_rule_type on public.findings (workspace_id, rule_type);
create index if not exists idx_workspace_members_user on public.workspace_members (user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.import_batches enable row level security;
alter table public.transactions enable row level security;
alter table public.findings enable row level security;
alter table public.finding_transactions enable row level security;
alter table public.finding_notes enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Workspaces: members can view their workspaces
create policy "Members can view workspaces" on public.workspaces
  for select using (
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Users can create workspaces" on public.workspaces
  for insert with check (auth.uid() = owner_id);

create policy "Owners can update workspaces" on public.workspaces
  for update using (auth.uid() = owner_id);

create policy "Owners can delete workspaces" on public.workspaces
  for delete using (auth.uid() = owner_id);

-- Workspace Members
create policy "Members can view workspace members" on public.workspace_members
  for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_members.workspace_id
      and wm.user_id = auth.uid()
    )
  );

-- Transactions: members can view and manipulate transactions of their workspace
create policy "Members can view workspace transactions" on public.transactions
  for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = transactions.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy "Members can insert workspace transactions" on public.transactions
  for insert with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = transactions.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy "Members can delete workspace transactions" on public.transactions
  for delete using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = transactions.workspace_id
      and wm.user_id = auth.uid()
    )
  );

-- Findings: members can view and update findings of their workspace
create policy "Members can view workspace findings" on public.findings
  for select using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = findings.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy "Members can update workspace findings" on public.findings
  for update using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = findings.workspace_id
      and wm.user_id = auth.uid()
    )
  );

create policy "Members can insert workspace findings" on public.findings
  for insert with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = findings.workspace_id
      and wm.user_id = auth.uid()
    )
  );
