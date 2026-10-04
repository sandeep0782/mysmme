"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Boxes,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileUp,
  Layers3,
  Package,
  Palette,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
  TicketPercent,
  Truck,
  Users,
  XCircle,
} from "lucide-react";

import { useGetSeasonsQuery } from "@/store/api/seasonApi";
import { useGetBrandsQuery } from "@/store/api/brandApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { useGetColorsQuery } from "@/store/api/colorApi";
import { useGetUsersQuery } from "@/store/api/userApi";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";

/* ============================================================
   TYPES
============================================================ */

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type Order = {
  _id: string;

  orderId?: string;
  orderNumber?: string;

  user?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };

  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  totalAmount?: number;
  subtotal?: number;
  shippingCharge?: number;
  discount?: number;

  paymentMethod?: string;
  paymentStatus?: PaymentStatus;

  orderStatus?: OrderStatus;
  status?: OrderStatus;

  createdAt?: string;
  updatedAt?: string;
};

/* ============================================================
   HELPERS
============================================================ */

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOrderStatus = (order: Order): OrderStatus => {
  return order.orderStatus || order.status || "pending";
};

const getOrderNumber = (order: Order) => {
  return order.orderNumber || order.orderId || order._id;
};

const getCustomerName = (order: Order) => {
  return order.customer?.name || order.user?.name || "Customer";
};

const percentage = (value: number, total: number) => {
  if (!total) return 0;

  return Math.round((value / total) * 100);
};

/* ============================================================
   SKELETON
============================================================ */

const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
};

/* ============================================================
   KPI CARD
============================================================ */

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconClass: string;
  iconBg: string;
  href?: string;
  loading?: boolean;
  accentClass?: string;
};

const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
  iconBg,
  href,
  loading,
  accentClass = "bg-violet-500",
}: KpiCardProps) => {
  const content = (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className={`absolute left-0 top-0 h-full w-[3px] ${accentClass}`} />

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          {loading ? (
            <Skeleton className="mt-3 h-9 w-28" />
          ) : (
            <p className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-slate-950">
              {value}
            </p>
          )}

          <p className="mt-2 text-xs leading-5 text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      {href && (
        <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
          View details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
};

/* ============================================================
   ORDER STATUS
============================================================ */

const getStatusAppearance = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return {
        label: "Delivered",
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
        dot: "bg-emerald-500",
      };

    case "shipped":
      return {
        label: "Shipped",
        badge: "bg-blue-50 text-blue-700 ring-blue-600/15",
        dot: "bg-blue-500",
      };

    case "ready_to_ship":
      return {
        label: "Ready to ship",
        badge: "bg-cyan-50 text-cyan-700 ring-cyan-600/15",
        dot: "bg-cyan-500",
      };

    case "processing":
      return {
        label: "Processing",
        badge: "bg-violet-50 text-violet-700 ring-violet-600/15",
        dot: "bg-violet-500",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/15",
        dot: "bg-indigo-500",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        badge: "bg-rose-50 text-rose-700 ring-rose-600/15",
        dot: "bg-rose-500",
      };

    case "returned":
      return {
        label: "Returned",
        badge: "bg-orange-50 text-orange-700 ring-orange-600/15",
        dot: "bg-orange-500",
      };

    default:
      return {
        label: "Pending",
        badge: "bg-amber-50 text-amber-700 ring-amber-600/15",
        dot: "bg-amber-500",
      };
  }
};

/* ============================================================
   PIPELINE ITEM
============================================================ */

