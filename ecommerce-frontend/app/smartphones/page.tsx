import { Layout } from "../components/Layout";
import { ProductCollection } from "../components/ProductCollections";
import { searchCatalog } from "../data/catalog";

export default function SmartphonesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q;
  const products = searchCatalog("smartphone", query);

  return (
    <Layout>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <ProductCollection
          title="Smartphones"
          subtitle={query ? `Search results for "${query}"` : undefined}
          products={products}
          emptyMessage="No smartphones found."
        />
      </div>
    </Layout>
  );
}
