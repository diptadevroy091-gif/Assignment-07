
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  ChevronRight,
  Mail,
  Pencil,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect("/signin?next=%2Fprofile");
  }

  const user = session.user;
  const name = user.name?.trim() || "নতুন ব্যবহারকারী";
  const firstLetter = name.charAt(0).toUpperCase();
  const email = user.email || "ইমেইল পাওয়া যায়নি";

  return (
    <main className="profile-dashboard">
      <div className="profile-orb profile-orb-one" />
      <div className="profile-orb profile-orb-two" />

      <div className="profile-shell">
        <div className="profile-topbar">
          <Link href="/" className="profile-back-link">
            <ArrowLeft size={17} />
            বাজারদরে ফিরে যান
          </Link>

          <span className="profile-secure-label">
            <ShieldCheck size={15} />
            Secure Account
          </span>
        </div>

        <header className="profile-heading">
          <div className="profile-heading-icon">
            <Sparkles size={19} />
          </div>

          <p className="profile-eyebrow">YOUR PERSONAL SPACE</p>

          <h1>
            আমার <span>প্রোফাইল</span>
          </h1>

          <p className="profile-heading-description">
            আপনার অ্যাকাউন্টের তথ্য এক জায়গায় দেখুন এবং নিজের মতো করে আপডেট করুন।
          </p>
        </header>

        <section className="profile-main-grid">
          <article className="profile-hero-card">
            <div className="profile-card-top">
              <span className="profile-status-pill">
                <span className="profile-status-dot" />
                Account active
              </span>

              <span className="profile-card-sparkle">
                <Sparkles size={20} />
              </span>
            </div>

            <div className="profile-identity">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar-ring">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`${name} profile`}
                      width={112}
                      height={112}
                      unoptimized
                      className="profile-avatar-photo"
                    />
                  ) : (
                    <span className="profile-avatar-initial">
                      {firstLetter}
                    </span>
                  )}
                </div>

                <span
                  className="profile-avatar-status"
                  title="Account active"
                />
              </div>

              <div className="profile-identity-text">
                <span className="profile-welcome">WELCOME BACK</span>
                <h2>{name}</h2>
                <p>
                  <BadgeCheck size={16} />
                  BazarDor member
                </p>
              </div>
            </div>

            <div className="profile-hero-divider" />

            <div className="profile-hero-bottom">
              <div>
                <span className="profile-mini-label">MEMBER PROFILE</span>
                <strong>আপনার পরিচয়, আপনার অ্যাকাউন্ট</strong>
              </div>

              <Link
                href="/update-profile"
                className="profile-edit-button"
              >
                <Pencil size={16} />
                এডিট করুন
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>

          <aside className="profile-side-card">
            <div className="profile-side-icon">
              <ShieldCheck size={22} />
            </div>

            <span className="profile-side-eyebrow">ACCOUNT SECURITY</span>
            <h3>আপনার অ্যাকাউন্ট</h3>
            <p>
              আপনার অ্যাকাউন্টের তথ্য নিয়ন্ত্রণ করুন এবং প্রয়োজন অনুযায়ী আপডেট
              রাখুন।
            </p>

            <div className="profile-security-status">
              <span className="profile-security-check">
                <ShieldCheck size={17} />
              </span>
              <div>
                <strong>লগইন সেশন সক্রিয়</strong>
                <span>আপনি বর্তমানে সাইন ইন করেছেন</span>
              </div>
            </div>

            <Link
              href="/update-profile"
              className="profile-side-link"
            >
              প্রোফাইল সেটিংস
              <ChevronRight size={18} />
            </Link>
          </aside>
        </section>

        <section className="profile-details-section">
          <div className="profile-section-heading">
            <div>
              <span className="profile-section-kicker">
                PERSONAL INFORMATION
              </span>
              <h2>আপনার তথ্য</h2>
            </div>

            <Link
              href="/update-profile"
              className="profile-text-edit"
            >
              <Pencil size={15} />
              পরিবর্তন করুন
            </Link>
          </div>

          <div className="profile-info-grid">
            <article className="profile-info-card">
              <div className="profile-info-icon profile-info-icon-purple">
                <UserRound size={21} />
              </div>

              <div className="profile-info-copy">
                <span>সম্পূর্ণ নাম</span>
                <strong>{name}</strong>
                <small>আপনার অ্যাকাউন্টের নাম</small>
              </div>

              <span className="profile-info-arrow">
                <ArrowUpRight size={17} />
              </span>
            </article>

            <article className="profile-info-card">
              <div className="profile-info-icon profile-info-icon-orange">
                <Mail size={21} />
              </div>

              <div className="profile-info-copy">
                <span>ইমেইল ঠিকানা</span>
                <strong className="profile-email-value">{email}</strong>
                <small>আপনার লগইন ইমেইল</small>
              </div>

              <span className="profile-info-arrow">
                <ArrowUpRight size={17} />
              </span>
            </article>
          </div>
        </section>

        <section className="profile-bottom-banner">
          <div className="profile-banner-icon">
            <Camera size={23} />
          </div>

          <div className="profile-banner-copy">
            <h3>আপনার প্রোফাইল, আপনার পরিচয়</h3>
            <p>
              আপনার নাম আপডেট করুন এবং ব্যক্তিগত তথ্য সবসময় হালনাগাদ রাখুন।
            </p>
          </div>

          <Link href="/update-profile" className="profile-banner-button">
            তথ্য আপডেট
            <ArrowUpRight size={17} />
          </Link>
        </section>

        <footer className="profile-page-footer">
          <span>BAZARDOR</span>
          <span>আপনার বাজার, আপনার পছন্দ।</span>
        </footer>
      </div>
    </main>
  );
}