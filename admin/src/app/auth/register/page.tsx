"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <main className="min-h-screen bg-[#fafafa]">
            <div className="flex min-h-screen">

                {/* ============================================================
                    LEFT BRANDING PANEL
                ============================================================ */}

                <section className="relative hidden overflow-hidden bg-[#111111] lg:flex lg:w-1/2">

                    {/* Red glow - top left */}
                    <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/25 blur-[120px]" />

                    {/* Red glow - bottom right */}
                    <div className="absolute -bottom-48 -right-40 h-[600px] w-[600px] rounded-full bg-red-500/15 blur-[140px]" />

                    {/* Subtle red circle */}
                    <div className="absolute right-[-120px] top-[25%] h-[350px] w-[350px] rounded-full border border-red-500/10" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        {/* Logo */}
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 text-white"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/30">
                                    M
                                </div>

                                <span className="text-xl font-bold tracking-tight">
                                    MYSMME
                                </span>
                            </Link>
                        </div>

                        {/* Main branding */}
                        <div className="max-w-xl">

                            {/* Badge */}
                            <div className="mb-7 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                                <span className="mr-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                Join Mysmme
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                                Build your business.
                                <br />

                                <span className="text-red-500">
                                    Grow with confidence.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-lg text-base leading-7 text-gray-400 xl:text-lg">
                                Create your Mysmme account and get everything
                                you need to manage products, orders and your
                                business in one place.
                            </p>

                            {/* Features */}
                            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">

                                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                        <ChartIcon />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Grow
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Your business
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                        <BoxIcon />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Manage
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Your products
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 backdrop-blur">
                                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                        <ShieldIcon />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Secure
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Always protected
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-600">

                            <span>
                                © 2026 Mysmme
                            </span>

                            <div className="flex gap-5">
                                <Link
                                    href="/privacy"
                                    className="transition hover:text-gray-300"
                                >
                                    Privacy
                                </Link>

                                <Link
                                    href="/terms"
                                    className="transition hover:text-gray-300"
                                >
                                    Terms
                                </Link>
                            </div>

                        </div>

                    </div>
                </section>

                {/* ============================================================
                    REGISTER SECTION
                ============================================================ */}

                <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <div className="mb-8 flex justify-center lg:hidden">

                            <Link
                                href="/"
                                className="flex items-center gap-3 text-gray-900"
                            >

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-lg font-bold text-white shadow-lg shadow-red-600/20">
                                    M
                                </div>

                                <span className="text-xl font-bold">
                                    MYSMME
                                </span>

                            </Link>

                        </div>

                        {/* Header */}
                        <div className="mb-7">

                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Get started with Mysmme in just a few steps.
                            </p>

                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="mx-auto flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]"
                        >
                            <GoogleIcon />

                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">

                            <div className="h-px flex-1 bg-gray-200" />

                            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">
                                Or continue with email
                            </span>

                            <div className="h-px flex-1 bg-gray-200" />

                        </div>

                        {/* ====================================================
                            FORM
                        ==================================================== */}

                        <form className="space-y-4">

                            {/* First + Last name */}
                            <div className="grid grid-cols-2 gap-3">

                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        First name
                                    </label>

                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="John"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Last name
                                    </label>

                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Doe"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    />
                                </div>

                            </div>

                            {/* Email */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Email address
                                </label>

                                <div className="relative">

                                    <MailIcon />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    />

                                </div>

                            </div>

                            {/* Password */}
                            <div>

                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <LockIcon />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon />
                                        ) : (
                                            <EyeIcon />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Confirm Password */}
                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Confirm password
                                </label>

                                <div className="relative">

                                    <LockIcon />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon />
                                        ) : (
                                            <EyeIcon />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-1">

                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 accent-red-600 focus:ring-red-500"
                                />

                                <label
                                    htmlFor="terms"
                                    className="text-sm leading-5 text-gray-500"
                                >
                                    I agree to the{" "}

                                    <Link
                                        href="/terms"
                                        className="font-semibold text-red-600 hover:text-red-700"
                                    >
                                        Terms
                                    </Link>

                                    {" "}and{" "}

                                    <Link
                                        href="/privacy"
                                        className="font-semibold text-red-600 hover:text-red-700"
                                    >
                                        Privacy Policy
                                    </Link>
                                </label>

                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:scale-[0.99]"
                            >

                                {/* Shine */}
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full " />

                                <span className="relative cursor-pointer">
                                    Create account
                                </span>

                            </button>

                        </form>

                        {/* Login */}
                        <p className="mt-7 text-center text-sm text-gray-500">

                            Already have an account?{" "}

                            <Link
                                href="/auth/login"
                                className="font-bold text-red-600 transition hover:text-red-700"
                            >
                                Sign in
                            </Link>

                        </p>

                        {/* Security */}
                        <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">

                            <ShieldIcon />

                            <span>
                                Your information is securely encrypted
                            </span>

                        </div>

                    </div>

                </section>

            </div>
        </main>
    );
}

/* ==========================================================================
   ICONS
========================================================================== */

function MailIcon() {
    return (
        <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
            />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <rect
                x="4"
                y="10"
                width="16"
                height="10"
                rx="2"
            />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m3 3 18 18" />
            <path d="M10.6 6.2A9.8 9.8 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.2 3.8" />
            <path d="M6.6 6.7C3.6 8.4 2 12 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.3-.6" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M12 3 20 6v5c0 5-3.3 8.7-8 10-4.7-1.3-8-5-8-10V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function ChartIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="m7 15 4-4 3 2 5-6" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="M4 7.5 12 12l8-4.5" />
            <path d="M12 12v9" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
        >
            <path
                fill="#4285F4"
                d="M21.35 12.23c0-.68-.06-1.34-.17-1.97H12v3.73h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.15Z"
            />
            <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.5Z"
            />
            <path
                fill="#FBBC05"
                d="M6.54 13.59A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.59V7.88H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.12l3.25-2.53Z"
            />
            <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.49 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
            />
        </svg>
    );
}