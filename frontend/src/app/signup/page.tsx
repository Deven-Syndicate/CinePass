"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch<{
        success: boolean;
        data: {
          token: string;
          user: {
            id: number;
            email: string;
            name: string;
            role: string;
          };
        };
      }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      localStorage.setItem("token", response.data.token);
      window.dispatchEvent(new Event("auth-change"));

      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)] opacity-[0.06] blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold"
          >
            <span className="text-3xl">🎬</span>

            <span>
              Cine<span className="text-[var(--primary)]">Pass</span>
            </span>
          </Link>

          <p className="mt-3 text-sm text-gray-500">
            Start your movie experience today.
          </p>
        </div>

        {/* Signup card */}
        <div className="cine-card overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[#0d1117] px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-bold">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join CinePass and start booking your favorite movies.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6 sm:p-8"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                autoComplete="name"
                className="cine-input"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
                className="cine-input"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                minLength={8}
                autoComplete="new-password"
                className="cine-input"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                required
                minLength={8}
                autoComplete="new-password"
                className="cine-input"
                placeholder="••••••••"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="cine-button w-full py-3.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--primary)] hover:underline"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-white"
          >
            ← Back to CinePass
          </Link>
        </div>
      </div>
    </main>
  );
}