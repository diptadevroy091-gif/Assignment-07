"use client";

import type { Product } from "@/types/product";
import {
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

type Props = {
  products: Product[];
};

const toBanglaNumber = (value: number | string) => {
  const digits = [
    "০",
    "১",
    "২",
    "৩",
    "৪",
    "৫",
    "৬",
    "৭",
    "৮",
    "৯",
  ];

  return String(value)
    .replace(/\d/g, (digit) => digits[Number(digit)])
    .replace(".", "দশমিক");
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

export default function PriceTicker({
  products,
}: Props) {
  const items = products.slice(0, 12);

  if (!items.length) {
    return null;
  }

  const tickerItems = [...items, ...items];

  return (
    <div className="sticky top-0 z-40 overflow-hidden border-b border-slate-200 bg-white shadow-sm">
      <div className="ticker-track flex min-w-max">
        {tickerItems.map((product, index) => {
          const isUp = product.change > 0;
          const isDown = product.change < 0;

          const percent = Math.abs(
            Number(product.changePercent ?? 0)
          );

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex shrink-0 items-center gap-2 border-r border-slate-200 px-5 py-2.5 text-sm"
            >
              <span className="text-lg">
                {product.emoji}
              </span>

              <span className="font-bold text-slate-700">
                {product.name}
              </span>

              <span className="font-black text-slate-900">
                ৳{formatPrice(product.price)}
              </span>

              <span className="text-xs text-slate-400">
                / {product.unit}
              </span>

              {isUp ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                  <ArrowUp size={14} />
                  {toBanglaNumber(percent)}%
                </span>
              ) : isDown ? (
                <span className="inline-flex items-center gap-1 font-bold text-red-600">
                  <ArrowDown size={14} />
                  {toBanglaNumber(percent)}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400">
                  <Minus size={14} />
                  ০%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}