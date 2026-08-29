import Link from "next/link";
import {
    ArrowRight,
    Package,
    ShoppingBag,
    BarChart3,
    Truck,
    Users,
    ShieldCheck,
    Boxes,
    Search,
    CheckCircle2,
    Zap,
    Store,
    RefreshCw,
    Clock3,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900">

            <Header />
            {/* HERO */}

            <section className="relative overflow-hidden bg-white">

                {/* Red glow */}
                <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />

                <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[130px]" />

                <div className="relative mx-auto max-w-7xl px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-28">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">

                        <Zap size={14} />

                        Powerful seller tools

                    </div>


                    {/* Heading */}
                    <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">

                        Everything you need to

                        <span className="block text-red-600">
                            run your business.
                        </span>

                    </h1>


                    {/* Description */}
                    <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">

                        MYSMME brings your products, orders, inventory,
                        customers, analytics and fulfilment together in one
                        simple seller platform.

                    </p>


                    {/* CTA */}
                    <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            href="/auth/register"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition hover:bg-red-700"
                        >
                            Get Started
                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            href="/auth/login"
                            className="flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-7 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                        >
                            Login to Portal
                        </Link>

                    </div>

                </div>

            </section>

            {/* MAIN FEATURES */}

            <section className="border-t border-gray-100 bg-[#fafafa]">

                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="mx-auto max-w-2xl text-center">

                        <div className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-600">
                            Core features
                        </div>

                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                            One platform. Complete control.
                        </h2>

                        <p className="mt-4 leading-7 text-gray-500">
                            Everything you need to manage and grow your
                            business without switching between multiple tools.
                        </p>

                    </div>


                    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        <FeatureCard
                            icon={<Package size={23} />}
                            title="Product Management"
                            description="Create, update and organize your entire product catalogue from a single dashboard."
                            features={[
                                "Centralized product catalogue",
                                "Product details and pricing",
                                "Easy product updates",
                            ]}
                        />

                        <FeatureCard
                            icon={<ShoppingBag size={23} />}
                            title="Order Management"
                            description="Keep track of every order from purchase through fulfilment and delivery."
                            features={[
                                "Order tracking",
                                "Order status management",
                                "Centralized order history",
                            ]}
                        />

                        <FeatureCard
                            icon={<Boxes size={23} />}
                            title="Inventory Management"
                            description="Monitor your stock levels and keep your inventory organized."
                            features={[
                                "Stock visibility",
                                "Inventory tracking",
                                "Low-stock awareness",
                            ]}
                        />

                        <FeatureCard
                            icon={<BarChart3 size={23} />}
                            title="Sales Analytics"
                            description="Turn your business data into useful insights and understand your performance."
                            features={[
                                "Sales overview",
                                "Performance tracking",
                                "Business insights",
                            ]}
                        />

                        <FeatureCard
                            icon={<Users size={23} />}
                            title="Customer Management"
                            description="Keep your customer information organized and accessible."
                            features={[
                                "Customer records",
                                "Customer activity",
                                "Centralized information",
                            ]}
                        />

                        <FeatureCard
                            icon={<Truck size={23} />}
                            title="Shipping & Fulfilment"
                            description="Keep your fulfilment process organized from order to delivery."
                            features={[
                                "Shipment tracking",
                                "Fulfilment visibility",
                                "Delivery management",
                            ]}
                        />

                    </div>

                </div>

            </section>

            {/* DASHBOARD SECTION */}

            <section className="overflow-hidden bg-[#111111]">

                <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">

                    {/* Glows */}
                    <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-red-600/20 blur-[120px]" />

                    <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]" />


                    <div className="relative grid items-center gap-14 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <div className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400">
                                One powerful dashboard
                            </div>

                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                See your entire business at a glance.
                            </h2>

                            <p className="mt-5 max-w-xl leading-7 text-gray-400">
                                Get a clear overview of your business without
                                jumping between different screens and systems.
                            </p>


                            <div className="mt-8 space-y-5">

                                <DarkBenefit
                                    icon={<BarChart3 size={18} />}
                                    title="Understand performance"
                                    description="See sales and business performance in one place."
                                />

                                <DarkBenefit
                                    icon={<Package size={18} />}
                                    title="Monitor your products"
                                    description="Keep track of products and inventory from your dashboard."
                                />

                                <DarkBenefit
                                    icon={<ShoppingBag size={18} />}
                                    title="Stay on top of orders"
                                    description="Know what needs attention and what has already been completed."
                                />

                            </div>

                        </div>


                        {/* Dashboard preview */}
                        <DashboardPreview />

                    </div>

                </div>

            </section>

            {/* ADDITIONAL FEATURES */}

            <section className="bg-white">

                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-24">

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        <SmallFeature
                            icon={<ShieldCheck size={21} />}
                            title="Secure"
                            description="Designed with security in mind."
                        />

                        <SmallFeature
                            icon={<Search size={21} />}
                            title="Easy to use"
                            description="Find what you need quickly."
                        />

                        <SmallFeature
                            icon={<RefreshCw size={21} />}
                            title="Always organized"
                            description="Keep your operations structured."
                        />

                        <SmallFeature
                            icon={<Clock3 size={21} />}
                            title="Save time"
                            description="Spend less time managing systems."
                        />

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="px-5 pb-20 sm:px-6 lg:px-8">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#111111] px-6 py-16 text-center sm:px-10 lg:px-16">

                    <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-600/20 blur-[100px]" />

                    <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-red-600/15 blur-[100px]" />

                    <div className="relative">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-bold text-white shadow-xl shadow-red-600/20">
                            M
                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to simplify your business?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-gray-400">
                            Create your MYSMME account and bring your business
                            operations together in one powerful platform.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link
                                href="/auth/register"
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-7 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                            >
                                Create Account
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                href="/auth/login"
                                className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                Login
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* FOOTER */}
            <Footer />

        </main>
    );
}


