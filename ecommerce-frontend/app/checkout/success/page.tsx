"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";
import { Layout } from "@/components/Layout";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 dark:text-zinc-400 mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>

            {orderId && (
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
                  Order ID
                </p>
                <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white break-all">
                  {orderId}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
              You will receive an order confirmation email shortly with tracking information.
            </p>

            <Link
              href="/smartphones"
              className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 dark:text-zinc-400">Loading...</p>
        </div>
      </Layout>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
