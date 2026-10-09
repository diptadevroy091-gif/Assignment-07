"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
Menu,
X,
ArrowUpRight,
ArrowDownRight,
Minus,
UserRound,
LogOut,
Pencil,
ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const categories = [
{ name: "চাল", slug: "chal", icon: "🍚" },
{ name: "ডাল", slug: "dal", icon: "🫘" },
{ name: "তেল", slug: "tel", icon: "🫗" },
{ name: "সবজি", slug: "sobji", icon: "🥬" },
{ name: "মাছ", slug: "mach", icon: "🐟" },
{ name: "মাংস", slug: "mangsho", icon: "🍖" },
{ name: "ডিম-দুধ", slug: "dim-dui", icon: "🥚" },
{ name: "মসলা", slug: "mosla", icon: "🌶️" },
];

type TickerItem = {
id: string;
name: string;
price: number;
change: number;
unit: string;
};

type ApiProduct = {
id?: string | number;
name?: string;
nameBn?: string;
title?: string;
today?: string | number;
price?: string | number;
currentPrice?: string | number;
averagePrice?: string | number;
change?:
| {
pct?: string | number;
dir?: string;
}
| string
| number;
changePercent?: string | number;
unit?: string;
};

type ApiResponse =
| ApiProduct[]
| {
data?: ApiProduct[];
products?: ApiProduct[];
items?: ApiProduct[];
};

type SessionResult = Awaited<
ReturnType<typeof authClient.getSession>

> ;

function toNumber(value: unknown, fallback = 0): number {
if (typeof value === "number") {
return Number.isFinite(value) ? value : fallback;
}

if (typeof value === "string") {
const parsed = Number(value.replace(/[^\d.-]/g, ""));
return Number.isFinite(parsed) ? parsed : fallback;
}

return fallback;
}

export default function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);
const [profileMenuOpen, setProfileMenuOpen] = useState(false);
const [date, setDate] = useState("");
const [ticker, setTicker] = useState<TickerItem[]>([]);
const [session, setSession] = useState<
SessionResult["data"] | null

> (null);

useEffect(() => {
let active = true;


setDate(
  new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
);

async function loadSession() {
  try {
    const result = await authClient.getSession();

    if (active) {
      setSession(result.data?.session ? result.data : null);
    }
  } catch {
    if (active) setSession(null);
  }
}

async function loadTicker() {
  try {
    const response = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/products"
    );

    if (!response.ok) {
      throw new Error("Unable to load market prices");
    }

    const data = (await response.json()) as ApiResponse;

    if (!active) return;

    const items: ApiProduct[] = Array.isArray(data)
      ? data
      : data.data ?? data.products ?? data.items ?? [];

    const tickerItems = items.slice(0, 12).map((item, index) => {
      const changeValue =
        typeof item.change === "object" && item.change !== null
          ? item.change.pct
          : item.change ?? item.changePercent ?? 0;

      let change = toNumber(changeValue);

      if (
        typeof item.change === "object" &&
        item.change !== null &&
        typeof item.change.dir === "string"
      ) {
        const direction = item.change.dir.toLowerCase();

        if (direction === "down" || direction === "negative") {
          change = -Math.abs(change);
        } else if (
          direction === "up" ||
          direction === "positive"
        ) {
          change = Math.abs(change);
        }
      }

      return {
        id: String(item.id ?? index),
        name: String(
          item.nameBn ?? item.name ?? item.title ?? "পণ্য"
        ),
        price: toNumber(
          item.today ??
            item.price ??
            item.currentPrice ??
            item.averagePrice
        ),
        change,
        unit: String(item.unit ?? "একক"),
      };
    });

    setTicker(tickerItems);
  } catch (error) {
    console.error("BazarDor ticker API error:", error);

    if (active) setTicker([]);
  }
}

function refreshSessionOnFocus() {
  if (document.visibilityState === "visible") {
    void loadSession();
  }
}

void loadSession();
void loadTicker();

window.addEventListener("focus", refreshSessionOnFocus);
document.addEventListener(
  "visibilitychange",
  refreshSessionOnFocus
);

return () => {
  active = false;
  window.removeEventListener("focus", refreshSessionOnFocus);
  document.removeEventListener(
    "visibilitychange",
    refreshSessionOnFocus
  );
};


}, []);

const user = session?.user;
const userName = user?.name?.trim() || user?.email || "আমার প্রোফাইল";
const userImage = user?.image;
const firstLetter = userName.charAt(0).toUpperCase();

function closeMenus() {
setMenuOpen(false);
setProfileMenuOpen(false);
}

