"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  Menu,
  ShoppingCart,
  X,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

const categories = [
  {
    name: "চাল",
    slug: "chal",
    icon: "🌾",
  },
  {
    name: "ডাল",
    slug: "dal",
    icon: "🫘",
  },
  {
    name: "তেল",
    slug: "tel",
    icon: "🫗",
  },
  {
    name: "সবজি",
    slug: "sobji",
    icon: "🥬",
  },
  {
    name: "মাছ",
    slug: "mach",
    icon: "🐟",
  },
  {
    name: "মাংস",
    slug: "mangsho",
    icon: "🥩",
  },
  {
    name: "ডিম",
    slug: "dim",
    icon: "🥚",
  },
  {
    name: "মসলা",
    slug: "mosla",
    icon: "🌶️",
  },
];

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [mobileOpen, setMobileOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] =
    useState(false);

  const [session, setSession] = useState<{
    user?: SessionUser;
  } | null>(null);

  useEffect(() => {
    const formatter =
      new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    setDate(formatter.format(new Date()));

    async function loadSession() {
      try {
        const response = await fetch(
          "/api/auth/get-session",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setSession(null);
          return;
        }

        const data = await response.json();

        setSession(data);
      } catch {
        setSession(null);
      }
    }

    loadSession();
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setSession(null);
      setProfileOpen(false);
      setMobileOpen(false);

      router.push("/");
      router.refresh();
    }
  }

  const user = session?.user;

  const userName =
    user?.name || "ব্যবহারকারী";

  const userInitial =
    userName.trim().charAt(0) || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main */}
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
              🛒
            </span>

            <div className="min-w-0">
              <div className="text-xl font-black text-emerald-700">
                বাজার দর
              </div>

              <div className="truncate text-xs text-slate-500">
                {date || "আজকের বাজার"}
              </div>
            </div>
          </Link>

          {/* Desktop auth */}
          <div className="hidden items-center md:flex">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (value) => !value
                    )
                  }
                  className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition hover:bg-slate-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-black text-emerald-700 ring-2 ring-emerald-100">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  <div className="text-left">
                    <p className="max-w-40 truncate text-sm font-bold text-slate-900">
                      {userName}
                    </p>

                    <p className="text-xs text-slate-500">
                      অ্যাকাউন্ট
                    </p>
                  </div>

                  <ChevronDown
                    size={17}
                    className={`text-slate-500 transition ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-black text-emerald-700">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={userName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            userInitial
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {userName}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <UserRound size={17} />
                        প্রোফাইল দেখুন
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={17} />
                        সাইন আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="ml-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                (value) => !value
              )
            }
            className="rounded-xl p-2 hover:bg-slate-100 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Desktop categories */}
        <nav className="hidden items-center gap-2 overflow-x-auto pb-3 md:flex">
          <Link
            href="/"
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ${
              pathname === "/"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <ShoppingCart
              size={15}
              className="mr-1 inline"
            />
            সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ${
                pathname ===
                `/category/${category.slug}`
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {category.icon} {category.name}
            </Link>
          ))}
        </nav>

        {/* Mobile */}
        {mobileOpen && (
          <div className="border-t border-slate-100 py-4 md:hidden">
            {user && (
              <div className="mb-4 rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white font-black text-emerald-700">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {userName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl bg-white p-3 text-center text-sm font-bold"
                  >
                    👤 প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-xl bg-red-50 p-3 text-center text-sm font-bold text-red-600"
                  >
                    সাইন আউট
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={`rounded-xl p-3 text-center text-sm font-semibold ${
                  pathname === "/"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100"
                }`}
              >
                🛒 সব পণ্য
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={`rounded-xl p-3 text-center text-sm font-semibold ${
                    pathname ===
                    `/category/${category.slug}`
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>

            {!user && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/signin"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="rounded-xl bg-slate-100 p-3 text-center text-sm font-bold"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="rounded-xl bg-emerald-600 p-3 text-center text-sm font-bold text-white"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}