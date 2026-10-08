"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import ProductGrid from "./ProductGrid";
import { ChevronDown } from "lucide-react";

type Props = {
  products: Product[];
};

export default function CategoryProducts({
  products,
}: Props) {
  const [sort, setSort] = useState("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sort === "asc") {
      result.sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      );
    }

    if (sort === "desc") {
      result.sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      );
    }

    return result;
  }, [products, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          মোট {products.length}টি পণ্য পাওয়া গেছে
        </p>

        <div className="relative">
          <label className="mr-2 text-sm font-semibold text-slate-600">
            সাজান:
          </label>

          <div className="relative inline-block">
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="default">
                ডিফল্ট
              </option>

              <option value="asc">
                দাম: কম থেকে বেশি
              </option>

              <option value="desc">
                দাম: বেশি থেকে কম
              </option>
            </select>

            <ChevronDown
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>
      </div>

      <ProductGrid products={sortedProducts} />
    </div>
  );
}