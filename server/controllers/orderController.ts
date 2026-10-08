import { Request, Response } from "express";
import Order from "../models/ProductOrder";
import Cart from "../models/cartItems";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import SellerOrder from "../models/SellerOrder";
import { validateCoupon } from "../services/couponService";
import { sendOrderConfirmationEmails } from "../config/orderEmailService";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// ============================================================
// CREATE / UPDATE ORDER
// ============================================================

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const {
      orderId,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      couponCode,
    } = req.body;

    if (paymentMethod === "razorpay") {
      return response(
        res,
        400,
        "Razorpay orders must be created through the payment verification flow",
      );
    }
    // ==========================================================
    // 1. GET CART
    // ==========================================================

    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return response(res, 400, "Cart is empty");
    }

    // ==========================================================
    // 2. VALIDATE PRODUCTS
    // ==========================================================

    for (const item of cart.items) {
      if (!item.product) {
        return response(
          res,
          400,
          "One or more products in your cart no longer exist",
        );
      }
    }

    // ==========================================================
    // 3. CALCULATE PRODUCT SUBTOTAL
    // ==========================================================

    const totalItemsAmount = cart.items.reduce((acc, item) => {
      const product = item.product as any;

      const unitPrice = Number(product.finalPrice);

      if (!Number.isFinite(unitPrice)) {
        throw new Error(`Invalid price for product ${product._id}`);
      }

      const quantity = Number(item.quantity);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product._id}`);
      }

      return acc + unitPrice * quantity;
    }, 0);

    // ==========================================================
    // 4. CALCULATE SHIPPING
    // ==========================================================

    const shippingCharges = cart.items.map((item) => {
      const product = item.product as any;

      const charge = product?.shippingCharge;

      if (charge === undefined || charge === null || charge === "") {
        return 0;
      }

      if (typeof charge === "string") {
        if (charge.trim().toLowerCase() === "free") {
          return 0;
        }

        const parsed = Number(charge);

        return Number.isFinite(parsed) ? parsed : 0;
      }

      if (typeof charge === "number") {
        return Number.isFinite(charge) ? charge : 0;
      }

      return 0;
    });

    const maximumShippingCharge = Math.max(0, ...shippingCharges);

    // ==========================================================
    // 5. FIND EXISTING ORDER
    // ==========================================================

    let order = null;

    if (orderId) {
      order = await Order.findOne({
        _id: orderId,
        user: userId,
      });

      if (!order) {
        return response(res, 404, "Order not found");
      }

      if (order.paymentStatus === "completed") {
        return response(res, 400, "Order is already completed");
      }
    }

    // ==========================================================
    // 6. DETERMINE COUPON
    // ==========================================================

    let couponDiscount = 0;

    let validatedCouponCode: string | undefined;

    /*
     * First request:
     * frontend sends couponCode.
     *
     * Later address/payment requests:
     * preserve coupon already saved on order.
     */
    const effectiveCouponCode =
      typeof couponCode === "string" && couponCode.trim()
        ? couponCode.trim().toUpperCase()
        : order?.couponCode || undefined;

    // ==========================================================
    // 7. VALIDATE COUPON SERVER-SIDE
    // ==========================================================

    if (effectiveCouponCode) {
      /*
       * Count previous successful orders.
       * Useful for firstOrderOnly coupons.
       */
      const completedOrderFilter: Record<string, any> = {
        user: userId,
        paymentStatus: "completed",
      };

      /*
       * Do not count current order
       * if we're updating it.
       */
      if (order?._id) {
        completedOrderFilter._id = {
          $ne: order._id,
        };
      }

      const userOrderCount = await Order.countDocuments(completedOrderFilter);

      /*
       * Important:
       * backend passes its own calculated subtotal.
       * Do not trust frontend cart total here.
       */
      const couponResult = await validateCoupon({
        code: effectiveCouponCode,

        cartTotal: totalItemsAmount,

        userId: userId.toString(),

        userOrderCount,
      });

      if (!couponResult.valid) {
        return res.status(400).json({
          success: false,

          message: couponResult.message || "Coupon is no longer valid.",
        });
      }

      const calculatedDiscount = Number(couponResult.discountAmount ?? 0);

      if (!Number.isFinite(calculatedDiscount) || calculatedDiscount < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon discount amount.",
        });
      }

      /*
       * Never allow coupon discount
       * to exceed the product subtotal.
       */
      couponDiscount = Math.min(calculatedDiscount, totalItemsAmount);

      validatedCouponCode = couponResult.couponCode || effectiveCouponCode;
    }

    // ==========================================================
    // 8. CALCULATE FINAL AMOUNT
    // ==========================================================

    /*
     * FINAL FORMULA:
     *
     * subtotal
     * - coupon discount
     * + shipping
     */

    const totalAmount =
      Math.max(0, totalItemsAmount - couponDiscount) + maximumShippingCharge;

    console.log("========================================");

    console.log("ORDER PRICE CALCULATION");

    console.log({
      subtotal: totalItemsAmount,

      couponCode: validatedCouponCode,

      couponDiscount,

      shippingCharge: maximumShippingCharge,

      totalAmount,
    });

    console.log("========================================");

    // ==========================================================
    // 9. BUILD ORDER ITEMS
    // ==========================================================

    const orderItems = cart.items.map((item: any) => {
      const product = item.product;

      const unitPrice = Number(product.finalPrice);

      const quantity = Number(item.quantity);

      const totalPrice = unitPrice * quantity;

      if (!product.seller) {
        throw new Error(`Product "${product.title}" does not have a seller`);
      }

      return {
        product: product._id,

        productName: product.title,

        seller: product.seller,

        quantity,

        unitPrice,

        totalPrice,
      };
    });

    // ==========================================================
    // 10. UPDATE EXISTING ORDER
    // ==========================================================

    if (order) {
      order.items = orderItems;

      order.subtotal = totalItemsAmount;

      order.shippingCharge = maximumShippingCharge;

      order.couponCode = validatedCouponCode;

      order.couponDiscount = couponDiscount;

      order.totalAmount = totalAmount;

      if (shippingAddress) {
        order.shippingAddress = shippingAddress;
      }

      if (paymentMethod) {
        order.paymentMethod = paymentMethod;
      }
      await order.save();
    }

    // ==========================================================
    // 13. CLEAR CART AFTER PAYMENT COMPLETION
    // ==========================================================

    // ==========================================================
    // 14. RESPONSE
    // ==========================================================

    return response(res, 201, "Order created/updated successfully", order);
  } catch (error) {
    console.error("❌ createOrUpdateOrder ERROR:", error);

    return response(res, 500, "Error creating/updating order", error);
  }
};

// ============================================================
// GET ORDER BY ID
// ============================================================

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",

        model: "Product",
      });

    if (!order) {
      return response(res, 404, "Order not found");
    }

    response(res, 200, "Order fetched successfully", order);
  } catch (error) {
    response(res, 500, "Error fetching order");
  }
};

// ============================================================
// GET USER ORDERS
// ============================================================

// export const getUserOrders = async (req: Request, res: Response) => {
//   try {
//     const userId = req?.id;

//     const orders = await Order.find({

//     })
//       .sort({
//         createdAt: -1,
//       })
//       .populate("user", "name email")
//       .populate("shippingAddress")
//       .populate({
//         path: "items.product",

//         model: "Product",
//       });

//     response(res, 200, "Orders fetched successfully", orders);
//   } catch (error) {
//     response(res, 500, "Error fetching orders");
//   }
// };

// ============================================================
// GET ORDERS
// ADMIN  -> ALL ORDERS
// OTHERS -> OWN ORDERS
// ============================================================

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const role = (req as any).user?.role || (req as any).role;

    const filter =
      role === "admin"
        ? {}
        : {
            user: userId,
          };

    const orders = await Order.find(filter)
      .sort({
        createdAt: -1,
      })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });

    return response(res, 200, "Orders fetched successfully", orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return response(res, 500, "Error fetching orders");
  }
};
// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================
// ============================================================
// CREATE RAZORPAY PAYMENT ORDER
// ============================================================

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req?.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const { couponCode, shippingAddress } = req.body;

    // ==========================================================
    // 1. GET CART
    // ==========================================================

    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return response(res, 400, "Cart is empty");
    }

    // ==========================================================
    // 2. CALCULATE SUBTOTAL
    // ==========================================================

    const totalItemsAmount = cart.items.reduce((acc, item: any) => {
      const product = item.product;

      if (!product) {
        throw new Error("One or more products no longer exist");
      }

      const unitPrice = Number(product.finalPrice);
      const quantity = Number(item.quantity);

      if (!Number.isFinite(unitPrice)) {
        throw new Error(`Invalid price for product ${product._id}`);
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product._id}`);
      }

      return acc + unitPrice * quantity;
    }, 0);

    // ==========================================================
    // 3. SHIPPING
    // ==========================================================

    const shippingCharges = cart.items.map((item: any) => {
      const product = item.product;

      const charge = product?.shippingCharge;

      if (charge === undefined || charge === null || charge === "") {
        return 0;
      }

      if (typeof charge === "string") {
        if (charge.trim().toLowerCase() === "free") {
          return 0;
        }

        const parsed = Number(charge);

        return Number.isFinite(parsed) ? parsed : 0;
      }

      if (typeof charge === "number") {
        return Number.isFinite(charge) ? charge : 0;
      }

      return 0;
    });

    const maximumShippingCharge = Math.max(0, ...shippingCharges);

    // ==========================================================
    // 4. COUPON
    // ==========================================================

    let couponDiscount = 0;
    let validatedCouponCode: string | undefined;

    if (typeof couponCode === "string" && couponCode.trim()) {
      const normalizedCouponCode = couponCode.trim().toUpperCase();

      const userOrderCount = await Order.countDocuments({
        user: userId,
        paymentStatus: "completed",
      });

      const couponResult = await validateCoupon({
        code: normalizedCouponCode,
        cartTotal: totalItemsAmount,
        userId: userId.toString(),
        userOrderCount,
      });

      if (!couponResult.valid) {
        return res.status(400).json({
          success: false,
          message: couponResult.message || "Coupon is no longer valid.",
        });
      }

      const calculatedDiscount = Number(couponResult.discountAmount ?? 0);

      if (!Number.isFinite(calculatedDiscount) || calculatedDiscount < 0) {
        return response(res, 400, "Invalid coupon discount amount");
      }

      couponDiscount = Math.min(calculatedDiscount, totalItemsAmount);

      validatedCouponCode = couponResult.couponCode || normalizedCouponCode;
    }

    // ==========================================================
    // 5. FINAL TOTAL
    // ==========================================================

    const totalAmount =
      Math.max(0, totalItemsAmount - couponDiscount) + maximumShippingCharge;

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return response(res, 400, "Invalid payment amount");
    }

    console.log("RAZORPAY PAYMENT AMOUNT:", {
      userId,
      subtotal: totalItemsAmount,
      couponCode: validatedCouponCode,
      couponDiscount,
      shippingCharge: maximumShippingCharge,
      totalAmount,
      amountInPaise: Math.round(totalAmount * 100),
    });

    // ==========================================================
    // 6. CREATE RAZORPAY ORDER
    // ==========================================================

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",

      receipt: `cart-${userId}-${Date.now()}`,

      notes: {
        userId: userId.toString(),
        couponCode: validatedCouponCode || "",
      },
    });

    // ==========================================================
    // 7. RESPONSE
    // ==========================================================

    return response(res, 200, "Razorpay order created", {
      order: razorpayOrder,

      checkout: {
        couponCode: validatedCouponCode,
        shippingAddress,
      },

      priceBreakdown: {
        subtotal: totalItemsAmount,
        couponCode: validatedCouponCode,
        couponDiscount,
        shippingCharge: maximumShippingCharge,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);

    return response(res, 500, "Error creating Razorpay order");
  }
};

