export interface Product {
  id: string | number;
  name: string;
  brand: string;
  category?: "smartphone" | "laptop" | "smartwatch" | "tablet" | string;
  description?: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image_url: string;
  stock?: number;
  specs?: Record<string, string | number>;
  featured?: boolean;
  is_deal?: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}
