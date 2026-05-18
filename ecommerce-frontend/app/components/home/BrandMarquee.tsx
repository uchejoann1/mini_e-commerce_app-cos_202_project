"use client";

const brandLogos = [
  { name: "Apple", color: "text-gray-700 dark:text-zinc-300" },
  { name: "Samsung", color: "text-blue-400" },
  { name: "Google", color: "text-gray-700 dark:text-zinc-300" },
  { name: "Dell", color: "text-gray-700 dark:text-zinc-300" },
  { name: "Lenovo", color: "text-red-400" },
  { name: "ASUS", color: "text-gray-700 dark:text-zinc-300" },
  { name: "Garmin", color: "text-emerald-400" },
  { name: "OnePlus", color: "text-red-400" },
];

export function BrandMarquee() {
  return (
    <section className="border-y border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 py-8 overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-xs text-gray-400 dark:text-zinc-600 uppercase tracking-widest text-center">
          Trusted brands
        </p>
      </div>
      <div className="flex items-center gap-12 px-8 overflow-x-auto scrollbar-hide">
        {[...brandLogos, ...brandLogos].map((brand, i) => (
          <span
            key={i}
            className={`text-xl font-bold whitespace-nowrap ${brand.color} opacity-50 hover:opacity-90 transition-opacity cursor-default`}
          >
            {brand.name}
          </span>
        ))}
      </div>
    </section>
  );
}
