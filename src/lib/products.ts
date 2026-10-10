
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://openapi.programming-hero.com/api/bazardor";

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

function toString(value: unknown, fallback = ""): string {
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

    return normalized !== "" && Number.isFinite(result)
      ? result
      : fallback;
  }

  return fallback;
}

export function bnNumber(value: number): string {
  return Math.round(value).toLocaleString("bn-BD");
}

function getCategoryValue(item: ApiRecord): string {
  const category = item.category;

  if (typeof category === "string" || typeof category === "number") {
    return String(category);
  }

  const categoryRecord = asRecord(category);

  return toString(
    categoryRecord.slug ??
      categoryRecord.id ??
      categoryRecord.name ??
      categoryRecord.nameBn,
    "other"
  );
}

function getEmoji(item: ApiRecord): string {
  const image = toString(
    item.emoji ?? item.icon ?? item.image ?? item.imageUrl
  );

  if (image && !/^https?:\/\//i.test(image)) {
    return image;
  }

  const category = getCategoryValue(item).toLowerCase();

  const emojis: Record<string, string> = {
    chal: "🍚",
    rice: "🍚",
    dal: "🫘",
    lentil: "🫘",
    tel: "🫒",
    oil: "🫒",
    sobji: "🥬",
    shobji: "🥬",
    vegetables: "🥬",
    vegetable: "🥬",
    mach: "🐟",
    fish: "🐟",
    mangsho: "🍗",
    meat: "🍗",
    dim: "🥚",
    egg: "🥚",
    mosla: "🌶️",
    spice: "🌶️",
  };

  return emojis[category] ?? "🛒";
}

function getPrice(item: ApiRecord): number {
  const priceValue =
    item.today ??
    item.price ??
    item.currentPrice ??
    item.averagePrice ??
    item.average ??
    item.minPrice;

  if (typeof priceValue === "object" && priceValue !== null) {
    const priceRecord = asRecord(priceValue);

    return toNumber(
      priceRecord.average ??
        priceRecord.today ??
        priceRecord.price ??
        priceRecord.min
    );
  }

  return toNumber(priceValue);
}

export function normalizeProduct(value: unknown): Product {
  const item = asRecord(value);

  const id = toString(
    item.id ?? item._id ?? item.productId ?? item.slug,
    "unknown"
  );

  const name = toString(
    item.nameBn ??
      item.name_bn ??
      item.name ??
      item.title ??
      item.productName,
    "নাম পাওয়া যায়নি"
  );

  const slug = toString(item.slug ?? item.id ?? id, id);
  const category = getCategoryValue(item);

  const categoryRecord = asRecord(item.category);

  const categoryName = toString(
    item.categoryNameBn ??
      item.categoryName ??
      item.category_bn ??
      categoryRecord.nameBn ??
      categoryRecord.name ??
      category,
    category
  );

  const price = getPrice(item);

  const changeData = asRecord(item.change);

  const direction = toString(
    changeData.dir ?? item.changeDirection
  ).toLowerCase();

  const changePercent = toNumber(
    changeData.pct ??
      item.changePercent ??
      item.priceChange ??
      (typeof item.change === "number" ? item.change : 0)
  );

  const change =
    direction === "down"
      ? -Math.abs(changePercent)
      : direction === "up"
        ? Math.abs(changePercent)
        : changePercent;

  const rawMarkets =
    item.markets ?? item.marketPrices ?? item.market_prices;

  const markets: MarketPrice[] = Array.isArray(rawMarkets)
    ? rawMarkets.map((value) => {
        const market = asRecord(value);

        const min = toNumber(
          market.min ?? market.minPrice ?? market.priceMin,
          price
        );

        const max = toNumber(
          market.max ?? market.maxPrice ?? market.priceMax,
          price
        );

        return {
          market: toString(
            market.market ?? market.name ?? market.marketName,
            "স্থানীয় বাজার"
          ),
          division: toString(market.division ?? market.region),
          min,
          max,
        };
      })
    : [];

  const minPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => market.min))
      : toNumber(item.minPrice ?? item.min, price);

  const maxPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => market.max))
      : toNumber(item.maxPrice ?? item.max, price);

  return {
    id,
    name,
    slug,
    category,
    categoryName,
    price,
    minPrice,
    maxPrice,
    averagePrice: toNumber(item.averagePrice, price),
    unit: toString(item.unit ?? item.unitBn, "কেজি"),
    change,
    emoji: getEmoji(item),
    description: toString(
      item.description ?? item.descriptionBn,
      `${name} - আজকের বাজারদর`
    ),
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
    throw new Error(`API request failed: ${response.status} ${url}`);
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
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === "object") {
      const nested = unwrapList(value);

      if (nested.length > 0) {
        return nested;
      }
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
      (product) => product.slug === slug || product.id === slug
    ) ?? null
  );
}

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await safeJson(`${API_BASE}/categories`);

    return unwrapList(data).map((value) => {
      const item = asRecord(value);
      const categoryRecord = asRecord(item.category);

      const id = toString(
        item.id ?? item._id ?? item.slug ?? item.name
      );

      const name = toString(
        item.nameBn ??
          item.categoryNameBn ??
          item.name_bn ??
          item.name ??
          item.title ??
          categoryRecord.nameBn ??
          categoryRecord.name,
        "অন্যান্য"
      );

      const slug = toString(
        item.slug ?? item.categorySlug ?? item.id ?? id
      );

      return {
        id,
        name,
        slug,
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
  const normalizedSlug = slug.toLowerCase();

  return (
    categories.find(
      (category) =>
        category.slug.toLowerCase() === normalizedSlug ||
        category.id.toLowerCase() === normalizedSlug ||
        category.name.toLowerCase() === normalizedSlug ||
        category.aliases?.some(
          (alias) => alias.toLowerCase() === normalizedSlug
        )
    ) ?? null
  );
}

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  const products = await getProducts();
  const normalizedSlug = slug.toLowerCase();

  return products.filter(
    (product) =>
      product.category.toLowerCase() === normalizedSlug ||
      product.categoryName.toLowerCase() === normalizedSlug ||
      product.slug.toLowerCase() === normalizedSlug
  );
}
