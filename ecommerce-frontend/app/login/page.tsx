import Link from "next/link";
import { Layout } from "../components/Layout";

export default function LoginPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <h1 className="mb-2 text-2xl font-bold">Sign In</h1>
              <p className="mb-6 text-gray-500 dark:text-zinc-400">
                Sign in to your account to continue shopping
              </p>

              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
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
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  />
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-red-600 py-2 font-semibold text-white transition-colors hover:bg-red-500"
                >
                  Sign In
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
    </Layout>
  );
}
