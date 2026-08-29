
import Image from "next/image";
import React from "react";

const collections = [
    {
        id: "silk",
        number: "Collection 01",
        title: "Silk Sarees",
        description:
            "Rich textures, elegant drapes and timeless designs perfect for weddings, celebrations and special occasions.",
        image: "/images/silk-saree.jpg",
    },
    {
        id: "banarasi",
        number: "Collection 02",
        title: "Banarasi Sarees",
        description:
            "Intricate zari work, traditional motifs and the timeless charm of Banarasi weaving.",
        image: "/images/banarasi-saree.jpg",
    },
    {
        id: "cotton",
        number: "Collection 03",
        title: "Cotton & Handloom",
        description:
            "Lightweight, comfortable and effortlessly elegant sarees for everyday wear and graceful occasions.",
        image: "/images/cotton-saree.jpg",
    },
];

const FeaturedCollection = () => {
    return (
        <section className="bg-gray-50 px-6 py-16">
            <div className="mx-auto max-w-7xl">
                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
                        Featured Collections
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        Find Your Signature Style
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        From luxurious silks to effortless cottons, discover
                        a saree collection made for every mood and occasion.
                    </p>
                </div>

                {/* Collection Cards */}
                <div className="grid gap-8 md:grid-cols-3">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Image */}
                            <div className="relative h-[420px] overflow-hidden">
                                <Image
                                    src={collection.image}
                                    alt={collection.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Collection Number */}
                                <p className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-900">
                                    {collection.number}
                                </p>

                                {/* Image Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                    <h3 className="text-2xl font-bold">
                                        {collection.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-200">
                                        {collection.description}
                                    </p>

                                    <button
                                        type="button"
                                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-300 hover:bg-red-500 hover:text-white"
                                    >
                                        View Collection
                                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;
