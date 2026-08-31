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
exports.markSellerOrderDelivered = exports.dispatchSellerOrder = exports.markSellerOrderReadyToShip = exports.processSellerOrder = exports.acceptSellerOrder = exports.getSellerOrderById = exports.getSellerOrders = void 0;
const SellerOrder_1 = __importDefault(require("../models/SellerOrder"));
const responseHandler_1 = require("../utils/responseHandler");
const syncOrderStatus_1 = require("../utils/syncOrderStatus");
const getSellerOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrders = yield SellerOrder_1.default.find({
            seller: sellerId,
        })
            .populate({
            path: "order",
            select: "orderNumber user shippingAddress paymentStatus paymentMethod createdAt notes",
            populate: [
                {
                    path: "user",
                    select: "name email",
                },
                {
                    path: "shippingAddress",
                },
            ],
        })
            .populate({
            path: "items.product",
            select: "title images skuId",
        })
            .sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Seller orders fetched successfully", sellerOrders);
    }
    catch (error) {
        console.error("Get seller orders error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching seller orders");
    }
});
exports.getSellerOrders = getSellerOrders;
const getSellerOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
        })
            .populate({
            path: "order",
            select: "user shippingAddress paymentStatus paymentMethod status createdAt notes",
            populate: [
                {
                    path: "user",
                    select: "name email",
                },
                {
                    path: "shippingAddress",
                },
            ],
        })
            .populate({
            path: "items.product",
            select: "title images skuId",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Seller order not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Seller order fetched successfully", sellerOrder);
    }
    catch (error) {
        console.error("Get seller order error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error fetching seller order");
    }
});
exports.getSellerOrderById = getSellerOrderById;
const acceptSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
            status: "pending",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Pending seller order not found");
        }
        sellerOrder.status = "accepted";
        yield sellerOrder.save();
        return (0, responseHandler_1.response)(res, 200, "Order accepted successfully", sellerOrder);
    }
    catch (error) {
        console.error("Accept seller order error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error accepting seller order");
    }
});
exports.acceptSellerOrder = acceptSellerOrder;
const processSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
            status: "accepted",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Accepted seller order not found");
        }
        sellerOrder.status = "processing";
        yield sellerOrder.save();
        return (0, responseHandler_1.response)(res, 200, "Order moved to processing", sellerOrder);
    }
    catch (error) {
        console.error("Process seller order error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error processing seller order");
    }
});
exports.processSellerOrder = processSellerOrder;
const markSellerOrderReadyToShip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
            status: "processing",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Processing seller order not found");
        }
        sellerOrder.status = "ready_to_ship";
        yield sellerOrder.save();
        return (0, responseHandler_1.response)(res, 200, "Order marked as ready to ship", sellerOrder);
    }
    catch (error) {
        console.error("Ready to ship error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error updating seller order");
    }
});
exports.markSellerOrderReadyToShip = markSellerOrderReadyToShip;
const dispatchSellerOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        const { courierName, trackingNumber, trackingUrl } = req.body;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        if (!courierName) {
            return (0, responseHandler_1.response)(res, 400, "Courier name is required");
        }
        if (!trackingNumber) {
            return (0, responseHandler_1.response)(res, 400, "Tracking number is required");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
            status: "ready_to_ship",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Ready-to-ship seller order not found");
        }
        sellerOrder.status = "shipped";
        sellerOrder.shipping = {
            courierName,
            trackingNumber,
            trackingUrl,
            dispatchedAt: new Date(),
        };
        yield sellerOrder.save();
        // -----------------------------------------
        // Sync parent customer order
        // -----------------------------------------
        const parentStatus = yield (0, syncOrderStatus_1.syncParentOrderStatus)(sellerOrder.order.toString());
        return (0, responseHandler_1.response)(res, 200, "Order dispatched successfully", {
            sellerOrder,
            parentOrderStatus: parentStatus,
        });
    }
    catch (error) {
        console.error("Dispatch seller order error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error dispatching seller order");
    }
});
exports.dispatchSellerOrder = dispatchSellerOrder;
const markSellerOrderDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.id;
        const { id } = req.params;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        const sellerOrder = yield SellerOrder_1.default.findOne({
            _id: id,
            seller: sellerId,
            status: "shipped",
        });
        if (!sellerOrder) {
            return (0, responseHandler_1.response)(res, 404, "Shipped seller order not found");
        }
        sellerOrder.status = "delivered";
        sellerOrder.shipping = Object.assign(Object.assign({}, sellerOrder.shipping), { deliveredAt: new Date() });
        yield sellerOrder.save();
        // -----------------------------------------
        // Sync parent customer order
        // -----------------------------------------
        const parentStatus = yield (0, syncOrderStatus_1.syncParentOrderStatus)(sellerOrder.order.toString());
        return (0, responseHandler_1.response)(res, 200, "Order marked as delivered", {
            sellerOrder,
            parentOrderStatus: parentStatus,
        });
    }
    catch (error) {
        console.error("Deliver seller order error:", error);
        return (0, responseHandler_1.response)(res, 500, "Error marking order as delivered");
    }
});
exports.markSellerOrderDelivered = markSellerOrderDelivered;
