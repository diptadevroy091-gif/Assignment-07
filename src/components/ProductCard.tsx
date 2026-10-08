import Link from "next/link";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
};

const formatPrice = (value: number | string): string => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const toBanglaNumber = (value: number | string): string => {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const absoluteValue = Math.abs(Number(value));

  return Array.from(String(absoluteValue), (digit) => banglaDigits[Number(digit)] ?? digit).join("");
};

export default function ProductCard({ product }: Props) {
  const isUp = product.change > 0;
  const isDown = product.change < 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
            {product.emoji}
          </div>

          {isUp && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <ArrowUp size={13} />
              বাড়ছে
            </span>
          )}

          {isDown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
              <ArrowDown size={13} />
              কমছে
            </span>
          )}

          {!isUp && !isDown && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              <Minus size={13} />
              অপরিবর্তিত
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-emerald-700">
            {product.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            প্রতি {product.unit}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-2xl font-black text-slate-900">
              {formatPrice(product.price)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              আজকের দর
            </p>
          </div>

          <span
            className={
              isUp
                ? "font-bold text-emerald-600"
                : isDown
                ? "font-bold text-red-600"
                : "font-bold text-slate-500"
            }
          >
            {product.change > 0 ? "+" : ""}
            {toBanglaNumber(product.change)}
          </span>
        </div>
      </article>
    </Link>
  );
}