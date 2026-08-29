"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Upload,
  Video,
  X,
} from "lucide-react";

interface FreelancerSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    href: "/platform/freelancer",
    icon: LayoutDashboard,
  },
  {
    label: "Campaigns",
    href: "/platform/freelancer/campaigns",
    icon: BriefcaseBusiness,
  },
  {
    label: "My Reels",
    href: "/platform/freelancer/reels",
    icon: Video,
  },
  {
    label: "Submit Reel",
    href: "/platform/freelancer/reels/submit",
    icon: Upload,
  },
  {
    label: "Social Accounts",
    href: "/platform/freelancer/social",
    icon: Share2,
  },
  {
    label: "Earnings",
    href: "/platform/freelancer/earnings",
    icon: CircleDollarSign,
  },
];

const secondaryNavigation = [
  {
    label: "Analytics",
    href: "/platform/freelancer/analytics",
    icon: BarChart3,
  },
  {
    label: "Profile",
    href: "/platform/freelancer/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/platform/freelancer/settings",
    icon: Settings,
  },
];

export default function FreelancerSidebar({
  isOpen,
  toggleSidebar,
}: FreelancerSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/platform/freelancer") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
                SIDEBAR WRAPPER

                Desktop:
                open   = 270px
                closed = 0px

                Mobile:
                drawer
            ===================================================== */}

      <div
        className={`
                    relative
                    z-50
                    hidden
                    shrink-0
                    transition-[width]
                    duration-300
                    ease-in-out
                    lg:block
                    ${isOpen ? "w-[270px]" : "w-0"}
                `}
      >
        <aside
          className={`
                        absolute
                        inset-y-0
                        left-0
                        flex
                        w-[270px]
                        flex-col
                        overflow-hidden
                        border-r
                        border-slate-200
                        bg-white
                        transition-transform
                        duration-300
                        ease-in-out
                        ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
        >
          {/* LOGO */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
            <Link
              href="/platform/freelancer"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white">
                M
              </div>

              <div className="whitespace-nowrap">
                <p className="text-sm font-bold text-slate-900">
                  <span className="text-red-700">MYSMME</span>
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-500">
                  Creator Studio
                </p>
              </div>
            </Link>
          </div>

          {/* CREATOR CARD */}
          <div className="px-4 pt-5">
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                  F
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Creator
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <span className="text-[11px] text-slate-500">
                      Available for work
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-6 flex-1 overflow-y-auto px-3">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Workspace
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                                            group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                                            ${
                                              active
                                                ? "bg-violet-600 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                                            }
                                        `}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-white"
                          : "text-slate-400 group-hover:text-violet-600"
                      }
                    />

                    <span className="whitespace-nowrap">{item.label}</span>

                    {item.label === "Submit Reel" && (
                      <span
                        className={`
                                                    ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold uppercase
                                                    ${
                                                      active
                                                        ? "bg-white/20 text-white"
                                                        : "bg-violet-100 text-violet-600"
                                                    }
                                                `}
                      >
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="my-5 h-px bg-slate-100" />

            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Account
            </p>

            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                                            flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                                            ${
                                              active
                                                ? "bg-violet-600 text-white"
                                                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                                            }
                                        `}
                  >
                    <Icon size={18} />

                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* TIP */}
          <div className="px-4 pb-4">
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Sparkles size={16} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-violet-900">
                    Creator Tip
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-violet-700">
                    Consistent, authentic content performs better.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP COLLAPSE BUTTON */}
          <div className="border-t border-slate-100 p-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
            >
              <ChevronLeft size={16} />
              Collapse
            </button>
          </div>
        </aside>
      </div>

      {/* =====================================================
                MOBILE SIDEBAR
            ===================================================== */}

      <aside
        className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-[270px]
                    flex-col
                    border-r
                    border-slate-200
                    bg-white
                    shadow-2xl
                    transition-transform
                    duration-300
                    lg:hidden
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        {/* MOBILE HEADER */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/platform/freelancer" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white">
              M
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">MySareeMe</p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-500">
                Creator Studio
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleSidebar}
                  className={`
                                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                                        ${
                                          active
                                            ? "bg-violet-600 text-white"
                                            : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                                        }
                                    `}
                >
                  <Icon size={18} />

                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="my-5 h-px bg-slate-100" />

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleSidebar}
                  className={`
                                        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                                        ${
                                          active
                                            ? "bg-violet-600 text-white"
                                            : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                                        }
                                    `}
                >
                  <Icon size={18} />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
