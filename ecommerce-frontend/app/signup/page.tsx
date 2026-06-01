"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import {
  getAuthErrorMessage,
  isValidAuthEmail,
  normalizeAuthEmail,
} from "@/lib/auth-errors";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!supabase) {
      setError("Supabase is not configured. Add your environment keys first.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const normalizedEmail = normalizeAuthEmail(email);
    if (!isValidAuthEmail(normalizedEmail)) {
      setError("Enter a valid email address (e.g. you@gmail.com).");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      return;
    }

    setSuccess("Account created. Check your email for a confirmation link, then sign in.");
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="mb-2 text-2xl font-bold">Create Account</h1>
              <p className="mb-6 text-gray-500 dark:text-zinc-400">
                Join T3chWorld to save your cart and place orders.
              </p>

              <form className="space-y-4" onSubmit={handleSignup}>
                {error && (
                  <div className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

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

                <div>
                  <label htmlFor="confirm_password" className="mb-1 block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {submitting ? "Creating Account..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-gray-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
