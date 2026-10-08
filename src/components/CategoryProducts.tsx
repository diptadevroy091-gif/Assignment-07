"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";

type SortOption = "default" | "low" | "high";

type Props = {
  products: Product[];
};

export default function CategoryProducts({
  products,
}: Props) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const copy = [...products];

    if (sort === "low") {
      copy.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      copy.sort((a, b) => b.price - a.price);
    }

    return copy;
  }, [products, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-slate-500">
          মোট {products.length}টি পণ্য
        </p>

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as SortOption)
          }
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-emerald-500"
        >
          <option value="default">ডিফল্ট</option>
          <option value="low">দাম: কম থেকে বেশি</option>
          <option value="high">দাম: বেশি থেকে কম</option>
        </select>
      </div>

      <ProductGrid products={sortedProducts} />
    </div>
  );
}