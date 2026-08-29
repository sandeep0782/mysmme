"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { useLogoutMutation } from "@/store/api/userApi";

const SellerNavbar: React.FC = () => {
  const router = useRouter();

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      await logout({}).unwrap();

      toast.success("Logged out successfully");

      router.replace("/auth/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);

      toast.error("Unable to logout. Please try again.");
    }
  };

  const handleSettings = () => {
    router.push("/platform/seller/settings");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-700 text-lg font-bold text-white">
          S
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">Seller Workspace</h1>

          <p className="text-sm text-slate-500">
            Manage your store and products
          </p>
        </div>
      </div>

      {/* Right */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 transition hover:bg-gray-100 focus:outline-none"
          aria-label="Seller account menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 font-medium text-red-700">
            S
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-gray-600" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoading}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />

            {isLoading ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default SellerNavbar;
