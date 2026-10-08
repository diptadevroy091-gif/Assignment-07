import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden rounded-3xl bg-emerald-700 px-6 py-8 text-white shadow-xl sm:px-10 lg:px-14 lg:py-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        
        {/* Left Content */}
        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            বাংলাদেশের দৈনিক বাজার দর
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            আজকের বাজারের
            <br />
            <span className="text-emerald-200">
              সঠিক দাম জানুন
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50 sm:text-lg">
            চাল, ডাল, মাছ, মাংস, সবজি ও অন্যান্য প্রয়োজনীয়
            পণ্যের সর্বশেষ বাজার দর এক জায়গায় দেখুন।
          </p>

          <Link
            href="#সব-পণ্য"
            className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-50"
          >
            সব পণ্য দেখুন →
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-130">
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