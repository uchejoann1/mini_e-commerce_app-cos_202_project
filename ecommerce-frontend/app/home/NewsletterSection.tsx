"use client";

export function NewsletterSection() {
  return (
    <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pb-14 mt-14">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-red-950 via-zinc-900 to-zinc-900 border border-red-900/30 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Newsletter
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Stay ahead of the curve.
          </h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Get early access to new products, exclusive deals, and tech news delivered straight to your inbox.
          </p>
          <div className="flex gap-3 max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0 text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
