-- ============================================================
-- MINARVA STORE - Supabase Database Schema
-- Run this in Supabase SQL Editor (new project)
-- ============================================================

-- 1. CATEGORIES (Home Kits, Shop Kits, Cameras, DVR/NVR, Accessories)
create table categories (
  id          bigint generated always as identity primary key,
  name        text not null,
  slug        text not null unique,
  type        text not null default 'package',  -- 'package' or 'product'
  sort_order  int  default 0,
  created_at  timestamptz default now()
);

-- 2. PACKAGES  (CCTV kits sold as a bundle)
create table packages (
  id            bigint generated always as identity primary key,
  name          text not null,
  slug          text not null unique,
  description   text,
  category_id   bigint references categories(id) on delete set null,
  price         numeric(10,2) not null,        -- selling price
  mrp           numeric(10,2),                 -- struck-through price
  images        text[] default '{}',           -- array of image URLs
  -- package specs
  camera_count  int,
  dvr_type      text,                          -- e.g. '4CH DVR', '8CH NVR'
  storage       text,                          -- e.g. '1TB HDD'
  cable_length  text,                          -- e.g. '90m'
  highlights    text[] default '{}',           -- bullet points shown on page
  weight_grams  int default 2000,              -- for shipping calc
  stock_status  text default 'in_stock',       -- 'in_stock' / 'out_of_stock'
  featured      boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- 3. PRODUCTS  (individual items - single camera, single DVR, cable etc.)
create table products (
  id            bigint generated always as identity primary key,
  name          text not null,
  slug          text not null unique,
  description   text,
  category_id   bigint references categories(id) on delete set null,
  brand         text,
  price         numeric(10,2) not null,
  mrp           numeric(10,2),
  images        text[] default '{}',
  specs         jsonb default '{}'::jsonb,      -- flexible spec key/values
  weight_grams  int default 500,
  stock_status  text default 'in_stock',
  featured      boolean default false,
  is_active     boolean default true,
  created_at    timestamptz default now()
);

-- 4. ORDERS
create table orders (
  id                bigint generated always as identity primary key,
  order_no          text not null unique,        -- e.g. MNV-1001
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text,
  address_line1     text not null,
  address_line2     text,
  city              text not null,
  state             text default 'Kerala',
  pincode           text not null,
  items_total       numeric(10,2) not null,      -- sum of item prices
  shipping_charge   numeric(10,2) default 0,
  grand_total       numeric(10,2) not null,
  payment_method    text not null,               -- 'paytm' / 'cod'
  -- For COD, customer pays shipping_charge in advance via Paytm.
  -- amount_paid_online = grand_total (for paytm) OR shipping_charge (for cod)
  amount_paid_online  numeric(10,2) default 0,
  amount_due_on_delivery numeric(10,2) default 0,
  payment_status    text default 'pending',      -- 'pending'/'paid'/'failed'
  paytm_txn_id      text,
  order_status      text default 'new',          -- new/confirmed/packed/shipped/delivered/cancelled
  shiprocket_order_id text,
  shiprocket_awb    text,
  notes             text,
  created_at        timestamptz default now()
);

-- 5. ORDER ITEMS  (line items - can be a package OR a product)
create table order_items (
  id          bigint generated always as identity primary key,
  order_id    bigint references orders(id) on delete cascade,
  item_type   text not null,                 -- 'package' or 'product'
  item_id     bigint not null,               -- package.id or product.id
  item_name   text not null,                 -- snapshot of name
  unit_price  numeric(10,2) not null,
  quantity    int not null default 1,
  line_total  numeric(10,2) not null,
  created_at  timestamptz default now()
);

-- 6. ENQUIRIES  (contact form)
create table enquiries (
  id          bigint generated always as identity primary key,
  name        text not null,
  phone       text not null,
  email       text,
  message     text,
  status      text default 'new',
  created_at  timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_packages_category on packages(category_id);
create index idx_packages_active   on packages(is_active);
create index idx_products_category on products(category_id);
create index idx_products_active   on products(is_active);
create index idx_orders_status     on orders(order_status);
create index idx_order_items_order on order_items(order_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Public can READ active catalogue. Orders/enquiries: insert only.
-- Admin operations go through service role (admin panel).
-- ============================================================
alter table categories  enable row level security;
alter table packages    enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table enquiries   enable row level security;

-- Public read for catalogue
create policy "public read categories" on categories for select using (true);
create policy "public read packages"   on packages   for select using (is_active = true);
create policy "public read products"   on products   for select using (is_active = true);

-- Public can place orders / enquiries (insert only)
create policy "public insert orders"      on orders      for insert with check (true);
create policy "public insert order_items" on order_items for insert with check (true);
create policy "public insert enquiries"   on enquiries   for insert with check (true);

-- ============================================================
-- SEED DATA - sample categories + one package + one product
-- (edit/delete later from admin panel)
-- ============================================================
insert into categories (name, slug, type, sort_order) values
  ('Home CCTV Kits',  'home-kits',   'package', 1),
  ('Shop CCTV Kits',  'shop-kits',   'package', 2),
  ('Office CCTV Kits','office-kits', 'package', 3),
  ('Cameras',         'cameras',     'product', 4),
  ('DVR / NVR',       'dvr-nvr',     'product', 5),
  ('Accessories',     'accessories', 'product', 6);

insert into packages
  (name, slug, description, category_id, price, mrp, camera_count, dvr_type, storage, cable_length, highlights, weight_grams, featured)
values
  ('2 Camera Home Kit', '2-camera-home-kit',
   '2 HD CCTV cameras with DVR, hard disk and all cables. Ideal for small homes.',
   (select id from categories where slug='home-kits'),
   8999, 12999, 2, '4CH DVR', '500GB HDD', '60m',
   array['2 x 2MP HD Cameras','4 Channel DVR','500GB Hard Disk','All cables & power supply','Free installation guide'],
   2500, true);

insert into products
  (name, slug, description, category_id, brand, price, mrp, specs, weight_grams, featured)
values
  ('2MP HD Dome Camera', '2mp-hd-dome-camera',
   'Indoor 2MP HD dome camera with night vision.',
   (select id from categories where slug='cameras'),
   'Generic', 1299, 1899,
   '{"resolution":"2MP","type":"Dome","night_vision":"20m","warranty":"1 year"}'::jsonb,
   400, true);
