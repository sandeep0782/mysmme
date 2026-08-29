"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Home, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import { useGetOrderByIdQuery } from "@/store/api/orderApi";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get order ID directly from URL
  const orderId = searchParams.get("orderId");

  const {
    data: orderData,
    isLoading,
    isFetching,
    error,
  } = useGetOrderByIdQuery(orderId as string, {
    skip: !orderId,
  });

  // Confetti only once when order exists
  useEffect(() => {
    if (orderId && orderData?.success) {
      confetti({
        particleCount: 100,
        spread: 140,
        origin: { y: 0.6 },
      });
    }
  }, [orderId, orderData?.success]);

  // -------------------------
  // Missing order ID
  // -------------------------
  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Order ID is missing
          </h2>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // Loading
  // -------------------------
  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading order...</div>

          <p className="text-gray-500 mt-2">Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  // -------------------------
  // API error
  // -------------------------
  if (error) {
    console.error("Order API error:", error);

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to load order
          </h2>

          <p className="text-gray-500 mt-2">Order ID: {orderId}</p>

          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // No order
  // -------------------------
  if (!orderData?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Order not found</h2>

          <p className="text-gray-500 mt-2">Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  // -------------------------
  // Extract order
  // -------------------------
  const order = orderData.data;

  const { totalAmount, items, status, createdAt } = order;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 px-4 py-10">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-5xl"
      >
        <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-2xl">
          {/* ================= HEADER ================= */}
          <CardHeader className="border-b border-gray-200 px-6 py-8 text-center sm:px-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 400,
              }}
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle className="h-11 w-11 text-green-500" />
            </motion.div>

            <CardTitle className="text-2xl font-bold text-green-700 sm:text-3xl">
              Payment Successful!
            </CardTitle>

            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 sm:text-base">
              Thank you for your purchase. Your order has been confirmed
              successfully.
            </p>
          </CardHeader>

          {/* ================= CONTENT ================= */}
          <CardContent className="px-5 py-7 sm:px-10 sm:py-9">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* ================= ORDER DETAILS ================= */}
              <section>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  Order Details
                </h3>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <div className="space-y-4">
                    {/* Order ID */}
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="text-sm text-gray-500">Order ID</span>

                      <span className="max-w-full break-all text-left text-sm font-semibold text-blue-700 sm:max-w-[65%] sm:text-right">
                        {orderId}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">Order Date</span>

                      <span className="text-sm font-semibold text-gray-700">
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">
                        Total Amount
                      </span>

                      <span className="text-base font-bold text-blue-700">
                        ₹{Number(totalAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-500">Items</span>

                      <span className="text-sm font-semibold text-gray-700">
                        {items?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ================= STATUS ================= */}
                <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-5">
                  <h4 className="mb-3 text-base font-semibold text-green-700">
                    Order Status
                  </h4>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Current status</p>

                      <p className="text-sm font-bold uppercase text-green-700">
                        {status || "PROCESSING"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= WHAT'S NEXT ================= */}
              <section>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  What's Next?
                </h3>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          Confirmation
                        </h4>

                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          You will receive an email confirmation shortly.
                        </p>
                      </div>
                    </motion.div>

                    {/* Connector */}
                    <div className="ml-5 h-4 border-l-2 border-dashed border-gray-200" />

                    {/* Step 2 */}
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <Truck className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          Processing & Shipping
                        </h4>

                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Your order will be processed and shipped soon.
                        </p>
                      </div>
                    </motion.div>

                    {/* Connector */}
                    <div className="ml-5 h-4 border-l-2 border-dashed border-gray-200" />

                    {/* Step 3 */}
                    <motion.div
                      className="flex items-start gap-4"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <Home className="h-5 w-5 text-green-600" />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          Delivery
                        </h4>

                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Track your order status from your account.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>
            </div>

            {/* ================= DIVIDER ================= */}
            <div className="my-8 border-t border-gray-200" />

            {/* ================= BUTTONS ================= */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/")}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl sm:w-auto cursor-pointer"
              >
                Continue Shopping
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/account/orders")}
                className="w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto cursor-pointer"
              >
                View My Orders
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
