import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Minus,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

const formatPrice = (value: number | string) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(numericValue);
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

  return String(Math.abs(Number(value) || 0)).replace(
    /\d/g,
    (digit) => digits[Number(digit)]
  );
};

export default function ProductCard({
  product,
}: Props) {
  const isUp = product.change > 0;
  const isDown = product.change < 0;

  const percent = Math.abs(
    Number(product.changePercent ?? 0)
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <article className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-5xl transition group-hover:scale-105">
            {product.emoji}
          </div>

          {isUp && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
              <ArrowUp size={14} />
              +{toBanglaNumber(percent)}%
            </span>
          )}

          {isDown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
              <ArrowDown size={14} />
              -{toBanglaNumber(percent)}%
            </span>
          )}

          {!isUp && !isDown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
              <Minus size={14} />
              ০%
            </span>
          )}
        </div>

        {/* Product info */}
        <div className="mt-5">
          <h3 className="line-clamp-1 text-xl font-black text-slate-900">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            প্রতি {product.unit}
          </p>

          {product.categoryName && (
            <span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-semibold text-slate-400">
              আজকের দাম
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              ৳{formatPrice(product.price)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              প্রতি {product.unit}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition group-hover:bg-emerald-600 group-hover:text-white">
            <ChevronRight size={18} />
          </div>
        </div>
      </article>
    </Link>
  );
}