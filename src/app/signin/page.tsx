"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { LockKeyhole } from "lucide-react";

import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("ইমেইল ও পাসওয়ার্ড লিখুন।");
      toast.error("সব তথ্য পূরণ করুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      const next = searchParams.get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//")
          ? next
          : "/";

      router.push(safeNext);
      router.refresh();
    } catch {
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
      toast.error("সার্ভারের সঙ্গে সংযোগ করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(provider: "google" | "github") {
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message || "Social login ব্যর্থ হয়েছে।"
        );
      }
    } catch {
      toast.error(
        "Social login-এর credentials configure করা আছে কি না পরীক্ষা করুন।"
      );
    }
  }

  return (
    <section className="form-page wrap">
      <div className="form-card">
        <span className="section-kicker">আপনাকে স্বাগতম</span>
        <h1>সাইন ইন করুন</h1>
        <p>আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন।</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">ইমেইল</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="আপনার পাসওয়ার্ড"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            <LockKeyhole size={17} />
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="form-divider">অথবা social login</div>

        <div className="social-buttons">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleSocial("google")}
          >
            Google
          </button>

          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleSocial("github")}
          >
            GitHub
          </button>
        </div>

        <p className="form-foot">
          অ্যাকাউন্ট নেই? <Link href="/signup">সাইন আপ করুন</Link>
        </p>
      </div>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <section className="form-page wrap">
          <div className="form-card">লোড হচ্ছে...</div>
        </section>
      }
    >
      <SignInForm />
    </Suspense>
  );
}