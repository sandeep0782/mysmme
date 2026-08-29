
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

const Cta = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-rose-700 px-6 py-20 text-white">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/cta-saree.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-15"
                />

                {/* Red Overlay */}
                <div className="absolute inset-0 bg-red-700/75" />
            </div>

            {/* Decorative Circles */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />

            {/* Decorative Pattern */}
            <div className="absolute right-10 top-10 hidden h-32 w-32 rounded-full border border-white/10 md:block" />
            <div className="absolute bottom-10 left-10 hidden h-20 w-20 rounded-full border border-white/10 md:block" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <Heart className="mx-auto h-10 w-10 fill-white text-white" />

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-red-100">
                    Your Style. Your Saree.
                </p>

                <h2 className="mt-4 text-3xl font-bold md:text-5xl">
                    Find a Saree That Feels Like You
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-red-50 md:text-lg">
                    Explore timeless weaves, vibrant colors and elegant
                    designs curated for every occasion.
                </p>

                <Link href='/sarees'
                    type="button"
                    className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-red-600 shadow-lg transition-all duration-300 hover:bg-red-50 hover:shadow-xl"
                >
                    Explore All Sarees

                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default Cta;
