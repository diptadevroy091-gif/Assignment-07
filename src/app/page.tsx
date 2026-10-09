import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";

export const revalidate = 300;

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
    <>
      {/* Hero / Banner Section */}
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              প্রতিদিনের বাজার, এখন হাতের মুঠোয়
            </div>

            <h1>
              বাজারের সঠিক দাম জানুন,
              <br />
              <em>সাশ্রয়ী সিদ্ধান্ত নিন।</em>
            </h1>

            <p>
              চাল, ডাল, মাছ, সবজি থেকে নিত্যপ্রয়োজনীয় পণ্য—
              আজকের বাজারদর দেখুন এক জায়গায়।
              সচেতন থাকুন, সাশ্রয় করুন।
            </p>

            <div className="hero-actions">
              <a
                href="#all-products"
                className="btn btn-primary btn-large"
              >
                সব পণ্যের দাম দেখুন
                <ArrowRight size={18} />
              </a>

              <Link
                href="/signin"
                className="btn btn-light btn-large"
              >
                সাইন ইন করুন
              </Link>
            </div>

            <div className="hero-proof">
              <span>
                <ShieldCheck size={17} />
                সহজে তুলনা করুন
              </span>

              <span>
                <ChartNoAxesCombined size={17} />
                দামের পরিবর্তন দেখুন
              </span>
            </div>
          </div>

          {/* Banner Image */}
          <div className="hero-art">
            <Image
              src="/images/bazar-hero.png"
              alt="বাজারদর — নিত্যপ্রয়োজনীয় পণ্যের ব্যানার"
              width={600}
              height={500}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxWidth: "560px",
                objectFit: "contain",
                marginInline: "auto",
              }}
            />
          </div>
        </div>

        <div className="hero-bottom wrap">
          <span>
            <Sparkles size={16} />
            বাজারের দাম সম্পর্কে সচেতন থাকুন
          </span>

          <span>
            স্থানীয় বাজারে প্রকৃত দাম ভিন্ন হতে পারে।
          </span>
        </div>
      </section>

      {/* Rising Prices */}
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="section-kicker up-kicker">
              দামের ঊর্ধ্বগতি
            </span>

            <h2>
              আজ দাম বেড়েছে{" "}
              <span className="green">▲</span>
            </h2>

            <p>
              যেসব পণ্যের দামে বৃদ্ধি দেখা যাচ্ছে
            </p>
          </div>

          <span className="section-count">
            শীর্ষ {risers.length.toLocaleString("bn-BD")} পণ্য
          </span>
        </div>

        <ProductGrid products={risers} />
      </section>

      {/* Falling Prices */}
      <section className="section section-tint">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="section-kicker down-kicker">
                দামের নিম্নগতি
              </span>

              <h2>
                আজ দাম কমেছে{" "}
                <span className="red">▼</span>
              </h2>

              <p>
                কেনাকাটার আগে যেসব পণ্যের দাম কমেছে দেখে নিন
              </p>
            </div>

            <span className="section-count">
              শীর্ষ {fallers.length.toLocaleString("bn-BD")} পণ্য
            </span>
          </div>

          <ProductGrid products={fallers} />
        </div>
      </section>

      {/* All Products */}
      <section className="section wrap" id="all-products">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              সম্পূর্ণ তালিকা
            </span>

            <h2>সব পণ্য</h2>

            <p>
              আজকের বাজারদর এক নজরে—
              আপনার প্রয়োজনীয় সব পণ্য।
            </p>
          </div>

          <span className="section-count">
            মোট {products.length.toLocaleString("bn-BD")} পণ্য
          </span>
        </div>

        <ProductGrid products={products} />
      </section>

      {/* Trust Section */}
      <section className="trust-band">
        <div className="wrap trust-inner">
          <div>
            <span aria-hidden="true">🧡</span>

            <h2>
              বাজারদর জানুন, পরিকল্পনা করে কেনাকাটা করুন।
            </h2>
          </div>

          <a
            href="#all-products"
            className="btn btn-primary"
          >
            পণ্যের তালিকা দেখুন
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </>
  );
}