/* ==========================================================================
   FEATURE CARD
========================================================================== */

function FeatureCard({
    icon,
    title,
    description,
    features,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    features: string[];
}) {
    return (
        <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl hover:shadow-red-600/5">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white">
                {icon}
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-950">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-500">
                {description}
            </p>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">

                {features.map((feature) => (
                    <div
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                    >
                        <CheckCircle2
                            size={15}
                            className="shrink-0 text-red-600"
                        />

                        <span>
                            {feature}
                        </span>

                    </div>
                ))}

            </div>

        </div>
    );
}


/* ==========================================================================
   DARK BENEFIT
========================================================================== */

function DarkBenefit({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                {icon}
            </div>

            <div>

                <h3 className="font-bold text-white">
                    {title}
                </h3>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                    {description}
                </p>

            </div>

        </div>
    );
}


/* ==========================================================================
   DASHBOARD PREVIEW
========================================================================== */

function DashboardPreview() {
    return (
        <div className="relative">

            <div className="absolute -inset-5 rounded-[35px] bg-red-600/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#181818] p-5 shadow-2xl sm:p-6">

                {/* Top */}
                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs text-gray-500">
                            Dashboard
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-white">
                            Business Overview
                        </h3>

                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                        M
                    </div>

                </div>


                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                    <PreviewStat
                        title="Total Sales"
                        value="₹2.45L"
                        change="+24%"
                    />

                    <PreviewStat
                        title="Orders"
                        value="320"
                        change="+18%"
                    />

                    <PreviewStat
                        title="Products"
                        value="850"
                        change="+12%"
                    />

                    <PreviewStat
                        title="Customers"
                        value="540"
                        change="+21%"
                    />

                </div>


                {/* Chart */}
                <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-xs text-gray-500">
                                Sales performance
                            </p>

                            <p className="mt-1 text-lg font-bold text-white">
                                ₹1,85,000
                            </p>

                        </div>

                        <BarChart3
                            size={18}
                            className="text-red-500"
                        />

                    </div>


                    <div className="mt-6 flex h-32 items-end gap-2">

                        {[35, 50, 42, 65, 55, 78, 68, 88, 76, 100].map(
                            (height, index) => (
                                <div
                                    key={index}
                                    style={{
                                        height: `${height}%`,
                                    }}
                                    className="flex-1 rounded-t-md bg-gradient-to-t from-red-700 to-red-400"
                                />
                            )
                        )}

                    </div>

                </div>


                {/* Recent order */}
                <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4">

                    <div className="flex items-center justify-between">

                        <span className="text-xs font-medium text-gray-500">
                            Recent activity
                        </span>

                        <span className="text-[10px] text-red-400">
                            View all
                        </span>

                    </div>


                    <div className="mt-4 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                <ShoppingBag size={15} />
                            </div>

                            <div>

                                <p className="text-xs font-semibold text-white">
                                    New order received
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-600">
                                    Order #MS-10482
                                </p>

                            </div>

                        </div>

                        <span className="text-xs font-semibold text-green-400">
                            ₹4,850
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* ==========================================================================
   PREVIEW STAT
========================================================================== */

function PreviewStat({
    title,
    value,
    change,
}: {
    title: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">

            <p className="text-[10px] text-gray-600">
                {title}
            </p>

            <div className="mt-2 flex items-end justify-between gap-2">

                <p className="text-lg font-bold text-white">
                    {value}
                </p>

                <span className="text-[9px] font-semibold text-green-400">
                    {change}
                </span>

            </div>

        </div>
    );
}


/* ==========================================================================
   SMALL FEATURE
========================================================================== */

function SmallFeature({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                {icon}
            </div>

            <h3 className="mt-5 font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

        </div>
    );
}
