-- Minimal schema for starter build (branding + purchase orders)

create extension if not exists "pgcrypto";

create table if not exists company_profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  brand_primary text,
  brand_secondary text,
  brand_accent text,
  created_at timestamptz not null default now()
);

create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  po_number bigserial,
  vendor_name text not null,
  vendor_email text,
  job_number text,
  notes text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  part_number text,
  description text not null,
  qty numeric not null default 0,
  unit text,
  created_at timestamptz not null default now()
);

-- RLS (simple v1: enable and allow all authenticated; tighten later)
alter table company_profile enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_lines enable row level security;

create policy "read_company" on company_profile for select using (true);
create policy "write_company" on company_profile for all using (true) with check (true);

create policy "read_po" on purchase_orders for select using (true);
create policy "write_po" on purchase_orders for all using (true) with check (true);

create policy "read_po_lines" on purchase_order_lines for select using (true);
create policy "write_po_lines" on purchase_order_lines for all using (true) with check (true);
