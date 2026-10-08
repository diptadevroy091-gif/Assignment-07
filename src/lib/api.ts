import type {
  BazarPrice,
  Category,
  Product,
} from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.abcz.workers.dev/api/bazardor";

type AnyObject = Record<string, any>;

/* =========================================================
   HELPERS
========================================================= */

function slugify(value: string): string {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\u0980-\u09FFa-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

function normalizeText(value: unknown): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, "");
}

/* =========================================================
   CATEGORY ICON
========================================================= */

function getCategoryIcon(category: string): string {
  const value = normalizeText(category);

  if (
    value.includes("chal") ||
    value.includes("rice") ||
    value.includes("চাল")
  ) {
    return "🌾";
  }

  if (
    value.includes("dal") ||
    value.includes("pulse") ||
    value.includes("lentil") ||
    value.includes("ডাল")
  ) {
    return "🫘";
  }

  if (
    value.includes("sobji") ||
    value.includes("vegetable") ||
    value.includes("সবজি")
  ) {
    return "🥬";
  }

  if (
    value.includes("mach") ||
    value.includes("fish") ||
    value.includes("মাছ")
  ) {
    return "🐟";
  }

  if (
    value.includes("mangsho") ||
    value.includes("meat") ||
    value.includes("beef") ||
    value.includes("chicken") ||
    value.includes("মাংস")
  ) {
    return "🥩";
  }

  if (
    value.includes("fol") ||
    value.includes("fruit") ||
    value.includes("ফল")
  ) {
    return "🍎";
  }

  if (
    value.includes("mosla") ||
    value.includes("moshla") ||
    value.includes("spice") ||
    value.includes("মসলা")
  ) {
    return "🌶️";
  }

  if (
    value.includes("tel") ||
    value.includes("oil") ||
    value.includes("তেল")
  ) {
    return "🫗";
  }

  if (
    value.includes("dim") ||
    value.includes("egg") ||
    value.includes("দিম") ||
    value.includes("ডিম")
  ) {
    return "🥚";
  }

  return "🛒";
}

/* =========================================================
   UNIT
========================================================= */

function getUnit(unit: unknown): string {
  const value = String(unit || "")
    .trim()
    .toLowerCase();

  if (value === "kg" || value === "kgs") {
    return "কেজি";
  }

  if (
    value === "litre" ||
    value === "liter" ||
    value === "l"
  ) {
    return "লিটার";
  }

  if (
    value === "dozen" ||
    value === "dozens"
  ) {
    return "ডজন";
  }

  if (
    value === "piece" ||
    value === "pieces" ||
    value === "pc"
  ) {
    return "পিস";
  }

  if (value === "gram" || value === "g") {
    return "গ্রাম";
  }

  return String(unit || "কেজি");
}

/* =========================================================
   API FETCH
========================================================= */

