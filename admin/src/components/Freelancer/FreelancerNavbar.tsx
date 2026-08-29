"use client";

import React from "react";
import { Bell, Menu, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/slice/userSlice";

interface FreelancerNavbarProps {
  toggleSidebar: () => void;
}

export default function FreelancerNavbar({
  toggleSidebar,
}: FreelancerNavbarProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    router.push("/auth/login");
  };

  return (
    <header className="relative z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
        >
          <Menu size={19} />
        </button>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">
            <span className="text-red-700">MYSMME</span> Creator Studio
          </p>

          <p className="text-xs text-slate-400">
            Manage your collaborations and content
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => router.push("/platform/freelancer/reels/submit")}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          <Upload size={16} />

          <span className="hidden sm:inline">Submit Reel</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative group">
          <button
            type="button"
            onClick={() => router.push("/platform/freelancer/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white  cursor-pointer"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "F"}
          </button>

          {/* Profile dropdown */}
          <div className="absolute right-0 top-full z-50 hidden w-64 pt-2 group-hover:block">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "F"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Freelancer</p>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                </div>
              </div>

              <div className="my-3 border-t border-gray-100" />

              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/profile")}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                View Profile
              </button>

              <button
                type="button"
                onClick={() => router.push("/platform/freelancer/settings")}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
