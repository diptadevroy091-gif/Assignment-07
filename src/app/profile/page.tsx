import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Mail,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin?callbackUrl=/profile");
  }

  const user = session.user;

  const initial =
    user.name?.trim().charAt(0) || "U";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-4xl font-black text-emerald-700">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <h1 className="mt-5 text-3xl font-black">
              {user.name || "ব্যবহারকারী"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              আপনার বাজার দর প্রোফাইল
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <UserRound
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  নাম
                </p>
                <p className="font-bold text-slate-800">
                  {user.name || "নাম দেওয়া হয়নি"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Mail
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  ইমেইল
                </p>
                <p className="break-all font-bold text-slate-800">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/profile/update"
            className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-black text-white hover:bg-emerald-700"
          >
            তথ্য আপডেট করুন
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}