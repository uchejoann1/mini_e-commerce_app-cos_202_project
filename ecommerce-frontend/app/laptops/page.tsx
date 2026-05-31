"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Layout } from "@/components/Layout";
import { ProductCollection } from "@/components/ProductCollection";

function LaptopsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <ProductCollection
          title="Laptops"
          subtitle={query ? `Search results for "${query}"` : undefined}
          filters={{ category: "laptop", q: query ?? undefined }}
          emptyMessage="No laptops found."
        />
      </div>
    </Layout>
  );
}

export default function LaptopsPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500 dark:text-zinc-400">Loading...</p>
        </div>
      </Layout>
    }>
      <LaptopsContent />
    </Suspense>
  );
}
