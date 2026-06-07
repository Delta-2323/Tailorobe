-- Tailorobe Bespoke Tailors — Supabase Schema

-- 1. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id               BIGSERIAL PRIMARY KEY,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  service_type     TEXT NOT NULL,
  location_type    TEXT NOT NULL DEFAULT 'store',
  remote_location  TEXT,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  notes            TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders / suit designs table
CREATE TABLE IF NOT EXISTS orders (
  id           BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  product_type  TEXT NOT NULL,
  fabric_name   TEXT NOT NULL,
  color         TEXT NOT NULL,
  lapel_style   TEXT NOT NULL,
  button_style  TEXT NOT NULL,
  pocket_style  TEXT NOT NULL,
  lining_color  TEXT NOT NULL,
  monogram      TEXT,
  design_notes  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security (RLS) Policies
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "Public can insert appointments"    ON appointments    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert contact_messages" ON contact_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can insert orders"           ON orders          FOR INSERT TO anon WITH CHECK (true);

-- Allow anyone to read (admin dashboard uses anon key)
CREATE POLICY "Public can read appointments"     ON appointments    FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read contact_messages" ON contact_messages FOR SELECT TO anon USING (true);
CREATE POLICY "Public can read orders"           ON orders          FOR SELECT TO anon USING (true);

-- Allow anyone to update appointments (for status changes in admin)
CREATE POLICY "Public can update appointments"   ON appointments    FOR UPDATE TO anon USING (true) WITH CHECK (true);
