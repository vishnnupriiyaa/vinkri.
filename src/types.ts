export type ThemeMode = 'rustic-dark' | 'warm-beige';

export interface Product {
  id: string;
  name: string;
  category: 'DESK TOYS' | 'CUSTOM DIORAMAS' | 'DIECAST CAR STANDS' | 'CUSTOM FIGURINES' | 'DECOR LAMPS';
  floorNumber: 1 | 2 | 3 | 4 | 5;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  shortTag: string;
  dimensions: string;
  materials: string[];
  powerSource?: string;
  ledColors?: string[];
  isTopSeller?: boolean;
  isOnShelf?: boolean;
  imageThumbnail: string;
  imageFull?: string;
  inStock: boolean;
  badge?: string;
}

export interface FloorInfo {
  number: string;
  numeric: number;
  name: string;
  tagline: string;
  accentColor: string;
  accentHex: string;
  bgDark: string;
  bgLight: string;
  description: string;
  items: {
    title: string;
    description: string;
    slot: 'left' | 'center' | 'right';
    productId?: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}
