"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { sarees } from "@/lib/Constant";

interface Saree {
    _id: string;
    title: string;
    price: number;
    finalPrice: number;
    condition?: string;
    images: string[];
}

interface ProductCardProps {
    saree: Saree;
    discount: number;
}

const NewProducts = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const touchStartX = useRef<number | null>(null);

    // ------------------------------------------
    // MOBILE CHECK
    // ------------------------------------------

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkScreen();

        window.addEventListener("resize", checkScreen);

        return () => {
            window.removeEventListener("resize", checkScreen);
        };
    }, []);

    // ------------------------------------------
    // SLIDE SETTINGS
    // ------------------------------------------

    const itemsPerSlide = isMobile ? 1 : 4;

    const totalSlides = Math.ceil(sarees.length / itemsPerSlide);

    // ------------------------------------------
    // RESET WHEN SCREEN SIZE CHANGES
    // ------------------------------------------

    useEffect(() => {
        setCurrentSlide(0);
    }, [isMobile]);

    // ------------------------------------------
    // AUTO SLIDE
    // ------------------------------------------

    useEffect(() => {
        if (totalSlides <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, 4000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    // ------------------------------------------
    // NEXT
    // ------------------------------------------

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    // ------------------------------------------
    // PREVIOUS
    // ------------------------------------------

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    // ------------------------------------------
    // SWIPE
    // ------------------------------------------

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;

        const distance = touchStartX.current - touchEndX;

        if (Math.abs(distance) > 50) {
            if (distance > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        touchStartX.current = null;
    };

    // ------------------------------------------
    // DISCOUNT
    // ------------------------------------------

    const calculateDiscount = (price: number, finalPrice: number) => {
        if (price > finalPrice && price > 0) {
            return Math.round(((price - finalPrice) / price) * 100);
        }

        return 0;
    };

    // ------------------------------------------
    // EMPTY STATE
    // ------------------------------------------

    if (!sarees || sarees.length === 0) {
        return (
            <section className="bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-2xl font-bold">Newly Added Sarees</h2>

                    <p className="mt-3 text-gray-500">
                        No sarees available at the moment.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 py-10 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                {/* HEADER */}

                <div className="mb-7 text-center sm:mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        Newly Added Sarees
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Discover our latest collection
                    </p>
                </div>

                {/* CAROUSEL */}

                <div className="relative">
                    {/* VIEWPORT */}

                    <div
                        className="overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* TRACK */}

                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                            }}
                        >
                            {/* SLIDES */}

                            {Array.from({
                                length: totalSlides,
                            }).map((_, slideIndex) => {
                                const start = slideIndex * itemsPerSlide;

                                const end = start + itemsPerSlide;

                                const products = sarees.slice(start, end);

                                return (
                                    <div
                                        key={slideIndex}
                                        className="min-w-full flex-none px-1 sm:px-2"
                                    >
                                        {/* PRODUCT GRID */}

                                        <div
                                            className="
                                            grid
                                            grid-cols-1
                                            gap-4
                                            sm:grid-cols-2
                                            lg:grid-cols-4
                                            lg:gap-6
                                        "
                                        >
                                            {products.map((saree) => (
                                                <ProductCard
                                                    key={saree._id}
                                                    saree={saree}
                                                    discount={calculateDiscount(
                                                        saree.price,
                                                        saree.finalPrice,
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* LEFT BUTTON */}

                    {totalSlides > 1 && (
                        <button
                            type="button"
                            onClick={prevSlide}
                            aria-label="Previous products"
                            className="
                                absolute
                                left-1
                                top-1/2
                                z-30
                                flex
                                h-10
                                w-10
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-gray-200
                                bg-white
                                shadow-lg
                                transition
                                hover:scale-110
                                hover:bg-red-50
                                sm:left-0
                                sm:h-11
                                sm:w-11
                                sm:-translate-x-1/2
                            "
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-700" />
                        </button>
                    )}

                    {/* RIGHT BUTTON */}

                    {totalSlides > 1 && (
                        <button
                            type="button"
                            onClick={nextSlide}
                            aria-label="Next products"
                            className="
                                absolute
                                right-1
                                top-1/2
                                z-30
                                flex
                                h-10
                                w-10
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-gray-200
                                bg-white
                                shadow-lg
                                transition
                                hover:scale-110
                                hover:bg-red-50
                                sm:right-0
                                sm:h-11
                                sm:w-11
                                sm:translate-x-1/2
                            "
                        >
                            <ChevronRight className="h-5 w-5 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* DOTS */}

                {totalSlides > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({
                            length: totalSlides,
                        }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`
                                    h-2
                                    rounded-full
                                    transition-all
                                    duration-300
                                    ${currentSlide === index
                                        ? "w-8 bg-red-500"
                                        : "w-2 bg-gray-300 hover:bg-red-300"
                                    }
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

// ==========================================
// PRODUCT CARD
// ==========================================

const ProductCard = ({ saree, discount }: ProductCardProps) => {
    const productUrl = `/products/${saree._id}`;

    return (
        <div
            className="
            overflow-hidden
            rounded-xl
            bg-white
            shadow-sm
            transition
            duration-300
            hover:shadow-lg
        "
        >
            {/* IMAGE + DETAILS */}

            <Link href={productUrl} className="group block">
                {/* IMAGE */}

                <div
                    className="
                    relative
                    aspect-[4/5]
                    w-full
                    overflow-hidden
                    bg-gray-100
                "
                >
                    <Image
                        src={saree.images?.[0] || "/placeholder.jpg"}
                        alt={saree.title}
                        fill
                        sizes="
                            (max-width: 639px) 90vw,
                            (max-width: 1023px) 45vw,
                            25vw
                        "
                        className="
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />

                    {/* OVERLAY */}

                    <div
                        className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/20
                        via-transparent
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                    "
                    />

                    {/* DISCOUNT */}

                    {discount > 0 && (
                        <span
                            className="
                            absolute
                            left-0
                            top-3
                            rounded-r-full
                            bg-red-500
                            px-3
                            py-1.5
                            text-xs
                            font-bold
                            text-white
                            shadow-md
                        "
                        >
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* DETAILS */}

                <div className="p-3 sm:p-4">
                    <h3
                        className="
                        line-clamp-1
                        text-sm
                        font-semibold
                        text-gray-800
                        transition-colors
                        group-hover:text-red-600
                        sm:text-base
                    "
                    >
                        {saree.title}
                    </h3>

                    <div
                        className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                    >
                        {/* PRICE */}

                        <div className="flex items-baseline gap-2">
                            <span
                                className="
                                text-base
                                font-black
                                text-gray-900
                                sm:text-lg
                            "
                            >
                                ₹{saree.finalPrice}
                            </span>

                            {saree.price > saree.finalPrice && (
                                <span
                                    className="
                                    text-xs
                                    text-gray-400
                                    line-through
                                    sm:text-sm
                                "
                                >
                                    ₹{saree.price}
                                </span>
                            )}
                        </div>

                        {/* CONDITION */}

                        {saree.condition && (
                            <span
                                className="
                                max-w-[100px]
                                truncate
                                text-[10px]
                                font-medium
                                text-zinc-400
                                sm:text-xs
                            "
                            >
                                {saree.condition}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* BUY BUTTON */}

            <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <Link
                    href={productUrl}
                    className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        rounded-lg
                        bg-gradient-to-r
                        from-red-500
                        to-red-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:from-red-600
                        hover:to-red-700
                        hover:shadow-lg
                    "
                >
                    Buy Now
                </Link>
            </div>
        </div>
    );
};

export default NewProducts;
