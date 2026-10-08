import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Minus,
  MapPin,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getProductBySlug } from "@/lib/api";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const toBanglaNumber = (
  value: number | string
) => {
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

  return String(value).replace(
    /\d/g,
    (digit) => digits[Number(digit)]
  );
};

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(
      `/signin?callbackUrl=${encodeURIComponent(
        `/product/${slug}`
      )}`
    );
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isUp = product.change > 0;
  const isDown = product.change < 0;

  const changePercent = Number(
    product.changePercent ?? 0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          সব পণ্যে ফিরে যান
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Product visual */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex min-h-90 items-center justify-center rounded-3xl bg-emerald-50">
              <span className="text-[10rem] leading-none">
                {product.emoji}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.categoryName && (
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {product.categoryName}
                </span>
              )}

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                প্রতি {product.unit}
              </span>
            </div>
          </section>

          {/* Details */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-emerald-600">
              আজকের বাজার দর
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-4 leading-8 text-slate-500">
              {product.description ||
                `${product.name} এর আজকের বাজার দর ও বিভিন্ন বাজারের মূল্য দেখুন।`}
            </p>

            {/* Current price */}
            <div className="mt-8 rounded-3xl bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-500">
                আজকের দাম
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-4">
                <span className="text-4xl font-black text-slate-900">
                  ৳{formatPrice(product.price)}
                </span>

                <span className="pb-1 text-sm text-slate-500">
                  / {product.unit}
                </span>

                {isUp && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-black text-emerald-700">
                    <ArrowUp size={16} />
                    +{toBanglaNumber(changePercent)}%
                  </span>
                )}

                {isDown && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-sm font-black text-red-700">
                    <ArrowDown size={16} />
                    -{toBanglaNumber(
                      Math.abs(changePercent)
                    )}%
                  </span>
                )}

                {!isUp && !isDown && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1.5 text-sm font-black text-slate-600">
                    <Minus size={16} />
                    ০%
                  </span>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  সর্বনিম্ন
                </p>
                <p className="mt-2 text-xl font-black">
                  ৳{formatPrice(product.minPrice ?? 0)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  গড় দাম
                </p>
                <p className="mt-2 text-xl font-black">
                  ৳
                  {formatPrice(
                    product.averagePrice ?? 0
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold text-slate-400">
                  সর্বোচ্চ
                </p>
                <p className="mt-2 text-xl font-black">
                  ৳{formatPrice(product.maxPrice ?? 0)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Market prices */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                বাজারভিত্তিক আজকের দাম
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                বিভিন্ন বাজারে {product.name} এর বর্তমান মূল্য।
              </p>
            </div>
          </div>

          {product.bazarPrices?.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.bazarPrices.map(
                (market, index) => (
                  <div
                    key={`${market.bazar}-${index}`}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <p className="font-bold text-slate-800">
                      {market.bazar}
                    </p>

                    <p className="mt-3 text-2xl font-black text-emerald-700">
                      ৳{formatPrice(market.price)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      প্রতি{" "}
                      {market.unit ||
                        product.unit}
                    </p>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-500">
                বাজারভিত্তিক আলাদা তথ্য পাওয়া যায়নি।
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}