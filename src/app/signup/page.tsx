"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserRoundPlus } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("সব তথ্য পূরণ করুন।");
      toast.error("সব তথ্য পূরণ করুন।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড আরও শক্তিশালী করুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
      router.push("/signin");
      router.refresh();
    } catch {
      setError("রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
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
      toast.error("Social provider configure করা আছে কি না দেখুন।");
    }
  }

  return (
    <section className="form-page wrap">
      <div className="form-card">
        <span className="section-kicker">নতুন অ্যাকাউন্ট</span>
        <h1>সাইন আপ করুন</h1>
        <p>বাজারদর দেখতে আপনার অ্যাকাউন্ট তৈরি করুন।</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">আপনার নাম</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="আপনার পূর্ণ নাম"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
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
            <UserRoundPlus size={17} />
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন</Link>
        </p>
      </div>
    </section>
  );
}