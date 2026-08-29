"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    ChevronDown,
    HelpCircle,
    Mail,
    MessageCircle,
    Package,
    Search,
    ShieldCheck,
    Truck,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
    {
        question: "How do I add a new product?",
        answer:
            "After signing in to your seller dashboard, open Products and select Add Product. Enter your product details, pricing, inventory and images, then save the product.",
    },
    {
        question: "How can I check my orders?",
        answer:
            "Open the Orders section from your dashboard. You can view order details, customer information, payment status and shipping status from there.",
    },
    {
        question: "How do I update my inventory?",
        answer:
            "Go to Products and open the product you want to update. You can modify the available stock quantity and save the changes.",
    },
    {
        question: "How can I track a shipment?",
        answer:
            "Open the relevant order from your Orders section. If shipment tracking is available, the tracking information will be displayed in the order details.",
    },
    {
        question: "I forgot my password. What should I do?",
        answer:
            "Click Forgot password on the login page and follow the instructions sent to your registered email address.",
    },
    {
        question: "How do I contact MYSMME support?",
        answer:
            "You can contact our support team using the support form below or send an email to the support address provided by your organization.",
    },
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [search, setSearch] = useState("");

    const filteredFaqs = faqs.filter((faq) =>
        `${faq.question} ${faq.answer}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900">

            {/* NAVBAR */}

            <Header />

            {/*HERO */}

            <section className="relative overflow-hidden bg-[#111111]">

                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[120px]" />

                <div className="absolute -bottom-60 -right-40 h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[140px]" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">

                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-red-400 ring-1 ring-red-500/20">
                        <HelpCircle size={28} />
                    </div>

                    <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300">
                        MYSMME Support
                    </span>

                    <h1 className="mx-auto mt-7 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        How can we
                        <span className="text-red-500"> help you?</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                        Find answers, learn how MYSMME works, or contact our support
                        team whenever you need assistance managing your business.
                    </p>

                    {/* Search */}

                    <div className="mx-auto mt-10 max-w-2xl">

                        <div className="relative">

                            <Search
                                size={20}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for help..."
                                className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-14 pr-5 text-sm text-white outline-none backdrop-blur transition placeholder:text-gray-500 focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-red-500/10"
                            />

                        </div>

                    </div>

                </div>

            </section>

            {/*  QUICK HELP */}

            <section className="mx-auto max-w-7xl px-6 py-16">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <SupportCard
                        icon={<Package size={22} />}
                        title="Products"
                        description="Manage products, pricing and inventory."
                    />

                    <SupportCard
                        icon={<MessageCircle size={22} />}
                        title="Orders"
                        description="Get help with orders and customers."
                    />

                    <SupportCard
                        icon={<Truck size={22} />}
                        title="Shipping"
                        description="Understand shipping and tracking."
                    />

                    <SupportCard
                        icon={<ShieldCheck size={22} />}
                        title="Account"
                        description="Manage your account and security."
                    />

                </div>

            </section>

            {/* FAQ */}

            <section className="mx-auto max-w-4xl px-6 pb-20">

                <div className="text-center">

                    <span className="text-sm font-bold uppercase tracking-widest text-red-600">
                        Frequently Asked Questions
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                        Common questions
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-500">
                        Quick answers to some of the most common questions from MYSMME
                        sellers.
                    </p>

                </div>

                <div className="mt-10 space-y-3">

                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => {

                            const isOpen = openFaq === index;

                            return (
                                <div
                                    key={faq.question}
                                    className={`overflow-hidden rounded-2xl border bg-white transition-all ${isOpen
                                        ? "border-red-200 shadow-lg shadow-red-100/50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(isOpen ? null : index)
                                        }
                                        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                                    >

                                        <span className="text-sm font-semibold text-gray-900 sm:text-base">
                                            {faq.question}
                                        </span>

                                        <ChevronDown
                                            size={20}
                                            className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-red-600" : ""
                                                }`}
                                        />

                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-gray-100 px-6 pb-6 pt-4">

                                            <p className="text-sm leading-7 text-gray-500">
                                                {faq.answer}
                                            </p>

                                        </div>
                                    )}

                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

                            <Search
                                size={28}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-semibold">
                                No results found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Try searching with different keywords.
                            </p>

                        </div>
                    )}

                </div>

            </section>

            {/*CONTACT SUPPORT */}

            <section className="border-y border-gray-100 bg-white">

                <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2">

                    {/* Left */}

                    <div>

                        <span className="text-sm font-bold uppercase tracking-widest text-red-600">
                            Need more help?
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            We're here to help.
                        </h2>

                        <p className="mt-5 max-w-lg leading-7 text-gray-500">
                            Can't find what you're looking for? Send us a message and
                            our support team will help you resolve your issue.
                        </p>

                        <div className="mt-8 space-y-4">

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Mail size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Email Support
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        support@mysmme.com
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-4">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <BookOpen size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        Seller Resources
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Guides and documentation for sellers
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Form */}

                    <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-6 shadow-sm sm:p-8">

                        <h3 className="text-xl font-bold">
                            Contact Support
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Tell us what you need help with.
                        </p>

                        <form className="mt-7 space-y-5">

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Your name"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    placeholder="What do you need help with?"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Message
                                </label>

                                <textarea
                                    rows={5}
                                    placeholder="Describe your issue..."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                />

                            </div>

                            <button
                                type="submit"
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 active:scale-[0.99]"
                            >
                                Send Message

                                <ArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>

                        </form>

                    </div>

                </div>

            </section>

            {/* CTA */}

            <section className="bg-[#111111]">

                <div className="mx-auto max-w-7xl px-6 py-16 text-center">

                    <h2 className="text-3xl font-bold text-white">
                        Ready to manage your business?
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-gray-400">
                        Sign in to MYSMME and manage your products, orders and
                        business from one powerful platform.
                    </p>

                    <Link
                        href="/auth/login"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                    >
                        Login to MYSMME
                        <ArrowRight size={17} />
                    </Link>

                </div>

            </section>

            <Footer />

        </main>
    );
}

/* ================================================================
   SUPPORT CARD
================================================================ */

function SupportCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-100/40">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                {icon}
            </div>

            <h3 className="mt-5 font-bold text-gray-900">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-red-600">
                Get help
                <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                />
            </div>

        </div>
    );
}
