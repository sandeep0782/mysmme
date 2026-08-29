
import Image from "next/image";
import React from "react";

const occasions = [
    {
        id: "wedding",
        title: "Wedding Sarees",
        description: "Elegant sarees for your special day",
        image: "/images/occasions/wedding.jpg",
    },
    {
        id: "festive",
        title: "Festive Sarees",
        description: "Vibrant styles for every celebration",
        image: "/images/occasions/festive.jpg",
    },
    {
        id: "party",
        title: "Party Wear",
        description: "Make every evening unforgettable",
        image: "/images/occasions/party.jpg",
    },
    {
        id: "everyday",
        title: "Everyday Sarees",
        description: "Comfortable elegance for every day",
        image: "/images/occasions/everyday.jpg",
    },
];

const ShopByOccasion = () => {
    return (
        <section className="bg-pink-50 px-6 py-16">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
                        Shop By Occasion
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        A Saree for Every Celebration
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Whether it&apos;s a grand wedding, festive celebration
                        or an everyday moment, find a saree that makes you
                        shine.
                    </p>
                </div>

                {/* Occasion Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {occasions.map((occasion) => (
                        <div
                            key={occasion.id}
                            className="group relative h-[360px] overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Image */}
                            <Image
                                src={occasion.image}
                                alt={occasion.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                                <h3 className="text-2xl font-bold">
                                    {occasion.title}
                                </h3>

                                <p className="mt-2 text-sm text-gray-200">
                                    {occasion.description}
                                </p>

                                {/* Explore Button */}
                                <button
                                    type="button"
                                    className="mt-5 inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                                >
                                    Explore
                                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByOccasion;
