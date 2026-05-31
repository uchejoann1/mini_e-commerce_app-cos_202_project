"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, Cpu, ChevronDown, LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";

// Navigation menu mapping: display label -> route path
interface NavMenu {
  [key: string]: string;
}

const navMenu: NavMenu = {
  "Home": "/",
  "Smartphones": "/smartphones",
  "Laptops": "/laptops",
  "Watches": "/watches",
};

export function Navbar() {
  // Get the current logged-in user and signOut function from auth context
  const { user, signOut } = useAuth();
  // Get the cart item count to display in the badge
  const { cartCount } = useCart();
  // Get current theme and toggle function for light/dark mode switching
  const { theme, toggleTheme } = useTheme();
  // Navigate programmatically (used after sign-out and search)
  const router = useRouter();
  // Current pathname used to highlight the active nav link
  const pathname = usePathname();

  // Search input value for the search bar
  const [searchQuery, setSearchQuery] = useState("");
  // Whether the mobile hamburger menu is open
  const [mobileOpen, setMobileOpen] = useState(false);
  // Whether the page has been scrolled (adds shadow to navbar)
  const [scrolled, setScrolled] = useState(false);
  // Whether the user dropdown menu is open (signed-in users only)
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Listen for scroll events to toggle the navbar shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the user navigates to a new page
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle search form submission — navigates to smartphones page with query param
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/smartphones?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Sign the user out, close the dropdown, and redirect to home
  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    router.push("/");
  };

  // Helper: returns active/inactive class strings for nav links based on current path
  const navLinkClass = (path: string) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      pathname === path
        ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800"
        : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800/60 ${
        scrolled ? "shadow-md shadow-black/5 dark:shadow-black/30" : ""
      }`}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {/* Logo — links back to home */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 group-hover:bg-red-500 transition-colors">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              T3ch<span className="text-red-500">World</span>
            </span>
          </Link>

          {/* Desktop nav links — rendered from navMenu object */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {Object.entries(navMenu).map(([label, path]) => (
              <Link key={path} href={path} className={navLinkClass(path)}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Search bar — desktop only */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for devices..."
                className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-1 ml-auto">
            {/* Theme toggle — switches between light and dark mode */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Cart icon with item count badge */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User menu — shows dropdown if signed in, sign-in button if not */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-sm"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block max-w-[100px] truncate">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {/* Dropdown with user info and sign-out button */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/30 py-1">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-zinc-800">
                      <p className="text-xs text-gray-500 dark:text-zinc-500">Signed in as</p>
                      <p className="text-sm text-gray-900 dark:text-white truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors ml-1"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — search + nav links from navMenu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-zinc-800 py-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </form>
            {Object.entries(navMenu).map(([label, path]) => (
              <Link
                key={path}
                href={path}
                className="block px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
