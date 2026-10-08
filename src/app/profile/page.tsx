"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { User, Mail, Save, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type ProfileUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await authClient.getSession();

        if (result.data?.user) {
          const currentUser = result.data.user;

          setUser(currentUser);
          setName(currentUser.name || "");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Profile session error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "প্রোফাইল আপডেট করা যায়নি"
        );
        return;
      }

      setUser((previous) =>
        previous
          ? {
              ...previous,
              name: trimmedName,
            }
          : previous
      );

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");

      // Navbar-এর session/user information refresh করার জন্য
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("প্রোফাইল আপডেট করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-48 bg-slate-200" />

            <div className="p-6 sm:p-8">
              <div className="h-7 w-40 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-64 rounded bg-slate-200" />

              <div className="mt-8 h-12 rounded-xl bg-slate-200" />
              <div className="mt-5 h-12 rounded-xl bg-slate-200" />
              <div className="mt-5 h-12 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <User size={38} className="text-emerald-600" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            লগইন প্রয়োজন
          </h1>

          <p className="mt-2 text-slate-500">
            আপনার প্রোফাইল দেখতে আগে সাইন ইন করুন।
          </p>

          <Link
            href="/signin"
            className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Back */}
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          হোমে ফিরে যান
        </Link>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="bg-emerald-700 px-6 py-10 text-center text-white sm:px-10">

            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white text-4xl shadow-lg">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={45}
                  className="text-emerald-700"
                />
              )}
            </div>

            <h1 className="mt-4 text-3xl font-black">
              {user.name || "ব্যবহারকারী"}
            </h1>

            <p className="mt-1 text-emerald-100">
              {user.email}
            </p>
          </div>

          {/* Profile Details */}
          <div className="p-6 sm:p-8">

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                প্রোফাইল বিস্তারিত
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                আপনার অ্যাকাউন্টের তথ্য দেখুন এবং নাম আপডেট করুন।
              </p>
            </div>

            <form
              onSubmit={handleUpdate}
              className="mt-7 space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  নাম
                </label>

                <div className="relative">
                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="আপনার নাম লিখুন"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  ইমেইল
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-11 pr-4 text-slate-500"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  নিরাপত্তার কারণে এই পেজ থেকে ইমেইল পরিবর্তন করা যাবে না।
                </p>
              </div>

              {/* Account ID */}
              {user.id && (
                <div>
                  <label
                    htmlFor="userId"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Account ID
                  </label>

                  <input
                    id="userId"
                    type="text"
                    value={user.id}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs text-slate-400"
                  />
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={19} />

                {saving
                  ? "আপডেট হচ্ছে..."
                  : "প্রোফাইল আপডেট করুন"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}