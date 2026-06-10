create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'investor' check (role in ('investor', 'admin')),
  balance numeric not null default 0,
  available_balance numeric not null default 0,
  roi numeric not null default 0,
  kyc_status text not null default 'Pending',
  status text not null default 'Active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pools (
  id text primary key,
  name text not null,
  manager text not null default 'Volli',
  capital numeric not null default 0,
  return_label text not null,
  win_rate numeric not null default 0,
  max_drawdown numeric not null default 0,
  risk text not null default 'Medium',
  investors integer not null default 0,
  minimum_deposit numeric not null default 750,
  status text not null default 'Open',
  asset text not null,
  return_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.pools (id, name, manager, return_label, asset, return_summary, investors, minimum_deposit)
values
  ('gold-pool', 'Gold Pool', 'Volli', '5x weekly', 'Gold', 'Profit return: 5 times a week the capital', 11, 750),
  ('usoil-nas100-pool', 'USOIL & NAS100 Pool', 'Volli', '5-10x weekly', 'USOIL, NAS100', 'Profit return: 5-10 times a week the capital', 6, 750)
on conflict (id) do nothing;

update public.pools set investors = 11, minimum_deposit = 750 where id = 'gold-pool';
update public.pools set investors = 6, minimum_deposit = 750 where id = 'usoil-nas100-pool';

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  method text not null,
  type text not null,
  amount numeric not null default 0,
  status text not null,
  reference text,
  destination text,
  network text,
  proof_url text,
  metadata jsonb default '{}'::jsonb,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.transactions add column if not exists reference text;
alter table public.transactions add column if not exists destination text;
alter table public.transactions add column if not exists network text;
alter table public.transactions add column if not exists proof_url text;
alter table public.transactions add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.transactions add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.transactions add column if not exists reviewed_at timestamptz;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  provider text not null,
  pool_id text references public.pools(id) on delete set null,
  amount numeric not null default 0,
  currency text default 'USD',
  asset text,
  wallet text,
  checkout_url text,
  external_reference text,
  proof_url text,
  status text not null,
  customer jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.payments add column if not exists proof_url text;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  status text not null default 'unread',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  pool_id text references public.pools(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  amount numeric not null default 0,
  status text not null default 'Pending payment confirmation',
  created_at timestamptz not null default now()
);

create table if not exists public.kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  document text not null,
  status text not null default 'Pending review',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  section text not null,
  values jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_overrides (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  target_id text,
  values jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.transactions enable row level security;
alter table public.payments enable row level security;
alter table public.allocations enable row level security;
alter table public.kyc_submissions enable row level security;
alter table public.settings enable row level security;
alter table public.admin_overrides enable row level security;
alter table public.pools enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select using (id = auth.uid() or public.is_admin());

drop policy if exists "pools_read_all" on public.pools;
create policy "pools_read_all" on public.pools for select using (true);

drop policy if exists "own_transactions_or_admin" on public.transactions;
create policy "own_transactions_or_admin" on public.transactions for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "own_payments_or_admin" on public.payments;
create policy "own_payments_or_admin" on public.payments for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "own_allocations_or_admin" on public.allocations;
create policy "own_allocations_or_admin" on public.allocations for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "own_kyc_or_admin" on public.kyc_submissions;
create policy "own_kyc_or_admin" on public.kyc_submissions for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "own_settings_or_admin" on public.settings;
create policy "own_settings_or_admin" on public.settings for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "own_notifications_or_admin" on public.notifications;
create policy "own_notifications_or_admin" on public.notifications for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin_overrides_admin_only" on public.admin_overrides;
create policy "admin_overrides_admin_only" on public.admin_overrides for all using (public.is_admin()) with check (public.is_admin());
