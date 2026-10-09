
import type { Product } from "../types/product";

type PriceTickerProps = {
  products: PriceTickerProduct[];
};

type PriceTickerProduct = Product & {
  change?: number | string;
};

function formatPrice(value: number | string | undefined): string {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numericValue) ? numericValue : 0);
}

function getChangeMeta(change: number | string | undefined): {
  symbol: string;
  className: string;
} {
  const numericChange = Number(change ?? 0);

  if (!Number.isFinite(numericChange)) {
    return { symbol: "—", className: "text-slate-300" };
  }

  if (numericChange > 0) {
    return { symbol: "▲", className: "text-rose-300" };
  }

  if (numericChange < 0) {
    return { symbol: "▼", className: "text-lime-300" };
  }

  return { symbol: "—", className: "text-slate-300" };
}

export default function PriceTicker({
  products,
}: PriceTickerProps) {
  if (products.length === 0) {
    return (
      <div className="border-b border-emerald-900 bg-emerald-950 px-4 py-3 text-center text-sm text-emerald-100">
        আজকের বাজারদরের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  const items = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-emerald-900 bg-emerald-950 text-white">
      <div className="flex min-h-12 items-center gap-5 px-4">
        <span className="z-10 shrink-0 rounded-md bg-lime-300 px-2.5 py-1 text-xs font-black text-emerald-950">
          বাজার আপডেট
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-[ticker_35s_linear_infinite] items-center gap-8 hover:[animation-play-state:paused]">
            {items.map((product, index) => {
              const changeMeta = getChangeMeta(product.change);

              return (
                <span
                  key={`${product.id}-${index}`}
                  className="flex shrink-0 items-center gap-2 text-sm"
                >
                  <span>{product.emoji}</span>
                  <span className="font-semibold">{product.name}</span>

                  <span className="font-bold text-lime-300">
                    ৳{formatPrice(product.price)}
                  </span>

                  <span className="text-emerald-200">/ {product.unit}</span>

                  <span className={changeMeta.className}>{changeMeta.symbol}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}