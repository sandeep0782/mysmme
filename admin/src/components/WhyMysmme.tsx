import React from "react";
import {
    BarChart3,
    CheckCircle2,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const WhyMysmme = () => {
    return (
        <section className="relative overflow-hidden bg-[#fafafa]">
            {/* ============================================================
          BACKGROUND EFFECTS
      ============================================================ */}

            <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-red-600/5 blur-[110px]" />

            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-red-500/5 blur-[120px]" />

            {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

            <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">

                {/* ==========================================================
            LEFT CONTENT
        ========================================================== */}

                <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">
                        <Sparkles size={13} />

                        Why MYSMME
                    </div>

                    {/* Heading */}
                    <h2 className="mt-5 max-w-xl text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                        Built to make selling
                        <span className="block text-red-600">
                            simpler.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                        Spend less time managing complicated systems and more
                        time focusing on your products, customers and growth.
                    </p>

                    {/* ========================================================
              BENEFITS
          ======================================================== */}

                    <div className="mt-9 space-y-6">

                        <Benefit
                            title="One powerful dashboard"
                            description="Products, orders, customers, inventory and analytics are connected in one place."
                        />

                        <Benefit
                            title="Simple and intuitive"
                            description="A clean seller experience designed so you can get started without a steep learning curve."
                        />

                        <Benefit
                            title="Secure by design"
                            description="Your business information is handled with modern security practices and a privacy-first approach."
                        />

                    </div>

                    {/* Small trust statement */}
                    <div className="mt-9 flex items-center gap-3 text-sm text-gray-500">
                        <ShieldCheck
                            size={18}
                            className="text-red-600"
                        />

                        <span>
                            Designed with sellers in mind.
                        </span>
                    </div>
                </div>

                {/* ==========================================================
            RIGHT DASHBOARD
        ========================================================== */}

                <div className="relative">

                    {/* Glow */}
                    <div className="absolute -inset-6 rounded-[40px] bg-red-600/10 blur-3xl" />

                    {/* Dashboard */}
                    <div className="relative overflow-hidden rounded-[28px] border border-gray-800 bg-[#111111] p-5 shadow-2xl shadow-red-900/10 sm:p-7">

                        {/* ======================================================
                DASHBOARD HEADER
            ====================================================== */}

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-medium text-gray-500">
                                    Business overview
                                </p>

                                <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
                                    Your store
                                </h3>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20">
                                M
                            </div>

                        </div>

                        {/* ======================================================
                STAT CARDS
            ====================================================== */}

                        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">

                            <DarkStat
                                title="Revenue"
                                value="₹2.45L"
                                change="+24%"
                            />

                            <DarkStat
                                title="Orders"
                                value="320"
                                change="+18%"
                            />

                            <DarkStat
                                title="Products"
                                value="850"
                                change="+12%"
                            />

                            <DarkStat
                                title="Customers"
                                value="540"
                                change="+21%"
                            />

                        </div>

                        {/* ======================================================
                PERFORMANCE CHART
            ====================================================== */}

                        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-medium text-gray-500">
                                        Store performance
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-white">
                                        Sales overview
                                    </p>
                                </div>

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                                    <BarChart3
                                        size={17}
                                        className="text-red-500"
                                    />
                                </div>

                            </div>

                            {/* Chart */}
                            <div className="mt-6 flex h-28 items-end gap-2">

                                {[30, 45, 35, 60, 50, 75, 65, 90, 80].map(
                                    (height, index) => (
                                        <div
                                            key={index}
                                            className="group relative flex h-full flex-1 items-end"
                                        >
                                            <div
                                                style={{
                                                    height: `${height}% `,
                                                }}
                                                className="w-full rounded-t-md bg-gradient-to-t from-red-700 to-red-400 transition-all duration-300 group-hover:from-red-500 group-hover:to-red-300"
                                            />
                                        </div>
                                    )
                                )}

                            </div>

                            {/* Chart labels */}
                            <div className="mt-3 flex justify-between text-[9px] text-gray-600">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                            </div>

                        </div>

                        {/* ======================================================
                BOTTOM STATUS
            ====================================================== */}

                        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">

                            <div className="flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

                                <span className="text-xs text-gray-500">
                                    Business performing well
                                </span>

                            </div>

                            <span className="text-xs font-semibold text-green-400">
                                +24.8%
                            </span>

                        </div>

                    </div>

                    {/* ========================================================
              FLOATING NOTIFICATION
          ======================================================== */}

                    <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block lg:-left-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <CheckCircle2 size={18} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-900">
                                    Sales are growing
                                </p>

                                <p className="mt-0.5 text-[11px] text-gray-400">
                                    24.8% this month
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* ========================================================
              FLOATING BADGE
          ======================================================== */}

                    <div className="absolute -right-3 -top-5 hidden rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-xl sm:block lg:-right-8">

                        <div className="flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                <Sparkles size={14} />
                            </span>

                            <div>
                                <p className="text-[10px] text-gray-400">
                                    MYSMME
                                </p>

                                <p className="text-xs font-bold text-gray-900">
                                    All in one
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

/* ================================================================
   BENEFIT
================================================================ */

function Benefit({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="group flex gap-4">

            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-600/20">
                <CheckCircle2 size={19} />
            </div>

            {/* Content */}
            <div>

                <h3 className="text-base font-bold text-gray-900">
                    {title}
                </h3>

                <p className="mt-1.5 max-w-lg text-sm leading-6 text-gray-500">
                    {description}
                </p>

            </div>

        </div>
    );
}

/* ================================================================
   DARK STAT
================================================================ */

function DarkStat({
    title,
    value,
    change,
}: {
    title: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition-all duration-300 hover:border-red-500/20 hover:bg-white/[0.06]">

            <p className="text-[11px] font-medium text-gray-500">
                {title}
            </p>

            <div className="mt-2 flex items-end justify-between gap-2">

                <p className="text-xl font-bold tracking-tight text-white">
                    {value}
                </p>

                <span className="text-[10px] font-semibold text-green-400">
                    {change}
                </span>

            </div>

        </div>
    );
}

export default WhyMysmme;