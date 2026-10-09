import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import type { Product } from "@/lib/products";
import { bnNumber } from "@/lib/products";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const positive = product.change > 0;
  const negative = product.change < 0;

  return (
    <Link
      href={`/product/${encodeURIComponent(
        product.slug || product.id
      )}`}
      className="product-card"
    >
      <div className="product-visual">
        <span className="product-emoji">{product.emoji}</span>
        <small>{product.categoryName}</small>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="unit">{product.unit}</p>

        <div className="price-label">আজকের দাম</div>

        <div className="price-row">
          <strong>
            {bnNumber(product.price)} <small>টাকা</small>
          </strong>

          <span
            className={`change ${
              positive
                ? "change-up"
                : negative
                  ? "change-down"
                  : "change-flat"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={14} />
            ) : negative ? (
              <ArrowDownRight size={14} />
            ) : (
              <Minus size={13} />
            )}

            {bnNumber(Math.abs(product.change))}%
          </span>
        </div>

        <div className="card-bottom">
          বিস্তারিত দেখুন <span>↗</span>
        </div>
      </div>
    </Link>
  );
}