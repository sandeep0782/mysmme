import Link from "next/link";
import type { ReactNode } from "react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#111111] text-gray-400">

            {/* ============================================================
                MAIN FOOTER
            ============================================================ */}

            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

                    {/* ========================================================
                        BRAND
                    ======================================================== */}

                    <div className="lg:col-span-2">

                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/20">
                                M
                            </div>

                            <div>
                                <p className="text-lg font-bold tracking-tight text-white">
                                    MYSMME
                                </p>

                                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
                                    Seller Platform
                                </p>
                            </div>
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-6 text-gray-400">
                            A modern marketplace platform built to help sellers
                            manage products, orders, inventory and grow their
                            business from one powerful platform.
                        </p>

                        {/* Social */}

                        <div className="mt-7 flex items-center gap-3">

                            <SocialButton label="Instagram">
                                <InstagramIcon />
                            </SocialButton>

                            <SocialButton label="Facebook">
                                <FacebookIcon />
                            </SocialButton>

                            <SocialButton label="LinkedIn">
                                <LinkedInIcon />
                            </SocialButton>

                            <SocialButton label="Twitter">
                                <TwitterIcon />
                            </SocialButton>

                        </div>

                    </div>


                    {/* ========================================================
                        MARKETPLACE
                    ======================================================== */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Marketplace
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">

                            <li>
                                <Link
                                    href="/products"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Browse Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/categories"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Categories
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/featured"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Featured Sellers
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/deals"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Deals & Offers
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ========================================================
                        SELLERS
                    ======================================================== */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            For Sellers
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">

                            <li>
                                <Link
                                    href="/auth/register"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Become a Seller
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/seller"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Seller Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/seller-guide"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Seller Guide
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/seller-support"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Seller Support
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* ========================================================
                        SUPPORT
                    ======================================================== */}

                    <div>

                        <h3 className="text-sm font-semibold text-white">
                            Help & Support
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm">

                            <li>
                                <Link
                                    href="/support"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Help Center
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/shipping"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Shipping Information
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/returns"
                                    className="transition-colors hover:text-red-500"
                                >
                                    Returns & Refunds
                                </Link>
                            </li>

                        </ul>

                    </div>

                </div>


                {/* ============================================================
                    NEWSLETTER
                ============================================================ */}

                <div className="mt-14 rounded-2xl border border-gray-800 bg-[#171717] p-6 sm:p-7">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />

                                <h3 className="text-base font-semibold text-white">
                                    Stay updated with MYSMME
                                </h3>
                            </div>

                            <p className="mt-2 text-sm text-gray-500">
                                Get marketplace updates, seller tips and new
                                features directly in your inbox.
                            </p>

                        </div>


                        <form className="flex w-full max-w-md gap-2">

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                                required
                                className="h-11 min-w-0 flex-1 rounded-xl border border-gray-700 bg-[#111111] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            />

                            <button
                                type="submit"
                                className="h-11 shrink-0 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700 active:scale-[0.98]"
                            >
                                Subscribe
                            </button>

                        </form>

                    </div>

                </div>


                {/* ============================================================
                    TRUST STRIP
                ============================================================ */}

                <div className="mt-10 flex flex-col gap-5 border-b border-gray-800 pb-8 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4 text-xs text-gray-500">

                        <div className="flex items-center gap-2">
                            <span className="text-red-500">
                                <ShieldIcon />
                            </span>
                            <span>Secure Platform</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-red-500">
                                <TruckIcon />
                            </span>
                            <span>Reliable Delivery</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-red-500">
                                <HeadphonesIcon />
                            </span>
                            <span>Seller Support</span>
                        </div>

                    </div>


                    <div className="text-xs text-gray-600">
                        Trusted marketplace experience
                    </div>

                </div>


                {/* ============================================================
                    BOTTOM BAR
                ============================================================ */}

                <div className="flex flex-col gap-5 pt-7 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">

                    <p>
                        © 2026 MYSMME. All rights reserved.
                    </p>


                    <div className="flex flex-wrap gap-x-6 gap-y-2">

                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-white"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition-colors hover:text-white"
                        >
                            Terms & Conditions
                        </Link>

                        <Link
                            href="/cookies"
                            className="transition-colors hover:text-white"
                        >
                            Cookie Policy
                        </Link>

                        <Link
                            href="/support"
                            className="transition-colors hover:text-white"
                        >
                            Support
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}


/* ================================================================
   SOCIAL BUTTON
================================================================ */

function SocialButton({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 bg-[#171717] text-gray-500 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
        >
            {children}
        </button>
    );
}


/* ================================================================
   INSTAGRAM
================================================================ */

function InstagramIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
            />

            <circle
                cx="12"
                cy="12"
                r="4"
            />

            <circle
                cx="17.5"
                cy="6.5"
                r="1"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    );
}


/* ================================================================
   FACEBOOK
================================================================ */

function FacebookIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v4h4v-4h3.2l.8-4H13V9c0-.7.3-1 1-1z" />
        </svg>
    );
}


/* ================================================================
   LINKEDIN
================================================================ */

function LinkedInIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M5 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h4v1.7c.9-1.3 2.2-2.1 4-2.1 3.5 0 5 2.2 5 6.2V21h-4v-5.4c0-1.8-.5-3-2-3s-2 1.1-2 3V21H9V9z" />
        </svg>
    );
}


/* ================================================================
   X / TWITTER
================================================================ */

function TwitterIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-6.5L6.2 22H3.1l7.3-8.4L2.8 2h6.4l4.5 5.9L18.9 2zm-1.1 17.8h1.7L8.3 4.1H6.5l11.3 15.7z" />
        </svg>
    );
}


/* ================================================================
   SHIELD
================================================================ */

function ShieldIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M12 3l8 3v5c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3z" />

            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}


/* ================================================================
   TRUCK
================================================================ */

function TruckIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M3 6h11v10H3z" />

            <path d="M14 10h4l3 3v3h-7z" />

            <circle
                cx="7"
                cy="18"
                r="2"
            />

            <circle
                cx="18"
                cy="18"
                r="2"
            />
        </svg>
    );
}


/* ================================================================
   HEADPHONES
================================================================ */

function HeadphonesIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 14v-2a8 8 0 0 1 16 0v2" />

            <path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5z" />

            <path d="M20 14h-3v6h2a1 1 0 0 0 1-1v-5z" />
        </svg>
    );
}