"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import {
  getAuthErrorMessage,
  isValidAuthEmail,
  normalizeAuthEmail,
} from "@/lib/auth-errors";

// 1. We move the form logic into its own inner component
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Supabase is not configured. Add your environment keys first.");
      return;
    }

    const normalizedEmail = normalizeAuthEmail(email);
    if (!isValidAuthEmail(normalizedEmail)) {
      setError("Enter a valid email address (e.g. you@gmail.com).");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h1 className="mb-2 text-2xl font-bold">Sign In</h1>
            <p className="mb-6 text-gray-500 dark:text-zinc-400">
              Sign in to your account to continue shopping
            </p>

            <form className="space-y-4" onSubmit={handleSignIn}>
              {error && (
                <div className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-red-600 py-2 font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-red-600 hover:text-red-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. We export the main page, wrapping the form in Suspense
export default function LoginPage() {
  return (
    <Layout>
      <Suspense fallback={<div className="py-12 text-center">Loading login...</div>}>
        <SignInForm />
      </Suspense>
    </Layout>
  );
}