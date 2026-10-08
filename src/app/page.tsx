import Hero from "@/components/Hero";
import PriceTicker from "@/components/PriceTicker";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/api";
import { ArrowDown, ArrowUp } from "lucide-react";

export default async function HomePage() {
  const products = await getProducts();

  const risers = [...products]
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Hero />
      </div>

      <PriceTicker products={products} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ArrowUp size={21} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                আজ দাম বেড়েছে
              </h2>

              <p className="text-sm text-slate-500">
                আজ যেসব পণ্যের দাম বেশি বেড়েছে
              </p>
            </div>
          </div>

          <ProductGrid products={risers} />
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <ArrowDown size={21} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                আজ দাম কমেছে
              </h2>

              <p className="text-sm text-slate-500">
                আজ যেসব পণ্যের দাম কমেছে
              </p>
            </div>
          </div>

          <ProductGrid products={fallers} />
        </section>

        <section
          id="সব-পণ্য"
          className="mt-16 scroll-mt-32"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-black">
              সব পণ্য
            </h2>

            <p className="mt-1 text-slate-500">
              বাজারের সকল পণ্যের সর্বশেষ মূল্য
            </p>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </main>
  );
}