import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

import { getProducts, bnNumber } from "@/lib/products";
import { auth } from "@/lib/auth";

export const revalidate = 300;

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) {
    redirect(
      `/signin?next=${encodeURIComponent(`/product/${slug}`)}`
    );
  }

  const products = await getProducts();

  const product = products.find(
    (item) => item.id === slug || item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const markets = product.markets.length
    ? product.markets
    : [{ name: "গড় বাজারদর", price: product.averagePrice }];

  return (
    <section className="wrap detail-page">
      <div className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-summary">
        <div className="detail-visual">{product.emoji}</div>

        <div className="detail-copy">
          <div className="detail-tags">
            <span className="tag">{product.categoryName}</span>
            <span className="tag tag-muted">{product.unit}</span>
          </div>

          <h1>{product.name}</h1>
          <p>{product.description}</p>

          <div className="detail-price-grid">
            <div className="detail-price-box">
              <small>সর্বনিম্ন দাম</small>
              <strong>{bnNumber(product.minPrice)} টাকা</strong>
            </div>

            <div className="detail-price-box">
              <small>সর্বোচ্চ দাম</small>
              <strong>{bnNumber(product.maxPrice)} টাকা</strong>
            </div>

            <div className="detail-price-box">
              <small>গড় দাম</small>
              <strong>{bnNumber(product.averagePrice)} টাকা</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="market-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">স্থানভেদে দাম</span>
            <h2>বাজারভিত্তিক আজকের দাম</h2>
            <p>API-তে পাওয়া বাজারদরের তথ্য</p>
          </div>
        </div>

        <div className="market-table-wrap">
          <table className="market-table">
            <thead>
              <tr>
                <th>বাজারের নাম</th>
                <th>আজকের দাম</th>
                <th>একক</th>
              </tr>
            </thead>

            <tbody>
              {markets.map(
                (
                  market: {
                    marketName?: string;
                    market?: string;
                    name?: string;
                    bazar?: string;
                    price?: number | string;
                    currentPrice?: number | string;
                    unit?: string;
                  },
                  index: number
                ) => (
                  <tr key={index}>
                    <td>
                      📍{" "}
                      {market.marketName ??
                        market.market ??
                        market.name ??
                        market.bazar ??
                        `বাজার ${index + 1}`}
                    </td>

                    <td>
                      {bnNumber(
                        Number(
                          market.price ??
                            market.currentPrice ??
                            product.averagePrice
                        )
                      )}{" "}
                      টাকা
                    </td>

                    <td>{market.unit ?? product.unit}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        <p className="disclaimer">
          * API-তে আলাদা বাজারের তথ্য না থাকলে গড় দাম দেখানো হতে পারে।
          প্রকৃত দাম স্থানীয় বাজারে ভিন্ন হতে পারে।
        </p>
      </div>
    </section>
  );
}