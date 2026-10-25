"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  TicketPercent,
  Copy,
  Check,
  Search,
  CalendarDays,
  Loader2,
  AlertCircle,
  RefreshCw,
  IndianRupee,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type Coupon = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  startsAt: string;
  expiresAt: string;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser: number;
  firstOrderOnly: boolean;
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;
  isActive: boolean;
};

type Filter = "all" | "active" | "upcoming" | "expired" | "inactive";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

function getStatus(coupon: Coupon): Exclude<Filter, "all"> {
  const now = Date.now();

  if (!coupon.isActive) return "inactive";
  if (new Date(coupon.startsAt).getTime() > now) return "upcoming";
  if (new Date(coupon.expiresAt).getTime() <= now) return "expired";

  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return "inactive";
  }

  return "active";
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Page() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [copied, setCopied] = useState("");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/coupons/users-all-coupons`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load coupons");
      }

      const list = Array.isArray(data?.data) ? data.data : [];
      setCoupons(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        `${coupon.code} ${coupon.name} ${coupon.description || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter = filter === "all" || getStatus(coupon) === filter;

      return matchesSearch && matchesFilter;
    });
  }, [coupons, search, filter]);

  const stats = useMemo(
    () => ({
      total: coupons.length,
      active: coupons.filter((c) => getStatus(c) === "active").length,
      expired: coupons.filter((c) => getStatus(c) === "expired").length,
      upcoming: coupons.filter((c) => getStatus(c) === "upcoming").length,
    }),
    [coupons],
  );

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      setError("Unable to copy coupon code");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-rose-600">
              <TicketPercent size={17} />
              Freelancer Dashboard
            </div>
            <h1 className="text-3xl font-bold tracking-tight">My Coupons</h1>
            <p className="mt-1 text-sm text-slate-500">
              View, manage and share your assigned coupons.
            </p>
          </div>

          <button
            onClick={() => void loadCoupons()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total Coupons", value: stats.total },
            { label: "Active Coupons", value: stats.active },
            { label: "Upcoming", value: stats.upcoming },
            { label: "Expired", value: stats.expired },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coupon code or name..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-rose-400"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive / Exhausted</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={32} />
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <TicketPercent size={40} className="mx-auto mb-4 text-slate-300" />
            <h3 className="font-semibold">No coupons found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No assigned coupons match your selection.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCoupons.map((coupon) => {
              const status = getStatus(coupon);

              const discount =
                coupon.discountType === "percentage"
                  ? `${coupon.discountValue}% OFF`
                  : `${money(coupon.discountValue)} OFF`;

              const commission =
                coupon.commissionType === "percentage"
                  ? `${coupon.commissionValue ?? 0}%`
                  : money(coupon.commissionValue ?? 0);

              return (
                <div
                  key={coupon._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="border-b border-dashed border-slate-200 bg-gradient-to-r from-rose-50 to-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-600">
                        {coupon.code}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-slate-900">
                      {discount}
                    </h2>
                    <p className="mt-1 font-medium">{coupon.name}</p>
                    {coupon.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {coupon.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                        <IndianRupee size={16} />
                        Your Commission
                      </span>
                      <strong className="text-lg text-emerald-700">
                        {commission}
                      </strong>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">Minimum order</span>
                        <span className="font-medium">
                          {money(coupon.minimumOrderAmount || 0)}
                        </span>
                      </div>

                      {coupon.maximumDiscountAmount != null && (
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500">Max discount</span>
                          <span className="font-medium">
                            {money(coupon.maximumDiscountAmount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <CalendarDays size={14} />
                          Valid until
                        </span>
                        <span className="font-medium">
                          {formatDate(coupon.expiresAt)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users size={14} />
                          Total redemptions
                        </span>
                        <span className="font-medium">
                          {coupon.usageCount || 0}
                          {coupon.usageLimit != null
                            ? ` / ${coupon.usageLimit}`
                            : ""}
                        </span>
                      </div>
                    </div>

                    {coupon.firstOrderOnly && (
                      <p className="text-xs text-amber-700">
                        First order customers only
                      </p>
                    )}

                    <button
                      onClick={() => void copyCode(coupon.code)}
                      disabled={status !== "active"}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {copied === coupon.code ? (
                        <>
                          <Check size={17} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={17} /> Copy Coupon Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
