"use client";

import type { Product } from "@/types/product";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function PriceTicker({
  products,
}: {
  products: Product[];
}) {
  const items = products.slice(0, 12);

  if (!items.length) return null;

  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white">
      <div className="flex min-w-max animate-[ticker_35s_linear_infinite]">
        {[...items, ...items].map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex items-center gap-3 border-r border-slate-200 px-6 py-3 text-sm"
          >
            <span>{product.emoji}</span>

            <span className="font-semibold text-slate-700">
              {product.name}
            </span>

            <span className="font-bold text-emerald-700">
              {formatPrice(product.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}