export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">
              বাজার দর
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400 md:text-right">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে
            পরিবর্তিত হয়।
          </p>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © ২০২৬ বাজার দর. All rights reserved.
        </div>
      </div>
    </footer>
  );
}