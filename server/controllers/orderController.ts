import { Request, Response } from "express";
import Order from "../models/ProductOrder";
import Cart from "../models/cartItems";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
dotenv.config();

import SellerOrder from "../models/SellerOrder";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// export const createOrUpdateOrder = async (req: Request, res: Response) => {
//   try {
//     const userId = req?.id;
//     const { orderId, shippingAddress, paymentMethod, paymentDetails } =
//       req.body;

//     // Fetch cart with populated products
//     const cart = await Cart.findOne({ user: userId })
//       .populate("items.product")
//       .lean();
//     if (!cart || cart.items.length === 0) {
//       return response(res, 400, "Cart is empty");
//     }

//     // 1️⃣ Calculate total amount from cart
//     const totalItemsAmount = cart.items.reduce(
//       (acc, item) => acc + (item.product as any).finalPrice * item.quantity,
//       0,
//     );

//     const shippingCharges = cart.items.map((item) => {
//       const charge = (item.product as any)?.shippingCharge;
//       if (!charge) return 0;
//       if (typeof charge === "string") {
//         return charge.toLowerCase() === "free" ? 0 : Number(charge) || 0;
//       }
//       if (typeof charge === "number") return charge;
//       return 0;
//     });

//     const maximumShippingCharge = Math.max(0, ...shippingCharges);
//     const totalAmount = totalItemsAmount + maximumShippingCharge;

//     // 2️⃣ Find existing order or create a new one
//     let order = await Order.findOne({ _id: orderId });

//     if (order) {
//       // Update existing order
//       order.shippingAddress = shippingAddress || order.shippingAddress;
//       order.paymentMethod = paymentMethod || order.paymentMethod;
//       order.totalAmount = totalAmount; // ✅ use calculated total
//       if (paymentDetails) {
//         order.paymentDetails = paymentDetails;
//         order.paymentStatus = "completed";
//         order.status = "processing";
//       }
//     } else {
//       // Create new order
//       order = new Order({
//         user: userId,
//         items: cart.items,
//         totalAmount, // ✅ calculated total
//         shippingAddress,
//         paymentMethod,
//         paymentDetails,
//         paymentStatus: paymentDetails ? "completed" : "pending",
//       });
//     }

//     await order.save();

//     // Clear cart if payment is done
//     if (paymentDetails) {
//       await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
//     }

