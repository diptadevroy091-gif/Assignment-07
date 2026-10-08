import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="text-5xl">🛒</div>

        <h3 className="mt-4 text-xl font-bold">
          কোনো পণ্য পাওয়া যায়নি
        </h3>

        <p className="mt-2 text-slate-500">
          এই মুহূর্তে এই ক্যাটাগরিতে কোনো পণ্যের তথ্য নেই।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={`${product.id}-${product.slug}`}
          product={product}
        />
      ))}
    </div>
  );
}