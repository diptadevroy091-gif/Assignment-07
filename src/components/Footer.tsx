
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand footer-logo">
            <span className="brand-icon">
              <Image
                src="/images/logo-icon.png"
                alt="বাজারদর লোগো"
                width={44}
                height={44}
                className="footer-brand-logo"
                sizes="44px"
              />
            </span>

            <span className="brand-copy">
              <strong>বাজারদর</strong>
              <small>সচেতন কেনাকাটার সঙ্গী</small>
            </span>
          </Link>

          <p>
            বাজারদর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

        <div className="footer-note">
          <span className="footer-note-icon">
            <ArrowUpRight size={17} />
          </span>

          <p>
            সকল দাম সম্ভাব্য; বাজারের অবস্থার ওপর নির্ভর করে
            পরিবর্তিত হতে পারে।
          </p>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} বাজারদর। সর্বস্বত্ব সংরক্ষিত।
        </span>

        <Link href="/">হোম পেজে ফিরে যান ↑</Link>
      </div>
    </footer>
  );
}
