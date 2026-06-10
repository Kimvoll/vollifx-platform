alter table public.transactions add column if not exists reference text;
alter table public.transactions add column if not exists destination text;
alter table public.transactions add column if not exists network text;
alter table public.transactions add column if not exists proof_url text;
alter table public.transactions add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.transactions add column if not exists reviewed_by uuid references auth.users(id) on delete set null;
alter table public.transactions add column if not exists reviewed_at timestamptz;

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

drop policy if exists "own_notifications_or_admin" on public.notifications;
create policy "own_notifications_or_admin" on public.notifications
for select using (user_id = auth.uid() or public.is_admin());

notify pgrst, 'reload schema';

update public.pools set investors = 11, minimum_deposit = 750 where id = 'gold-pool';
update public.pools set investors = 6, minimum_deposit = 750 where id = 'usoil-nas100-pool';

notify pgrst, 'reload schema';
