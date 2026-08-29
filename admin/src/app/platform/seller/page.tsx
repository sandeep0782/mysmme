"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Clock3,
  IndianRupee,
  Plus,
  ArrowRight,
  TrendingUp,
  Store,
} from "lucide-react";

const SellerDashboard = () => {
  const router = useRouter();

  const stats = [
    {
      title: "Total Products",
      value: "0",
      description: "Products in your catalogue",
      icon: Package,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      cardBg: "from-white to-red-50/70",
    },
    {
      title: "Total Orders",
      value: "0",
      description: "Orders received",
      icon: ShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      cardBg: "from-white to-blue-50/70",
    },
    {
      title: "Pending Orders",
      value: "0",
      description: "Orders waiting for action",
      icon: Clock3,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      cardBg: "from-white to-amber-50/70",
    },
    {
      title: "Total Sales",
      value: "₹0",
      description: "Your total revenue",
      icon: IndianRupee,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      cardBg: "from-white to-emerald-50/70",
    },
  ];

  const quickActions = [
    {
      title: "Add Product",
      description: "Add a new product to your store",
      icon: Plus,
      href: "/platform/seller/catalogue/create",
    },
    {
      title: "Manage Products",
      description: "View and manage your products",
      icon: Package,
      href: "/platform/seller/catalogue",
    },
    {
      title: "View Orders",
      description: "Track and manage customer orders",
      icon: ShoppingBag,
      href: "/platform/seller/orders",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-6 lg:p-8">
        {/* Welcome Banner */}
        <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-6 text-white shadow-lg sm:p-8">
          {/* Decorative Background */}
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-red-800/20" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-red-100">
                <Store className="h-5 w-5" />

                <span className="text-sm font-medium">Seller Dashboard</span>
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Welcome back to <span className="text-white">MYSMME</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm text-red-100 sm:text-base">
                Manage your products, orders, inventory and sales from one
                simple workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/platform/seller/catalogue/create")}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-white px-5 py-3
                text-sm font-semibold text-red-700
                shadow-md transition
                hover:bg-red-50 hover:shadow-lg
                active:scale-95
              "
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Overview</h3>

            <p className="text-sm text-slate-500">
              Your store performance at a glance
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className={`
                    group rounded-2xl border border-slate-200
                    bg-gradient-to-br ${stat.cardBg}
                    p-5 shadow-sm
                    transition duration-200
                    hover:-translate-y-1
                    hover:border-slate-300
                    hover:shadow-md
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`
                        flex h-11 w-11 items-center justify-center
                        rounded-xl ${stat.iconBg}
                        transition
                        group-hover:scale-105
                      `}
                    >
                      <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-red-50/40 p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>

            <p className="mt-1 text-sm text-slate-500">
              Common tasks to manage your store
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => router.push(action.href)}
                  className="
                    group flex items-center gap-4
                    rounded-xl border border-slate-200
                    bg-gradient-to-br from-white to-slate-50
                    p-4 text-left
                    transition duration-200
                    hover:border-red-200
                    hover:from-red-50
                    hover:to-white
                    hover:shadow-sm
                  "
                >
                  <div
                    className="
                      flex h-11 w-11 flex-shrink-0
                      items-center justify-center
                      rounded-xl bg-red-50
                      text-red-600
                      transition
                      group-hover:bg-red-100
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">
                      {action.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRight
                    className="
                      h-4 w-4 flex-shrink-0 text-slate-400
                      transition
                      group-hover:translate-x-1
                      group-hover:text-red-600
                    "
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Bottom Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Orders
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest customer orders
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/platform/seller/orders")}
                className="
                  flex items-center gap-1
                  text-sm font-semibold text-red-600
                  transition hover:text-red-700
                "
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex min-h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <ShoppingBag className="h-5 w-5 text-slate-400" />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No orders yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Your recent orders will appear here.
                </p>
              </div>
            </div>
          </section>

          {/* Sales Performance */}
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/50 p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Sales Performance
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Track your store revenue
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-emerald-100 bg-white/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Total Revenue
                  </p>

                  <p className="text-2xl font-bold text-slate-900">₹0</p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-0 rounded-full bg-emerald-500" />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-400">Current performance</p>

                <span className="text-xs font-medium text-emerald-600">0%</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