//     response(res, 201, "Order created/updated successfully", order);
//   } catch (error) {
//     console.error(error);
//     response(res, 500, "Error creating/updating order", error);
//   }
// };

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;

    const { orderId, shippingAddress, paymentMethod, paymentDetails } =
      req.body;

    // -----------------------------------------
    // 1. Get cart
    // -----------------------------------------
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return response(res, 400, "Cart is empty");
    }

    // -----------------------------------------
    // 2. Validate cart products
    // -----------------------------------------
    for (const item of cart.items) {
      if (!item.product) {
        return response(
          res,
          400,
          "One or more products in your cart no longer exist",
        );
      }
    }

    // -----------------------------------------
    // 3. Calculate item total
    // -----------------------------------------
    const totalItemsAmount = cart.items.reduce((acc, item) => {
      const product = item.product as any;

      const unitPrice = Number(product.finalPrice);

      if (!Number.isFinite(unitPrice)) {
        throw new Error(`Invalid price for product ${product._id}`);
      }

      return acc + unitPrice * item.quantity;
    }, 0);

    // -----------------------------------------
    // 4. Calculate shipping
    // -----------------------------------------
    const shippingCharges = cart.items.map((item) => {
      const product = item.product as any;
      const charge = product?.shippingCharge;

      if (!charge) {
        return 0;
      }

      if (typeof charge === "string") {
        return charge.toLowerCase() === "free" ? 0 : Number(charge) || 0;
      }

      if (typeof charge === "number") {
        return charge;
      }

      return 0;
    });

    const maximumShippingCharge = Math.max(0, ...shippingCharges);

    const totalAmount = totalItemsAmount + maximumShippingCharge;

    // -----------------------------------------
    // 5. Create proper Order items
    // -----------------------------------------
    const orderItems = cart.items.map((item: any) => {
      const product = item.product;

      const unitPrice = Number(product.finalPrice);
      const totalPrice = unitPrice * item.quantity;

      // IMPORTANT:
      // product.seller must be a real User ObjectId
      if (!product.seller) {
        throw new Error(`Product "${product.title}" does not have a seller`);
      }

      return {
        product: product._id,
        productName: product.title,
        seller: product.seller,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    // -----------------------------------------
    // 6. Find existing order
    // -----------------------------------------
    let order = null;

    if (orderId) {
      order = await Order.findById(orderId);
    }

    // -----------------------------------------
    // 7. Update existing order
    // -----------------------------------------
    if (order) {
      order.items = orderItems;

      order.shippingAddress = shippingAddress || order.shippingAddress;

      order.paymentMethod = paymentMethod || order.paymentMethod;

      order.totalAmount = totalAmount;

      if (paymentDetails) {
        order.paymentDetails = paymentDetails;
        order.paymentStatus = "completed";
        order.status = "processing";
      }

      await order.save();
    }

    // -----------------------------------------
    // 8. Create new order
    // -----------------------------------------
    else {
      order = new Order({
        user: userId,

        items: orderItems,

        totalAmount,

        shippingAddress,

        paymentMethod,

        paymentDetails,

        paymentStatus: paymentDetails ? "completed" : "pending",
      });

      await order.save();
    }

    // =========================================================
    // 9. CREATE SELLER ORDERS
    // =========================================================
    //
    // Only create SellerOrders after payment is completed.
    //
    // Example:
    //
    // Product A -> seller X
    // Product B -> seller X
    // Product C -> seller Y
    //
    // Result:
    //
    // SellerOrder #1 -> seller X -> A + B
    // SellerOrder #2 -> seller Y -> C
    //
    // =========================================================

    if (paymentDetails) {
      const sellerGroups = new Map<string, any[]>();

      // -----------------------------------------
      // Group order items by seller
      // -----------------------------------------
      for (const item of orderItems) {
        const sellerId = item.seller?.toString();

        if (!sellerId) {
          throw new Error(
            `Product ${item.product} does not have a valid seller`,
          );
        }

        if (!sellerGroups.has(sellerId)) {
          sellerGroups.set(sellerId, []);
        }

        sellerGroups.get(sellerId)!.push(item);
      }

      // -----------------------------------------
      // Create one SellerOrder per seller
      // -----------------------------------------
      for (const [sellerId, sellerItems] of sellerGroups.entries()) {
        const sellerOrderItems = sellerItems.map((item) => {
          // Find original product from cart
          const cartItem = cart.items.find(
            (cartItem: any) =>
              cartItem.product?._id?.toString() === item.product.toString(),
          );

          const product = cartItem?.product as any;

          return {
            product: item.product,
            quantity: item.quantity,
            productName: item.productName,
            productImage: product?.images?.[0],
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          };
        });

        // -----------------------------------------
        // Calculate seller total
        // -----------------------------------------
        const sellerTotalAmount = sellerOrderItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0,
        );

        // -----------------------------------------
        // Create / update SellerOrder
        // -----------------------------------------
        const sellerOrder = await SellerOrder.findOneAndUpdate(
          {
            order: order._id,
            seller: sellerId,
          },
          {
            $set: {
              order: order._id,
              seller: sellerId,
              items: sellerOrderItems,
              totalAmount: sellerTotalAmount,
              paymentStatus: order.paymentStatus,
              paymentMethod: order.paymentMethod || "N/A",
            },
            $setOnInsert: {
              status: "pending",
            },
          },
          {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          },
        );

        console.log(
          "✅ SellerOrder created/updated:",
          sellerOrder?._id,
          "Seller:",
          sellerId,
          "Amount:",
          sellerTotalAmount,
        );
      }
    }

    // -----------------------------------------
    // 10. Clear cart after successful payment
    // -----------------------------------------
    if (paymentDetails) {
      await Cart.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            items: [],
          },
        },
      );
    }

    // -----------------------------------------
    // 11. Success response
    // -----------------------------------------
    return response(res, 201, "Order created/updated successfully", order);
  } catch (error) {
    console.error("❌ createOrUpdateOrder ERROR:", error);

    return response(res, 500, "Error creating/updating order", error);
  }
};

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

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });
    response(res, 200, "Orders fetched successfully", orders);
  } catch (error) {
    response(res, 500, "Error fetching orders");
  }
};

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response,
) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return response(res, 404, "Order not found");
    }

    if (order.paymentStatus === "completed") {
      return response(res, 400, "Order is already paid");
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "INR",
      receipt: order._id.toString(),
    });
    order.paymentDetails = {
      ...order.paymentDetails,
      razorpay_order_id: razorpayOrder.id,
    };

    response(res, 200, "Razorpay order created", { order: razorpayOrder });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    response(res, 500, "Error creating Razorpay order");
  }
};

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const paymentId = req.body.payload.payment.entity.id;
    const orderId = req.body.payload.payment.entity.order_id;

    await Order.findOneAndUpdate(
      { "paymentDetails.razorpay_order_id": orderId },
      {
        paymentStatus: "completed",
        status: "processing",
        "paymentDetails.razorpay_payment_id": paymentId,
      },
    );

    response(res, 200, "Webhook processed successfully");
  } else {
    response(res, 400, "Invalid signature");
  }
};
