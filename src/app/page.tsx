import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";
import { ArrowDown, ArrowUp } from "lucide-react";

export default async function HomePage() {
  const products = await getProducts();

  const risers = [...products]
    .filter((product) => product.change > 0)
    .sort((a, b) => {
      const aPercent = Number(a.changePercent ?? 0);
      const bPercent = Number(b.changePercent ?? 0);

      return bPercent - aPercent || b.change - a.change;
    })
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change < 0)
    .sort((a, b) => {
      const aPercent = Number(a.changePercent ?? 0);
      const bPercent = Number(b.changePercent ?? 0);

      return aPercent - bPercent || a.change - b.change;
    })
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Hero />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Rising */}
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700">
                <ArrowUp size={16} />
                আজকের বাজার
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                আজ দাম বেড়েছে
              </h2>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে।
              </p>
            </div>
          </div>

          <ProductGrid products={risers} />
        </section>

        {/* Falling */}
        <section className="mt-16">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1.5 text-sm font-bold text-red-700">
              <ArrowDown size={16} />
              আজকের বাজার
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              আজ দাম কমেছে
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে।
            </p>
          </div>

          <ProductGrid products={fallers} />
        </section>

        {/* All Products */}
        <section
          id="সব-পণ্য"
          className="mt-20 scroll-mt-36"
        >
          <div className="mb-6">
            <div className="mb-2 inline-flex rounded-full bg-slate-200 px-3 py-1.5 text-sm font-bold text-slate-700">
              🛒 বাজারের তালিকা
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              সব পণ্য
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              প্রয়োজনীয় সব পণ্যের আজকের বাজার দর এক জায়গায়।
            </p>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}