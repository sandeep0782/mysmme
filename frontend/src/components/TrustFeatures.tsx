
import {
    BadgeCheck,
    Headphones,
    RotateCcw,
    ShieldCheck,
    Truck,
} from "lucide-react";
import React from "react";

const trustFeatures = [
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        description: "100% safe & encrypted checkout",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Quick delivery across India",
    },
    {
        icon: Headphones,
        title: "Dedicated Support",
        description: "We're here whenever you need us",
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Simple & hassle-free returns",
    },
    {
        icon: BadgeCheck,
        title: "Verified Sellers",
        description: "Shop from trusted brands",
    },
];

const TrustFeatures = () => {
    return (
        <section className="w-full bg-white py-6 sm:py-8">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className="
                        grid grid-cols-1 overflow-hidden
                        rounded-2xl border border-gray-100
                        bg-white shadow-sm
                        sm:grid-cols-2
                        lg:grid-cols-5
                    "
                >
                    {trustFeatures.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className={`
                                    group relative flex items-center
                                    gap-4 p-5
                                    transition-all duration-300
                                    hover:bg-red-50/60
                                    sm:p-6
                                    
                                    ${
                                        index !== 0
                                            ? "border-t border-gray-100 sm:border-t-0 sm:border-l"
                                            : ""
                                    }

                                    ${
                                        index === 2
                                            ? "sm:border-t sm:border-gray-100 lg:border-t-0"
                                            : ""
                                    }

                                    ${
                                        index === 4
                                            ? "sm:col-span-2 lg:col-span-1"
                                            : ""
                                    }
                                `}
                            >
                                {/* Icon */}
                                <div
                                    className="
                                        flex h-11 w-11 shrink-0
                                        items-center justify-center
                                        rounded-xl
                                        bg-red-50
                                        text-red-600
                                        ring-1 ring-red-100
                                        transition-all duration-300
                                        group-hover:scale-105
                                        group-hover:bg-red-600
                                        group-hover:text-white
                                        group-hover:shadow-md
                                    "
                                >
                                    <Icon
                                        size={21}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                {/* Content */}
                                <div className="min-w-0">
                                    <h3
                                        className="
                                            text-sm font-bold
                                            text-gray-900
                                            transition-colors duration-300
                                            group-hover:text-red-600
                                        "
                                    >
                                        {feature.title}
                                    </h3>

                                    <p
                                        className="
                                            mt-1 text-xs
                                            leading-5 text-gray-500
                                        "
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TrustFeatures;