// ============================================================
// VERIFY RAZORPAY PAYMENT + CREATE FINAL MYSMME ORDER
// ============================================================

export const verifyPaymentAndCreateOrder = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req?.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      shippingAddress,
      couponCode,
    } = req.body;

    // ==========================================================
    // 1. BASIC VALIDATION
    // ==========================================================

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return response(res, 400, "Missing Razorpay payment details");
    }

    if (!shippingAddress) {
      return response(res, 400, "Shipping address is required");
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return response(res, 500, "Razorpay configuration missing");
    }

    // ==========================================================
    // 2. IDEMPOTENCY CHECK
    // Prevent duplicate MYSMME orders for same Razorpay payment
    // ==========================================================

    const existingOrder = await Order.findOne({
      "paymentDetails.razorpay_payment_id": razorpay_payment_id,
    });

    if (existingOrder) {
      console.log("♻️ Payment already processed:", razorpay_payment_id);

      return response(res, 200, "Order already created", existingOrder);
    }

    // ==========================================================
    // 3. VERIFY RAZORPAY SIGNATURE
    // ==========================================================

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay payment signature");

      return response(res, 400, "Invalid payment signature");
    }

    console.log("✅ Razorpay signature verified:", razorpay_payment_id);

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.order_id !== razorpay_order_id) {
      return response(res, 400, "Razorpay payment/order mismatch");
    }

    if (
      razorpayPayment.status !== "captured" &&
      razorpayPayment.status !== "authorized"
    ) {
      return response(res, 400, "Payment has not been completed");
    }

    // ==========================================================
    // 4. GET CURRENT CART
    // ==========================================================

    const cart = await Cart.findOne({
      user: userId,
    })
      .populate("items.product")
      .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return response(res, 400, "Cart is empty");
    }

    // ==========================================================
    // 5. CALCULATE PRODUCT SUBTOTAL
    // ==========================================================

    const totalItemsAmount = cart.items.reduce((acc: number, item: any) => {
      const product = item.product;

      if (!product) {
        throw new Error("One or more products no longer exist");
      }

      const unitPrice = Number(product.finalPrice);

      const quantity = Number(item.quantity);

      if (!Number.isFinite(unitPrice)) {
        throw new Error(`Invalid price for product ${product._id}`);
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for product ${product._id}`);
      }

      return acc + unitPrice * quantity;
    }, 0);

    // ==========================================================
    // 6. SHIPPING
    // ==========================================================

    const shippingCharges = cart.items.map((item: any) => {
      const product = item.product;

      const charge = product?.shippingCharge;

      if (charge === undefined || charge === null || charge === "") {
        return 0;
      }

      if (typeof charge === "string") {
        if (charge.trim().toLowerCase() === "free") {
          return 0;
        }

        const parsed = Number(charge);

        return Number.isFinite(parsed) ? parsed : 0;
      }

      if (typeof charge === "number") {
        return Number.isFinite(charge) ? charge : 0;
      }

      return 0;
    });

    const maximumShippingCharge = Math.max(0, ...shippingCharges);

    // ==========================================================
    // 7. VALIDATE COUPON AGAIN
    // ==========================================================

    let couponDiscount = 0;

    let validatedCouponCode: string | undefined;

    if (typeof couponCode === "string" && couponCode.trim()) {
      const normalizedCouponCode = couponCode.trim().toUpperCase();

      const userOrderCount = await Order.countDocuments({
        user: userId,
        paymentStatus: "completed",
      });

      const couponResult = await validateCoupon({
        code: normalizedCouponCode,
        cartTotal: totalItemsAmount,
        userId: userId.toString(),
        userOrderCount,
      });

      if (!couponResult.valid) {
        return response(
          res,
          400,
          couponResult.message || "Coupon is no longer valid",
        );
      }

      const discount = Number(couponResult.discountAmount ?? 0);

      if (!Number.isFinite(discount) || discount < 0) {
        return response(res, 400, "Invalid coupon discount");
      }

      couponDiscount = Math.min(discount, totalItemsAmount);

      validatedCouponCode = couponResult.couponCode || normalizedCouponCode;
    }

    // ==========================================================
    // 8. FINAL TOTAL
    // ==========================================================

    const totalAmount =
      Math.max(0, totalItemsAmount - couponDiscount) + maximumShippingCharge;

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return response(res, 400, "Invalid order amount");
    }

    // ==========================================================
    // 9. VERIFY RAZORPAY ORDER AMOUNT
    // ==========================================================

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

    const expectedAmount = Math.round(totalAmount * 100);

    if (Number(razorpayPayment.amount) !== expectedAmount) {
      return response(res, 400, "Payment amount mismatch");
    }

    if (Number(razorpayOrder.amount) !== expectedAmount) {
      console.error("❌ Razorpay amount mismatch", {
        razorpayAmount: razorpayOrder.amount,
        expectedAmount,
      });

      return response(res, 400, "Payment amount mismatch");
    }

    // ==========================================================
    // 10. BUILD ORDER ITEMS
    // ==========================================================

    const orderItems = cart.items.map((item: any) => {
      const product = item.product;

      if (!product.seller) {
        throw new Error(`Product "${product.title}" does not have a seller`);
      }

      const unitPrice = Number(product.finalPrice);

      const quantity = Number(item.quantity);

      return {
        product: product._id,

        productName: product.title,

        seller: product.seller,

        quantity,

        unitPrice,

        totalPrice: unitPrice * quantity,
      };
    });

    // ==========================================================
    // 11. CREATE FINAL MYSMME ORDER
    // ==========================================================

    const shippingAddressId =
      typeof shippingAddress === "string"
        ? shippingAddress
        : shippingAddress?._id;

    if (!shippingAddressId) {
      return response(res, 400, "Invalid shipping address");
    }

    const order = new Order({
      user: userId,

      items: orderItems,

      subtotal: totalItemsAmount,

      shippingCharge: maximumShippingCharge,

      couponCode: validatedCouponCode,

      couponDiscount,

      totalAmount,

      shippingAddress: shippingAddressId,

      paymentMethod: "razorpay",

      paymentDetails: {
        razorpay_payment_id,

        razorpay_order_id,

        razorpay_signature,
      },

      paymentStatus: "completed",

      status: "processing",
    });

    await order.save();

    console.log("✅ FINAL MYSMME ORDER CREATED:", order._id.toString());

    // ==========================================================
    // 12. CREATE SELLER ORDERS
    // ==========================================================

    const sellerGroups = new Map<string, any[]>();

    for (const item of orderItems) {
      const sellerId = item.seller?.toString();

      if (!sellerId) {
        continue;
      }

      if (!sellerGroups.has(sellerId)) {
        sellerGroups.set(sellerId, []);
      }

      sellerGroups.get(sellerId)!.push(item);
    }

    for (const [sellerId, sellerItems] of sellerGroups.entries()) {
      const sellerTotal = sellerItems.reduce(
        (acc: number, item: any) => acc + Number(item.totalPrice),
        0,
      );

      await SellerOrder.create({
        order: order._id,

        seller: sellerId,

        items: sellerItems,

        totalAmount: sellerTotal,

        paymentStatus: "completed",

        status: "processing",
      });
    }

    // ==========================================================
    // 13. SEND CONFIRMATION EMAIL
    // ==========================================================

    try {
      const populatedOrder = await Order.findById(order._id)
        .populate("user", "name email")
        .populate("shippingAddress");

      if (populatedOrder) {
        const customer: any = populatedOrder.user;

        const populatedAddress: any = populatedOrder.shippingAddress;

        await sendOrderConfirmationEmails({
          order: populatedOrder,

          customer: {
            name: customer?.name,

            email: customer?.email,
          },

          shippingAddress: populatedAddress,
        });

        console.log("✅ Order confirmation email sent");
      }
    } catch (emailError) {
      console.error("❌ Order email error:", emailError);
    }

    // ==========================================================
    // 14. CLEAR CART
    // ==========================================================

    await Cart.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          items: [],
        },
      },
    );

    // ==========================================================
    // 15. RESPONSE
    // ==========================================================

    return response(
      res,
      201,
      "Payment verified and order created successfully",
      order,
    );
  } catch (error) {
    console.error("❌ verifyPaymentAndCreateOrder ERROR:", error);

    return response(
      res,
      500,
      "Unable to verify payment and create order",
      error,
    );
  }
};
// ============================================================
// RAZORPAY WEBHOOK
// ============================================================

export const handleRazorpayWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");

      response(res, 500, "Webhook configuration error");

      return;
    }

    const signature = req.headers["x-razorpay-signature"];

    if (!signature || typeof signature !== "string") {
      response(res, 400, "Missing Razorpay signature");

      return;
    }

    const rawBody = (
      req as Request & {
        rawBody?: Buffer;
      }
    ).rawBody;

    if (!rawBody) {
      console.error("Razorpay webhook raw body is missing");

      response(res, 400, "Invalid webhook payload");

      return;
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      response(res, 400, "Invalid signature");

      return;
    }

    /*
     * Only captured payments
     * should complete an order.
     */
    if (req.body.event !== "payment.captured") {
      response(res, 200, "Webhook event ignored");

      return;
    }

    const payment = req.body?.payload?.payment?.entity;

    if (!payment?.id || !payment?.order_id) {
      response(res, 400, "Invalid payment payload");

      return;
    }

    const paymentId = payment.id;

    const razorpayOrderId = payment.order_id;

    const order = await Order.findOneAndUpdate(
      {
        "paymentDetails.razorpay_order_id": razorpayOrderId,
      },
      {
        paymentStatus: "completed",

        status: "processing",

        "paymentDetails.razorpay_payment_id": paymentId,
      },
      {
        new: true,
      },
    );

    if (!order) {
      console.error(
        `Razorpay webhook: MYSMME order not found for ${razorpayOrderId}`,
      );

      response(res, 200, "Order not found");

      return;
    }

    console.log(
      `Razorpay payment captured: order=${razorpayOrderId}, payment=${paymentId}`,
    );

    response(res, 200, "Webhook processed successfully");
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    response(res, 500, "Webhook processing failed");
  }
};

// ============================================================
// DOWNLOAD INVOICE
// Keep your existing invoice code below this point.
// ============================================================

export const downloadInvoice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = req.id;

    /* ===================================================== */
    /* AUTHENTICATION                                        */
    /* ===================================================== */

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    /* ===================================================== */
    /* GET ORDER                                             */
    /* ===================================================== */

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("shippingAddress")
      .populate("items.product")
      .populate("user");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    /* ===================================================== */
    /* DELIVERY CHECK                                        */
    /* ===================================================== */

    if (order.status !== "delivered") {
      res.status(400).json({
        success: false,
        message: "Invoice is available only after the order is delivered",
      });
      return;
    }

    /* ===================================================== */
    /* PDF SETUP                                             */
    /* ===================================================== */

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      bufferPages: true,
    });

    const invoiceNumber = `INV-${order._id.toString().slice(-8).toUpperCase()}`;

    const filename = `${invoiceNumber}.pdf`;

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    doc.pipe(res);

    /* ===================================================== */
    /* COLORS                                                */
    /* ===================================================== */

    const COLORS = {
      primary: "#EC4899",
      primaryDark: "#DB2777",
      rose: "#F43F5E",

      dark: "#111827",
      text: "#374151",
      muted: "#6B7280",

      light: "#F9FAFB",
      border: "#E5E7EB",

      green: "#059669",
      greenBg: "#ECFDF5",

      white: "#FFFFFF",
    };

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;

    const LEFT = 50;
    const RIGHT = 545;
    const CONTENT_WIDTH = RIGHT - LEFT;

    /* ===================================================== */
    /* HELPERS                                               */
    /* ===================================================== */

    const money = (value: number) =>
      `₹${Number(value || 0).toLocaleString("en-IN")}`;

    const formatDate = (date: Date | string) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const drawRoundedBox = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius = 10,
      fill = COLORS.light,
      stroke?: string,
    ) => {
      doc.roundedRect(x, y, width, height, radius);

      doc.fillColor(fill).fill();

      if (stroke) {
        doc
          .roundedRect(x, y, width, height, radius)
          .strokeColor(stroke)
          .stroke();
      }
    };

    /* ===================================================== */
    /* TOP BRAND HEADER                                      */
    /* ===================================================== */

    // Pink gradient-like brand strip
    doc.rect(0, 0, PAGE_WIDTH, 8).fillColor(COLORS.primary).fill();

    // Brand
    doc
      .font("Helvetica-Bold")
      .fontSize(25)
      .fillColor(COLORS.dark)
      .text("MYSMME", LEFT, 38);

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("Saree Marketplace", LEFT, 68);

    // Invoice title
    doc
      .font("Helvetica-Bold")
      .fontSize(27)
      .fillColor(COLORS.dark)
      .text("INVOICE", 390, 38, {
        width: 155,
        align: "right",
      });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`Invoice # ${invoiceNumber}`, 390, 72, {
        width: 155,
        align: "right",
      });

    doc.text(`Invoice Date: ${formatDate(new Date())}`, 390, 87, {
      width: 155,
      align: "right",
    });

    /* ===================================================== */
    /* STATUS BADGE                                          */
    /* ===================================================== */

    drawRoundedBox(430, 115, 115, 28, 14, COLORS.greenBg);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.green)
      .text("✓  DELIVERED", 430, 124, {
        width: 115,
        align: "center",
      });

    /* ===================================================== */
    /* CUSTOMER / ORDER CARDS                                */
    /* ===================================================== */

    const cardsY = 165;
    const cardGap = 15;
    const cardWidth = (CONTENT_WIDTH - cardGap) / 2;

    /* Customer card */

    drawRoundedBox(LEFT, cardsY, cardWidth, 145, 10, "#FFFFFF", COLORS.border);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text("BILL TO", LEFT + 18, cardsY + 18);

    const customer: any = order.user;
    const address: any = order.shippingAddress;

    const customerName = customer?.name || address?.name || "Customer";

    const customerEmail = customer?.email || "";

    const customerPhone = customer?.phoneNumber || address?.phoneNumber || "";

    let customerY = cardsY + 43;

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.dark)
      .text(customerName, LEFT + 18, customerY);

    customerY += 18;

    if (customerEmail) {
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(COLORS.muted)
        .text(customerEmail, LEFT + 18, customerY);

      customerY += 15;
    }

    if (customerPhone) {
      doc.text(`Phone: ${customerPhone}`, LEFT + 18, customerY);

      customerY += 15;
    }

    if (address) {
      const addressLines = [
        address.addressLine1,
        address.addressLine2,
        [address.city, address.state, address.pincode]
          .filter(Boolean)
          .join(", "),
      ].filter(Boolean);

      addressLines.forEach((line: string) => {
        doc.text(line, LEFT + 18, customerY, {
          width: cardWidth - 36,
        });

        customerY += 13;
      });
    }

    /* Order card */

    const orderCardX = LEFT + cardWidth + cardGap;

    drawRoundedBox(
      orderCardX,
      cardsY,
      cardWidth,
      145,
      10,
      "#FFFFFF",
      COLORS.border,
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text("ORDER DETAILS", orderCardX + 18, cardsY + 18);

    const detailsX = orderCardX + 18;
    let detailsY = cardsY + 45;

    const orderDetails = [
      ["Order ID", `#${order._id.toString().slice(-8).toUpperCase()}`],
      ["Order Date", formatDate(order.createdAt)],
      ["Status", "Delivered"],
      ["Payment", order.paymentMethod || "Online Payment"],
    ];

    orderDetails.forEach(([label, value]) => {
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(COLORS.muted)
        .text(label, detailsX, detailsY);

      doc
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .fillColor(COLORS.dark)
        .text(value, detailsX + 75, detailsY);

      detailsY += 20;
    });

    /* ===================================================== */
    /* ITEMS SECTION                                         */
    /* ===================================================== */

    const tableY = cardsY + 175;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(COLORS.dark)
      .text("Order Items", LEFT, tableY);

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        `${order.items.length} ${order.items.length === 1 ? "item" : "items"}`,
        LEFT,
        tableY + 18,
      );

    /* Table header */

    const headerY = tableY + 42;

    drawRoundedBox(LEFT, headerY, CONTENT_WIDTH, 34, 7, "#FFF1F7");

    doc.font("Helvetica-Bold").fontSize(8).fillColor(COLORS.primaryDark);

    doc.text("PRODUCT", LEFT + 14, headerY + 12, {
      width: 270,
    });

    doc.text("QTY", 335, headerY + 12, {
      width: 40,
      align: "center",
    });

    doc.text("PRICE", 390, headerY + 12, {
      width: 65,
      align: "right",
    });

    doc.text("TOTAL", 465, headerY + 12, {
      width: 65,
      align: "right",
    });

    /* Table rows */

    let rowY = headerY + 45;

    order.items.forEach((item, index) => {
      const rowHeight = 48;

      if (index % 2 === 1) {
        drawRoundedBox(LEFT, rowY - 8, CONTENT_WIDTH, rowHeight, 6, "#FAFAFA");
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(COLORS.dark)
        .text(item.productName, LEFT + 14, rowY, {
          width: 265,
        });

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text("Saree", LEFT + 14, rowY + 15);

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(String(item.quantity), 335, rowY + 3, {
          width: 40,
          align: "center",
        });

      doc.text(money(item.unitPrice), 390, rowY + 3, {
        width: 65,
        align: "right",
      });

      doc
        .font("Helvetica-Bold")
        .fillColor(COLORS.dark)
        .text(money(item.totalPrice), 465, rowY + 3, {
          width: 65,
          align: "right",
        });

      rowY += rowHeight;
    });

    /* ===================================================== */
    /* TOTAL SECTION                                         */
    /* ===================================================== */

    const totalBoxY = rowY + 15;

    drawRoundedBox(330, totalBoxY, 215, 120, 10, "#FFF7FA", "#FCE7F3");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("Subtotal", 350, totalBoxY + 18);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.dark)
      .text(money(order.totalAmount), 445, totalBoxY + 18, {
        width: 80,
        align: "right",
      });

    doc
      .moveTo(350, totalBoxY + 40)
      .lineTo(525, totalBoxY + 40)
      .strokeColor("#F3DCE5")
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text("Shipping", 350, totalBoxY + 52);

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.dark)
      .text("Included", 445, totalBoxY + 52, {
        width: 80,
        align: "right",
      });

    doc
      .moveTo(350, totalBoxY + 73)
      .lineTo(525, totalBoxY + 73)
      .strokeColor("#F3DCE5")
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.primaryDark)
      .text("TOTAL", 350, totalBoxY + 87);

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(COLORS.primaryDark)
      .text(money(order.totalAmount), 425, totalBoxY + 84, {
        width: 100,
        align: "right",
      });

    /* ===================================================== */
    /* PAYMENT INFORMATION                                   */
    /* ===================================================== */

    const paymentY = totalBoxY + 145;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.dark)
      .text("Payment Information", LEFT, paymentY);

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(
        `Payment Method: ${order.paymentMethod || "Online Payment"}`,
        LEFT,
        paymentY + 18,
      );

    doc.text(
      `Payment Status: ${
        order.paymentStatus === "completed" ? "Paid" : order.paymentStatus
      }`,
      LEFT,
      paymentY + 33,
    );

    /* ===================================================== */
    /* FOOTER                                                */
    /* ===================================================== */

    const footerY = PAGE_HEIGHT - 85;

    doc
      .moveTo(LEFT, footerY)
      .lineTo(RIGHT, footerY)
      .strokeColor(COLORS.border)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.primaryDark)
      .text("Thank you for shopping with MySMME", LEFT, footerY + 18, {
        width: CONTENT_WIDTH,
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        "Your trusted destination for beautiful sarees.",
        LEFT,
        footerY + 35,
        {
          width: CONTENT_WIDTH,
          align: "center",
        },
      );

    doc
      .fontSize(7.5)
      .fillColor("#9CA3AF")
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        LEFT,
        footerY + 51,
        {
          width: CONTENT_WIDTH,
          align: "center",
        },
      );

    /* ===================================================== */
    /* PAGE NUMBER                                           */
    /* ===================================================== */

    doc
      .fontSize(7)
      .fillColor("#9CA3AF")
      .text("MySMME", LEFT, PAGE_HEIGHT - 25, {
        width: CONTENT_WIDTH,
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Download invoice error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Unable to generate invoice",
      });
    }
  }
};
