import Link from "next/link";
import { Cpu } from "lucide-react";
import { FaTwitter, FaInstagram, FaYoutube, FaGithub} from "react-icons/fa";


export function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 mt-20">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
                                <Cpu className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                T3ch<span className="text-red-500">World</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-zinc-500 leading-relaxed">
                            Your premium destination for the latest tech devices. Curated selection, expert advice, and fast delivery.
                        </p>
                        <div className="social-links">
                            <div className="flex items-center gap-3">
                                {[FaTwitter, FaInstagram, FaYoutube, FaGithub].map((Icon, i) => (
                                    <button key={i} 
                                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <Icon className="h-4 w-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Products</h3>
                        <ul className="space-y-2">
                            {[
                                { label: "Smartphones", href: "/smartphones" },
                                { label: "Laptops", href: "/laptops" },
                                { label: "Smartwatches", href: "/watches" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            {["About Us", "Careers", "Press", "Blog"].map((item) => (
                                <li key={item}>
                                    <span className="text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
                        <ul className="space-y-2">
                            {["Help Center", "Shipping Info", "Returns", "Track Order", "Contact Us"].map((item) => (
                                <li key={item}>
                                    <span className="text-sm text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 dark:text-zinc-600">
                        &copy; {new Date().getFullYear()} T3chWorld. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                            <span key={item} className="text-xs text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400 cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}