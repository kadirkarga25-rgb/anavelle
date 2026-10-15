-- Run this SQL in Supabase SQL Editor before enabling persistent admin storage.
-- Service-role credentials are used only by server-side Next.js route handlers.
create table if not exists public.anavelle_products (
  id text primary key,
  data jsonb not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);
create index if not exists anavelle_products_active_idx on public.anavelle_products(is_active);
create index if not exists anavelle_products_updated_idx on public.anavelle_products(updated_at desc);
alter table public.anavelle_products enable row level security;

create table if not exists public.anavelle_settings (
  id text primary key default 'store',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.anavelle_settings enable row level security;

create table if not exists public.anavelle_orders (
  id text primary key,
  data jsonb not null,
  status text not null default 'Yeni',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists anavelle_orders_created_idx on public.anavelle_orders(created_at desc);
alter table public.anavelle_orders enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('anavelle-media', 'anavelle-media', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 15728640;
