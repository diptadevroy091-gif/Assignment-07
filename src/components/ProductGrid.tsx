import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  if (!products.length) {
    return (
      <div className="empty-products">
        <span>🧺</span>
        <h3>কোনো পণ্য পাওয়া যায়নি</h3>
        <p>পরে আবার চেষ্টা করুন অথবা অন্য ক্যাটাগরি দেখুন।</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}