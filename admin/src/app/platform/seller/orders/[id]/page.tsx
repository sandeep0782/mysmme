"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  Phone,
  Mail,
  Box,
} from "lucide-react";

import {
  useGetSellerOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/store/api/sellerApi";

/* ================================================================
   ORDER STATUS
================================================================ */

type OrderStatus =
  | "pending"
  | "accepted"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";

/* ================================================================
   NORMALIZE ORDER STATUS
================================================================ */

const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const status = String(value ?? "")
    .trim()
    .toLowerCase();

  switch (status) {
    case "pending":
      return "pending";

    case "accepted":
      return "accepted";

    case "processing":
      return "processing";

    case "ready_to_ship":
      return "ready_to_ship";

    case "shipped":
      return "shipped";

    case "delivered":
      return "delivered";

    case "cancelled":
    case "canceled":
      return "cancelled";

    default:
      console.warn("Unknown order status received from API:", value);
      return "pending";
  }
};

/* ================================================================
   STATUS ORDER
================================================================ */

const statusOrder: OrderStatus[] = [
  "pending",
  "accepted",
  "processing",
  "ready_to_ship",
  "shipped",
  "delivered",
];

/* ================================================================
   STATUS STEPS
================================================================ */

const statusSteps: {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    status: "pending",
    label: "New Order",
    icon: Clock3,
  },
  {
    status: "accepted",
    label: "Accepted",
    icon: CheckCircle2,
  },
  {
    status: "processing",
    label: "Processing",
    icon: Package,
  },
  {
    status: "ready_to_ship",
    label: "Ready to Ship",
    icon: Box,
  },
  {
    status: "shipped",
    label: "Shipped",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: CheckCircle2,
  },
];

/* ================================================================
   TYPES
================================================================ */

type OrderItem = {
  _id?: string;

  product?:
    | {
        _id?: string;
        title?: string;
        skuId?: string;
        images?: string[];
      }
    | string;

  quantity: number;

  productName?: string;

  productImage?: string;

  unitPrice: number;

  totalPrice: number;
};

type ShippingInfo = {
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
};

type ShippingAddress = {
  _id?: string;
  user?: string;

  addressLine1?: string;
  addressLine2?: string;

  phoneNumber?: string;

  city?: string;
  state?: string;
  pincode?: string;

  country?: string;
};

type Customer = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type ParentOrder = {
  _id?: string;

  user?: Customer;

  paymentStatus?: string;

  paymentMethod?: string;
  status?: string;
  createdAt?: string;

  shippingAddress?: ShippingAddress;

  subtotal?: number;
  shipping?: number;
  discount?: number;
  total?: number;
};

type SellerOrder = {
  _id: string;

  orderNumber?: string;

  createdAt?: string;

  updatedAt?: string;

  order?: ParentOrder;

  seller?: string;

  items: OrderItem[];

  totalAmount: number;

  paymentStatus?: string;

  paymentMethod?: string;

  status?: string;

  shipping?: ShippingInfo;

  /*
   * These are optional in case your API directly returns
   * financial fields on SellerOrder.
   */
  subtotal?: number;
  shippingAmount?: number;
  discount?: number;
  total?: number;
};

/* ================================================================
   PAGE
================================================================ */

