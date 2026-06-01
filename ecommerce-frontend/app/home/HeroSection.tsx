"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    tag: "New Launch",
    title: "iPhone 15 Pro Max",
    subtitle: "Titanium design. A17 Pro chip. Pro camera system.",
    price: "$1,199",
    badge: "Starting from",
    cta: "Shop Now",
    href: "/smartphones",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    accent: "from-red-950/80 to-zinc-950",
    tag_color: "bg-red-600",
  },
  {
    id: 2,
    tag: "Best Seller",
    title: "MacBook Pro M3",
    subtitle: "Supercharged by M3 Max. Up to 22 hours battery.",
    price: "$3,499",
    badge: "Starting from",
    cta: "Explore Laptops",
    href: "/laptops",
    image: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg",
    accent: "from-blue-950/80 to-zinc-950",
    tag_color: "bg-blue-600",
  },
  {
    id: 3,
    tag: "Most Popular",
    title: "Apple Watch Ultra 2",
    subtitle: "Built for endurance. Precision GPS. 60hr battery.",
    price: "$799",
    badge: "Starting from",
    cta: "View Watches",
    href: "/watches",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    accent: "from-orange-950/80 to-zinc-950",
    tag_color: "bg-orange-600",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, []);

  const goTo = (idx: number) => {
    setCurrentSlide((idx + heroSlides.length) % heroSlides.length);
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % heroSlides.length);
    }, 5000);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative h-140 md:h-160 overflow-hidden bg-gray-50 dark:bg-zinc-900">
      <div className="absolute inset-0">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover transition-all duration-700"
          key={slide.id}
        />
        <div className={`absolute inset-0 bg-linear-to-r ${slide.accent} via-zinc-950/60`} />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-2xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl">
          <span
            className={`inline-block ${slide.tag_color} text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4`}
          >
            {slide.tag}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            {slide.title}
          </h1>
          <p className="text-zinc-300 text-lg mb-6 leading-relaxed">{slide.subtitle}</p>
          <div className="flex items-center gap-4 mb-8">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">{slide.badge}</p>
              <p className="text-3xl font-bold text-white">{slide.price}</p>
            </div>
          </div>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-7 py-3 rounded-xl transition-colors shadow-lg shadow-red-900/40"
          >
            {slide.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <button
        onClick={() => goTo(currentSlide - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => goTo(currentSlide + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentSlide ? "w-6 bg-red-500" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
