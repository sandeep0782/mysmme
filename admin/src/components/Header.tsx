"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">

                {/* ============================================================
                    LOGO
                ============================================================ */}

                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/20">
                        M
                    </div>

                    <div className="leading-tight">
                        <div className="text-lg font-bold tracking-tight text-gray-900">
                            MYSMME
                        </div>

                        <div className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                            Seller Platform
                        </div>
                    </div>
                </Link>


                {/* ============================================================
                    NAVIGATION
                ============================================================ */}

                <nav className="hidden items-center gap-8 md:flex">

                    <Link
                        href="/"
                        className={`relative text-sm font-semibold transition hover:text-red-600 ${pathname === "/"
                                ? "text-gray-900 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-red-600"
                                : "text-gray-500"
                            }`}
                    >
                        Home
                    </Link>

                    <Link
                        href="/features"
                        className={`relative text-sm font-medium transition hover:text-red-600 ${pathname === "/features"
                                ? "text-gray-900 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-red-600"
                                : "text-gray-500"
                            }`}
                    >
                        Features
                    </Link>

                    <Link
                        href="/support"
                        className={`relative text-sm font-medium transition hover:text-red-600 ${pathname === "/support"
                                ? "text-gray-900 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-red-600"
                                : "text-gray-500"
                            }`}
                    >
                        Support
                    </Link>

                </nav>


                {/* ============================================================
                    ACTIONS
                ============================================================ */}

                <div className="flex items-center gap-3">

                    <Link
                        href="/auth/login"
                        className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 sm:block"
                    >
                        Login
                    </Link>

                    <Link
                        href="/auth/register"
                        className="group flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 active:scale-[0.98]"
                    >
                        Create Account

                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>

                </div>

            </div>
        </header>
    );
};

export default Header;