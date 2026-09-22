-- ============================================================
-- BAZAARIO — PHASE 3 ADDITIONS
-- Run this AFTER schema.sql (SQL Editor → New Query → Run)
-- Adds: rating columns, auto-stock trigger, auto-rating trigger,
-- and seeds real category/product rows so the site has live data.
-- ============================================================

-- Track average rating + review count directly on products,
-- so listing pages don't need a slow join on every page load.
alter table products add column if not exists avg_rating numeric(2,1) not null default 0;
alter table products add column if not exists review_count integer not null default 0;

create or replace function public.refresh_product_rating()
returns trigger as $$
declare
  target_product uuid;
begin
  target_product := coalesce(new.product_id, old.product_id);

  update products set
    avg_rating = coalesce((
      select round(avg(rating)::numeric, 1) from reviews
      where product_id = target_product and is_approved = true
    ), 0),
    review_count = (
      select count(*) from reviews
      where product_id = target_product and is_approved = true
    )
  where id = target_product;

  return null;
end;
$$ language plpgsql security definer;

drop trigger if exists on_review_change on reviews;
create trigger on_review_change
  after insert or update or delete on reviews
  for each row execute procedure public.refresh_product_rating();

-- Automatically reduce stock when an order item is created, and block
-- the order if there isn't enough stock (keeps things consistent even
-- if two people order the last item at the same time).
create or replace function public.decrement_stock()
returns trigger as $$
declare
  current_stock integer;
begin
  select stock into current_stock from products where id = new.product_id for update;

  if current_stock is null then
    return new; -- product was deleted; skip
  end if;

  if current_stock < new.quantity then
    raise exception 'Stock khatam ho gaya hai is product ke liye';
  end if;

  update products set stock = stock - new.quantity where id = new.product_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_item_created on order_items;
create trigger on_order_item_created
  after insert on order_items
  for each row execute procedure public.decrement_stock();

-- ---------- SEED DATA ----------
insert into categories (id, name, slug, image_url) values
  ('11111111-1111-1111-1111-111111111101', 'Fashion', 'fashion', null),
  ('11111111-1111-1111-1111-111111111102', 'Electronics', 'electronics', null),
  ('11111111-1111-1111-1111-111111111103', 'Home & Living', 'home', null),
  ('11111111-1111-1111-1111-111111111104', 'Beauty & Personal Care', 'beauty', null),
  ('11111111-1111-1111-1111-111111111105', 'Grocery', 'grocery', null),
  ('11111111-1111-1111-1111-111111111106', 'Toys & Kids', 'toys', null)
on conflict (id) do nothing;

insert into products (id, category_id, name, slug, description, price, mrp, stock, sku, is_active) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101',
   'Cotton Handloom Kurta', 'cotton-handloom-kurta',
   'Breathable handloom cotton kurta, perfect for daily wear.', 899, 1299, 24, 'FSH-001', true),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102',
   'Wireless Earbuds Pro', 'wireless-earbuds-pro',
   '40-hour battery life with active noise cancellation.', 1499, 2499, 51, 'ELC-001', true),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111103',
   'Ceramic Dinner Set (12 pcs)', 'ceramic-dinner-set-12pcs',
   'Microwave-safe ceramic dinner set for everyday dining.', 1199, 1799, 15, 'HOM-001', true),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111104',
   'Herbal Face Wash', 'herbal-face-wash',
   'Neem and tulsi based face wash for daily use.', 249, 349, 96, 'BTY-001', true),
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111105',
   'Assorted Dry Fruits Box', 'assorted-dry-fruits-box',
   'Premium almonds, cashews and raisins — 500g box.', 699, 899, 40, 'GRC-001', true),
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111106',
   'Wooden Building Blocks', 'wooden-building-blocks',
   'Non-toxic wooden blocks set for ages 3+.', 599, 799, 30, 'TOY-001', true)
on conflict (id) do nothing;
