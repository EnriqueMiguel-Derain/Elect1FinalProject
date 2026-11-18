-- Run this once in the Supabase SQL Editor for the Pyesa project.
create table if not exists public.pyesa_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{"name":"","bench":"","email":"","photo":""}'::jsonb,
  parts jsonb not null default '[]'::jsonb,
  cart jsonb not null default '[]'::jsonb,
  balance numeric(12, 2) not null default 5000,
  updated_at timestamptz not null default now()
);

alter table public.pyesa_accounts enable row level security;
grant select, insert, update on public.pyesa_accounts to authenticated;

drop policy if exists "Users can read their own Pyesa account" on public.pyesa_accounts;
create policy "Users can read their own Pyesa account"
  on public.pyesa_accounts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own Pyesa account" on public.pyesa_accounts;
create policy "Users can create their own Pyesa account"
  on public.pyesa_accounts for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own Pyesa account" on public.pyesa_accounts;
create policy "Users can update their own Pyesa account"
  on public.pyesa_accounts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.create_pyesa_account()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.pyesa_accounts (user_id, profile)
  values (
    new.id,
    jsonb_build_object(
      'name', coalesce(new.raw_user_meta_data ->> 'display_name', ''),
      'bench', '',
      'email', coalesce(new.email, ''),
      'photo', ''
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_pyesa on auth.users;
create trigger on_auth_user_created_pyesa
  after insert on auth.users
  for each row execute procedure public.create_pyesa_account();

-- The app's cash-in/out and balance are demo values, not real payments.
