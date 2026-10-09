
import type { Product } from "../types/product";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === "object"
    ? (value as AnyRecord)
    : {};
}

function unwrapList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;

  const record = asRecord(value);

  for (const key of ["data", "products", "categories", "results"]) {
    if (Array.isArray(record[key])) {
      return record[key] as unknown[];
    }
  }

  return [];
}

function toNumber(value: unknown, fallback = 0): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function toString(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function normalizeProduct(value: unknown): Product {
  const item = asRecord(value);
  const price = toNumber(
    item.price ?? item.currentPrice ?? item.averagePrice
  );

  const category = toString(
    item.categorySlug ?? item.category ?? item.categoryName,
    "অন্যান্য"
  );

  const rawPrices = Array.isArray(item.bazarPrices)
    ? item.bazarPrices
    : Array.isArray(item.prices)
      ? item.prices
      : [];

  return {
    id: toString(item.id ?? item._id ?? item.slug),
    name: toString(item.name ?? item.title, "নাম নেই"),
    slug: toString(item.slug ?? item.id ?? item._id),
    category,
    categoryName: toString(item.categoryName, category),
    description: toString(item.description),
    unit: toString(item.unit, "কেজি"),
    price,
    minPrice: toNumber(item.minPrice, price),
    maxPrice: toNumber(item.maxPrice, price),
    averagePrice: toNumber(item.averagePrice, price),
    changePercent: toNumber(item.changePercent),
    emoji: toString(item.emoji ?? item.icon, "🛒"),
    bazarPrices: rawPrices.map((entry) => {
      const bazar = asRecord(entry);

      return {
        bazar: toString(
          bazar.bazar ?? bazar.name ?? bazar.market,
          "স্থানীয় বাজার"
        ),
        price: toNumber(bazar.price),
        unit: toString(bazar.unit, "কেজি"),
      };
    }),
    raw: value,
  } as Product;
}

function normalizeCategory(value: unknown): Category {
  const item = asRecord(value);
  const name = toString(item.name ?? item.title, "অন্যান্য");

  return {
    id: toString(item.id ?? item.slug ?? name),
    name,
    slug: toString(item.slug ?? item.id ?? name),
    icon: toString(item.icon ?? item.emoji, "🛒"),
  };
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  try {
    const result = await fetchJson(API_BASE);
    return unwrapList(result).map(normalizeProduct);
  } catch (error) {
    console.error("getProducts:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const result = await fetchJson(
      `${API_BASE}/${encodeURIComponent(slug)}`
    );

    const record = asRecord(result);
    const product = record.data ?? record.product ?? result;

    return normalizeProduct(product);
  } catch (error) {
    console.error("getProductBySlug:", error);

    const products = await getProducts();

    return (
      products.find(
        (product) =>
          product.slug === slug || product.id === slug
      ) ?? null
    );
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await fetchJson(`${API_BASE}/categories`);
    return unwrapList(result).map(normalizeCategory);
  } catch (error) {
    console.error("getCategories:", error);

    const products = await getProducts();
    const unique = new Map<string, Category>();

    for (const product of products) {
      const categoryKey =
        product.category ||
        product.categoryName ||
        product.slug ||
        "অন্যান্য";

      unique.set(categoryKey, {
        id: categoryKey,
        name: product.categoryName || product.category || "অন্যান্য",
        slug: categoryKey,
        icon: "🛒",
      });
    }

    return Array.from(unique.values());
  }
}

export async function getCategory(
  slug: string
): Promise<Category | null> {
  const categories = await getCategories();

  const found = categories.find(
    (category) =>
      category.slug === slug ||
      category.id === slug ||
      category.name === slug
  );

  if (found) return found;

  try {
    const result = await fetchJson(
      `${API_BASE}/categories/${encodeURIComponent(slug)}`
    );

    const record = asRecord(result);
    const category = record.data ?? record.category ?? result;

    return normalizeCategory(category);
  } catch (error) {
    console.error("getCategory:", error);
    return null;
  }
}

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  try {
    const result = await fetchJson(
      `${API_BASE}/categories/${encodeURIComponent(slug)}`
    );

    const record = asRecord(result);

    const list =
      Array.isArray(result)
        ? result
        : Array.isArray(record.products)
          ? record.products
          : Array.isArray(asRecord(record.data).products)
            ? (asRecord(record.data).products as unknown[])
            : [];

    if (list.length > 0) {
      return list.map(normalizeProduct);
    }
  } catch (error) {
    console.error("Category API request:", error);
  }

  const products = await getProducts();

  return products.filter((product) => {
    const category = (product.category ?? "").toLowerCase();
    const categoryName = (product.categoryName ?? "").toLowerCase();

    return category === slug.toLowerCase() ||
      categoryName === slug.toLowerCase() ||
      product.slug === slug;
  });
}