export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image_url: string;
  featured?: boolean;
  is_deal?: boolean;
}
