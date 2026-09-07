import { Request, Response } from "express";
import Order from "../models/ProductOrder";
import Cart from "../models/cartItems";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
dotenv.config();
import PDFDocument from "pdfkit";

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
