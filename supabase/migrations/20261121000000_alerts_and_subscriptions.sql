-- Flight Price Notifier: price alerts + ECPay subscription state.
-- Run in Supabase Dashboard -> SQL Editor.

-- ---------------------------------------------------------------------------
-- alerts: one row per route + target price a user wants to watch
-- ---------------------------------------------------------------------------
create table public.alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  origin        text not null default 'TPE' check (origin ~ '^[A-Z]{3}$'),
  destination   text not null check (destination ~ '^[A-Z]{3}$'),
  target_price  integer not null check (target_price > 0),
  currency      text not null default 'TWD',
  active        boolean not null default true,
  last_price    integer,
  last_checked_at timestamptz,
  last_notified_at timestamptz,
  created_at    timestamptz not null default now()
);

create index alerts_user_id_idx on public.alerts (user_id);
create index alerts_active_idx on public.alerts (active) where active;

alter table public.alerts enable row level security;

create policy "alerts_select_own" on public.alerts
  for select to authenticated using (user_id = (select auth.uid()));
create policy "alerts_insert_own" on public.alerts
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "alerts_update_own" on public.alerts
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "alerts_delete_own" on public.alerts
  for delete to authenticated using (user_id = (select auth.uid()));

-- Logged-in users manage their own alerts; anonymous users get nothing.
grant select, insert, update, delete on public.alerts to authenticated;
grant all on public.alerts to service_role;

-- ---------------------------------------------------------------------------
-- subscriptions: paid plan state, written ONLY by server code (service_role)
-- via the ECPay webhook. Users can read their own row but never modify it.
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id              uuid primary key references auth.users (id) on delete cascade,
  plan                 text not null default 'free' check (plan in ('free', 'pro')),
  status               text not null default 'inactive'
                         check (status in ('inactive', 'active', 'past_due', 'canceled')),
  ecpay_trade_no       text,            -- MerchantTradeNo of the first (period) order
  current_period_end   timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated using (user_id = (select auth.uid()));

grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
