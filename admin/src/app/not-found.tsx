"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-6">
            {/* Background decoration */}
            <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-gray-200 blur-3xl" />

            <div className="relative z-10 w-full max-w-lg text-center">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Image
                        src="/images/logo.webp"
                        width={72}
                        height={72}
                        alt="Company logo"
                        priority
                        className="h-[72px] w-[72px] object-contain"
                    />
                </div>

                {/* 404 */}
                <div className="relative">
                    <h1 className="text-[120px] font-black leading-none tracking-tight text-red-600 sm:text-[150px]">
                        404
                    </h1>

                    <div className="absolute inset-x-0 bottom-2 mx-auto h-4 max-w-[280px] rounded-full bg-red-500/10 blur-xl" />
                </div>

                {/* Message */}
                <h2 className="mt-4 text-2xl font-bold text-red-600 sm:text-3xl">
                    Page Not Found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                    Sorry, the page you're looking for doesn't exist,
                    has been moved, or you may not have access to it.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 cursor-pointer"
                    >
                        Go Back
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/platform/admin")}
                        className="rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-10 text-xs text-gray-400">
                    Error Code: 404
                </p>
            </div>
        </div>
    );
};

export default NotFound;