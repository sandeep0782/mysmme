"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogoutMutation } from "@/store/api/userApi";

const UnauthorizedPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const dashboard = searchParams.get("dashboard");

    const [logout, { isLoading }] = useLogoutMutation();

    const handleDashboard = () => {
        console.log("DASHBOARD PARAM:", dashboard);

        if (dashboard) {
            router.replace(dashboard);
            return;
        }

        router.replace("/auth/login");
    };

    const handleLogout = async () => {
        try {
            await logout({}).unwrap();
            router.replace("/auth/login");
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
                <div className="mb-5 flex justify-center">
                    <Image
                        src="/images/logo.webp"
                        width={80}
                        height={80}
                        alt="Company logo"
                        priority
                        className="h-20 w-20 object-contain"
                    />
                </div>

                <h1 className="text-3xl font-bold text-red-500">
                    Access Denied
                </h1>

                <p className="mt-3 text-gray-600">
                    You do not have permission to access this page.
                </p>

                <div className="mt-7 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={handleDashboard}
                        className="rounded-md bg-red-600 px-5 py-2.5 text-white transition hover:bg-red-800 cursor-pointer"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="rounded-md border border-gray-300 px-5 py-2.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;