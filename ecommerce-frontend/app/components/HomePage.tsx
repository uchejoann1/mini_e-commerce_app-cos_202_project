"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { fetchProducts } from "@/lib/api";
import { Layout } from "@/components/Layout";

import { HeroSection } from "../home/HeroSection";
import { TrustBadges } from "../home/TrustBadges";
import { CategoryNav } from "../home/CategoryNav";
import { DealsSection } from "../home/DealsSection";
import { BrandMarquee } from "../home/BrandMarquee";
import { FeaturedProducts } from "../home/FeaturedProducts";
import { NewsletterSection } from "../home/NewsletterSection";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [featured, deals] = await Promise.all([
          fetchProducts({ featured: true, limit: 8 }),
          fetchProducts({ isDeal: true, limit: 4 }),
        ]);

        if (!active) return;
        setProducts(featured ?? []);
        setDealProducts(deals ?? []);
      } catch (error) {
        console.error("Failed to load homepage products:", error);
        if (!active) return;
        setProducts([]);
        setDealProducts([]);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Layout>
      <main className="flex flex-col min-h-screen pb-10">
        <HeroSection />
        <TrustBadges />
        <CategoryNav />
        <DealsSection dealProducts={dealProducts} />
        <BrandMarquee />
        <FeaturedProducts products={products} />
        <NewsletterSection />
      </main>
    </Layout>
  );
}
