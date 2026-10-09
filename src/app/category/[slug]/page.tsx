import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProducts,
  getCategories,
} from "@/lib/products";

import CategoryProducts from "@/components/CategoryProducts";

export const revalidate = 300;

const known: Record<
  string,
  { name: string; emoji: string; aliases: string[] }
> = {
  chal: {
    name: "চাল",
    emoji: "🍚",
    aliases: ["rice", "chal", "চাল"],
  },
  dal: {
    name: "ডাল",
    emoji: "🫘",
    aliases: ["lentil", "dal", "ডাল"],
  },
  sobji: {
  name: "সবজি",
  emoji: "🥬",
  aliases: [
    "sobji",
    "shobji",
    "vegetable",
    "vegetables",
    "সবজি",
  ],
},
  mach: {
    name: "মাছ",
    emoji: "🐟",
    aliases: ["fish", "মাছ", "mach"],
  },
  mangsho: {
    name: "মাংস",
    emoji: "🍗",
    aliases: ["meat", "মাংস", "chicken", "mangsho"],
  },
  tel: {
    name: "তেল",
    emoji: "🫙",
    aliases: ["oil", "তেল", "tel"],
  },
  moshla: {
    name: "মসলা",
    emoji: "🌶️",
    aliases: ["spice", "মসলা", "moshla"],
  },
  dim: {
    name: "ডিম",
    emoji: "🥚",
    aliases: ["egg", "ডিম", "dim"],
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const info = known[slug];

  const apiCategory = categories.find(
    (category: { slug?: string | number; id?: string | number; name?: string }) =>
      String(category.slug ?? "").toLowerCase() === slug ||
      String(category.id ?? "").toLowerCase() === slug ||
      String(category.name ?? "").toLowerCase() === slug
  );

  if (!info && !apiCategory) {
    notFound();
  }

  const aliases = info?.aliases ?? [
    String(apiCategory?.slug ?? ""),
    String(apiCategory?.id ?? ""),
    String(apiCategory?.name ?? ""),
    slug,
  ].filter(Boolean);

  const filtered = products.filter((product) => {
    const category = product.category.toLowerCase();
    const categoryName = product.categoryName.toLowerCase();

    return aliases.some((alias) => {
      const normalizedAlias = alias.toLowerCase();

      return (
        category === normalizedAlias ||
        categoryName.includes(normalizedAlias) ||
        category.includes(normalizedAlias)
      );
    });
  });

  const name = info?.name ?? String(apiCategory?.name ?? slug);
  const emoji = info?.emoji ?? "🧺";

  return (
    <section className="section wrap category-page">
      <div className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span>/</span>
        <span>{name}</span>
      </div>

      <div className="category-hero">
        <span className="category-emoji">{emoji}</span>

        <div>
          <span className="section-kicker">
            ক্যাটাগরি অনুযায়ী বাজারদর
          </span>

          <h1>{name}</h1>

          <p>
            এই ক্যাটাগরির পণ্যের আজকের দাম তুলনা করুন।
          </p>
        </div>
      </div>

      <CategoryProducts products={filtered} />
    </section>
  );
}