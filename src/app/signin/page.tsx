
"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LockKeyhole } from "lucide-react";

import { authClient } from "@/lib/auth-client";

function GoogleLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.95 46.98 31.8 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.28-2.59 5.22-5.07 5.5.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.53A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
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
    setError("");
    setSocialLoading(provider);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        const message =
          result.error.message || "Social login ব্যর্থ হয়েছে.";

        setError(message);
        toast.error(message);
        setSocialLoading(null);
      }
    } catch {
      setError(
        "Social login কাজ করছে না। Provider credentials ও configuration পরীক্ষা করুন।"
      );
      toast.error("Social login-এর configuration পরীক্ষা করুন।");
      setSocialLoading(null);
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

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || socialLoading !== null}
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
            disabled={loading || socialLoading !== null}
          >
            <GoogleLogo />
            {socialLoading === "google"
              ? "Google-এ সংযোগ হচ্ছে..."
              : "Google দিয়ে চালিয়ে যান"}
          </button>

          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleSocial("github")}
            disabled={loading || socialLoading !== null}
          >
            <GitHubLogo />
            {socialLoading === "github"
              ? "GitHub-এ সংযোগ হচ্ছে..."
              : "GitHub দিয়ে চালিয়ে যান"}
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
