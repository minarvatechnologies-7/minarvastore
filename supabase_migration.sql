-- ============================================================
-- MINARVA STORE - Migration for rebuild (run in Supabase SQL Editor)
-- Safe to run once. Adds newsletter table + categories.is_active
-- ============================================================

-- 1. categories.is_active (BUG #8)
alter table categories add column if not exists is_active boolean default true;

-- 2. optional stock integer on packages/products (BUG #7)
alter table packages add column if not exists stock int;
alter table products add column if not exists stock int;

-- 3. newsletter subscriptions
create table if not exists newsletter_subscriptions (
  id          bigint generated always as identity primary key,
  email       text not null unique,
  created_at  timestamptz default now()
);

alter table newsletter_subscriptions enable row level security;

-- public can subscribe (insert only); no public read
drop policy if exists "public insert newsletter" on newsletter_subscriptions;
create policy "public insert newsletter" on newsletter_subscriptions
  for insert with check (true);
