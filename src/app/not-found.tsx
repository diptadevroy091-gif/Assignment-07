import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="text-8xl">🛒</div>

        <h1 className="mt-5 text-6xl font-black text-slate-900">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-black">
          পেজটি পাওয়া যায়নি
        </h2>

        <p className="mt-2 text-slate-500">
          আপনি যে পেজ বা পণ্যটি খুঁজছেন সেটি নেই।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    </main>
  );
}