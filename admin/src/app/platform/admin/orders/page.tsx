"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Eye,
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock3,
  XCircle,
  CheckCircle2,
  Loader2,
  IndianRupee,
  CreditCard,
  RotateCcw,
} from "lucide-react";

import Pagination from "@/components/Admin/Pagination";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";

// Change this import according to your actual order API
// import { useGetOrdersQuery } from "@/store/api/orderApi";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
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

  items?: Array<{
    product?: {
      _id?: string;
      title?: string;
      images?: string[];
    };
    title?: string;
    image?: string;
    quantity?: number;
    price?: number;
  }>;

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

type StatusFilter = "all" | OrderStatus;
type PaymentFilter = "all" | PaymentStatus;

const ITEMS_PER_PAGE = 10;

const Page = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  // ============================================================
  // ORDERS API
  // ============================================================

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetUserOrdersQuery(undefined);

  const orders: Order[] = ordersResponse?.data ?? ordersResponse?.orders ?? [];

  // TEMPORARY DEMO
  // Remove this block after connecting API

  // ============================================================
  // NORMALIZED VALUES
  // ============================================================

  const getOrderStatus = (order: Order): OrderStatus => {
    return order.orderStatus || order.status || "pending";
  };

  const getCustomerName = (order: Order) => {
    return order.customer?.name || order.user?.name || "Customer";
  };

  const getCustomerEmail = (order: Order) => {
    return order.customer?.email || order.user?.email || "";
  };

  const getCustomerPhone = (order: Order) => {
    return order.customer?.phone || order.user?.phone || "";
  };

  const getOrderNumber = (order: Order) => {
    return order.orderId || order.orderNumber || order._id;
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const total = orders.length;

    const pending = orders.filter(
      (order) => getOrderStatus(order) === "pending",
    ).length;

    const processing = orders.filter(
      (order) => getOrderStatus(order) === "processing",
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
      .reduce((total, order) => total + Number(order.totalAmount || 0), 0);

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      returned,
      paid,
      revenue,
    };
  }, [orders]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderNumber = getOrderNumber(order).toLowerCase();

      const customerName = getCustomerName(order).toLowerCase();
      const customerEmail = getCustomerEmail(order).toLowerCase();
      const customerPhone = getCustomerPhone(order).toLowerCase();

      const matchesSearch =
        !value ||
        orderNumber.includes(value) ||
        customerName.includes(value) ||
        customerEmail.includes(value) ||
        customerPhone.includes(value);

      const matchesStatus =
        statusFilter === "all" || getOrderStatus(order) === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const resetPagination = () => {
    setCurrentPage(1);
  };

  // ============================================================
  // STATUS STYLES
  // ============================================================

  const getOrderStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return {
          wrapper: "bg-blue-50 text-blue-600",
          dot: "bg-blue-500",
          label: "Confirmed",
        };

      case "processing":
        return {
          wrapper: "bg-violet-50 text-violet-600",
          dot: "bg-violet-500",
          label: "Processing",
        };

      case "shipped":
        return {
          wrapper: "bg-cyan-50 text-cyan-600",
          dot: "bg-cyan-500",
          label: "Shipped",
        };

      case "delivered":
        return {
          wrapper: "bg-emerald-50 text-emerald-600",
          dot: "bg-emerald-500",
          label: "Delivered",
        };

      case "cancelled":
        return {
          wrapper: "bg-red-50 text-red-600",
          dot: "bg-red-500",
          label: "Cancelled",
        };

      case "returned":
        return {
          wrapper: "bg-orange-50 text-orange-600",
          dot: "bg-orange-500",
          label: "Returned",
        };

      default:
        return {
          wrapper: "bg-amber-50 text-amber-600",
          dot: "bg-amber-500",
          label: "Pending",
        };
    }
  };

  const getPaymentStatusStyles = (status: PaymentStatus = "pending") => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-600";

      case "failed":
        return "bg-red-50 text-red-600";

      case "refunded":
        return "bg-violet-50 text-violet-600";

      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  // ============================================================
  // DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        {/* ========================================================
                            HEADER
        ======================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Order Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Manage Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              View, process, track and manage customer orders from one place.
            </p>
          </div>
        </div>

        {/* ========================================================
                            STATISTICS
        ======================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {isLoading ? (
                    <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
                  ) : (
                    statistics.total
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* PROCESSING */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Processing</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {statistics.processing}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* DELIVERED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Delivered</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {statistics.delivered}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* REVENUE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Order Value
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  ₹{statistics.revenue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
                          SECONDARY STATS
        ======================================================== */}

        <div className="mb-6 flex flex-wrap gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
            Pending: {statistics.pending}
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700">
            Shipped: {statistics.shipped}
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Cancelled: {statistics.cancelled}
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700">
            Returned: {statistics.returned}
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Paid: {statistics.paid}
          </div>
        </div>

        {/* ========================================================
                         SEARCH + FILTER
        ======================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search order, customer, phone, email..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetPagination();
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* ORDER STATUS */}

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilter);
                  resetPagination();
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Order Status</option>

                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>

              {/* PAYMENT */}

              <select
                value={paymentFilter}
                onChange={(event) => {
                  setPaymentFilter(event.target.value as PaymentFilter);
                  resetPagination();
                }}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Payments</option>

                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredOrders.length === 0 ? 0 : startIndex + 1}
              </span>
              {" - "}
              <span className="font-semibold text-slate-900">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)}
              </span>
              {" of "}
              <span className="font-semibold text-slate-900">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>
          </div>
        </div>

        {/* ========================================================
                            ERROR
        ======================================================== */}

        {isError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />

              <div>
                <p className="font-semibold text-red-700">
                  Failed to load orders
                </p>

                <p className="mt-1 text-sm text-red-600">
                  Something went wrong while fetching orders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
                         LOADING / TABLE
        ======================================================== */}

        {isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                <p className="text-sm text-slate-500">Loading orders...</p>
              </div>
            </div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1350px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Items
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedOrders.map((order) => {
                    const status = getOrderStatus(order);

                    const statusStyle = getOrderStatusStyles(status);

                    const firstItem = order.items?.[0];

                    const image =
                      firstItem?.product?.images?.[0] || firstItem?.image;

                    return (
                      <tr
                        key={order._id}
                        className="group transition hover:bg-slate-50"
                      >
                        {/* ORDER */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            #{getOrderNumber(order)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ID: {order._id.slice(-8)}
                          </p>
                        </td>

                        {/* CUSTOMER */}

                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {getCustomerName(order)}
                            </p>

                            {getCustomerPhone(order) && (
                              <p className="mt-1 text-xs text-slate-500">
                                {getCustomerPhone(order)}
                              </p>
                            )}

                            {getCustomerEmail(order) && (
                              <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                                {getCustomerEmail(order)}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* ITEMS */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    firstItem?.title ||
                                    firstItem?.product?.title ||
                                    "Order item"
                                  }
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <ShoppingBag className="h-5 w-5 text-slate-300" />
                              )}
                            </div>

                            <div>
                              <p className="max-w-[200px] truncate text-sm font-medium text-slate-700">
                                {firstItem?.product?.title ||
                                  firstItem?.title ||
                                  "Order item"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {order.items?.length || 0}{" "}
                                {(order.items?.length || 0) === 1
                                  ? "item"
                                  : "items"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* AMOUNT */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-bold text-slate-900">
                            ₹
                            {Number(order.totalAmount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </td>

                        {/* PAYMENT */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />

                            <p className="text-sm font-medium text-slate-700">
                              {order.paymentMethod || "—"}
                            </p>
                          </div>

                          <span
                            className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentStatusStyles(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus || "pending"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex min-w-[105px] items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {statusStyle.label}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="text-sm text-slate-700">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        {/* ACTION */}

                        <td className="whitespace-nowrap px-6 py-5">
                          <div className="flex justify-end">
                            <Link
                              href={`/platform/admin/orders/${order._id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              title="View order"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="border-t border-slate-200 bg-white">
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          /* EMPTY */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <ShoppingBag className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {search || statusFilter !== "all" || paymentFilter !== "all"
                ? "Try changing your search or filters."
                : "Customer orders will appear here."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
