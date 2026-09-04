"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetSeasonsQuery } from "@/store/api/seasonApi";
import Link from "next/link";
import { useGetBrandsQuery } from "@/store/api/brandApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetColorsQuery } from "@/store/api/colorApi";
import { useGetUsersQuery } from "@/store/api/userApi";

const AdminDashboard = () => {
  const router = useRouter();
  // Season Data
  const { data: seasonsResponse, isLoading: seasonsLoading } =
    useGetSeasonsQuery({});
  const seasons = seasonsResponse?.data ?? [];
  const seasonCount = seasons.length;
  const activeSeasonCount = seasons.filter(
    (season: any) => season.isActive,
  ).length;
  const inactiveSeasonCount = seasons.filter(
    (season: any) => !season.isActive,
  ).length;

  // Brand Data
  const { data: brandsResponse, isLoading: brandsLoading } =
    useGetBrandsQuery();
  const brands = brandsResponse?.data ?? [];
  const brandCount = brands.length;
  const activeBrandCount = brands.filter((brand) => brand.isActive).length;
  const inactiveBrandCount = brands.filter((brand) => !brand.isActive).length;

  // Category Data
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const categories = categoriesResponse?.data ?? [];
  const categoriesCount = categories.length;
  const activeCategoriesCount = categories.filter(
    (category) => category.isActive,
  ).length;
  const inactiveCategoriesCount = categories.filter(
    (category) => !category.isActive,
  ).length;

  // COLOR DATA

  const { data: colorsResponse, isLoading: colorsLoading } =
    useGetColorsQuery();

  const colors = colorsResponse?.data ?? [];
  const colorsCount = colors.length;
  const activeColorsCount = colors.filter((color) => color.isActive).length;
  const inactiveColorsCount = colors.filter((color) => !color.isActive).length;

  const { data: usersResponse, isLoading, isError } = useGetUsersQuery({});
  const user = usersResponse?.data ?? [];
  const userCount = user.length;
  console.log(userCount);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main */}
      <main className="px-4 py-2">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            Welcome to the Admin Console
          </h2>

          <p className="mt-2 text-slate-500">
            Manage users, sellers, freelancers, products, and platform
            operations from one place.
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Users</p>
            <Link href="/platform/admin/users">
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {userCount}
              </p>
            </Link>
            <p className="mt-2 text-xs text-slate-400">Registered users</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Sellers</p>

            <p className="mt-2 text-3xl font-bold text-blue-700">0</p>

            <p className="mt-2 text-xs text-slate-400">Active sellers</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Freelancers</p>

            <p className="mt-2 text-3xl font-bold text-violet-600">0</p>

            <p className="mt-2 text-xs text-slate-400">Active freelancers</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Platform Revenue</p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">₹0</p>

            <p className="mt-2 text-xs text-slate-400">Total revenue</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* ============================================================
        SEASONS
    ============================================================ */}

          <Link
            href="/platform/admin/season"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
          >
            {/* Accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

            <div className="flex items-start justify-between">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xl">☀️</span>
              </div>

              {/* Arrow */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                <span className="text-lg">→</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-500">Seasons</p>

              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {seasonCount}
                </p>

                <span className="mb-1 text-xs font-medium text-slate-400">
                  total
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-slate-500">
                  Active
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  {activeSeasonCount}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />

                <span className="text-xs font-medium text-slate-500">
                  Inactive
                </span>

                <span className="text-sm font-bold text-slate-600">
                  {inactiveSeasonCount}
                </span>
              </div>
            </div>
          </Link>

          {/* ============================================================
        BRANDS
    ============================================================ */}

          <Link
            href="/platform/admin/brand"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-400" />

            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xl">🏷️</span>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-purple-50 group-hover:text-purple-600">
                <span className="text-lg">→</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-500">Brands</p>

              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {brandCount}
                </p>

                <span className="mb-1 text-xs font-medium text-slate-400">
                  total
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-slate-500">
                  Active
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  {activeBrandCount}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />

                <span className="text-xs font-medium text-slate-500">
                  Inactive
                </span>

                <span className="text-sm font-bold text-slate-600">
                  {inactiveBrandCount}
                </span>
              </div>
            </div>
          </Link>

          {/* ============================================================
        CATEGORIES
    ============================================================ */}

          <Link
            href="/platform/admin/category"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400" />

            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xl">📦</span>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-orange-50 group-hover:text-orange-600">
                <span className="text-lg">→</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-500">Categories</p>

              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {categoriesCount}
                </p>

                <span className="mb-1 text-xs font-medium text-slate-400">
                  total
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-slate-500">
                  Active
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  {activeCategoriesCount}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />

                <span className="text-xs font-medium text-slate-500">
                  Inactive
                </span>

                <span className="text-sm font-bold text-slate-600">
                  {inactiveCategoriesCount}
                </span>
              </div>
            </div>
          </Link>

          {/* ============================================================
        COLORS
    ============================================================ */}

          <Link
            href="/platform/admin/colors"
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/50"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 to-rose-400" />

            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600 transition-transform duration-300 group-hover:scale-110">
                <span className="text-xl">🎨</span>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-pink-50 group-hover:text-pink-600">
                <span className="text-lg">→</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-slate-500">Colors</p>

              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  {colorsCount}
                </p>

                <span className="mb-1 text-xs font-medium text-slate-400">
                  total
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-medium text-slate-500">
                  Active
                </span>

                <span className="text-sm font-bold text-emerald-600">
                  {activeColorsCount}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />

                <span className="text-xs font-medium text-slate-500">
                  Inactive
                </span>

                <span className="text-sm font-bold text-slate-600">
                  {inactiveColorsCount}
                </span>
              </div>
            </div>
          </Link>
        </div>
        {/* Management */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Platform Management
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage the different areas of your platform.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                U
              </div>

              <p className="font-semibold text-slate-900">Manage Users</p>

              <p className="mt-1 text-sm text-slate-500">
                View and manage platform users.
              </p>
            </button>

            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-200 p-5 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                S
              </div>

              <p className="font-semibold text-slate-900">Manage Sellers</p>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage seller accounts.
              </p>
            </button>

            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-200 p-5 text-left transition hover:border-violet-300 hover:bg-violet-50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                F
              </div>

              <p className="font-semibold text-slate-900">Manage Freelancers</p>

              <p className="mt-1 text-sm text-slate-500">
                Manage freelancer accounts and projects.
              </p>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                System Status
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Current platform health
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-emerald-700">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">API</p>

              <p className="mt-1 font-semibold text-emerald-600">Operational</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Database</p>

              <p className="mt-1 font-semibold text-emerald-600">Operational</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Authentication</p>

              <p className="mt-1 font-semibold text-emerald-600">Operational</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
