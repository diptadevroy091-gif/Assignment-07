export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

export type MarketPrice = {
  market: string;
  division?: string;
  min: number;
  max: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  unit: string;
  change: number;
  emoji: string;
  description: string;
  markets: MarketPrice[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  aliases?: string[];
};

type ApiRecord = Record<string, unknown>;

function asRecord(value: unknown): ApiRecord {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as ApiRecord;
  }

  return {};
}

function toString(
  value: unknown,
  fallback = ""
): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
}

export function toNumber(
  value: unknown,
  fallback = 0
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit))
      )
      .replace(/[^\d.-]/g, "");

    const result = Number(normalized);

    return Number.isFinite(result) && normalized !== ""
      ? result
      : fallback;
  }

  return fallback;
}

export function bnNumber(value: number): string {
  return Math.round(value).toLocaleString("bn-BD");
}

function getEmoji(item: ApiRecord): string {
  const image = toString(item.image ?? item.emoji ?? item.icon);

  if (image && !/^https?:\/\//i.test(image)) {
    return image;
  }

  const emojis: Record<string, string> = {
    chal: "🍚",
    dal: "🫘",
    tel: "🫒",
    sobji: "🥬",
    mach: "🐟",
    mangsho: "🍗",
    "dim-dui": "🥚",
    mosla: "🌶️",
  };

  return emojis[toString(item.category).toLowerCase()] ?? "🛒";
}

export function normalizeProduct(value: unknown): Product {
  const item = asRecord(value);

  const id = toString(
    item.id ?? item._id ?? item.slug,
    "unknown"
  );

  const name = toString(
    item.nameBn ?? item.name ?? item.title,
    "নাম পাওয়া যায়নি"
  );

  const slug = toString(item.slug, id);
  const category = toString(item.category, "other");

  const categoryName = toString(
    item.categoryNameBn ?? item.categoryName,
    category
  );

  const price = toNumber(item.today ?? item.price);

  const changeData = asRecord(item.change);

  const direction = toString(changeData.dir).toLowerCase();

  const changePercent = toNumber(
    changeData.pct ??
      item.changePercent ??
      (typeof item.change === "number" ? item.change : 0)
  );

  const change =
    direction === "down"
      ? -Math.abs(changePercent)
      : direction === "up"
        ? Math.abs(changePercent)
        : changePercent;

  const markets: MarketPrice[] = Array.isArray(item.markets)
    ? item.markets.map((value) => {
        const market = asRecord(value);

        return {
          market: toString(
            market.market ?? market.name,
            "স্থানীয় বাজার"
          ),
          division: toString(market.division),
          min: toNumber(market.min, price),
          max: toNumber(market.max, price),
        };
      })
    : [];

  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : price;

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : price;

  return {
    id,
    name,
    slug,
    category,
    categoryName,
    price,
    minPrice,
    maxPrice,
    averagePrice: price,
    unit: toString(item.unit, "কেজি"),
    change,
    emoji: getEmoji(item),
    description: `${name} - আজকের বাজারদর`,
    markets,
  };
}

async function safeJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    next: { revalidate: 300 },
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${url}`
    );
  }

  return response.json();
}

function unwrapList(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  const record = asRecord(data);

  for (const key of [
    "data",
    "products",
    "categories",
    "items",
    "results",
  ]) {
    if (Array.isArray(record[key])) {
      return record[key] as unknown[];
    }
  }

  const nestedData = asRecord(record.data);

  for (const key of ["products", "categories", "items"]) {
    if (Array.isArray(nestedData[key])) {
      return nestedData[key] as unknown[];
    }
  }

  return [];
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await safeJson(`${API_BASE}/products`);

    return unwrapList(data).map(normalizeProduct);
  } catch (error) {
    console.error("Failed to load products from API:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const products = await getProducts();

  return (
    products.find(
      (product) =>
        product.slug === slug || product.id === slug
    ) ?? null
  );
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await safeJson(`${API_BASE}/categories`);

    return unwrapList(data).map((value) => {
      const item = asRecord(value);

      return {
        id: toString(item.id ?? item.slug ?? item.name),
        name: toString(
          item.nameBn ??
            item.categoryNameBn ??
            item.name ??
            item.title,
          "অন্যান্য"
        ),
        slug: toString(item.slug ?? item.id),
        icon: toString(item.icon ?? item.emoji),
        aliases: Array.isArray(item.aliases)
          ? item.aliases.filter(
              (alias): alias is string =>
                typeof alias === "string"
            )
          : [],
      };
    });
  } catch (error) {
    console.error("Failed to load categories from API:", error);
    return [];
  }
}

export async function getCategory(
  slug: string
): Promise<Category | null> {
  const categories = await getCategories();

  return (
    categories.find(
      (category) =>
        category.slug === slug ||
        category.id === slug ||
        category.name === slug ||
        category.aliases?.includes(slug)
    ) ?? null
  );
}

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  const products = await getProducts();

  return products.filter(
    (product) =>
      product.category.toLowerCase() === slug.toLowerCase() ||
      product.categoryName.toLowerCase() === slug.toLowerCase() ||
      product.slug === slug
  );
}