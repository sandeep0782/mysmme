import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const Cta = () => {
    return (
        <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#111111] px-6 py-16 text-center shadow-2xl shadow-red-900/10 sm:px-10 lg:px-16 lg:py-20">

                {/* ============================================================
                    BACKGROUND EFFECTS
                ============================================================ */}

                <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-[100px]" />

                <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-red-600/15 blur-[110px]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />

                {/* Subtle border */}
                <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/5" />


                {/* ============================================================
                    CONTENT
                ============================================================ */}

                <div className="relative">

                    {/* Logo */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-bold text-white shadow-xl shadow-red-600/30">
                        M
                    </div>


                    {/* Badge */}
                    <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Built for modern sellers
                    </div>


                    {/* Heading */}
                    <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Ready to grow your{" "}
                        <span className="text-red-500">
                            business?
                        </span>
                    </h2>


                    {/* Description */}
                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
                        Create your MYSMME account and manage your products,
                        orders, inventory and customers from one powerful
                        seller platform.
                    </p>


                    {/* Buttons */}
                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            href="/auth/register"
                            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30 active:scale-[0.98]"
                        >
                            Create Free Account

                            <ArrowRight
                                size={17}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                        </Link>


                        <Link
                            href="/auth/login"
                            className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 text-sm font-bold text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
                        >
                            Login to Portal
                        </Link>

                    </div>


                    {/* Trust points */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500">

                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={15}
                                className="text-red-500"
                            />
                            Easy to use
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={15}
                                className="text-red-500"
                            />
                            Secure platform
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={15}
                                className="text-red-500"
                            />
                            Built for sellers
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Cta;