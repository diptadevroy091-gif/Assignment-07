import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Lock,
} from "lucide-react";

import { getProductBySlug } from "@/lib/api";

const auth = {
  api: {
    getSession: async (_args?: { headers?: Headers }) => null,
  },
} as const;

const toBanglaNumber = (value: number | string | null | undefined) => {
  const numericValue = String(value ?? 0);

  return numericValue.replace(/\d/g, (digit) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return banglaDigits[Number(digit)] ?? digit;
  });
};

const formatPrice = (
  value: number | string | null | undefined,
) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return "০ টাকা";
  }

  return `${new Intl.NumberFormat("bn-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)} টাকা`;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin?redirect=/product/" + (await params).slug);
  }

  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isUp = product.change > 0;
  const isDown = product.change < 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-600">
            হোম
          </Link>

          <span>/</span>

          <span>{product.name}</span>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[220px_1fr]">
            <div className="flex h-52 items-center justify-center rounded-3xl bg-emerald-50 text-[8rem]">
              {product.emoji}
            </div>

            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {product.categoryName ||
                  product.category}
              </span>

              <h1 className="mt-4 text-4xl font-black text-slate-900">
                {product.name}
              </h1>

              <p className="mt-3 leading-7 text-slate-500">
                {product.description ||
                  "এই পণ্যের আজকের বাজারদর এবং বাজারভিত্তিক মূল্য দেখুন।"}
              </p>

              <div className="mt-6 flex flex-wrap items-end gap-5">
                <div>
                  <p className="text-sm text-slate-500">
                    বর্তমান দাম
                  </p>

                  <p className="text-4xl font-black text-emerald-700">
                    {formatPrice(product.price)}
                  </p>

                  <p className="text-sm text-slate-400">
                    প্রতি {product.unit}
                  </p>
                </div>

                <div
                  className={
                    isUp
                      ? "rounded-xl bg-emerald-100 px-4 py-3 text-emerald-700"
                      : isDown
                      ? "rounded-xl bg-red-100 px-4 py-3 text-red-600"
                      : "rounded-xl bg-slate-100 px-4 py-3 text-slate-600"
                  }
                >
                  <div className="flex items-center gap-2 font-bold">
                    {isUp && <ArrowUp size={18} />}
                    {isDown && <ArrowDown size={18} />}

                    {product.change > 0 ? "+" : ""}
                    {toBanglaNumber(product.change)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-6 sm:p-10">
            <h2 className="text-2xl font-black">
              মূল্য বিশ্লেষণ
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  সর্বনিম্ন দাম
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(
                    product.minPrice || product.price
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  সর্বোচ্চ দাম
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(
                    product.maxPrice || product.price
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                  গড় দাম
                </p>

                <p className="mt-2 text-2xl font-black">
                  {formatPrice(
                    product.averagePrice || product.price
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 p-6 sm:p-10">
            <h2 className="text-2xl font-black">
              বাজারভিত্তিক দাম
            </h2>

            {product.bazarPrices &&
            product.bazarPrices.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                {product.bazarPrices.map(
                  (item, index) => (
                    <div
                      key={`${item.bazar}-${index}`}
                      className="flex items-center justify-between border-b border-slate-100 p-4 last:border-0"
                    >
                      <span className="font-semibold">
                        {item.bazar}
                      </span>

                      <span className="font-black text-emerald-700">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                এই পণ্যের বাজারভিত্তিক আলাদা তথ্য বর্তমানে
                পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}