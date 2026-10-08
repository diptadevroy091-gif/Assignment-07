import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import {
  getCategory,
  getProductsByCategory,
} from "@/lib/api";

import CategoryProducts from "@/components/CategoryProducts";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products =
    await getProductsByCategory(slug);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          হোমে ফিরে যান
        </Link>

        <section className="mb-8 overflow-hidden rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-5xl">
              {category.icon}
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-600">
                বাজার দর
              </p>

              <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">
                {category.name}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {category.name} বিভাগের আজকের বাজার দর।
              </p>
            </div>
          </div>
        </section>

        {products.length ? (
          <CategoryProducts products={products} />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto text-slate-400" size={48} />

            <h2 className="mt-4 text-2xl font-black">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-slate-500">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}