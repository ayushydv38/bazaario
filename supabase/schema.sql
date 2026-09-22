-- ============================================================
-- BAZAARIO — DATABASE SCHEMA (Phase 2)
-- Run this once inside Supabase → SQL Editor → New Query → Run
-- ============================================================

-- ---------- PROFILES ----------
-- One row per user, linked to Supabase's built-in auth.users table.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Automatically create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- ADDRESSES ----------
create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- CATEGORIES ----------
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamptz not null default now()
);

-- ---------- PRODUCTS ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  specifications jsonb,
  price numeric(10,2) not null,
  mrp numeric(10,2) not null,
  stock integer not null default 0,
  sku text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_name text not null,   -- e.g. "Size", "Colour"
  variant_value text not null,  -- e.g. "M", "Red"
  extra_price numeric(10,2) not null default 0,
  stock integer not null default 0
);

-- ---------- CART ----------
create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade unique,
  created_at timestamptz not null default now()
);

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete set null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- ---------- ORDERS ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  address_id uuid references addresses(id) on delete set null,
  status text not null default 'pending',
    -- pending, confirmed, processing, packed, shipped, out_for_delivery,
    -- delivered, cancelled, return_requested, returned, refund_processing, refunded
  payment_method text not null default 'cod', -- 'cod' or 'manual_upi'
  payment_status text not null default 'pending', -- pending, paid, failed
  payment_reference text, -- customer-submitted UPI ref, for manual verification
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  shipping_charge numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  tracking_number text,
  coupon_code text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,   -- snapshot, in case product changes later
  price numeric(10,2) not null, -- snapshot price at time of order
  quantity integer not null
);

-- ---------- REVIEWS ----------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete set null, -- proves verified purchase
  rating integer not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- WISHLIST ----------
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ---------- COUPONS ----------
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null, -- 'percentage' or 'fixed'
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  max_discount numeric(10,2),
  expiry_date timestamptz,
  usage_limit integer,
  times_used integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Rule of thumb: customers can only ever see/edit their OWN data.
-- Products/categories/approved reviews are public to read.
-- Only admins (profiles.is_admin = true) can write products, etc.
-- ============================================================

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table wishlists enable row level security;
alter table coupons enable row level security;

-- Helper: is the current logged-in user an admin?
create function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$ language sql stable security definer;

-- PROFILES: user can see/edit only their own profile. Admin can see all.
create policy "view own profile" on profiles for select
  using (auth.uid() = id or public.is_admin());
create policy "update own profile" on profiles for update
  using (auth.uid() = id);

-- ADDRESSES: fully private to the owner.
create policy "manage own addresses" on addresses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- CATEGORIES: public read, admin write.
create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all
  using (public.is_admin()) with check (public.is_admin());

-- PRODUCTS: public read of active products, admin full access.
create policy "public read active products" on products for select
  using (is_active = true or public.is_admin());
create policy "admin write products" on products for insert
  with check (public.is_admin());
create policy "admin update products" on products for update
  using (public.is_admin());
create policy "admin delete products" on products for delete
  using (public.is_admin());

create policy "public read product images" on product_images for select using (true);
create policy "admin write product images" on product_images for all
  using (public.is_admin()) with check (public.is_admin());

create policy "public read product variants" on product_variants for select using (true);
create policy "admin write product variants" on product_variants for all
  using (public.is_admin()) with check (public.is_admin());

-- CART: private to the owner.
create policy "manage own cart" on carts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "manage own cart items" on cart_items for all
  using (exists (select 1 from carts where carts.id = cart_id and carts.user_id = auth.uid()))
  with check (exists (select 1 from carts where carts.id = cart_id and carts.user_id = auth.uid()));

-- ORDERS: customer sees only their own orders. Admin sees all, can update status.
create policy "view own orders" on orders for select
  using (auth.uid() = user_id or public.is_admin());
create policy "create own orders" on orders for insert
  with check (auth.uid() = user_id);
create policy "admin update orders" on orders for update
  using (public.is_admin());

create policy "view own order items" on order_items for select
  using (exists (select 1 from orders where orders.id = order_id and (orders.user_id = auth.uid() or public.is_admin())));
create policy "create own order items" on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()));

-- REVIEWS: public reads approved reviews, owner manages their own, admin moderates.
create policy "public read approved reviews" on reviews for select
  using (is_approved = true or auth.uid() = user_id or public.is_admin());
create policy "create own review" on reviews for insert
  with check (auth.uid() = user_id);
create policy "update own review or admin" on reviews for update
  using (auth.uid() = user_id or public.is_admin());
create policy "delete own review or admin" on reviews for delete
  using (auth.uid() = user_id or public.is_admin());

-- WISHLIST: private to the owner.
create policy "manage own wishlist" on wishlists for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- COUPONS: anyone can read active coupons (to apply at checkout), only admin writes.
create policy "public read active coupons" on coupons for select
  using (is_active = true or public.is_admin());
create policy "admin write coupons" on coupons for all
  using (public.is_admin()) with check (public.is_admin());
