import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-4xl bg-emerald-700 text-white shadow-xl">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-950/30 blur-3xl" />

      <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-14">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <TrendingUp size={16} />
            বাংলাদেশের দৈনিক বাজার দর
          </span>

          <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            আজকের বাজারের
            <br />
            <span className="text-emerald-200">
              সঠিক দাম জানুন
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-emerald-50 sm:text-lg">
            চাল, ডাল, মাছ, মাংস, সবজি ও অন্যান্য প্রয়োজনীয়
            পণ্যের সর্বশেষ বাজার দর এক জায়গায় দেখুন।
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-black text-emerald-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            সব পণ্য দেখুন
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative w-full max-w-xl">
            <Image
              src="/images/bazar-hero.png"
              alt="বাজারের তাজা পণ্য"
              width={700}
              height={500}
              priority
              className="h-auto w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}