"use client";

import { useState } from "react";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";
import { useRouter } from "next/navigation";
import BookLoader from "@/lib/Spinner";
import { Order } from "@/types/product";
import { Button } from "@/components/ui/button";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import {
  ShoppingBag,
  CalendarDays,
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import NoData from "@/lib/NoData";

const ORDERS_PER_PAGE = 10;

export default function OrdersPage() {
  const router = useRouter();

  const { data: orderData, isLoading: isOrderLoading } = useGetUserOrdersQuery(
    {},
  );

  const [currentPage, setCurrentPage] = useState(1);

  if (isOrderLoading) {
    return <BookLoader />;
  }

  const orders: Order[] = orderData?.data || [];

  /* ========================================================= */
  /* PAGINATION                                                 */
  /* ========================================================= */

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);

  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;

  const displayedOrders = orders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE,
  );

  /* ========================================================= */
  /* EMPTY STATE                                                */
  /* ========================================================= */

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <NoData
          imageUrl="/images/no-book.jpg"
          message="You haven't ordered any products yet."
          description="Start shopping and your orders will appear here."
          onClick={() => router.push("/products")}
          buttonText="Start Shopping"
        />
      </div>
    );
  }

  /* ========================================================= */
  /* PAGINATION HANDLERS                                        */
  /* ========================================================= */

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-5">
      {/* ================================================= */}
      {/* ORDER SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Total Orders"
          value={orders.length}
          color="orange"
        />

        <SummaryCard
          icon={<Package className="h-4 w-4" />}
          label="Delivered"
          value={orders.filter((order) => order.status === "delivered").length}
          color="green"
        />

        <SummaryCard
          icon={<Package className="h-4 w-4" />}
          label="Processing"
          value={
            orders.filter(
              (order) =>
                order.status === "processing" || order.status === "shipped",
            ).length
          }
          color="blue"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* ================================================= */}
      {/* ORDERS TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* ================================================= */}
        {/* TABLE HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-2 border-b bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Orders
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              View and manage your purchases
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        {/* ================================================= */}
        {/* DESKTOP TABLE */}
        {/* ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-white">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Order
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Items
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {displayedOrders.map((order) => (
                <OrderTableRow key={order._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {/* ================================================= */}
        {/* MOBILE ORDER CARDS */}
        {/* ================================================= */}

        <div className="divide-y divide-slate-100 md:hidden">
          {displayedOrders.map((order) => (
            <MobileOrderCard key={order._id} order={order} />
          ))}
        </div>

        {/* ================================================= */}
        {/* PAGINATION */}
        {/* ================================================= */}

        {totalPages > 1 && (
          <div className="flex flex-col gap-4 border-t bg-slate-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* Showing information */}
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(startIndex + ORDERS_PER_PAGE, orders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {orders.length}
              </span>{" "}
              orders
            </p>

            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-1">
              {/* Previous */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                className="h-8 w-8 border-slate-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    type="button"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={`h-8 min-w-8 px-2 text-xs ${
                      currentPage === page
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              {/* Next */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
                className="h-8 w-8 border-slate-200"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* DESKTOP TABLE ROW                                         */
/* ========================================================= */

function OrderTableRow({ order }: { order: Order }) {
  const itemCount = order.items.length;

  const itemNames = order.items.map((item) => item.product.title).join(", ");

  return (
    <tr className="group transition-colors hover:bg-orange-50/30">
      {/* Order */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <ShoppingBag className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              #{order._id.slice(-6).toUpperCase()}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />

          <span className="text-sm text-slate-600">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </td>

      {/* Items */}
      <td className="max-w-[250px] px-5 py-4">
        <p
          title={itemNames}
          className="truncate text-sm font-medium text-slate-700"
        >
          {itemNames}
        </p>

        {order.items.length > 0 && (
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {order.items[0]?.product.subject}
            {order.items.length > 1 && ` + ${order.items.length - 1} more`}
          </p>
        )}
      </td>

      {/* Total */}
      <td className="whitespace-nowrap px-5 py-4">
        <span className="text-sm font-semibold text-slate-900">
          ₹{order.totalAmount.toLocaleString("en-IN")}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <OrderStatus status={order.status} />
      </td>

      {/* Action */}
      <td className="px-5 py-4 text-right">
        <OrderDetailsDialog order={order}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
        </OrderDetailsDialog>
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE ORDER CARD                                         */
/* ========================================================= */

function MobileOrderCard({ order }: { order: Order }) {
  const itemNames = order.items.map((item) => item.product.title).join(", ");

  return (
    <div className="space-y-4 p-4">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <ShoppingBag className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              #{order._id.slice(-6).toUpperCase()}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />

              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <OrderStatus status={order.status} />
      </div>

      {/* Items */}
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="line-clamp-2 text-sm font-medium text-slate-700">
          {itemNames}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {order.items.length} {order.items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Total amount</p>

          <p className="mt-0.5 text-base font-bold text-slate-900">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <OrderDetailsDialog order={order}>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </OrderDetailsDialog>
      </div>
    </div>
  );
}

/* ========================================================= */
/* STATUS                                                     */
/* ========================================================= */

function OrderStatus({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
      dot: string;
    }
  > = {
    delivered: {
      label: "Delivered",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      dot: "bg-emerald-500",
    },

    processing: {
      label: "Processing",
      className: "bg-amber-50 text-amber-700 ring-amber-600/20",
      dot: "bg-amber-500",
    },

    shipped: {
      label: "Shipped",
      className: "bg-blue-50 text-blue-700 ring-blue-600/20",
      dot: "bg-blue-500",
    },

    cancelled: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700 ring-red-600/20",
      dot: "bg-red-500",
    },

    pending: {
      label: "Pending",
      className: "bg-slate-100 text-slate-600 ring-slate-500/20",
      dot: "bg-slate-400",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />

      {config.label}
    </span>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                               */
/* ========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  color,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "orange" | "green" | "blue";
  className?: string;
}) {
  const colors = {
    orange: {
      icon: "bg-orange-100 text-orange-600",
    },

    green: {
      icon: "bg-emerald-100 text-emerald-600",
    },

    blue: {
      icon: "bg-blue-100 text-blue-600",
    },
  };

  const current = colors[color];

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${current.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">{label}</p>

          <p className="mt-0.5 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
