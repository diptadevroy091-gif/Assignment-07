"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";

import type { Product } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

type SortOption = "default" | "low-high" | "high-low";

export default function CategoryProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "low-high") {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, sort]);

  return (
    <>
      <div className="category-toolbar">
        <p>
          মোট <strong>{products.length.toLocaleString("bn-BD")}</strong> টি পণ্য
        </p>

        <label className="sort-control">
          <SlidersHorizontal size={16} />
          <span>সাজান:</span>

          <select
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
            aria-label="পণ্য সাজান"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>

          {sort === "low-high" ? (
            <ArrowUpAZ size={16} />
          ) : (
            <ArrowDownAZ size={16} />
          )}
        </label>
      </div>

      <ProductGrid products={sortedProducts} />
    </>
  );
}