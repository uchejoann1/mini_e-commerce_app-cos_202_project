/*
  # T3chWorld E-Commerce Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `original_price` (numeric, nullable - for showing discounts)
      - `image_url` (text)
      - `category` (text - 'smartphone', 'laptop', 'smartwatch', 'tablet')
      - `brand` (text)
      - `rating` (numeric, 0-5)
      - `review_count` (integer)
      - `stock` (integer)
      - `featured` (boolean)
      - `is_deal` (boolean)
      - `specs` (jsonb)
      - `created_at` (timestamptz)

    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `created_at` (timestamptz)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `total` (numeric)
      - `status` (text)
      - `shipping_address` (jsonb)
      - `created_at` (timestamptz)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, references orders)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `price_at_purchase` (numeric)

  2. Security
    - Enable RLS on all tables
    - Products are publicly readable
    - Cart items are user-scoped
    - Orders are user-scoped
*/

-- Products table (publicly readable)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  original_price numeric,
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  is_deal boolean NOT NULL DEFAULT false,
  specs jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  shipping_address jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  price_at_purchase numeric NOT NULL DEFAULT 0
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Seed product data
INSERT INTO products (name, description, price, original_price, image_url, category, brand, rating, review_count, stock, featured, is_deal, specs) VALUES
-- Smartphones
('iPhone 15 Pro Max', 'The most advanced iPhone ever with A17 Pro chip, titanium design, and revolutionary camera system.', 1199, 1299, 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg', 'smartphone', 'Apple', 4.9, 2341, 50, true, true, '{"display": "6.7-inch Super Retina XDR", "chip": "A17 Pro", "camera": "48MP main", "battery": "4422mAh", "storage": "256GB"}'),
('Samsung Galaxy S24 Ultra', 'Ultimate Android experience with built-in S Pen, 200MP camera, and AI-powered features.', 1099, 1199, 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg', 'smartphone', 'Samsung', 4.8, 1876, 35, true, false, '{"display": "6.8-inch QHD+", "chip": "Snapdragon 8 Gen 3", "camera": "200MP main", "battery": "5000mAh", "storage": "256GB"}'),
('iPhone 15', 'Dynamic Island, 48MP camera, and USB-C on iPhone for the first time.', 799, 899, 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg', 'smartphone', 'Apple', 4.7, 3102, 80, false, true, '{"display": "6.1-inch Super Retina XDR", "chip": "A16 Bionic", "camera": "48MP main", "battery": "3877mAh", "storage": "128GB"}'),
('Samsung Galaxy S24', 'Compact flagship with Galaxy AI, 50MP camera, and all-day battery.', 799, 849, 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg', 'smartphone', 'Samsung', 4.6, 987, 60, false, false, '{"display": "6.2-inch FHD+", "chip": "Snapdragon 8 Gen 3", "camera": "50MP main", "battery": "4000mAh", "storage": "128GB"}'),
('Google Pixel 8 Pro', 'The smartest Pixel yet with Google AI, best-in-class camera, and 7 years of updates.', 999, 1099, 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg', 'smartphone', 'Google', 4.7, 754, 40, false, true, '{"display": "6.7-inch LTPO OLED", "chip": "Google Tensor G3", "camera": "50MP main", "battery": "5050mAh", "storage": "128GB"}'),
('OnePlus 12', 'Flagship performance at an accessible price with Hasselblad cameras and 100W charging.', 799, 849, 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg', 'smartphone', 'OnePlus', 4.5, 512, 45, false, false, '{"display": "6.82-inch QHD+", "chip": "Snapdragon 8 Gen 3", "camera": "50MP main", "battery": "5400mAh", "storage": "256GB"}'),

-- Laptops
('MacBook Pro 16" M3 Max', 'Supercharged by M3 Max chip with up to 128GB unified memory and stunning Liquid Retina XDR display.', 3499, 3799, 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg', 'laptop', 'Apple', 4.9, 1234, 20, true, false, '{"display": "16.2-inch Liquid Retina XDR", "chip": "M3 Max", "ram": "36GB", "storage": "512GB SSD", "battery": "22hr"}'),
('Dell XPS 15', 'Premium Windows laptop with OLED display, 13th Gen Intel Core, and thin-and-light design.', 1799, 1999, 'https://images.pexels.com/photos/7974/pexels-photo.jpg', 'laptop', 'Dell', 4.7, 876, 30, true, true, '{"display": "15.6-inch OLED", "chip": "Intel Core i9-13900H", "ram": "32GB", "storage": "1TB SSD", "battery": "13hr"}'),
('MacBook Air 15" M2', 'Remarkably thin and light with the powerful M2 chip and all-day battery life.', 1299, 1399, 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg', 'laptop', 'Apple', 4.8, 2103, 55, false, true, '{"display": "15.3-inch Liquid Retina", "chip": "M2", "ram": "8GB", "storage": "256GB SSD", "battery": "18hr"}'),
('Lenovo ThinkPad X1 Carbon', 'Ultra-light business laptop built for enterprise with military-grade durability.', 1599, 1799, 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg', 'laptop', 'Lenovo', 4.6, 654, 25, false, false, '{"display": "14-inch IPS", "chip": "Intel Core i7-1365U", "ram": "16GB", "storage": "512GB SSD", "battery": "15hr"}'),
('ASUS ROG Zephyrus G14', 'Compact gaming powerhouse with AMD Ryzen 9 and NVIDIA RTX 4060.', 1499, 1599, 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg', 'laptop', 'ASUS', 4.7, 432, 18, false, true, '{"display": "14-inch QHD+ 165Hz", "chip": "AMD Ryzen 9 7940HS", "ram": "16GB", "storage": "512GB SSD", "gpu": "RTX 4060"}'),
('HP Spectre x360 14', '2-in-1 premium laptop with Intel Evo platform, OLED display, and 360-degree hinge.', 1399, 1499, 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg', 'laptop', 'HP', 4.5, 321, 22, false, false, '{"display": "13.5-inch OLED", "chip": "Intel Core i7-1355U", "ram": "16GB", "storage": "1TB SSD", "battery": "17hr"}'),

-- Smartwatches
('Apple Watch Ultra 2', 'The most rugged and capable Apple Watch ever with up to 60hr battery and precision dual-frequency GPS.', 799, 899, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg', 'smartwatch', 'Apple', 4.8, 987, 40, true, false, '{"display": "49mm Always-On Retina", "chip": "S9 SiP", "battery": "60hr", "water_resistance": "100m", "gps": "Precision dual-frequency"}'),
('Samsung Galaxy Watch 6 Classic', 'Premium smartwatch with rotating bezel, advanced health monitoring, and Google ecosystem.', 399, 449, 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg', 'smartwatch', 'Samsung', 4.6, 743, 60, true, true, '{"display": "47mm Super AMOLED", "chip": "Exynos W930", "battery": "40hr", "water_resistance": "5ATM", "os": "Wear OS"}'),
('Apple Watch Series 9', 'The most popular Apple Watch now with Double Tap gesture and carbon neutral option.', 399, 429, 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg', 'smartwatch', 'Apple', 4.8, 1543, 75, false, true, '{"display": "45mm Always-On Retina", "chip": "S9 SiP", "battery": "18hr", "water_resistance": "50m", "gps": "L1 GPS"}'),
('Garmin Fenix 7X Solar', 'Multisport GPS watch with solar charging, topographic maps, and advanced training metrics.', 699, 799, 'https://images.pexels.com/photos/3927388/pexels-photo-3927388.jpeg', 'smartwatch', 'Garmin', 4.7, 432, 30, false, false, '{"display": "51mm transflective MIP", "battery": "28 days solar", "water_resistance": "100m", "gps": "Multi-band GNSS", "sensors": "HR, SpO2, stress"}'),

-- Tablets (for category completeness)
('iPad Pro 12.9" M2', 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and ProRes video.', 1099, 1199, 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg', 'tablet', 'Apple', 4.8, 1102, 45, true, false, '{"display": "12.9-inch Liquid Retina XDR", "chip": "M2", "storage": "128GB", "camera": "12MP main", "battery": "10hr"}'),
('Samsung Galaxy Tab S9 Ultra', 'The largest and most powerful Galaxy Tab with 14.6-inch Dynamic AMOLED display.', 1099, 1199, 'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg', 'tablet', 'Samsung', 4.7, 654, 35, false, true, '{"display": "14.6-inch Dynamic AMOLED", "chip": "Snapdragon 8 Gen 2", "storage": "256GB", "camera": "13MP main", "battery": "11200mAh"}');