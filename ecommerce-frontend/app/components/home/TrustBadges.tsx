"use client";

import { Shield, Truck, Zap, RotateCcw } from "lucide-react";

export function TrustBadges() {
  return (
    <section className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $500" },
            { icon: RotateCcw, title: "30-Day Returns", desc: "No questions asked" },
            { icon: Shield, title: "2-Year Warranty", desc: "On all products" },
            { icon: Zap, title: "Fast Delivery", desc: "2-3 business days" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 py-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800">
                <Icon className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