async function handleSignOut() {
try {
await authClient.signOut();
setSession(null);
closeMenus();
window.location.href = "/";
} catch (error) {
console.error("Sign out failed:", error);
window.location.href = "/signin";
}
}

return ( <header className="site-header"> <div className="wrap nav-top"> <Link
       href="/"
       className="brand"
       onClick={closeMenus}
       aria-label="বাজারদর হোম"
     > <span className="brand-icon"> <Image
           src="/images/logo-icon.png"
           alt="বাজারদর লোগো"
           width={44}
           height={44}
           priority
           className="brand-logo"
           sizes="44px"
         /> </span>


      <span className="brand-copy">
        <strong>বাজারদর</strong>
        <small>{date || "আজকের বাজারদর"}</small>
      </span>
    </Link>

    <button
      type="button"
      className="menu-toggle"
      aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
      aria-expanded={menuOpen}
      onClick={() => {
        setMenuOpen((open) => !open);
        setProfileMenuOpen(false);
      }}
    >
      {menuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>

    <div
      className={`nav-actions ${menuOpen ? "nav-actions-open" : ""}`}
    >
      {session?.session ? (
        <>
          <div className="profile-menu">
            <button
              type="button"
              className="profile-trigger"
              aria-label="প্রোফাইল মেনু খুলুন"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              onClick={() =>
                setProfileMenuOpen((open) => !open)
              }
            >
              <span className="profile-avatar">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={`${userName} প্রোফাইল ছবি`}
                    className="profile-avatar-image"
                  />
                ) : (
                  <span>{firstLetter}</span>
                )}
              </span>

              <span className="profile-trigger-name">
                {userName}
              </span>

              <ChevronDown
                size={16}
                className={`profile-chevron ${
                  profileMenuOpen ? "profile-chevron-open" : ""
                }`}
              />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown" role="menu">
                <div className="profile-dropdown-user">
                  <span className="profile-avatar profile-avatar-large">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt=""
                        className="profile-avatar-image"
                      />
                    ) : (
                      <span>{firstLetter}</span>
                    )}
                  </span>

                  <span className="profile-user-details">
                    <strong>{userName}</strong>
                    {user?.email && (
                      <small>{user.email}</small>
                    )}
                  </span>
                </div>

                <div className="profile-dropdown-divider" />

                <Link
                  href="/profile"
                  className="profile-dropdown-link"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  <UserRound size={17} />
                  প্রোফাইল দেখুন
                </Link>

                <Link
                  href="/update-profile"
                  className="profile-dropdown-link"
                  role="menuitem"
                  onClick={closeMenus}
                >
                  <Pencil size={17} />
                  প্রোফাইল এডিট করুন
                </Link>

                <div className="profile-dropdown-divider" />

                <button
                  type="button"
                  className="profile-dropdown-link profile-signout"
                  role="menuitem"
                  onClick={handleSignOut}
                >
                  <LogOut size={17} />
                  সাইন আউট
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            href="/signin"
            className="btn btn-light btn-sm"
            onClick={closeMenus}
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="btn btn-primary btn-sm"
            onClick={closeMenus}
          >
            সাইন আপ
          </Link>
        </>
      )}
    </div>
  </div>

  <nav
    className={`category-nav ${menuOpen ? "category-nav-open" : ""}`}
    aria-label="পণ্যের ক্যাটাগরি"
  >
    <div className="wrap category-nav-inner">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={closeMenus}
          className="category-link"
        >
          <span aria-hidden="true">{category.icon}</span>
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  </nav>

  <div className="ticker">
    <div className="ticker-label">আজকের দর</div>

    <div className="ticker-window">
      <div className="ticker-track">
        {ticker.length > 0 ? (
          [...ticker, ...ticker].map((item, index) => (
            <span
              className="ticker-item"
              key={`${item.id}-${index}`}
            >
              <b>{item.name}</b>

              <span>
                {item.price.toLocaleString("bn-BD")} টাকা
              </span>

              <span
                className={
                  item.change > 0
                    ? "ticker-up"
                    : item.change < 0
                      ? "ticker-down"
                      : "ticker-flat"
                }
              >
                {item.change > 0 ? (
                  <ArrowUpRight size={13} />
                ) : item.change < 0 ? (
                  <ArrowDownRight size={13} />
                ) : (
                  <Minus size={12} />
                )}

                {Math.abs(item.change).toLocaleString("bn-BD")}%
              </span>

              <small>{item.unit}</small>
            </span>
          ))
        ) : (
          <span className="ticker-item">
            বাজারদরের তথ্য লোড হচ্ছে…
          </span>
        )}
      </div>
    </div>
  </div>
</header>


);
}
