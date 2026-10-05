"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setLoggedIn(Boolean(localStorage.getItem("token")));
    };

    updateAuthState();

    window.addEventListener("auth-change", updateAuthState);

    return () => {
      window.removeEventListener("auth-change", updateAuthState);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#07090d]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="text-2xl">🎬</span>

          <span>
            Cine<span className="text-[var(--primary)]">Pass</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm text-gray-300 hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-300 hover:text-white"
          >
            Movies
          </Link>

          {loggedIn && (
            <Link
              href="/booking"
              className="text-sm text-gray-300 hover:text-white"
            >
              My Bookings
            </Link>
          )}

          {loggedIn && (
            <Link
              href="/scanner"
              className="text-sm text-gray-300 hover:text-white"
            >
              Scanner
            </Link>
          )}

          {!loggedIn ? (
            <Link href="/login" className="cine-button text-sm">
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="cine-button-secondary text-sm"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-gray-300 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-[#0b0e13] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-gray-300 hover:bg-[#151a23] hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-gray-300 hover:bg-[#151a23] hover:text-white"
            >
              Movies
            </Link>

            {loggedIn && (
              <Link
                href="/booking"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-300 hover:bg-[#151a23] hover:text-white"
              >
                My Bookings
              </Link>
            )}

            {loggedIn && (
              <Link
                href="/scanner"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-gray-300 hover:bg-[#151a23] hover:text-white"
              >
                Scanner
              </Link>
            )}

            {!loggedIn ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="cine-button text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="cine-button-secondary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
