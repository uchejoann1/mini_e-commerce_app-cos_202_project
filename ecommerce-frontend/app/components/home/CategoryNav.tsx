"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryNav() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          {
            label: "Smartphones",
            href: "/smartphones",
            image: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
            desc: "Latest flagship & mid-range phones",
            count: "6 products",
          },
          {
            label: "Laptops",
            href: "/laptops",
            image: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg",
            desc: "Premium ultrabooks & gaming rigs",
            count: "6 products",
          },
          {
            label: "Smartwatches",
            href: "/watches",
            image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
            desc: "Track health & stay connected",
            count: "4 products",
          },
        ].map((cat) => (
          <Link
            key={cat.label}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-300"
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-xs text-zinc-400 mb-1">{cat.count}</p>
              <h3 className="text-xl font-bold text-white mb-0.5">{cat.label}</h3>
              <p className="text-xs text-zinc-400">{cat.desc}</p>
            </div>
            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
