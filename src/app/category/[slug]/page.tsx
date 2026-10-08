import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  if (!category && products.length === 0) {
    const categories = await getCategories();

    const exists = categories.some(
      (item) => item.slug === slug
    );

    if (!exists) {
      notFound();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
              {category?.icon || "🛒"}
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-600">
                বাজার দর
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900">
                {category?.name || slug}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                এই ক্যাটাগরির আজকের পণ্যের দাম
              </p>
            </div>
          </div>
        </div>

        <CategoryProducts products={products} />
      </div>
    </main>
  );
}