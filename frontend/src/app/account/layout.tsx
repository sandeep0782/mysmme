"use client";

import {
  LogOut,
  ShoppingCart,
  User,
  Heart,
  MapPin,
  ChevronRight,
  Settings,
  ShieldCheck,
  Package,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";

import toast from "react-hot-toast";
import { useLogoutMutation } from "@/store/api/userApi";
import NoData from "@/lib/NoData";
import { useEffect } from "react";

const navigation = [
  {
    title: "My Profile",
    description: "Personal information",
    href: "/account/profile",
    icon: User,
  },
  {
    title: "My Orders",
    description: "Track your purchases",
    href: "/account/orders",
    icon: ShoppingCart,
  },
  {
    title: "My Addresses",
    description: "Manage your Addresses",
    href: "/account/address",
    icon: MapPin,
  },
  {
    title: "Wishlist",
    description: "Your saved products",
    href: "/account/wishlist",
    icon: Heart,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (user && user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();

      dispatch(logout());

      toast.success("Logged out successfully");

      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <NoData
          message="Please log in to access your account."
          description="Sign in to manage your profile, orders, wishlist and products."
          buttonText="Login"
          imageUrl="/images/login.jpg"
          onClick={handleOpenLogin}
        />
      </div>
    );
  }

  const userPlaceholder =
    user?.name
      ?.split(" ")
      .map((name: string) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const activePage =
    navigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.title || "Overview";

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* ACCOUNT HERO */}
        {/* ================================================= */}

        <div className="relative mb-4 shrink-0 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-400" />

          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-orange-300/20" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-14 w-14 shrink-0 border-4 border-white/30 shadow-lg sm:h-16 sm:w-16">
                {user.profilePicture ? (
                  <AvatarImage
                    src={user.profilePicture}
                    alt={user.name}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-white text-lg font-bold text-orange-600">
                    {userPlaceholder}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0 text-white">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-orange-100">
                    Welcome back
                  </p>

                  <ShieldCheck className="h-3.5 w-3.5 text-orange-100" />
                </div>

                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  {user.name}
                </h1>

                <p className="truncate text-sm text-orange-50">{user.email}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white backdrop-blur-sm lg:self-auto">
              <div className="rounded-lg bg-white/15 p-2">
                <Settings className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[11px] text-orange-100">Account</p>

                <p className="text-sm font-semibold">Personal Account</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* MAIN AREA */}
        {/* ================================================= */}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="hidden min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex lg:flex-col">
            <div className="shrink-0 px-5 pb-3 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Account Menu
              </p>

              <p className="mt-1 text-xs text-slate-400">Manage your account</p>
            </div>

            {/* Sidebar navigation */}
            <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              <div className="space-y-1.5">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-orange-50 to-amber-50"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-orange-500" />
                      )}

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold ${
                            isActive ? "text-orange-700" : "text-slate-700"
                          }`}
                        >
                          {item.title}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 ${
                          isActive ? "text-orange-400" : "text-slate-300"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <Separator />

            <div className="shrink-0 p-3">
              <div className="rounded-xl bg-slate-50 p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />

                  <p className="text-xs font-semibold text-slate-700">
                    Your Account
                  </p>
                </div>

                <p className="text-[11px] leading-5 text-slate-500">
                  Manage your orders, products, profile and wishlist from one
                  place.
                </p>
              </div>
            </div>

            <Separator />

            <div className="shrink-0 p-3">
              <Button
                variant="ghost"
                className="h-10 w-full justify-start gap-3 rounded-xl px-3 text-slate-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                  <LogOut className="h-4 w-4" />
                </div>

                <span className="text-sm font-medium">Logout</span>
              </Button>
            </div>
          </aside>

          {/* ================================================= */}
          {/* MAIN CONTENT */}
          {/* ================================================= */}

          <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Fixed content header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">
                  Account
                </p>

                <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
                  {activePage}
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-emerald-700">
                  Account Active
                </span>
              </div>
            </div>

            {/* ============================================= */}
            {/* ACTUAL SCROLL CONTAINER */}
            {/* ============================================= */}

            <div
              className="
              min-h-0
              flex-1
              overflow-y-auto
              overscroll-contain
              scroll-smooth
              [scrollbar-gutter:stable]
            "
            >
              <div className="p-4 sm:p-6 lg:p-7">{children}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
