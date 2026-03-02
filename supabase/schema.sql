-- SUPABASE SCHEMA SETUP FOR LE PETIT COIN MAGIQUE
-- Run this script in the Supabase SQL Editor to initialize your database.

-- 1. Create Products Table (supporting multiple images)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of image URLs to support multiple images per product
  is_available BOOLEAN DEFAULT true, -- To easily hide a product
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, paid, shipped, delivered, cancelled
  stripe_session_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_time NUMERIC NOT NULL
);

-- 4. Set up Row Level Security (RLS) Permissions

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Product Policies: Everyone can view, only authenticated (Admin) can modify
CREATE POLICY "Public products viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Order Policies: Only authenticated (Admin) can view and update. Anyone can insert an order during checkout.
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Order Item Policies: Only authenticated (Admin) can view. Anyone can insert an item during checkout.
CREATE POLICY "Admins can view order items" ON order_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- 5. Storage for Images
-- Create a public bucket named 'product-images' for the images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Allow public read access to the images
CREATE POLICY "Public Access to Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- Allow authenticated users (Admins) to upload/update/delete images
CREATE POLICY "Admin Insert Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Update Images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
