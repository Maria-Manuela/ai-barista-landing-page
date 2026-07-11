-- =============================================================================
-- AI Barista — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- =============================================================================

-- 1) Profiles: one row per authenticated user, holds membership + daily usage.
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  email           text,
  is_pro          boolean not null default false,  -- true = signed-up member
  cups_used_today integer not null default 0,
  usage_date      date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 2) Auto-create a profile row whenever a new auth user signs up.
--    is_pro = true for registered (non-anonymous) accounts.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_pro)
  values (new.id, new.email, coalesce(new.is_anonymous, true) = false)
  on conflict (id) do update
    set email = excluded.email,
        is_pro = coalesce(new.is_anonymous, true) = false,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Atomically record a cup serve and enforce limits for members.
--    Members: unlimited. Guests use client-side tracking (no auth required).
--    Returns JSON: { allowed, reason, is_pro, cups_used_today, remaining }.
create or replace function public.record_cup_usage(p_is_premium boolean)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_limit     constant integer := 3;
  v_row       public.profiles%rowtype;
  v_is_member boolean;
begin
  if v_uid is null then
    return json_build_object('allowed', false, 'reason', 'unauthenticated');
  end if;

  select coalesce(u.is_anonymous = false, false)
    into v_is_member
    from auth.users u
   where u.id = v_uid;

  insert into public.profiles (id, is_pro)
  values (v_uid, v_is_member)
  on conflict (id) do nothing;

  select * into v_row from public.profiles where id = v_uid for update;

  -- Keep is_pro in sync with auth state.
  if v_row.is_pro is distinct from v_is_member then
    update public.profiles set is_pro = v_is_member, updated_at = now() where id = v_uid;
    v_row.is_pro := v_is_member;
  end if;

  if v_row.usage_date < current_date then
    v_row.cups_used_today := 0;
    v_row.usage_date := current_date;
  end if;

  -- Premium cups require a signed-up member.
  if p_is_premium and not v_is_member then
    return json_build_object(
      'allowed', false, 'reason', 'signup_required',
      'is_pro', false,
      'cups_used_today', v_row.cups_used_today,
      'remaining', null
    );
  end if;

  -- Members: unlimited cups.
  if v_is_member then
    update public.profiles
      set usage_date = current_date, updated_at = now()
      where id = v_uid;
    return json_build_object(
      'allowed', true, 'reason', 'member',
      'is_pro', true, 'cups_used_today', v_row.cups_used_today, 'remaining', null
    );
  end if;

  -- Should not reach here for normal flow (guests don't call RPC).
  return json_build_object('allowed', true, 'reason', 'guest');
end;
$$;

revoke all on function public.record_cup_usage(boolean) from anon;
grant execute on function public.record_cup_usage(boolean) to authenticated;
