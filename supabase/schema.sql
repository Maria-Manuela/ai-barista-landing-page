-- =============================================================================
-- AI Barista — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- =============================================================================

-- 1) Profiles: one row per authenticated user, holds entitlement + daily usage.
create table if not exists public.profiles (
  id                     uuid primary key references auth.users (id) on delete cascade,
  email                  text,
  is_pro                 boolean not null default false,
  stripe_customer_id     text,
  stripe_subscription_id text,
  cups_used_today        integer not null default 0,
  usage_date             date not null default current_date,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users may READ their own profile. They may NOT write it directly —
-- entitlement (is_pro) is set by the Stripe webhook via the service role,
-- and usage is incremented via the security-definer function below.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 2) Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Atomically record a cup serve and enforce the free daily limit.
--    Returns JSON: { allowed, reason, is_pro, cups_used_today, remaining }.
create or replace function public.record_cup_usage(p_is_premium boolean)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_limit constant integer := 3;           -- free cups per day
  v_row   public.profiles%rowtype;
begin
  if v_uid is null then
    return json_build_object('allowed', false, 'reason', 'unauthenticated');
  end if;

  -- Ensure a profile row exists (defensive; the trigger normally creates it).
  insert into public.profiles (id) values (v_uid) on conflict (id) do nothing;

  select * into v_row from public.profiles where id = v_uid for update;

  -- Roll the daily counter over at midnight (server date).
  if v_row.usage_date < current_date then
    v_row.cups_used_today := 0;
    v_row.usage_date := current_date;
  end if;

  -- Premium flavors require an active Pro subscription.
  if p_is_premium and not v_row.is_pro then
    return json_build_object(
      'allowed', false, 'reason', 'premium_locked',
      'is_pro', v_row.is_pro,
      'cups_used_today', v_row.cups_used_today,
      'remaining', greatest(0, v_limit - v_row.cups_used_today)
    );
  end if;

  -- Pro users are unlimited and their usage isn't counted.
  if v_row.is_pro then
    update public.profiles
      set usage_date = current_date, updated_at = now()
      where id = v_uid;
    return json_build_object(
      'allowed', true, 'reason', 'pro',
      'is_pro', true, 'cups_used_today', v_row.cups_used_today, 'remaining', null
    );
  end if;

  -- Free user: enforce the daily limit.
  if v_row.cups_used_today >= v_limit then
    update public.profiles
      set cups_used_today = v_row.cups_used_today, usage_date = current_date, updated_at = now()
      where id = v_uid;
    return json_build_object(
      'allowed', false, 'reason', 'limit_reached',
      'is_pro', false, 'cups_used_today', v_row.cups_used_today, 'remaining', 0
    );
  end if;

  update public.profiles
    set cups_used_today = v_row.cups_used_today + 1,
        usage_date = current_date,
        updated_at = now()
    where id = v_uid;

  return json_build_object(
    'allowed', true, 'reason', 'free',
    'is_pro', false,
    'cups_used_today', v_row.cups_used_today + 1,
    'remaining', greatest(0, v_limit - (v_row.cups_used_today + 1))
  );
end;
$$;

revoke all on function public.record_cup_usage(boolean) from anon;
grant execute on function public.record_cup_usage(boolean) to authenticated;
