"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Eye,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetSellerOrdersQuery } from "@/store/api/sellerApi";
import Spinner from "@/lib/Spinner";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  amount: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
};

type SellerOrderResponse = {
  _id: string;
  order?: {
    _id?: string;
    orderNumber?: string;
    user?: {
      name?: string;
      email?: string;
    };
    paymentStatus?: string;
    paymentMethod?: string;
    createdAt?: string;
  };
  items?: unknown[];
  totalAmount?: number;
  amount?: number;
  status?: string;
};

type SellerOrdersApiResponse = {
  data?: SellerOrderResponse[];
};

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },

  CONFIRMED: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },

  PROCESSING: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Package,
  },

  SHIPPED: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Truck,
  },

  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const SellerOrdersPage = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetSellerOrdersQuery() as {
    data?: SellerOrdersApiResponse;
    isLoading: boolean;
    isError: boolean;
  };

  /**
   * Transform backend SellerOrder data
   * into the shape required by the UI.
   */
const orders: Order[] = useMemo(() => {
  const sellerOrders = ordersResponse?.data ?? [];

  return sellerOrders.map((sellerOrder) => {
    const order = sellerOrder.order;

    // ==============================
    // PAYMENT STATUS
    // ==============================
    const rawPaymentStatus = order?.paymentStatus?.toLowerCase();

    let paymentStatus: PaymentStatus;

    switch (rawPaymentStatus) {
      case "paid":
      case "completed":
      case "success":
      case "successful":
        paymentStatus = "PAID";
        break;

      case "refunded":
        paymentStatus = "REFUNDED";
        break;

      case "failed":
      case "failure":
        paymentStatus = "FAILED";
        break;

      default:
        paymentStatus = "PENDING";
    }

    // ==============================
    // ORDER STATUS
    // ==============================
    const rawStatus = sellerOrder.status?.toLowerCase();

    const statusMap: Record<string, OrderStatus> = {
      pending: "PENDING",
      confirmed: "CONFIRMED",
      processing: "PROCESSING",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    };

    const status: OrderStatus =
      statusMap[rawStatus || ""] || "PENDING";

    console.log("========== FINAL ORDER ==========");
    console.log("RAW STATUS:", sellerOrder.status);
    console.log("FINAL STATUS:", status);
    console.log("RAW PAYMENT:", order?.paymentStatus);
    console.log("FINAL PAYMENT:", paymentStatus);
    console.log("================================");

    return {
      id: sellerOrder._id,

      orderNumber: order?.orderNumber || sellerOrder._id,

      customer: order?.user?.name || "Unknown Customer",

      email: order?.user?.email || "",

      date: order?.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",

      items: sellerOrder.items?.length || 0,

      amount: sellerOrder.totalAmount ?? sellerOrder.amount ?? 0,

      paymentStatus,

      status,
    };
  });
}, [ordersResponse]);
  /**
   * Search + status filtering
   */
  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.email.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  /**
   * Status counts
   */
  const statusCounts = useMemo(
    () => ({
      ALL: orders.length,

      PENDING: orders.filter((order) => order.status === "PENDING").length,

      CONFIRMED: orders.filter((order) => order.status === "CONFIRMED").length,

      PROCESSING: orders.filter((order) => order.status === "PROCESSING")
        .length,

      SHIPPED: orders.filter((order) => order.status === "SHIPPED").length,

      DELIVERED: orders.filter((order) => order.status === "DELIVERED").length,

      CANCELLED: orders.filter((order) => order.status === "CANCELLED").length,
    }),
    [orders],
  );

  const tabs: Array<{
    label: string;
    value: "ALL" | OrderStatus;
  }> = [
    {
      label: "All Orders",
      value: "ALL",
    },
    {
      label: "Pending",
      value: "PENDING",
    },
    {
      label: "Confirmed",
      value: "CONFIRMED",
    },
    {
      label: "Processing",
      value: "PROCESSING",
    },
    {
      label: "Shipped",
      value: "SHIPPED",
    },
    {
      label: "Delivered",
      value: "DELIVERED",
    },
    {
      label: "Cancelled",
      value: "CANCELLED",
    },
  ];

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  /**
   * Error state
   */
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-600">
            Failed to load seller orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-red-600" />

                <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Manage and process your customer orders.
              </p>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs font-medium text-red-600">Total Orders</p>

              <p className="text-xl font-bold text-red-700">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="All Orders"
            value={statusCounts.ALL}
            icon={ShoppingBag}
            iconClass="bg-slate-100 text-slate-600"
            bgClass="from-white to-slate-50"
          />

          <SummaryCard
            title="New Orders"
            value={statusCounts.PENDING}
            icon={Clock3}
            iconClass="bg-amber-100 text-amber-600"
            bgClass="from-white to-amber-50/60"
          />

          <SummaryCard
            title="Processing"
            value={statusCounts.PROCESSING}
            icon={Package}
            iconClass="bg-purple-100 text-purple-600"
            bgClass="from-white to-purple-50/60"
          />

          <SummaryCard
            title="Delivered"
            value={statusCounts.DELIVERED}
            icon={CheckCircle2}
            iconClass="bg-emerald-100 text-emerald-600"
            bgClass="from-white to-emerald-50/60"
          />
        </div>

        {/* Main Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search / Filters */}
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order, customer..."
                  className="
                    h-10 w-full rounded-xl
                    border border-slate-200
                    bg-slate-50 pl-10 pr-4
                    text-sm text-slate-700
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-red-300
                    focus:bg-white
                    focus:ring-2
                    focus:ring-red-100
                  "
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "ALL" | OrderStatus)
                  }
                  className="
                    h-10 rounded-xl
                    border border-slate-200
                    bg-white px-3
                    text-sm text-slate-600
                    outline-none
                    focus:border-red-300
                    focus:ring-2
                    focus:ring-red-100
                  "
                >
                  {tabs.map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const active = statusFilter === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`
                      flex flex-shrink-0 items-center gap-2
                      rounded-lg px-3 py-2
                      text-sm font-medium
                      transition
                      ${
                        active
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    {tab.label}

                    <span
                      className={`
                        rounded-full px-1.5 py-0.5 text-xs
                        ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-500"
                        }
                      `}
                    >
                      {statusCounts[tab.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onView={() =>
                      router.push(`/platform/seller/orders/${order.id}`)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];

              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.date}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex items-center gap-1.5
                        rounded-full border px-2.5 py-1
                        text-xs font-medium
                        ${status.className}
                      `}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-800">
                      {order.customer}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">{order.email}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">
                        {order.items} item
                        {order.items !== 1 ? "s" : ""}
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/platform/seller/orders/${order.id}`)
                      }
                      className="
                        inline-flex items-center gap-2
                        rounded-lg bg-red-50 px-3 py-2
                        text-sm font-medium text-red-600
                        transition hover:bg-red-100
                      "
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <ShoppingBag className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No orders found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filter.
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <p className="text-xs text-slate-500">
                Showing <span className="font-medium text-slate-700">1</span> to{" "}
                <span className="font-medium text-slate-700">
                  {filteredOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {filteredOrders.length}
                </span>{" "}
                orders
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg border border-slate-200
                    text-slate-300
                  "
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg bg-red-600
                    text-xs font-semibold text-white
                  "
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg border border-slate-200
                    text-slate-300
                  "
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon: Icon,
  iconClass,
  bgClass,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
}) => {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200
        bg-gradient-to-br ${bgClass}
        p-5 shadow-sm
        transition duration-200
        hover:-translate-y-1 hover:shadow-md
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

const OrderRow = ({ order, onView }: { order: Order; onView: () => void }) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <tr className="transition hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <p className="font-semibold text-slate-900">{order.orderNumber}</p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-medium text-slate-800">{order.customer}</p>

        <p className="mt-1 text-xs text-slate-400">{order.email}</p>
      </td>

      <td className="px-5 py-4 text-sm text-slate-500">{order.date}</td>

      <td className="px-5 py-4 text-sm text-slate-600">{order.items}</td>

      <td className="px-5 py-4">
        <p className="font-semibold text-slate-900">
          ₹{order.amount.toLocaleString("en-IN")}
        </p>
      </td>

      <td className="px-5 py-4">
        <span
          className={`
            rounded-full px-2.5 py-1
            text-xs font-medium
            ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700"
                : order.paymentStatus === "REFUNDED"
                  ? "bg-purple-50 text-purple-700"
                  : order.paymentStatus === "FAILED"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {order.paymentStatus}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`
            inline-flex items-center gap-1.5
            rounded-full border px-2.5 py-1
            text-xs font-medium
            ${status.className}
          `}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onView}
          className="
            inline-flex items-center gap-2
            rounded-lg bg-red-50 px-3 py-2
            text-sm font-medium text-red-600
            transition hover:bg-red-100
          "
        >
          <Eye className="h-4 w-4" />
          View
        </button>
      </td>
    </tr>
  );
};

export default SellerOrdersPage;
