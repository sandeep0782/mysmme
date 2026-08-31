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
exports.syncParentOrderStatus = void 0;
const ProductOrder_1 = __importDefault(require("../models/ProductOrder"));
const SellerOrder_1 = __importDefault(require("../models/SellerOrder"));
const syncParentOrderStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerOrders = yield SellerOrder_1.default.find({
        order: orderId,
    }).select("status");
    if (sellerOrders.length === 0) {
        console.warn(`No seller orders found for parent order ${orderId}`);
        return null;
    }
    const statuses = sellerOrders.map((sellerOrder) => sellerOrder.status);
    let parentStatus;
    // ---------------------------------------------------------
    // ALL DELIVERED
    // ---------------------------------------------------------
    if (statuses.every((status) => status === "delivered")) {
        parentStatus = "delivered";
    }
    // ---------------------------------------------------------
    // ALL CANCELLED
    // ---------------------------------------------------------
    else if (statuses.every((status) => status === "cancelled")) {
        parentStatus = "cancelled";
    }
    // ---------------------------------------------------------
    // ALL SHIPPED OR DELIVERED
    // ---------------------------------------------------------
    else if (statuses.every((status) => status === "shipped" || status === "delivered")) {
        parentStatus = "shipped";
    }
    // ---------------------------------------------------------
    // AT LEAST ONE SHIPPED/DELIVERED
    // BUT NOT ALL
    // ---------------------------------------------------------
    else if (statuses.some((status) => status === "shipped" || status === "delivered")) {
        parentStatus = "partially_shipped";
    }
    // ---------------------------------------------------------
    // NOTHING HAS SHIPPED
    // ---------------------------------------------------------
    else {
        parentStatus = "processing";
    }
    yield ProductOrder_1.default.findByIdAndUpdate(orderId, {
        status: parentStatus,
    });
    console.log(`Order ${orderId} status synchronized → ${parentStatus}`);
    return parentStatus;
});
exports.syncParentOrderStatus = syncParentOrderStatus;