const SellerOrderDetailsPage = () => {
  const router = useRouter();

  const params = useParams();

  /* ================================================================
     ORDER ID
  ================================================================ */

  const orderId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  /* ================================================================
     GET SELLER ORDER
  ================================================================ */

  const {
    data: orderResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSellerOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  /* ================================================================
     UPDATE STATUS MUTATION
  ================================================================ */

  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  /* ================================================================
     ORDER DATA
  ================================================================ */

  const order: SellerOrder | undefined = orderResponse?.data;

  const customer = order?.order?.user;

  const shippingAddress = order?.order?.shippingAddress;

  const customerName = customer?.name ?? "N/A";

  const customerEmail = customer?.email ?? "N/A";

  const customerPhone =
    shippingAddress?.phoneNumber ?? customer?.phone ?? "N/A";

  const paymentStatus =
    order?.paymentStatus ?? order?.order?.paymentStatus ?? "N/A";

  const paymentMethod =
    order?.paymentMethod ?? order?.order?.paymentMethod ?? "N/A";

  /* ================================================================
     FINANCIAL DATA
     
     Prefer values from SellerOrder if your backend sends them.
     Otherwise fall back to parent Order.
  ================================================================ */

  const subtotal = Number(order?.subtotal ?? order?.order?.subtotal ?? 0);

  const shippingAmount = Number(
    order?.shippingAmount ?? order?.order?.shipping ?? 0,
  );

  const discount = Number(order?.discount ?? order?.order?.discount ?? 0);

  const orderTotal = Number(
    order?.totalAmount ?? order?.total ?? order?.order?.total ?? 0,
  );

  /* ================================================================
     LOADING
  ================================================================ */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Loading order...</p>
        </div>
      </div>
    );
  }

  /* ================================================================
     ERROR
  ================================================================ */

  if (isError || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The order could not be found or something went wrong.
          </p>

          {isFetching && (
            <p className="mt-2 text-xs text-slate-400">Fetching order...</p>
          )}

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => router.push("/platform/seller/orders")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </button>
          </div>

          {error && (
            <p className="mt-4 text-xs text-red-500">
              Something went wrong while fetching the order.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ================================================================
     NORMALIZED STATUS
  ================================================================ */

  const rawStatus = order?.status ?? order?.order?.status;

  const status = normalizeOrderStatus(rawStatus);
  const currentIndex = statusOrder.indexOf(status);

  console.log("========== DETAIL STATUS ==========");
  console.log("SELLER ORDER:", order);
  console.log("SELLER ORDER STATUS:", order?.status);
  console.log("PARENT ORDER:", order?.order);
  console.log("PARENT ORDER STATUS:", order?.order?.status);
  console.log("RAW STATUS USED:", rawStatus);
  console.log("FINAL STATUS:", status);
  console.log("CURRENT INDEX:", currentIndex);
  console.log("==================================");
  /* ================================================================
     UPDATE STATUS
  ================================================================ */

  const updateStatus = async (newStatus: OrderStatus) => {
    if (isUpdating || !orderId) return;

    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
      }).unwrap();

      toast.success(`Order moved to ${formatStatus(newStatus)}`);
    } catch (error) {
      console.error("ORDER STATUS ERROR:", error);

      toast.error("Unable to update order status.");
    }
  };

  /* ================================================================
     STATUS HANDLERS
  ================================================================ */

  const handleAccept = () => {
    updateStatus("accepted");
  };

  const handleProcessing = () => {
    updateStatus("processing");
  };

  const handleReadyToShip = () => {
    updateStatus("ready_to_ship");
  };

  const handleShip = () => {
    updateStatus("shipped");
  };

  const handleDelivered = () => {
    updateStatus("delivered");
  };

  /* ================================================================
     CANCEL ORDER
  ================================================================ */

  const handleCancel = async () => {
    if (isUpdating || !orderId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) return;

    try {
      await updateOrderStatus({
        orderId,
        status: "cancelled",
      }).unwrap();

      toast.success("Order cancelled successfully.");
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);

      toast.error("Unable to update order status.");
    }
  };

  /* ================================================================
     NEXT ACTION
  ================================================================ */

  const getAction = () => {
    switch (status) {
      case "pending":
        return {
          label: "Accept Order",
          onClick: handleAccept,
          className: "bg-red-600 hover:bg-red-700",
        };

      case "accepted":
        return {
          label: "Start Processing",
          onClick: handleProcessing,
          className: "bg-purple-600 hover:bg-purple-700",
        };

      case "processing":
        return {
          label: "Ready to Ship",
          onClick: handleReadyToShip,
          className: "bg-orange-600 hover:bg-orange-700",
        };

      case "ready_to_ship":
        return {
          label: "Mark as Shipped",
          onClick: handleShip,
          className: "bg-indigo-600 hover:bg-indigo-700",
        };

      case "shipped":
        return {
          label: "Mark as Delivered",
          onClick: handleDelivered,
          className: "bg-emerald-600 hover:bg-emerald-700",
        };

      case "delivered":
      case "cancelled":
      default:
        return null;
    }
  };

  const action = getAction();

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-5 sm:p-6 lg:p-8">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/platform/seller/orders")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            {/* ORDER INFO */}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {order.orderNumber ?? "Order"}
                </h1>

                <StatusBadge status={status} />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Order placed on {formatDate(order.createdAt)}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Order ID: {order._id}
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-3">
              {status !== "cancelled" && status !== "delivered" && action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  disabled={isUpdating}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
                >
                  {isUpdating ? (
                    "Updating..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />

                      {action.label}
                    </>
                  )}
                </button>
              )}

              {status !== "cancelled" && status !== "delivered" && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            STATUS TIMELINE
        ============================================================ */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-red-50/30 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Order Status</h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the progress of this order.
            </p>
          </div>
          {status === "cancelled" ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <p className="font-semibold text-red-800">Order Cancelled</p>

                  <p className="mt-1 text-sm text-red-600">
                    This order has been cancelled.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex min-w-[700px] items-start">
                {statusSteps.map((step, index) => {
                  const StepIcon = step.icon;

                  const isCompleted = index < currentIndex;
                  const isActive = index === currentIndex;

                  return (
                    <React.Fragment key={step.status}>
                      <div className="flex flex-1 flex-col items-center">
                        <div
                          className={`
                  flex h-11 w-11 items-center justify-center
                  rounded-full border-2 transition
                  ${
                    isActive
                      ? "border-red-600 bg-red-600 text-white ring-4 ring-red-100"
                      : isCompleted
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-slate-200 bg-white text-slate-400"
                  }
                `}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>

                        <p
                          className={`
                  mt-3 text-center text-xs font-semibold
                  ${isActive || isCompleted ? "text-red-600" : "text-slate-400"}
                `}
                        >
                          {step.label}
                        </p>
                      </div>

                      {index < statusSteps.length - 1 && (
                        <div
                          className={`
                  mt-5 h-0.5 flex-1
                  ${index < currentIndex ? "bg-red-600" : "bg-slate-200"}
                `}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}{" "}
        </section>

        {/* ============================================================
            MAIN CONTENT
        ============================================================ */}

        <div className="grid gap-6 xl:grid-cols-3">
          {/* ==========================================================
              LEFT COLUMN
          ========================================================== */}

          <div className="space-y-6 xl:col-span-2">
            {/* ========================================================
                PRODUCTS
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Products</h2>

                  <p className="text-xs text-slate-500">
                    {order.items?.length ?? 0} product
                    {(order.items?.length ?? 0) !== 1 ? "s" : ""} in this order
                  </p>
                </div>
              </div>

              <div className="products-scrollbar max-h-[420px] overflow-y-scroll divide-y divide-slate-100 pr-2">
                {order.items?.length ? (
                  order.items.map((item, index) => {
                    const product =
                      typeof item.product === "object"
                        ? item.product
                        : undefined;

                    const productName =
                      item.productName || product?.title || "Product";

                    const productSku = product?.skuId || "N/A";

                    const productImage =
                      item.productImage || product?.images?.[0] || "";

                    const quantity = Number(item.quantity || 0);

                    const unitPrice = Number(item.unitPrice || 0);

                    const totalPrice = Number(
                      item.totalPrice ?? unitPrice * quantity,
                    );

                    const productId =
                      product?._id ||
                      (typeof item.product === "string"
                        ? item.product
                        : undefined);

                    const itemId =
                      item._id || productId || `${order._id}-${index}`;

                    return (
                      <div
                        key={itemId}
                        className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                      >
                        {/* PRODUCT IMAGE */}

                        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Box className="h-7 w-7 text-slate-400" />
                          )}
                        </div>

                        {/* PRODUCT DETAILS */}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">
                            {productName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            SKU:{" "}
                            <span className="font-semibold text-slate-700">
                              {productSku}
                            </span>
                          </p>

                          {productId && (
                            <p className="mt-1 text-xs text-slate-400">
                              Product ID: {productId}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-slate-500">
                            Quantity:{" "}
                            <span className="font-semibold text-slate-700">
                              {quantity}
                            </span>
                          </p>
                        </div>

                        {/* PRICE */}

                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-slate-900">
                            ₹{totalPrice.toLocaleString("en-IN")}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            ₹{unitPrice.toLocaleString("en-IN")} each
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <Box className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-2 text-sm text-slate-500">
                      No products found in this order.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================
                SHIPPING ADDRESS
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Shipping Address</h2>

                  <p className="text-xs text-slate-500">
                    Customer delivery address
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-white/80 p-4">
                <p className="font-semibold text-slate-900">{customerName}</p>

                {shippingAddress ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {shippingAddress.addressLine1}

                    {shippingAddress.addressLine2 && (
                      <>
                        <br />
                        {shippingAddress.addressLine2}
                      </>
                    )}

                    {(shippingAddress.city || shippingAddress.state) && (
                      <>
                        <br />

                        {shippingAddress.city ?? ""}

                        {shippingAddress.city && shippingAddress.state
                          ? ", "
                          : ""}

                        {shippingAddress.state ?? ""}
                      </>
                    )}

                    {shippingAddress.pincode && (
                      <>
                        <br />
                        {shippingAddress.pincode}
                      </>
                    )}

                    {shippingAddress.country && (
                      <>
                        <br />
                        {shippingAddress.country}
                      </>
                    )}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No shipping address available.
                  </p>
                )}

                {shippingAddress?.phoneNumber && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4" />

                    <span>{shippingAddress.phoneNumber}</span>
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================
                SHIPPING DETAILS
            ======================================================== */}

            {order.shipping &&
              (order.shipping.courierName ||
                order.shipping.trackingNumber ||
                order.shipping.trackingUrl ||
                order.shipping.dispatchedAt ||
                order.shipping.deliveredAt) && (
                <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-indigo-50/40 p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Truck className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Shipping Details
                      </h2>

                      <p className="text-xs text-slate-500">
                        Courier and tracking information
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {order.shipping.courierName && (
                      <div className="rounded-xl bg-white/80 p-4">
                        <p className="text-xs text-slate-400">Courier</p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {order.shipping.courierName}
                        </p>
                      </div>
                    )}

                    {order.shipping.trackingNumber && (
                      <div className="rounded-xl bg-white/80 p-4">
                        <p className="text-xs text-slate-400">
                          Tracking Number
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                          {order.shipping.trackingNumber}
                        </p>
                      </div>
                    )}

                    {order.shipping.dispatchedAt && (
                      <div className="rounded-xl bg-white/80 p-4">
                        <p className="text-xs text-slate-400">Dispatched At</p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatDateTime(order.shipping.dispatchedAt)}
                        </p>
                      </div>
                    )}

                    {order.shipping.deliveredAt && (
                      <div className="rounded-xl bg-white/80 p-4">
                        <p className="text-xs text-slate-400">Delivered At</p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {formatDateTime(order.shipping.deliveredAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {order.shipping.trackingUrl && (
                    <a
                      href={order.shipping.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <Truck className="h-4 w-4" />
                      Track Shipment
                    </a>
                  )}
                </section>
              )}

            {/* ========================================================
                PAYMENT
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/40 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CreditCard className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Payment</h2>

                  <p className="text-xs text-slate-500">Payment information</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/80 p-4">
                  <p className="text-xs text-slate-400">Payment Method</p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatPaymentMethod(paymentMethod)}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 p-4">
                  <p className="text-xs text-slate-400">Payment Status</p>

                  <PaymentStatusBadge status={paymentStatus} />
                </div>
              </div>
            </section>
          </div>

          {/* ==========================================================
              RIGHT COLUMN
          ========================================================== */}

          <div className="space-y-6">
            {/* ========================================================
                CUSTOMER
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-purple-50/40 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <User className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Customer</h2>

                  <p className="text-xs text-slate-500">Customer information</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-slate-900">{customerName}</p>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4 flex-shrink-0" />

                  <span className="break-all">{customerEmail}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone className="h-4 w-4 flex-shrink-0" />

                  <span>{customerPhone}</span>
                </div>
              </div>
            </section>

            {/* ========================================================
                ORDER SUMMARY
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-red-50/40 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">Order Summary</h2>

                  <p className="text-xs text-slate-500">Payment breakdown</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Subtotal</span>

                  <span className="font-medium text-slate-800">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Shipping</span>

                  <span className="font-medium text-slate-800">
                    ₹{shippingAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Discount</span>

                  <span className="font-medium text-emerald-600">
                    - ₹{discount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="my-3 border-t border-slate-200" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">Total</span>

                  <span className="text-xl font-bold text-red-600">
                    ₹{orderTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>

            {/* ========================================================
                ORDER INFORMATION
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Order Information
                  </h2>

                  <p className="text-xs text-slate-500">Order metadata</p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow label="Seller Order ID" value={order._id} />

                {order.order?._id && (
                  <InfoRow label="Parent Order ID" value={order.order._id} />
                )}

                <InfoRow label="Order Status" value={formatStatus(status)} />

                {order.createdAt && (
                  <InfoRow
                    label="Created"
                    value={formatDateTime(order.createdAt)}
                  />
                )}

                {order.updatedAt && (
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(order.updatedAt)}
                  />
                )}
              </div>
            </section>

            {/* ========================================================
                PROCESSING INFO
            ======================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Clock3 className="h-4 w-4 text-amber-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Processing Reminder
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Make sure the products are available and ready before moving
                    the order to the next stage.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================================================================
   INFO ROW
================================================================ */

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-slate-400">{label}</span>

      <span className="break-all text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
};

/* ================================================================
   DATE FORMAT
================================================================ */

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* ================================================================
   DATE + TIME FORMAT
================================================================ */

const formatDateTime = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/* ================================================================
   STATUS FORMAT
================================================================ */

const formatStatus = (status: OrderStatus) => {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* ================================================================
   PAYMENT METHOD FORMAT
================================================================ */

const formatPaymentMethod = (method?: string) => {
  if (!method) return "N/A";

  return method
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* ================================================================
   STATUS BADGE
================================================================ */

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config: Record<
    OrderStatus,
    {
      label: string;
      className: string;
      icon: React.ElementType;
    }
  > = {
    pending: {
      label: "Pending",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      icon: Clock3,
    },

    accepted: {
      label: "Accepted",
      className: "border-blue-200 bg-blue-50 text-blue-700",
      icon: CheckCircle2,
    },

    processing: {
      label: "Processing",
      className: "border-purple-200 bg-purple-50 text-purple-700",
      icon: Package,
    },

    ready_to_ship: {
      label: "Ready to Ship",
      className: "border-orange-200 bg-orange-50 text-orange-700",
      icon: Box,
    },

    shipped: {
      label: "Shipped",
      className: "border-indigo-200 bg-indigo-50 text-indigo-700",
      icon: Truck,
    },

    delivered: {
      label: "Delivered",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },

    cancelled: {
      label: "Cancelled",
      className: "border-red-200 bg-red-50 text-red-700",
      icon: XCircle,
    },
  };

  const current = config[status] ?? config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border px-2.5 py-1
        text-xs font-semibold
        ${current.className}
      `}
    >
      <Icon className="h-3.5 w-3.5" />

      {current.label}
    </span>
  );
};

/* ================================================================
   PAYMENT STATUS BADGE
================================================================ */

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const normalized = status.trim().toLowerCase();

  let className = "bg-slate-50 text-slate-700 border-slate-200";

  if (normalized === "completed") {
    className = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "pending") {
    className = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "failed") {
    className = "bg-red-50 text-red-700 border-red-200";
  } else if (normalized === "refunded") {
    className = "bg-purple-50 text-purple-700 border-purple-200";
  }

  return (
    <span
      className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default SellerOrderDetailsPage;
