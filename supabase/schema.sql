-- AUXUZ CRM — V3 clean schema
-- Run this in a NEW Supabase project.
-- Public website: INSERT only.
-- CRM: authenticated SELECT/UPDATE.

create extension if not exists pgcrypto;

do $$ begin
  create type public.lead_status as enum ('NEW','CONTACTED','QUALIFIED','APPOINTMENT','WON','LOST');
exception when duplicate_object then null; end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  company text not null default '',
  website text,
  service text not null default 'Customer acquisition',
  message text not null default '',
  source text not null default 'website',
  status public.lead_status not null default 'NEW',
  score integer not null default 0 check (score between 0 and 100),
  next_followup_at timestamptz,
  appointment_at timestamptz,
  notes text
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_followup_idx on public.leads(next_followup_at);
create index if not exists lead_events_lead_id_idx on public.lead_events(lead_id);

create or replace function public.set_updated_at() returns trigger
language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;

drop policy if exists "public can create leads" on public.leads;
create policy "public can create leads"
on public.leads for insert to anon, authenticated
with check (
  char_length(name) between 1 and 120 and
  char_length(email) between 3 and 200 and
  char_length(phone) between 3 and 50 and
  char_length(company) between 1 and 180 and
  char_length(message) <= 5000
);

drop policy if exists "authenticated can read leads" on public.leads;
create policy "authenticated can read leads"
on public.leads for select to authenticated
using (true);

drop policy if exists "authenticated can update leads" on public.leads;
create policy "authenticated can update leads"
on public.leads for update to authenticated
using (true) with check (true);

drop policy if exists "authenticated can create events" on public.lead_events;
create policy "authenticated can create events"
on public.lead_events for insert to authenticated
with check (true);

drop policy if exists "authenticated can read events" on public.lead_events;
create policy "authenticated can read events"
on public.lead_events for select to authenticated
using (true);

-- Explicit grants for Supabase API roles.
grant usage on schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant select, update on public.leads to authenticated;
grant select, insert on public.lead_events to authenticated;
