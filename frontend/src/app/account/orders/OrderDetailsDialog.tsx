"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Check,
  CreditCard,
  ExternalLink,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Order } from "@/types/product";

interface OrderDetailsDialogProps {
  order: Order;
  children?: React.ReactNode;
}

/* ========================================================= */
/* DELIVERY STEPS                                             */
/* ========================================================= */

const deliverySteps = [
  {
    key: "pending",
    label: "Order Placed",
  },
  {
    key: "processing",
    label: "Processing",
  },
  {
    key: "shipped",
    label: "Shipped",
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
  },
  {
    key: "delivered",
    label: "Delivered",
  },
];

/* ========================================================= */
/* NORMALIZE STATUS                                           */
/* ========================================================= */

function normalizeTrackingStatus(status?: string) {
  if (!status) return "pending";

  const value = status
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

  if (
    value.includes("delivered") ||
    value === "delivery_completed" ||
    value === "completed"
  ) {
    return "delivered";
  }

  if (value.includes("out_for_delivery") || value.includes("outfordelivery")) {
    return "out_for_delivery";
  }

  if (
    value.includes("shipped") ||
    value.includes("in_transit") ||
    value.includes("transit") ||
    value.includes("picked_up") ||
    value.includes("pickup")
  ) {
    return "shipped";
  }

  if (
    value.includes("processing") ||
    value.includes("packed") ||
    value.includes("ready")
  ) {
    return "processing";
  }

  return "pending";
}

/* ========================================================= */
/* GET DELIVERY STEP INDEX                                    */
/* ========================================================= */

function getTrackingStep(status?: string) {
  const normalizedStatus = normalizeTrackingStatus(status);

  return deliverySteps.findIndex((step) => step.key === normalizedStatus);
}

/* ========================================================= */
/* TRACKING PROGRESS                                          */
/* ========================================================= */

function DeliveryProgress({ status }: { status?: string }) {
  const normalizedStatus = normalizeTrackingStatus(status);

  const currentStep = getTrackingStep(status);

  const isCancelled =
    status?.toLowerCase() === "cancelled" ||
    status?.toLowerCase() === "canceled";

  if (isCancelled) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Package className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-700">
              Order Cancelled
            </p>

            <p className="mt-0.5 text-xs text-red-500">
              This order is no longer being processed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Delivery Progress
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            Track the current status of your order
          </p>
        </div>

        <Truck className="h-5 w-5 text-orange-500" />
      </div>

      {/* Desktop / horizontal progress */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-[10%] right-[10%] top-5 h-1 rounded-full bg-slate-200" />

          {/* Active line */}
          {currentStep > 0 && (
            <div
              className="absolute left-[10%] top-5 h-1 rounded-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${Math.min(
                  (currentStep / (deliverySteps.length - 1)) * 80,
                  80,
                )}%`,
              }}
            />
          )}

          <div className="relative grid grid-cols-5">
            {deliverySteps.map((step, index) => {
              const completed = index <= currentStep;
              const active = index === currentStep;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      completed
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-slate-200 bg-white text-slate-300"
                    } ${active ? "ring-4 ring-orange-100" : ""}`}
                  >
                    {completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}
                  </div>

                  <p
                    className={`mt-3 text-xs font-medium ${
                      completed ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile / vertical progress */}
      <div className="sm:hidden">
        <div className="space-y-0">
          {deliverySteps.map((step, index) => {
            const completed = index <= currentStep;
            const active = index === currentStep;
            const isLast = index === deliverySteps.length - 1;

            return (
              <div key={step.key} className="relative flex gap-3">
                {/* Vertical line */}
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-8 h-full w-0.5 ${
                      index < currentStep ? "bg-orange-500" : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Circle */}
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    completed
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-slate-200 bg-white text-slate-300"
                  } ${active ? "ring-4 ring-orange-100" : ""}`}
                >
                  {completed ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[10px] font-semibold">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="pb-6">
                  <p
                    className={`text-sm font-medium ${
                      completed ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {active && (
                    <p className="mt-0.5 text-xs text-orange-600">
                      Current status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current status */}
      <div className="mt-5 rounded-lg bg-orange-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500" />

          <p className="text-xs text-orange-700">
            Current status:{" "}
            <span className="font-semibold">
              {normalizedStatus
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* ORDER DETAILS DIALOG                                      */
/* ========================================================= */

export function OrderDetailsDialog({
  order,
  children,
}: OrderDetailsDialogProps) {
  const trackingStatus = order.courierStatus || order.status;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">View Details</Button>}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-orange-500" />
            Order #{order._id.slice(-6).toUpperCase()}
          </DialogTitle>

          <DialogDescription>
            View your order details and delivery progress.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ================================================= */}
          {/* ORDER INFORMATION                                */}
          {/* ================================================= */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {/* Order Date */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <CalendarDays className="h-4 w-4" />

                <span className="text-xs">Order Date</span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <Package className="h-4 w-4" />

                <span className="text-xs">Status</span>
              </div>

              <p className="text-sm font-semibold capitalize text-slate-900">
                {order.status}
              </p>
            </div>

            {/* Total */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-400">
                <CreditCard className="h-4 w-4" />

                <span className="text-xs">Total</span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* ================================================= */}
          {/* SHIPPING / AWB INFORMATION                       */}
          {/* ================================================= */}

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Shipment Details
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Courier and tracking information
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* AWB */}
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-400">AWB Number</p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                  {order.awbNumber || "Not assigned yet"}
                </p>
              </div>

              {/* Courier */}
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-400">Courier</p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {order.courierName || "Not assigned yet"}
                </p>
              </div>
            </div>

            {/* Courier Status */}
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-400">Courier Status</p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />

                <p className="text-sm font-semibold capitalize text-slate-900">
                  {order.courierStatus || order.status || "Pending"}
                </p>
              </div>
            </div>

            {/* Tracking Button */}
            {order.trackingUrl && (
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full border-blue-200 bg-white hover:bg-blue-50"
              >
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Track Shipment
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>

          {/* ================================================= */}
          {/* DELIVERY PROGRESS                                 */}
          {/* ================================================= */}

          <DeliveryProgress status={trackingStatus} />

          {/* ================================================= */}
          {/* ORDERED PRODUCTS                                 */}
          {/* ================================================= */}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Ordered Products
            </h3>

            <div className="divide-y overflow-hidden rounded-xl border border-slate-200">
              {order.items.map((item) => {
                const productImage = item.product?.images?.[0];

                return (
                  <div
                    key={item.product._id}
                    className="flex gap-4 p-4 transition-colors hover:bg-slate-50"
                  >
                    {/* Product Image */}
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={item.product.title}
                          fill
                          sizes="96px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                        {item.product.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.product.subject}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Author: {item.product.author}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================= */}
          {/* ORDER TOTAL                                       */}
          {/* ================================================= */}

          <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-4">
            <span className="text-sm font-medium text-slate-600">
              Order Total
            </span>

            <span className="text-lg font-bold text-orange-600">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
