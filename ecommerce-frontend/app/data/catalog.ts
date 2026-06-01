import type { Product } from "../../types";

type CatalogItem = Product & {
  category: "smartphone" | "laptop" | "watch";
  description: string;
  stock: number;
  specs: Record<string, string>;
};

export const catalog: CatalogItem[] = [
  {
    id: "sp-1",
    category: "smartphone",
    name: "Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1299,
    original_price: 1399,
    rating: 4.8,
    review_count: 5310,
    image_url: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
    featured: true,
    is_deal: true,
    description: "Flagship smartphone with a brilliant display and advanced camera system.",
    stock: 24,
    specs: {
      Display: "6.8-inch AMOLED",
      Storage: "256GB",
      Camera: "200MP",
      Battery: "5000mAh",
    },
  },
  {
    id: "sp-2",
    category: "smartphone",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    original_price: 1299,
    rating: 4.9,
    review_count: 12840,
    image_url: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    featured: true,
    is_deal: true,
    description: "Premium performance with a titanium build and powerful camera features.",
    stock: 17,
    specs: {
      Display: "6.7-inch OLED",
      Storage: "256GB",
      Chip: "A17 Pro",
      Battery: "All-day",
    },
  },
  {
    id: "sp-3",
    category: "smartphone",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 799,
    original_price: 899,
    rating: 4.6,
    review_count: 2212,
    image_url: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
    featured: true,
    is_deal: true,
    description: "Fast and fluid flagship phone with a clean software experience.",
    stock: 31,
    specs: {
      Display: "6.82-inch LTPO",
      Storage: "256GB",
      Camera: "50MP",
      Battery: "5400mAh",
    },
  },
  {
    id: "lp-1",
    category: "laptop",
    name: "MacBook Pro M3",
    brand: "Apple",
    price: 3499,
    original_price: 3799,
    rating: 4.7,
    review_count: 6721,
    image_url: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg",
    featured: true,
    is_deal: true,
    description: "High-performance laptop built for creative workflows and pro productivity.",
    stock: 9,
    specs: {
      Display: "14-inch Liquid Retina XDR",
      Memory: "18GB",
      Storage: "1TB SSD",
      Chip: "Apple M3 Pro",
    },
  },
  {
    id: "lp-2",
    category: "laptop",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 2199,
    rating: 4.4,
    review_count: 2104,
    image_url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    featured: true,
    description: "Slim premium laptop with a near-borderless display and balanced power.",
    stock: 14,
    specs: {
      Display: "15.6-inch OLED",
      Memory: "16GB",
      Storage: "1TB SSD",
      Graphics: "NVIDIA RTX",
    },
  },
  {
    id: "lp-3",
    category: "laptop",
    name: "Lenovo Legion 7",
    brand: "Lenovo",
    price: 1899,
    rating: 4.2,
    review_count: 980,
    image_url: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    featured: true,
    description: "Gaming-ready laptop with strong thermals and a fast refresh display.",
    stock: 11,
    specs: {
      Display: "16-inch QHD",
      Memory: "32GB",
      Storage: "1TB SSD",
      Graphics: "NVIDIA RTX 4070",
    },
  },
  {
    id: "wt-1",
    category: "watch",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    price: 799,
    original_price: 899,
    rating: 4.5,
    review_count: 4033,
    image_url: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    featured: true,
    is_deal: true,
    description: "Rugged smartwatch with advanced health and fitness features.",
    stock: 19,
    specs: {
      Display: "49mm Retina",
      Battery: "Up to 36 hours",
      WaterResistance: "100m",
      Connectivity: "GPS + Cellular",
    },
  },
  {
    id: "wt-2",
    category: "watch",
    name: "Garmin Forerunner",
    brand: "Garmin",
    price: 499,
    rating: 4.3,
    review_count: 1890,
    image_url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
    featured: true,
    description: "Training-focused smartwatch for runners and athletes.",
    stock: 28,
    specs: {
      Display: "1.4-inch AMOLED",
      Battery: "Up to 14 days",
      GPS: "Multi-band",
      Weight: "Lightweight",
    },
  },
  {
    id: "wt-3",
    category: "watch",
    name: "Galaxy Watch6",
    brand: "Samsung",
    price: 329,
    original_price: 379,
    rating: 4.4,
    review_count: 1142,
    image_url: "https://images.pexels.com/photos/9973917/pexels-photo-9973917.jpeg",
    featured: true,
    is_deal: true,
    description: "Sleek smartwatch with wellness tracking and a vibrant display.",
    stock: 23,
    specs: {
      Display: "Super AMOLED",
      Battery: "Up to 40 hours",
      Compatibility: "Android",
      Sensors: "Heart rate, ECG",
    },
  },
];

export function getProductsByCategory(category: CatalogItem["category"]) {
  return catalog.filter((product) => product.category === category);
}

export function searchCatalog(category: CatalogItem["category"], query?: string) {
  const products = getProductsByCategory(category);
  if (!query) return products;

  const normalizedQuery = query.toLowerCase();
  return products.filter((product) => {
    return `${product.name} ${product.brand}`.toLowerCase().includes(normalizedQuery);
  });
}

export function getProductById(id: string | number) {
  return catalog.find((product) => String(product.id) === String(id));
}
