-- TERMINAL 3 — Module 2 schema
-- Supabase / PostgreSQL

-- Roles
CREATE TYPE app_role AS ENUM ('admin', 'staff', 'client');

-- Profiles (public read/write own)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  grape TEXT,
  year INT,
  volume TEXT,
  weight TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku TEXT UNIQUE NOT NULL,
  image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  summary TEXT,
  tasting TEXT,
  serving TEXT,
  pairing TEXT,
  style TEXT,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  is_alcohol BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE promotion_type AS ENUM ('percent', 'fixed', 'special_price', 'x_for_y', 'bundle');
CREATE TYPE banner_placement AS ENUM ('home_top', 'home_mid', 'category', 'global_ribbon');
CREATE TYPE banner_theme AS ENUM ('gold', 'bordeaux', 'dark');
CREATE TYPE page_key AS ENUM (
  'index', 'vins', 'spiritueux', 'sarfati', 'charcuterie', 'plateaux',
  'prestige', 'promotions', 'nouveautes', 'bonnes-affaires', 'contact'
);

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtitle TEXT,
  type promotion_type NOT NULL,
  value NUMERIC(10,2) NOT NULL CHECK (value >= 0),
  quantity INT,
  department TEXT,
  category TEXT,
  product_slugs JSONB DEFAULT '[]'::jsonb,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  active BOOLEAN DEFAULT true,
  members_only BOOLEAN DEFAULT false
);

CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  placement banner_placement NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  body TEXT,
  image_url TEXT,
  cta_label TEXT,
  cta_href TEXT,
  theme banner_theme DEFAULT 'gold',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

CREATE TABLE page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key page_key UNIQUE NOT NULL,
  hero_title TEXT,
  hero_eyebrow TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  intro_html TEXT,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TYPE order_channel AS ENUM ('web', 'phone');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'ready', 'out_for_delivery', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'card_in_store', 'card_on_delivery', 'bank_transfer');
CREATE TYPE fulfillment_type AS ENUM ('pickup', 'delivery');

CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  radius_km NUMERIC,
  postal_codes JSONB DEFAULT '[]'::jsonb,
  min_order NUMERIC(10,2) NOT NULL DEFAULT 0,
  fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  channel order_channel NOT NULL DEFAULT 'web',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  fulfillment fulfillment_type NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  promotion_label TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  contains_alcohol BOOLEAN NOT NULL DEFAULT false,
  id_checked BOOLEAN NOT NULL DEFAULT false,
  id_checked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  id_checked_at TIMESTAMPTZ,
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  payment_method payment_method,
  paid_at TIMESTAMPTZ,
  validated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  requested_slot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  from_status order_status,
  to_status order_status NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock restoration on cancellation trigger
CREATE OR REPLACE FUNCTION restore_stock_on_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    UPDATE products
    SET stock = stock + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND products.id = oi.product_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_restore_stock
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION restore_stock_on_cancel();

-- Order event log trigger
CREATE OR REPLACE FUNCTION log_order_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, from_status, to_status, comment)
    VALUES (NEW.id, OLD.status, NEW.status, TG_ARGV[0]);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_event_log
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_event();

-- Completion constraints (mirrored in app)
CREATE OR REPLACE FUNCTION enforce_completion_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    IF NEW.payment_status <> 'paid' THEN
      RAISE EXCEPTION 'La commande doit être payée avant completion';
    END IF;
    IF NEW.contains_alcohol AND NOT NEW.id_checked THEN
      RAISE EXCEPTION 'Teoudat Zeout requise pour remettre de l alcool';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_completion_guard
BEFORE UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION enforce_completion_rules();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Public/anon reads of published public content
CREATE POLICY "public_select_published_products" ON products
  FOR SELECT USING (is_published = true);

CREATE POLICY "public_select_active_promotions" ON promotions
  FOR SELECT USING (active = true AND starts_at <= now() AND ends_at >= now());

CREATE POLICY "public_select_active_banners" ON banners
  FOR SELECT USING (active = true AND starts_at <= now() AND ends_at >= now());

CREATE POLICY "public_select_page_content" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "public_select_delivery_zones" ON delivery_zones
  FOR SELECT USING (active = true);

-- Authenticated own profile
CREATE POLICY "authenticated_select_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "authenticated_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "authenticated_insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin writes on public tables
CREATE POLICY "admin_all_products" ON products
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_all_promotions" ON promotions
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_all_banners" ON banners
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_all_page_content" ON page_content
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_all_delivery_zones" ON delivery_zones
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Favorites / wishlist
CREATE POLICY "own_favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_wishlist" ON wishlist_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders: client reads own, admin/staff reads all & updates
CREATE POLICY "own_orders_select" ON orders
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

CREATE POLICY "own_orders_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "admin_staff_update_orders" ON orders
  FOR UPDATE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- Order items follow order access via join in app; keep simple RLS
CREATE POLICY "order_items_select" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
    )
  );

CREATE POLICY "order_items_admin_insert" ON order_items
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff') OR auth.uid() IS NOT NULL);

CREATE POLICY "order_events_select" ON order_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_events.order_id
        AND (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'))
    )
  );

CREATE POLICY "order_events_admin_insert" ON order_events
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'staff'));

-- user_roles: admin can manage
CREATE POLICY "admin_user_roles" ON user_roles
  FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER page_content_updated_at
BEFORE UPDATE ON page_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
