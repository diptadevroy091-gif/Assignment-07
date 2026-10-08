export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>

              <span className="text-2xl font-black">
                বাজার দর
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              বাংলাদেশের দৈনিক বাজারদর সহজে দেখুন।
              সঠিক তথ্যের মাধ্যমে আপনার দৈনন্দিন বাজার
              আরও সহজ হোক।
            </p>
          </div>

          <div>
            <h3 className="font-bold">দ্রুত লিংক</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <a href="/">হোম</a>
              <a href="/category/chal">চাল</a>
              <a href="/category/dal">ডাল</a>
              <a href="/category/sobji">সবজি</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">বাজার দর</h3>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              প্রতিদিনের প্রয়োজনীয় পণ্যের বাজারমূল্য
              এক জায়গায়।
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
         © ২০২৬ বাজার দর. All rights reserved.
        </div>
      </div>
    </footer>
  );
}