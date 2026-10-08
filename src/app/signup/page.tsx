"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("সবগুলো তথ্য পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          callbackURL: "/",
        });

      if (error) {
        toast.error(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(
    provider: "google" | "github"
  ) {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Social login error:", error);

      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন আপ করা যায়নি`
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-4xl">
              🛒
            </div>

            <h1 className="mt-5 text-3xl font-black text-slate-900">
              সাইন আপ করুন
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              নতুন বাজার দর অ্যাকাউন্ট তৈরি করুন
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                নাম
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="আপনার নাম"
                autoComplete="name"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
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
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                পাসওয়ার্ড
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "সাইন আপ"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">
              অথবা
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">

            {/* Google */}
            <button
              type="button"
              onClick={() =>
                handleSocial("google")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="text-lg font-black">
                G
              </span>

              Google
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() =>
                handleSocial("github")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span className="text-lg font-black">
                ●
              </span>

              GitHub
            </button>
          </div>

          {/* Sign In */}
          <p className="mt-7 text-center text-sm text-slate-500">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}

            <Link
              href="/signin"
              className="font-bold text-emerald-600 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}