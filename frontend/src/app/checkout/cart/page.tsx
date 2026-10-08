"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useValidateCouponMutation } from "@/store/api/couponApi";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  ChevronRight,
  Tag,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RootState } from "@/store/store";

import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemQuantityMutation,
} from "@/store/api/cartApi";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/wishlistApi";

import {
  useCreateRazorpayPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} from "@/store/api/orderApi";

import { Address } from "@/types/product";

import { clearCart, setCart } from "@/store/slice/cartSlice";

import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";

import { toggleLoginDialog } from "@/store/slice/userSlice";

import { resetCheckout, setCheckoutStep } from "@/store/slice/checkoutSlice";

import Spinner from "@/lib/Spinner";
import { PriceDetails } from "@/components/PriceDetails";
import CheckoutAddress from "@/components/CheckoutAddress";
import NoData from "@/lib/NoData";
import { CartItems } from "@/components/CartItems";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CouponResponse = {
  success: boolean;
  message?: string;
  data?: {
    code: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    discountAmount: number;
    minimumOrderAmount?: number;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { step } = useSelector((state: RootState) => state.checkout);
  const cart = useSelector((state: RootState) => state.cart);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [validateCoupon] = useValidateCouponMutation();
  /*
   * ============================================================
   * COUPON STATE
   * ============================================================
   */

  const [couponCode, setCouponCode] = useState("");

  const [couponDiscount, setCouponDiscount] = useState(0);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  /*
   * ============================================================
   * CART API
   * ============================================================
   */

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    user?._id || "",
  );

  const [removeFromCartMutation] = useRemoveFromCartMutation();

  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();

  /*
   * ============================================================
   * WISHLIST API
   * ============================================================
   */

  const [addToWishlist] = useAddToWishlistMutation();

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  /*
   * ============================================================
   * ORDER API
   * ============================================================
   */

  const [createRazorpayOrder] = useCreateRazorpayPaymentMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  /*
   * ============================================================
   * SYNC CART
   * ============================================================
   */

  useEffect(() => {
    if (cartData?.success && cartData.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  /*
   * ============================================================
   * SYNC ORDER ADDRESS
   * ============================================================
   */

  /*
   * ============================================================
   * AUTO OPEN ADDRESS DIALOG
   * ============================================================
   */

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  /*
   * ============================================================
   * RESET COUPON
   *
   * Whenever cart changes after coupon application,
   * coupon must be applied again.
   * ============================================================
   */

  const resetCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscount(0);
  };

  /*
   * ============================================================
   * VALID CART ITEMS
   * ============================================================
   */

  const validCartItems = cart.items.filter((item) => item.product);

  /*
   * ============================================================
   * TOTALS
   * ============================================================
   */

  const totalAmount = validCartItems.reduce(
    (acc, item) => acc + (item.product?.finalPrice ?? 0) * item.quantity,
    0,
  );

  const totalOriginalPrice = validCartItems.reduce(
    (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  const totalDiscount = totalOriginalPrice - totalAmount;

  /*
   * ============================================================
   * SHIPPING
   * ============================================================
   */

  const shippingCharges = validCartItems.map((item) => {
    const charge = item?.product?.shippingCharge;

    if (!charge) return 0;

    if (typeof charge === "string") {
      return charge.toLowerCase() === "free" ? 0 : Number(charge) || 0;
    }

    if (typeof charge === "number") {
      return charge;
    }

    return 0;
  });

  const maximunShippingCharge = Math.max(0, ...shippingCharges);

  /*
   * ============================================================
   * FINAL AMOUNT
   *
   * Product total
   * - coupon
   * + shipping
   * ============================================================
   */

  const finalAmount =
    Math.max(0, totalAmount - couponDiscount) + maximunShippingCharge;

  /*
   * ============================================================
   * REMOVE ITEM
   * ============================================================
   */

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeFromCartMutation(productId).unwrap();

      if (result.success && result.data) {
        dispatch(setCart(result.data));

        /*
         * Cart changed,
         * coupon must be applied again.
         */
        resetCoupon();

        /*
         * Recalculate existing order if one exists.
         */

        toast.success(result.message || "Item removed from cart");
      } else {
        throw new Error(result.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to remove item from cart");
    }
  };

  /*
   * ============================================================
   * QUANTITY CHANGE
   * ============================================================
   */

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      await updateCartItemQuantity({
        productId,
        quantity,
      }).unwrap();

      /*
       * Coupon is based on cart value.
       * Require customer to apply again.
       */
      resetCoupon();

      toast.success("Cart updated successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to update quantity");
    }
  };

  /*
   * ============================================================
   * WISHLIST
   * ============================================================
   */

  const toggleWishlist = async (productId: string) => {
    try {
      const isInWishlist = wishlist.some((item) =>
        item.products.includes(productId),
      );

      if (isInWishlist) {
        const result = await removeFromWishlist(productId).unwrap();

        if (result.success) {
          dispatch(removeFromWishlistAction(productId));

          toast.success("Removed from wishlist");
        } else {
          throw new Error(result.message || "Failed to remove from wishlist");
        }
      } else {
        const result = await addToWishlist(productId).unwrap();

        if (result.success) {
          dispatch(addToWishlistAction(result.data));

          toast.success("Added to wishlist");
        } else {
          throw new Error(result.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to update wishlist");
    }
  };

  /*
   * ============================================================
   * APPLY COUPON
   * ============================================================
   */

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("Cart total is invalid");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const result = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        cartTotal: totalAmount,
      }).unwrap();

      console.log("COUPON SUCCESS RESPONSE:", result);

      if (!result.success || !result.valid) {
        throw new Error(result.message || "Invalid coupon");
      }

      if (!result.couponCode) {
        throw new Error("Coupon response is missing couponCode");
      }

      const discountAmount = Number(result.discountAmount ?? 0);

      if (!Number.isFinite(discountAmount) || discountAmount < 0) {
        throw new Error("Invalid coupon discount amount");
      }

      setAppliedCoupon(result.couponCode);
      setCouponCode(result.couponCode);
      setCouponDiscount(discountAmount);

      toast.success(
        result.message || `Coupon ${result.couponCode} applied successfully`,
      );
    } catch (error: any) {
      console.log("========== COUPON ERROR ==========");
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error?.status);
      console.log("DATA:", error?.data);
      console.log("ERROR:", error?.error);
      console.log("MESSAGE:", error?.message);
      console.log("STRINGIFIED:", JSON.stringify(error, null, 2));
      console.log("==================================");

      setCouponDiscount(0);
      setAppliedCoupon(null);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Coupon is invalid or not applicable",
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  /*
   * ============================================================
   * REMOVE COUPON
   * ============================================================
   */

  const handleRemoveCoupon = () => {
    resetCoupon();

    toast.success("Coupon removed");
  };

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  /*
   * ============================================================
   * PROCEED CHECKOUT
   * ============================================================
   */

  const handleProceedToCheckout = async () => {
    /*
     * CART → ADDRESS
     */
    if (step === "cart") {
      if (validCartItems.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }

      dispatch(setCheckoutStep("address"));

      return;
    }

    /*
     * ADDRESS → PAYMENT
     */
    if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }

      return;
    }

    /*
     * PAYMENT
     */
    if (step === "payment") {
      await handlePayment();
    }
  };

  /*
   * ============================================================
   * ADDRESS
   * ============================================================
   */

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);

    setShowAddressDialog(false);

    toast.success("Address selected successfully");
  };

  /*
   * ============================================================
   * PAYMENT
   * ============================================================
   */

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await createRazorpayOrder({
        couponCode: appliedCoupon || undefined,
        shippingAddress: selectedAddress,
      });

      if (error) {
        console.error("Razorpay order creation error:", error);
        throw new Error("Failed to create Razorpay order");
      }

      if (!data?.data?.order) {
        throw new Error("Invalid Razorpay order response");
      }

      const razorpayOrder = data.data.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "MYSMME",

        description: "MYSMME Purchase",

        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const result = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_signature: response.razorpay_signature,

              shippingAddress: selectedAddress?._id,

              couponCode: appliedCoupon || undefined,
            }).unwrap();

            if (!result.success) {
              throw new Error(result.message || "Payment verification failed");
            }

            const createdOrderId = result.data?._id;

            if (!createdOrderId) {
              throw new Error("Order ID not returned");
            }

            dispatch(clearCart());

            dispatch(resetCheckout());

            resetCoupon();

            toast.success("Payment successful!");

            router.push(`/checkout/payment-success?orderId=${createdOrderId}`);
          } catch (error: any) {
            console.error("PAYMENT VERIFICATION ERROR:", error);

            toast.error(
              error?.data?.message ||
                error?.message ||
                "Payment successful, but order confirmation failed.",
            );
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: selectedAddress.phoneNumber || "",
        },

        theme: {
          color: "#b91c1c",
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK is not loaded");
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response: any) {
        console.error("❌ RAZORPAY PAYMENT FAILED:", response?.error);

        toast.error(
          response?.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);

      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  /*
   * ============================================================
   * LOGIN REQUIRED
   * ============================================================
   */

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="You need to be logged in to view your cart and checkout."
        buttonText="Login"
        imageUrl="/images/login.png"
        onClick={handleOpenLogin}
      />
    );
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isCartLoading) {
    return <Spinner />;
  }

  /*
   * ============================================================
   * EMPTY CART
   * ============================================================
   */

  if (!isCartLoading && validCartItems.length === 0) {
    return (
      <NoData
        message="Your cart is empty."
        description="Looks like you haven't added any items yet. Explore our collection and find something you love!"
        buttonText="Browse Sarees"
        imageUrl="/images/cart.png"
        onClick={() => router.push("/sarees")}
      />
    );
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-white">
        {/* ================================================
            CART HEADER
        ================================================ */}

        <div className="mb-8 bg-gray-100 px-6 py-4">
          <div className="mx-auto flex w-[95%] items-center">
            <ShoppingCart className="mr-2 h-6 w-6 text-gray-600" />

            <span className="text-lg font-semibold text-gray-800">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </span>
          </div>
        </div>

        <div className="mx-auto w-[90%] max-w-8xl px-4">
          {/* ================================================
              CHECKOUT STEPS
          ================================================ */}

          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {/* CART */}

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "cart"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                </div>

                <span className="hidden font-medium md:inline">Cart</span>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />

              {/* ADDRESS */}

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "address"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <MapPin className="h-6 w-6" />
                </div>

                <span className="hidden font-medium md:inline">Address</span>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />

              {/* PAYMENT */}

              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${
                    step === "payment"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <CreditCard className="h-6 w-6" />
                </div>

                <span className="hidden font-medium md:inline">Payment</span>
              </div>
            </div>
          </div>

          {/* ================================================
              CONTENT GRID
          ================================================ */}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ==============================================
                LEFT
            ============================================== */}

            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>

                  <CardDescription>Review your items</CardDescription>
                </CardHeader>

                <CardContent>
                  <CartItems
                    items={validCartItems}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={toggleWishlist}
                    onQuantityChange={handleQuantityChange}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>

            {/* ==============================================
                RIGHT
            ============================================== */}

            <div>
              {/* ============================================
                  COUPON
              ============================================ */}

              <Card className="mb-4 shadow-sm">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-red-600" />

                    <p className="font-semibold text-gray-900">Apply Coupon</p>
                  </div>

                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();

                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Enter coupon code"
                        className="uppercase"
                        disabled={isApplyingCoupon}
                      />

                      <Button
                        type="button"
                        disabled={!couponCode.trim() || isApplyingCoupon}
                        onClick={handleApplyCoupon}
                        className="shrink-0"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                            ✓
                          </span>

                          <p className="font-semibold text-green-800">
                            {appliedCoupon}
                          </p>
                        </div>

                        <p className="mt-1 text-sm text-green-700">
                          You saved ₹{couponDiscount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-white hover:text-red-600"
                        aria-label="Remove coupon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ============================================
                  PRICE DETAILS
              ============================================ */}
              <PriceDetails
                totalOriginalPrice={totalOriginalPrice}
                totalDiscount={totalDiscount}
                couponDiscount={couponDiscount}
                totalAmount={finalAmount}
                shippingCharge={maximunShippingCharge}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onGoBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address"),
                  )
                }
              />

              {/* ============================================
                  ADDRESS
              ============================================ */}

              {selectedAddress && (
                <Card className="mb-6 mt-6 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Delivery Address</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-1">
                      <p>{selectedAddress.addressLine1}</p>

                      {selectedAddress.addressLine2 && (
                        <p>{selectedAddress.addressLine2}</p>
                      )}

                      <p>
                        {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.pincode}
                      </p>

                      <p>Phone: {selectedAddress.phoneNumber}</p>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setShowAddressDialog(true)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Change Address
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* ================================================
              ADDRESS DIALOG
          ================================================ */}

          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select or Add Delivery Address</DialogTitle>
              </DialogHeader>

              <CheckoutAddress
                onAddressSelect={handleAddressSelect}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
