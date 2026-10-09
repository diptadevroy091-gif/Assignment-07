
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Save,
  UserRound,
  Mail,
  ShieldCheck,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const { data, error } = await authClient.getSession();

        if (!active) return;

        if (error || !data?.user) {
          router.replace("/signin?next=%2Fupdate-profile");
          return;
        }

        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setUserId(data.user.id || "");
        setEmailVerified(Boolean(data.user.emailVerified));
      } catch {
        if (active) {
          router.replace("/signin?next=%2Fupdate-profile");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "নাম আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে!");

      window.dispatchEvent(new Event("profile-updated"));

      router.refresh();
      router.push("/profile");
    } catch {
      toast.error("আপডেট করার সময় সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="form-page wrap">
        <div className="form-card">
          প্রোফাইল লোড হচ্ছে...
        </div>
      </section>
    );
  }

  return (
    <section className="form-page wrap">
      <div className="form-card">
        <Link href="/profile" className="profile-back-link">
          <ArrowLeft size={17} />
          প্রোফাইলে ফিরে যান
        </Link>

        <span className="section-kicker">
          ACCOUNT SETTINGS
        </span>

        <h1>প্রোফাইল এডিট করুন</h1>

        <p>
          আপনার অ্যাকাউন্টের তথ্য দেখুন এবং নিজের নাম পরিবর্তন করুন।
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">
              <UserRound
                size={16}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              আপনার নাম
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              disabled={saving}
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">
              <Mail
                size={16}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              ইমেইল ঠিকানা
            </label>

            <input
              id="email"
              type="email"
              value={email}
              readOnly
              aria-describedby="email-help"
            />

            <small id="email-help">
              {emailVerified
                ? "আপনার ইমেইল যাচাই করা হয়েছে।"
                : "আপনার অ্যাকাউন্টের বর্তমান ইমেইল ঠিকানা।"}
            </small>
          </div>

          <div className="account-info-panel">
            <div className="account-info-icon">
              <ShieldCheck size={20} />
            </div>

            <div className="account-info-content">
              <strong>অ্যাকাউন্টের পরিচয়</strong>
              <span>User ID</span>
              <code>{userId || "তথ্য পাওয়া যায়নি"}</code>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || !name.trim()}
          >
            <Save size={17} />
            {saving ? "সেভ হচ্ছে..." : "পরিবর্তন সেভ করুন"}
          </button>
        </form>

        <p className="form-foot">
          <Link href="/profile">
            বাতিল করে প্রোফাইলে ফিরে যান
          </Link>
        </p>
      </div>
    </section>
  );
}