const PipelineItem = ({
  icon,
  title,
  value,
  total,
  iconBg,
  iconColor,
  progressColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  total: number;
  iconBg: string;
  iconColor: string;
  progressColor: string;
}) => {
  const progress = percentage(value, total);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">{title}</p>

            <p className="text-lg font-semibold text-slate-950">{value}</p>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${progressColor}`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MARKETPLACE ITEM
============================================================ */

const MarketplaceItem = ({
  title,
  value,
  active,
  href,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  active: number;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <p className="text-xl font-semibold text-slate-950">{value}</p>

          <p className="mb-0.5 text-xs text-slate-400">{active} active</p>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-slate-600" />
    </Link>
  );
};

/* ============================================================
   QUICK ACTION
============================================================ */

const QuickAction = ({
  title,
  description,
  href,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50/70"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>

        <p className="mt-0.5 truncate text-xs text-slate-400">{description}</p>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
    </Link>
  );
};

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

const AdminDashboard = () => {
  /* ==========================================================
     MASTER DATA APIs
  ========================================================== */

  const { data: seasonsResponse, isLoading: seasonsLoading } =
    useGetSeasonsQuery({});

  const { data: brandsResponse, isLoading: brandsLoading } =
    useGetBrandsQuery();

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: colorsResponse, isLoading: colorsLoading } =
    useGetColorsQuery();

  const { data: usersResponse, isLoading: usersLoading } = useGetUsersQuery({});

  /* ==========================================================
     ORDERS
  ========================================================== */

  const { data: ordersResponse, isLoading: ordersLoading } =
    useGetUserOrdersQuery(undefined);

  /* ==========================================================
     NORMALIZED DATA
  ========================================================== */

  const seasons = seasonsResponse?.data ?? [];

  const brands = brandsResponse?.data ?? [];

  const categories = categoriesResponse?.data ?? [];

  const colors = colorsResponse?.data ?? [];

  const users = usersResponse?.data ?? [];

  const orders: Order[] = ordersResponse?.data ?? ordersResponse?.orders ?? [];

  /* ==========================================================
     ORDER STATISTICS
  ========================================================== */

  const orderStats = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => getOrderStatus(order) === "pending",
    ).length;

    const confirmed = orders.filter(
      (order) => getOrderStatus(order) === "confirmed",
    ).length;

    const processing = orders.filter(
      (order) => getOrderStatus(order) === "processing",
    ).length;

    const readyToShip = orders.filter(
      (order) => getOrderStatus(order) === "ready_to_ship",
    ).length;

    const shipped = orders.filter(
      (order) => getOrderStatus(order) === "shipped",
    ).length;

    const delivered = orders.filter(
      (order) => getOrderStatus(order) === "delivered",
    ).length;

    const cancelled = orders.filter(
      (order) => getOrderStatus(order) === "cancelled",
    ).length;

    const returned = orders.filter(
      (order) => getOrderStatus(order) === "returned",
    ).length;

    const paid = orders.filter(
      (order) => order.paymentStatus === "paid",
    ).length;

    const revenue = orders
      .filter((order) => getOrderStatus(order) !== "cancelled")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const deliveredRevenue = orders
      .filter((order) => getOrderStatus(order) === "delivered")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const averageOrderValue = total > 0 ? revenue / total : 0;

    return {
      total,
      pending,
      confirmed,
      processing,
      readyToShip,
      shipped,
      delivered,
      cancelled,
      returned,
      paid,
      revenue,
      deliveredRevenue,
      averageOrderValue,
    };
  }, [orders]);

  /* ==========================================================
     RECENT ORDERS
  ========================================================== */

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;

        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return bTime - aTime;
      })
      .slice(0, 6);
  }, [orders]);

  /* ==========================================================
     MASTER DATA STATS
  ========================================================== */

  const activeBrands = brands.filter((item: any) => item.isActive).length;

  const activeCategories = categories.filter(
    (item: any) => item.isActive,
  ).length;

  const activeColors = colors.filter((item: any) => item.isActive).length;

  const activeSeasons = seasons.filter((item: any) => item.isActive).length;

  const masterLoading =
    seasonsLoading || brandsLoading || categoriesLoading || colorsLoading;

  /* ==========================================================
     ATTENTION COUNT
  ========================================================== */

  const attentionCount =
    orderStats.pending +
    orderStats.readyToShip +
    orderStats.cancelled +
    orderStats.returned;

  return (
    <div className="min-h-screen bg-[#f8f8fa]">
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <section className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white px-6 py-7 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-8">
          <div className="absolute right-0 top-0 h-full w-[420px] bg-gradient-to-l from-violet-50/70 to-transparent" />

          <div className="absolute -right-8 -top-16 h-44 w-44 rounded-full bg-rose-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                  MYSMME
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                Admin Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                A complete view of your marketplace performance, operations and
                catalogue.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/platform/admin/catalogue/import"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <FileUp className="h-4 w-4" />
                Import Catalogue
              </Link>

              <Link
                href="/platform/admin/orders"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
              >
                <ShoppingBag className="h-4 w-4" />
                View Orders
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================
            KPI SECTION
        ==================================================== */}

        <section className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Revenue"
              value={formatCurrency(orderStats.revenue)}
              subtitle={`${formatCurrency(
                orderStats.deliveredRevenue,
              )} delivered revenue`}
              icon={<BadgeIndianRupee className="h-5 w-5" />}
              iconBg="bg-emerald-50"
              iconClass="text-emerald-600"
              accentClass="bg-emerald-500"
              href="/platform/admin/orders"
              loading={ordersLoading}
            />

            <KpiCard
              title="Total Orders"
              value={formatNumber(orderStats.total)}
              subtitle={`${orderStats.pending} awaiting action`}
              icon={<ShoppingBag className="h-5 w-5" />}
              iconBg="bg-violet-50"
              iconClass="text-violet-600"
              accentClass="bg-violet-500"
              href="/platform/admin/orders"
              loading={ordersLoading}
            />

            <KpiCard
              title="Delivered"
              value={formatNumber(orderStats.delivered)}
              subtitle={`${orderStats.shipped} shipments in transit`}
              icon={<CheckCircle2 className="h-5 w-5" />}
              iconBg="bg-blue-50"
              iconClass="text-blue-600"
              accentClass="bg-blue-500"
              href="/platform/admin/orders"
              loading={ordersLoading}
            />

            <KpiCard
              title="Customers"
              value={formatNumber(users.length)}
              subtitle="Registered MYSMME users"
              icon={<Users className="h-5 w-5" />}
              iconBg="bg-rose-50"
              iconClass="text-rose-600"
              accentClass="bg-rose-500"
              href="/platform/admin/users"
              loading={usersLoading}
            />
          </div>
        </section>

        {/* ====================================================
            BUSINESS OVERVIEW
        ==================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.75fr]">
          {/* ORDER PIPELINE */}

          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Operations
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Order pipeline
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Live distribution of orders by fulfilment stage.
                </p>
              </div>

              <Link
                href="/platform/admin/orders"
                className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-800"
              >
                View all orders
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <PipelineItem
                title="Pending"
                value={orderStats.pending}
                total={orderStats.total}
                icon={<Clock3 className="h-4 w-4" />}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                progressColor="bg-amber-400"
              />

              <PipelineItem
                title="Processing"
                value={orderStats.processing + orderStats.confirmed}
                total={orderStats.total}
                icon={<Package className="h-4 w-4" />}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
                progressColor="bg-violet-500"
              />

              <PipelineItem
                title="Ready to Ship"
                value={orderStats.readyToShip}
                total={orderStats.total}
                icon={<Boxes className="h-4 w-4" />}
                iconBg="bg-cyan-50"
                iconColor="text-cyan-600"
                progressColor="bg-cyan-500"
              />

              <PipelineItem
                title="Shipped"
                value={orderStats.shipped}
                total={orderStats.total}
                icon={<Truck className="h-4 w-4" />}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                progressColor="bg-blue-500"
              />

              <PipelineItem
                title="Delivered"
                value={orderStats.delivered}
                total={orderStats.total}
                icon={<CheckCircle2 className="h-4 w-4" />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                progressColor="bg-emerald-500"
              />

              <PipelineItem
                title="Returned"
                value={orderStats.returned}
                total={orderStats.total}
                icon={<RotateCcw className="h-4 w-4" />}
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
                progressColor="bg-orange-500"
              />
            </div>

            {/* SECONDARY BUSINESS METRICS */}

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Average order value
                </p>

                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {formatCurrency(orderStats.averageOrderValue)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Paid orders
                </p>

                <p className="mt-2 text-xl font-semibold text-slate-950">
                  {orderStats.paid}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Cancelled
                </p>

                <p className="mt-2 text-xl font-semibold text-rose-600">
                  {orderStats.cancelled}
                </p>
              </div>
            </div>
          </div>

          {/* ATTENTION */}

          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Priority
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Needs attention
                </h2>
              </div>

              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-rose-50 px-3 text-sm font-bold text-rose-600">
                {attentionCount}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/platform/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 p-4 transition hover:bg-amber-50"
              >
                <div className="flex items-center gap-3">
                  <Clock3 className="h-4 w-4 text-amber-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Pending orders
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Require confirmation
                    </p>
                  </div>
                </div>

                <span className="text-lg font-semibold text-amber-700">
                  {orderStats.pending}
                </span>
              </Link>

              <Link
                href="/platform/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 transition hover:bg-cyan-50"
              >
                <div className="flex items-center gap-3">
                  <Boxes className="h-4 w-4 text-cyan-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Ready to ship
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Awaiting dispatch
                    </p>
                  </div>
                </div>

                <span className="text-lg font-semibold text-cyan-700">
                  {orderStats.readyToShip}
                </span>
              </Link>

              <Link
                href="/platform/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/70 p-4 transition hover:bg-rose-50"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="h-4 w-4 text-rose-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Cancelled
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Review cancellation
                    </p>
                  </div>
                </div>

                <span className="text-lg font-semibold text-rose-700">
                  {orderStats.cancelled}
                </span>
              </Link>

              <Link
                href="/platform/admin/orders"
                className="group flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/70 p-4 transition hover:bg-orange-50"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 text-orange-600" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Returns
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Returned orders
                    </p>
                  </div>
                </div>

                <span className="text-lg font-semibold text-orange-700">
                  {orderStats.returned}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ====================================================
            RECENT ORDERS
        ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Commerce
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Recent orders
              </h2>
            </div>

            <Link
              href="/platform/admin/orders"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-14 w-full" />
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50/70">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Order
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Payment
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => {
                    const orderStatus = getOrderStatus(order);

                    const appearance = getStatusAppearance(orderStatus);

                    return (
                      <tr
                        key={order._id}
                        className="group transition hover:bg-slate-50/60"
                      >
                        <td className="px-6 py-4">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                            #{getOrderNumber(order)}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {getCustomerName(order)}
                          </p>

                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                            {order.user?.email || order.customer?.email || ""}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatCurrency(Number(order.totalAmount || 0))}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              order.paymentStatus === "paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : order.paymentStatus === "failed"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {order.paymentStatus || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${appearance.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${appearance.dot}`}
                            />

                            {appearance.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/platform/admin/orders/${order._id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                            title="View order"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <ShoppingBag className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Customer orders will appear here.
              </p>
            </div>
          )}
        </section>

        {/* ====================================================
            BOTTOM GRID
        ==================================================== */}

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          {/* MARKETPLACE */}

          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Catalogue
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Marketplace setup
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Core catalogue data used across MYSMME.
              </p>
            </div>

            {masterLoading ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MarketplaceItem
                  title="Brands"
                  value={brands.length}
                  active={activeBrands}
                  href="/platform/admin/brand"
                  icon={<Tags className="h-5 w-5" />}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                />

                <MarketplaceItem
                  title="Categories"
                  value={categories.length}
                  active={activeCategories}
                  href="/platform/admin/category"
                  icon={<Layers3 className="h-5 w-5" />}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-600"
                />

                <MarketplaceItem
                  title="Colors"
                  value={colors.length}
                  active={activeColors}
                  href="/platform/admin/colors"
                  icon={<Palette className="h-5 w-5" />}
                  iconBg="bg-rose-50"
                  iconColor="text-rose-600"
                />

                <MarketplaceItem
                  title="Seasons"
                  value={seasons.length}
                  active={activeSeasons}
                  href="/platform/admin/season"
                  icon={<CalendarDays className="h-5 w-5" />}
                  iconBg="bg-cyan-50"
                  iconColor="text-cyan-600"
                />
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}

          <div className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Shortcuts
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                Quick actions
              </h2>
            </div>

            <div className="mt-6 space-y-3">
              <QuickAction
                title="Manage Orders"
                description="Review, ship and manage orders"
                href="/platform/admin/orders"
                icon={<ShoppingBag className="h-4 w-4" />}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
              />

              <QuickAction
                title="Import Catalogue"
                description="Bulk import saree products"
                href="/platform/admin/catalogue/import"
                icon={<FileUp className="h-4 w-4" />}
                iconBg="bg-violet-50"
                iconColor="text-violet-600"
              />

              <QuickAction
                title="Manage Coupons"
                description="Offers, discounts and campaigns"
                href="/platform/admin/coupons"
                icon={<TicketPercent className="h-4 w-4" />}
                iconBg="bg-rose-50"
                iconColor="text-rose-600"
              />

              <QuickAction
                title="Manage Users"
                description="View registered customers"
                href="/platform/admin/users"
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
              />
            </div>
          </div>
        </section>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>MYSMME Admin Console</p>

          <div className="flex items-center gap-2">
            <Store className="h-3.5 w-3.5" />

            <span>Saree Marketplace</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminDashboard;
