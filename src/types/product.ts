export type Product = {
  id: string;
  name: string;
  slug: string;

  category: string;
  categoryName?: string;
  categoryIcon?: string;

  description?: string;
  unit: string;

  price: number;
  minPrice?: number;
  maxPrice?: number;
  averagePrice?: number;

  change: number;
  changePercent?: number;

  emoji: string;

  bazarPrices?: BazarPrice[];

  raw?: unknown;
};

export type BazarPrice = {
  bazar: string;
  price: number;
  unit?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};