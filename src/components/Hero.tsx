
import Link from "next/link";
import { ArrowDown, ArrowUpRight, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-700/30 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900/70 px-4 py-2 text-sm font-semibold text-lime-300">
            <TrendingUp size={17} />
            বাংলাদেশের বাজারদর এক জায়গায়
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            বাজার বুঝুন,
            <span className="mt-2 block text-lime-300">
              সঠিক দামে কিনুন।
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-emerald-100 sm:text-lg">
            চাল, ডাল, তেল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের
            বাজারদর দেখুন সহজেই। কেনাকাটার আগে জেনে নিন
            আজকের দাম।
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 font-black text-emerald-950 transition hover:bg-lime-200"
            >
              সব পণ্য দেখুন
              <ArrowDown size={18} />
            </Link>

            <Link
              href="/category/chal"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-6 py-3.5 font-bold text-white transition hover:bg-emerald-900"
            >
              ক্যাটাগরি দেখুন
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 border-t border-emerald-800 pt-6">
            <div>
              <p className="text-2xl font-black text-lime-300">সহজ</p>
              <p className="mt-1 text-sm text-emerald-200">
                দামের তুলনা
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-lime-300">একসাথে</p>
              <p className="mt-1 text-sm text-emerald-200">
                প্রয়োজনীয় পণ্য
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-lime-300">বাংলায়</p>
              <p className="mt-1 text-sm text-emerald-200">
                সহজ তথ্য
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rounded-4xl bg-lime-300/10 blur-2xl" />

          <div className="relative overflow-hidden rounded-4xl border border-emerald-800 bg-emerald-900 p-5 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-200">
                  আপনার বাজার পরিকল্পনা
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  আজকের বাজার
                </h2>
              </div>

              <span className="rounded-2xl bg-lime-300 p-3 text-3xl">
                🛒
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { emoji: "🍚", name: "চাল", detail: "প্রয়োজনীয় খাদ্য" },
                { emoji: "🫘", name: "ডাল", detail: "প্রোটিনের উৎস" },
                { emoji: "🥬", name: "সবজি", detail: "প্রতিদিনের পুষ্টি" },
                { emoji: "🐟", name: "মাছ", detail: "দৈনন্দিন খাবার" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-emerald-800 bg-emerald-950/70 p-4"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="mt-3 font-black">{item.name}</h3>
                  <p className="mt-1 text-xs text-emerald-200">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-lime-300 p-4 text-emerald-950">
              <TrendingUp size={24} />
              <div>
                <p className="font-black">কেনার আগে দাম যাচাই করুন</p>
                <p className="mt-1 text-sm">
                  পরিকল্পিত কেনাকাটা, সহজ হিসাব
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}