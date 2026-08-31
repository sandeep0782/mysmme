"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRazorpayWebhook = exports.createPaymentWithRazorpay = exports.getUserOrders = exports.getOrderById = exports.createOrUpdateOrder = void 0;
const ProductOrder_1 = __importDefault(require("../models/ProductOrder"));
const cartItems_1 = __importDefault(require("../models/cartItems"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const SellerOrder_1 = __importDefault(require("../models/SellerOrder"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
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
const createOrUpdateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        const { orderId, shippingAddress, paymentMethod, paymentDetails } = req.body;
        // -----------------------------------------
        // 1. Get cart
        // -----------------------------------------
        const cart = yield cartItems_1.default.findOne({ user: userId })
            .populate("items.product")
            .lean();
        if (!cart || !cart.items || cart.items.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Cart is empty");
        }
        // -----------------------------------------
        // 2. Validate cart products
        // -----------------------------------------
        for (const item of cart.items) {
            if (!item.product) {
                return (0, responseHandler_1.response)(res, 400, "One or more products in your cart no longer exist");
            }
        }
        // -----------------------------------------
        // 3. Calculate item total
        // -----------------------------------------
        const totalItemsAmount = cart.items.reduce((acc, item) => {
            const product = item.product;
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
            const product = item.product;
            const charge = product === null || product === void 0 ? void 0 : product.shippingCharge;
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
        const orderItems = cart.items.map((item) => {
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
            order = yield ProductOrder_1.default.findById(orderId);
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
            yield order.save();
        }
        // -----------------------------------------
        // 8. Create new order
        // -----------------------------------------
        else {
            order = new ProductOrder_1.default({
                user: userId,
                items: orderItems,
                totalAmount,
                shippingAddress,
                paymentMethod,
                paymentDetails,
                paymentStatus: paymentDetails ? "completed" : "pending",
            });
            yield order.save();
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
            const sellerGroups = new Map();
            // -----------------------------------------
            // Group order items by seller
            // -----------------------------------------
            for (const item of orderItems) {
                const sellerId = (_a = item.seller) === null || _a === void 0 ? void 0 : _a.toString();
                if (!sellerId) {
                    throw new Error(`Product ${item.product} does not have a valid seller`);
                }
                if (!sellerGroups.has(sellerId)) {
                    sellerGroups.set(sellerId, []);
                }
                sellerGroups.get(sellerId).push(item);
            }
            // -----------------------------------------
            // Create one SellerOrder per seller
            // -----------------------------------------
            for (const [sellerId, sellerItems] of sellerGroups.entries()) {
                const sellerOrderItems = sellerItems.map((item) => {
                    var _a;
                    // Find original product from cart
                    const cartItem = cart.items.find((cartItem) => { var _a, _b; return ((_b = (_a = cartItem.product) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) === item.product.toString(); });
                    const product = cartItem === null || cartItem === void 0 ? void 0 : cartItem.product;
                    return {
                        product: item.product,
                        quantity: item.quantity,
                        productName: item.productName,
                        productImage: (_a = product === null || product === void 0 ? void 0 : product.images) === null || _a === void 0 ? void 0 : _a[0],
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                    };
                });
                // -----------------------------------------
                // Calculate seller total
                // -----------------------------------------
                const sellerTotalAmount = sellerOrderItems.reduce((sum, item) => sum + item.totalPrice, 0);
                // -----------------------------------------
                // Create / update SellerOrder
                // -----------------------------------------
                const sellerOrder = yield SellerOrder_1.default.findOneAndUpdate({
                    order: order._id,
                    seller: sellerId,
                }, {
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
                }, {
                    upsert: true,
                    returnDocument: "after",
                    setDefaultsOnInsert: true,
                });
                console.log("✅ SellerOrder created/updated:", sellerOrder === null || sellerOrder === void 0 ? void 0 : sellerOrder._id, "Seller:", sellerId, "Amount:", sellerTotalAmount);
            }
        }
        // -----------------------------------------
        // 10. Clear cart after successful payment
        // -----------------------------------------
        if (paymentDetails) {
            yield cartItems_1.default.findOneAndUpdate({ user: userId }, {
                $set: {
                    items: [],
                },
            });
        }
        // -----------------------------------------
        // 11. Success response
        // -----------------------------------------
        return (0, responseHandler_1.response)(res, 201, "Order created/updated successfully", order);
    }
    catch (error) {
        console.error("❌ createOrUpdateOrder ERROR:", error);
        return (0, responseHandler_1.response)(res, 500, "Error creating/updating order", error);
    }
});
exports.createOrUpdateOrder = createOrUpdateOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield ProductOrder_1.default.findById(req.params.id)
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            model: "Product",
        });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        (0, responseHandler_1.response)(res, 200, "Order fetched successfully", order);
    }
    catch (error) {
        (0, responseHandler_1.response)(res, 500, "Error fetching order");
    }
});
exports.getOrderById = getOrderById;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.id;
        const orders = yield ProductOrder_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            model: "Product",
        });
        (0, responseHandler_1.response)(res, 200, "Orders fetched successfully", orders);
    }
    catch (error) {
        (0, responseHandler_1.response)(res, 500, "Error fetching orders");
    }
});
exports.getUserOrders = getUserOrders;
const createPaymentWithRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield ProductOrder_1.default.findById(orderId);
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        if (order.paymentStatus === "completed") {
            return (0, responseHandler_1.response)(res, 400, "Order is already paid");
        }
        const razorpayOrder = yield razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        });
        order.paymentDetails = Object.assign(Object.assign({}, order.paymentDetails), { razorpay_order_id: razorpayOrder.id });
        (0, responseHandler_1.response)(res, 200, "Razorpay order created", { order: razorpayOrder });
    }
    catch (error) {
        console.error("Error creating Razorpay order:", error);
        (0, responseHandler_1.response)(res, 500, "Error creating Razorpay order");
    }
});
exports.createPaymentWithRazorpay = createPaymentWithRazorpay;
const handleRazorpayWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto_1.default.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
        const paymentId = req.body.payload.payment.entity.id;
        const orderId = req.body.payload.payment.entity.order_id;
        yield ProductOrder_1.default.findOneAndUpdate({ "paymentDetails.razorpay_order_id": orderId }, {
            paymentStatus: "completed",
            status: "processing",
            "paymentDetails.razorpay_payment_id": paymentId,
        });
        (0, responseHandler_1.response)(res, 200, "Webhook processed successfully");
    }
    else {
        (0, responseHandler_1.response)(res, 400, "Invalid signature");
    }
});
exports.handleRazorpayWebhook = handleRazorpayWebhook;
