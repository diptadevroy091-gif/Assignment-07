import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found wrap">
      <div className="not-found-icon">
        <SearchX size={46} />
      </div>

      <span className="section-kicker">404 — পৃষ্ঠা পাওয়া যায়নি</span>

      <h1>ওহ! এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।</h1>

      <p>
        লিংকটি ভুল হতে পারে অথবা পৃষ্ঠাটি সরানো হয়েছে।
        হোম পেজ থেকে আবার খুঁজে দেখুন।
      </p>

      <Link href="/" className="btn btn-primary">
        <Home size={18} />
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}