async function apiFetch<T>(
  path: string
): Promise<T> {
  const response = await fetch(
    `${API_BASE}${path}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }

  return response.json();
}

/* =========================================================
   MARKET DATA
========================================================= */

function normalizeMarkets(
  markets: any[]
): BazarPrice[] {
  if (!Array.isArray(markets)) {
    return [];
  }

  return markets
    .map((market) => {
      const min = Number(
        market?.min || 0
      );

      const max = Number(
        market?.max || 0
      );

      const average =
        min > 0 && max > 0
          ? Math.round((min + max) / 2)
          : min || max || 0;

      return {
        bazar:
          market?.market ||
          market?.bazar ||
          market?.name ||
          "বাজার",

        price: average,

        unit:
          market?.unit ||
          undefined,
      };
    })
    .filter(
      (market) =>
        Number(market.price) > 0
    );
}

/* =========================================================
   PRODUCT NORMALIZER
========================================================= */

function normalizeProduct(
  item: AnyObject
): Product {
  const today = Number(
    item?.today ??
      item?.price ??
      item?.currentPrice ??
      0
  );

  const yesterday = Number(
    item?.yesterday ??
      item?.previousPrice ??
      0
  );

  const priceChange =
    today - yesterday;

  const changePercent = Number(
    item?.change?.pct ??
      item?.changePercent ??
      0
  );

  const markets =
    Array.isArray(item?.markets)
      ? item.markets
      : [];

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  const categoryValue =
    item?.category ??
    item?.categorySlug ??
    item?.categoryId ??
    "other";

  const categoryName =
    item?.categoryNameBn ??
    item?.categoryName ??
    item?.categoryBn ??
    item?.category_name ??
    String(categoryValue);

  /* -------------------------------------------------------
     NAME
  ------------------------------------------------------- */

  const productName =
    item?.nameBn ??
    item?.name ??
    item?.productNameBn ??
    item?.productName ??
    item?.title ??
    "অজানা পণ্য";

  /* -------------------------------------------------------
     SLUG
  ------------------------------------------------------- */

  const productSlug =
    item?.slug ??
    item?.productSlug ??
    slugify(productName);

  /* -------------------------------------------------------
     MIN PRICE
  ------------------------------------------------------- */

  const allMinPrices = markets
    .map((market) =>
      Number(
        market?.min || 0
      )
    )
    .filter(
      (price) => price > 0
    );

  const minPrice =
    allMinPrices.length > 0
      ? Math.min(
          ...allMinPrices
        )
      : today;

  /* -------------------------------------------------------
     MAX PRICE
  ------------------------------------------------------- */

  const allMaxPrices = markets
    .map((market) =>
      Number(
        market?.max || 0
      )
    )
    .filter(
      (price) => price > 0
    );

  const maxPrice =
    allMaxPrices.length > 0
      ? Math.max(
          ...allMaxPrices
        )
      : today;

  /* -------------------------------------------------------
     AVERAGE PRICE
  ------------------------------------------------------- */

  const validMarkets =
    markets.filter(
      (market) =>
        Number(
          market?.min || 0
        ) > 0 ||
        Number(
          market?.max || 0
        ) > 0
    );

  const averagePrice =
    validMarkets.length > 0
      ? Math.round(
          validMarkets.reduce(
            (
              sum,
              market
            ) => {
              const min =
                Number(
                  market?.min ||
                    0
                );

              const max =
                Number(
                  market?.max ||
                    0
                );

              const average =
                min > 0 &&
                max > 0
                  ? (min + max) /
                    2
                  : min ||
                    max;

              return (
                sum + average
              );
            },
            0
          ) /
            validMarkets.length
        )
      : today;

  /* -------------------------------------------------------
     ICON / EMOJI
  ------------------------------------------------------- */

  const categoryIcon =
    item?.categoryIcon ||
    item?.icon ||
    item?.emoji ||
    getCategoryIcon(
      String(categoryValue)
    );

  const emoji =
    item?.image ||
    item?.emoji ||
    item?.icon ||
    categoryIcon ||
    getCategoryIcon(
      String(categoryValue)
    );

  /* -------------------------------------------------------
     RETURN
  ------------------------------------------------------- */

  return {
    id: String(
      item?.id ??
        item?._id ??
        productSlug
    ),

    name: productName,

    slug: String(
      productSlug
    ),

    category:
      String(
        categoryValue
      ),

    categoryName:
      String(
        categoryName
      ),

    categoryIcon:

      categoryIcon,

    description:
      item?.description ??
      item?.details ??
      `${productName} এর আজকের বাজার দর`,

    unit:
      getUnit(
        item?.unit
      ),

    price: today,

    minPrice,

    maxPrice,

    averagePrice,

    change:
      priceChange,

    changePercent,

    emoji,

    bazarPrices:
      normalizeMarkets(
        markets
      ),

    raw: item,
  };
}

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

export async function getProducts(): Promise<
  Product[]
> {
  try {
    const data =
      await apiFetch<any>(
        "/products"
      );

    if (
      !Array.isArray(data)
    ) {
      return [];
    }

    return data
      .filter(
        (item) =>
          item &&
          typeof item ===
            "object"
      )
      .map(
        normalizeProduct
      );
  } catch (error) {
    console.error(
      "getProducts error:",
      error
    );

    return [];
  }
}

/* =========================================================
   CATEGORY ALIASES
========================================================= */

const CATEGORY_ALIASES: Record<
  string,
  string[]
> = {
  chal: [
    "chal",
    "rice",
    "চাল",
  ],

  dal: [
    "dal",
    "pulse",
    "pulses",
    "lentil",
    "ডাল",
  ],

  sobji: [
    "sobji",
    "vegetable",
    "vegetables",
    "সবজি",
  ],

  fish: [
    "fish",
    "mach",
    "মাছ",
  ],

  mangsho: [
    "mangsho",
    "meat",
    "beef",
    "chicken",
    "মাংস",
  ],

  fol: [
    "fol",
    "fruit",
    "fruits",
    "ফল",
  ],

  mosla: [
    "mosla",
    "moshla",
    "spice",
    "spices",
    "মসলা",
  ],

  tel: [
    "tel",
    "oil",
    "তেল",
  ],

  dim: [
    "dim",
    "egg",
    "eggs",
    "ডিম",
  ],
};

/* =========================================================
   CHECK CATEGORY
========================================================= */

function productMatchesCategory(
  product: Product,
  slug: string
): boolean {
  const requestedSlug =
    normalizeText(slug);

  const aliases =
    CATEGORY_ALIASES[
      requestedSlug
    ] || [
      requestedSlug,
    ];

  const productCategory =
    normalizeText(
      product.category
    );

  const productCategoryName =
    normalizeText(
      product.categoryName
    );

  const productSlug =
    normalizeText(
      product.slug
    );

  return aliases.some(
    (alias) => {
      const normalizedAlias =
        normalizeText(
          alias
        );

      return (
        productCategory ===
          normalizedAlias ||
        productCategoryName ===
          normalizedAlias ||
        productCategory.includes(
          normalizedAlias
        ) ||
        productCategoryName.includes(
          normalizedAlias
        ) ||
        productSlug.includes(
          normalizedAlias
        )
      );
    }
  );
}

/* =========================================================
   GET PRODUCTS BY CATEGORY
========================================================= */

export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  try {
    /*
      IMPORTANT:

      API-এর

      /products?category=fol

      endpoint [] return করছে।

      তাই এখানে category query ব্যবহার করছি না।

      প্রথমে সব product নিচ্ছি,
      তারপর frontend-এ category মিলিয়ে নিচ্ছি।
    */

    const products =
      await getProducts();

    if (
      !products.length
    ) {
      return [];
    }

    return products.filter(
      (product) =>
        productMatchesCategory(
          product,
          slug
        )
    );
  } catch (error) {
    console.error(
      "getProductsByCategory error:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET SINGLE PRODUCT BY ID
========================================================= */

export async function getProductById(
  id: string
): Promise<Product | null> {
  try {
    const data =
      await apiFetch<any>(
        `/products/${encodeURIComponent(
          id
        )}`
      );

    if (
      !data ||
      typeof data !==
        "object"
    ) {
      return null;
    }

    const productData =
      data?.data ??
      data?.product ??
      data;

    if (
      !productData ||
      typeof productData !==
        "object"
    ) {
      return null;
    }

    return normalizeProduct(
      productData
    );
  } catch (error) {
    console.error(
      "getProductById error:",
      error
    );

    return null;
  }
}

/* =========================================================
   GET PRODUCT BY SLUG
========================================================= */

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const products =
      await getProducts();

    const product =
      products.find(
        (item) =>
          item.slug ===
            slug ||
          slugify(
            item.name
          ) === slug
      );

    if (!product) {
      return null;
    }

    const detailedProduct =
      await getProductById(
        product.id
      );

    return (
      detailedProduct ||
      product
    );
  } catch (error) {
    console.error(
      "getProductBySlug error:",
      error
    );

    return null;
  }
}

/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeCategory(
  item: AnyObject
): Category {
  const name =
    item?.nameBn ??
    item?.name ??
    item?.categoryNameBn ??
    item?.categoryName ??
    "ক্যাটাগরি";

  const slug =
    item?.slug ??
    item?.categorySlug ??
    item?.id ??
    slugify(name);

  const icon =
    item?.categoryIcon ??
    item?.icon ??
    item?.emoji ??
    getCategoryIcon(
      String(slug)
    );

  return {
    id: String(
      item?.id ?? slug
    ),

    name: String(
      name
    ),

    slug: String(
      slug
    ),

    icon,
  };
}

/* =========================================================
   GET ALL CATEGORIES
========================================================= */

export async function getCategories(): Promise<
  Category[]
> {
  try {
    const data =
      await apiFetch<any>(
        "/categories"
      );

    if (
      !Array.isArray(data)
    ) {
      return [];
    }

    return data
      .filter(
        (item) =>
          item &&
          typeof item ===
            "object"
      )
      .map(
        normalizeCategory
      );
  } catch (error) {
    console.error(
      "getCategories error:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET SINGLE CATEGORY
========================================================= */

export async function getCategory(
  slug: string
): Promise<Category | null> {
  try {
    /*
      এখানে আর

      /categories/${slug}

      API request করা হচ্ছে না।

      কারণ ওই endpoint কিছু slug-এর জন্য
      404 দিতে পারে।

      সব category এনে slug দিয়ে খুঁজে নিচ্ছি।
    */

    const categories =
      await getCategories();

    const requestedSlug =
      normalizeText(slug);

    const category =
      categories.find(
        (item) => {
          const itemSlug =
            normalizeText(
              item.slug
            );

          const itemId =
            normalizeText(
              item.id
            );

          return (
            itemSlug ===
              requestedSlug ||
            itemId ===
              requestedSlug
          );
        }
      );

    return (
      category || null
    );
  } catch (error) {
    console.error(
      "getCategory error:",
      error
    );

    return null;
  }
}