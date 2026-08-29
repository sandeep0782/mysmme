import React from "react";
import {
    Package,
    ShoppingBag,
    BarChart3,
    Truck,
    ArrowUpRight,
} from "lucide-react";

const Features = () => {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* ============================================================
          BACKGROUND EFFECTS
      ============================================================ */}

            <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-red-600/5 blur-[100px]" />

            <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-red-500/5 blur-[100px]" />

            {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

            <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">

                {/* ==========================================================
            HEADER
        ========================================================== */}

                <div className="mx-auto max-w-2xl text-center">

                    <div className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">
                        Powerful tools
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
                        Everything you need
                        <span className="block text-red-600">
                            to grow your business.
                        </span>
                    </h2>

                    <p className="mt-5 text-base leading-7 text-gray-500 sm:text-lg">
                        Manage your entire seller operation from one simple,
                        powerful platform built for modern businesses.
                    </p>

                </div>

                {/* ==========================================================
            FEATURE CARDS
        ========================================================== */}

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <FeatureCard
                        icon={<Package size={22} />}
                        title="Products"
                        description="Manage your complete product catalogue, pricing and inventory with ease."
                    />

                    <FeatureCard
                        icon={<ShoppingBag size={22} />}
                        title="Orders"
                        description="Track, manage and organize your customer orders from one place."
                    />

                    <FeatureCard
                        icon={<BarChart3 size={22} />}
                        title="Analytics"
                        description="Understand your sales performance and make better business decisions."
                    />

                    <FeatureCard
                        icon={<Truck size={22} />}
                        title="Shipping"
                        description="Keep fulfilment, delivery and shipping operations organized."
                    />

                </div>

                {/* ==========================================================
            BOTTOM CTA
        ========================================================== */}

                <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-6 sm:flex-row sm:px-8">

                    <div>

                        <h3 className="text-base font-bold text-gray-900">
                            Everything connected in one platform.
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Spend less time managing tools and more time growing your business.
                        </p>

                    </div>

                    <a
                        href="/auth/register"
                        className="group flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 active:scale-[0.98]"
                    >
                        Get Started

                        <ArrowUpRight
                            size={16}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>

                </div>

            </div>
        </section>
    );
};

/* ================================================================
   FEATURE CARD
================================================================ */

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-900/5">

            {/* Red hover glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-600/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

            {/* Icon */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-600/20">
                {icon}
            </div>

            {/* Content */}
            <h3 className="mt-6 text-lg font-bold tracking-tight text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

            {/* Bottom indicator */}
            <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-red-600 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Learn more
                <ArrowUpRight size={13} />
            </div>

        </div>
    );
}

export default Features;