import { Layout } from "@/components/Layout";
import { ProductCollection } from "@/components/ProductCollection";

export default async function SmartwatchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q;

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <ProductCollection
          title="Smartwatches"
          subtitle={query ? `Search results for "${query}"` : undefined}
          filters={{ category: "smartwatch", q: query }}
          emptyMessage="No smartwatches found."
        />
      </div>
    </Layout>
  );
}
