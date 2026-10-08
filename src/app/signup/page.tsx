"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [socialLoading, setSocialLoading] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("আপনার নাম দিন।");
      return;
    }

    if (!email.trim()) {
      toast.error("ইমেইল দিন।");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।"
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });

      if (result.error) {
        toast.error(
          result.error.message ||
            "অ্যাকাউন্ট তৈরি করা যায়নি।"
        );
        return;
      }

      toast.success(
        "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।"
      );

      router.push("/signin");
    } catch {
      toast.error(
        "অ্যাকাউন্ট তৈরির সময় সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(
    provider: "google" | "github"
  ) {
    setSocialLoading(provider);

    try {
      const result =
        await authClient.signIn.social({
          provider,
          callbackURL: "/",
        });

      if (result?.error) {
        toast.error(
          result.error.message ||
            "সোশ্যাল সাইন আপ করা যায়নি।"
        );
      }
    } catch {
      toast.error(
        "সোশ্যাল সাইন আপে সমস্যা হয়েছে।"
      );
    } finally {
      setSocialLoading("");
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
              🛒
            </div>

            <h1 className="mt-5 text-3xl font-black">
              সাইন আপ করুন
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              নতুন বাজার দর অ্যাকাউন্ট তৈরি করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-bold">
                নাম
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="আপনার নাম"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

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
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                পাসওয়ার্ড
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-black text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {loading
                ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                : "সাইন আপ"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400">
              অথবা
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() =>
                handleSocial("google")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                "G"
              )}
              Google
            </button>

            <button
              type="button"
              disabled={!!socialLoading}
              onClick={() =>
                handleSocial("github")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold hover:bg-slate-50 disabled:opacity-50"
            >
              {socialLoading === "github" ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <span className="text-xs font-black">GH</span>
              )}
              GitHub
            </button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-black text-emerald-600"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}