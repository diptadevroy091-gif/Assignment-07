"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: redirectTo,
    });

    setLoading(false);

    if (error) {
      toast.error(
        error.message || "সাইন ইন করা যায়নি"
      );
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে");

    router.push(redirectTo);
    router.refresh();
  }

  async function handleSocial(
    provider: "google" | "github"
  ) {
    await authClient.signIn.social({
      provider,
      callbackURL: redirectTo,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-4xl">
              🛒
            </div>

            <h1 className="mt-5 text-3xl font-black">
              সাইন ইন করুন
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-bold">
                ইমেইল
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                পাসওয়ার্ড
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">
              অথবা
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocial("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold hover:bg-slate-50"
            >
              <span className="font-black text-lg">
                G
              </span>
              Google
            </button>

            <button
              onClick={() => handleSocial("github")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold hover:bg-slate-50"
            >
              GitHub
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-bold text-emerald-600 hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}