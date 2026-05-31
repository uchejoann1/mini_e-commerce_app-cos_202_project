import Link from "next/link";
import { Layout } from "@/components/Layout";
import { ProductCollection } from "@/components/ProductCollection";

export default function HomePage() {
  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-8 sm:p-12 lg:p-16 text-white">
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to T3chWorld</h1>
              <p className="text-lg text-red-100 mb-8">
                Discover the latest premium smartphones, laptops, and smartwatches from leading brands.
              </p>
              <Link
                href="/smartphones"
                className="inline-block bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "Smartphones", path: "/smartphones", icon: "📱" },
              { name: "Laptops", path: "/laptops", icon: "💻" },
              { name: "Smartwatches", path: "/watches", icon: "⌚" },
            ].map((category) => (
              <Link
                key={category.path}
                href={category.path}
                className="block p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-red-500 dark:hover:border-red-500 transition-colors"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <ProductCollection
          title="Featured Products"
          filters={{ featured: true, limit: 8 }}
          emptyMessage="No featured products available."
        />
      </div>
    </Layout>
  );
}
