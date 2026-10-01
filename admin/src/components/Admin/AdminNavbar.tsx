"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { LogOut, Settings, User } from "lucide-react";

import { useLogoutMutation } from "@/store/api/userApi";
import { RootState } from "@/store/store";

const getInitials = (name?: string) => {
  if (!name?.trim()) {
    return "AD";
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return words[0].slice(0, 2).toUpperCase();
};

const AdminNavbar: React.FC = () => {
  const router = useRouter();

  /* ==============================================================
     LOGGED-IN USER FROM REDUX
  ============================================================== */

  const user = useSelector((state: RootState) => state.user.user);

  /* ==============================================================
     LOGOUT
  ============================================================== */

  const [logout, { isLoading }] = useLogoutMutation();

  /* ==============================================================
     USER DETAILS
  ============================================================== */

  const userName = user?.name || "Admin";

  const userEmail = user?.email || "";

  const userRole = user?.role || "admin";

  const profilePicture = user?.profilePicture || "";

  const initials = getInitials(userName);

  /* ==============================================================
     HANDLERS
  ============================================================== */

  const handleLogout = async () => {
    if (isLoading) {
      return;
    }

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
    router.push("/platform/admin/settings");
  };

  const handleProfile = () => {
    router.push("/platform/admin/profile");
  };

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* =========================================================
          LEFT
      ========================================================= */}

      <div className="flex items-center gap-3">
        {/* INITIALS / LOGO */}

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-700 text-sm font-bold uppercase text-white">
          {initials}
        </div>

        {/* TITLE */}

        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Console</h1>

          <p className="text-sm text-slate-500">
            Manage and monitor your platform
          </p>
        </div>
      </div>

      {/* =========================================================
          RIGHT ACCOUNT MENU
      ========================================================= */}

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-100 focus:outline-none"
          aria-label="Admin account menu"
        >
          {/* USER NAME + ROLE */}

          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-xs capitalize text-slate-500">{userRole}</p>
          </div>

          {/* PROFILE IMAGE / INITIALS */}

          {profilePicture ? (
            <img
              src={profilePicture}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-bold uppercase text-red-700 ring-1 ring-red-100">
              {initials}
            </div>
          )}
        </DropdownMenuTrigger>

        {/* =======================================================
            DROPDOWN CONTENT
        ======================================================= */}

        <DropdownMenuContent align="end" className="w-64">
          {/* USER DETAILS */}

          <div className="px-3 py-3">
            <div className="flex items-center gap-3">
              {/* PROFILE IMAGE */}

              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={userName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gray-200"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold uppercase text-red-700">
                  {initials}
                </div>
              )}

              {/* USER INFO */}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>

                {userEmail && (
                  <p className="truncate text-xs text-slate-500">{userEmail}</p>
                )}

                <p className="mt-0.5 text-[11px] capitalize text-slate-400">
                  {userRole}
                </p>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* PROFILE */}

          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4 text-gray-600" />
            Profile
          </DropdownMenuItem>

          {/* SETTINGS */}

          <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-gray-600" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* LOGOUT */}

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

export default AdminNavbar;
