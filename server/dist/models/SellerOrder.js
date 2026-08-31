"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const sellerOrderSchema = new mongoose_1.Schema({
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    items: {
        type: [
            {
                product: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                productName: {
                    type: String,
                    required: true,
                },
                productImage: {
                    type: String,
                },
                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                totalPrice: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: "Seller order must contain at least one item",
        },
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
        index: true,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "processing",
            "ready_to_ship",
            "shipped",
            "delivered",
            "cancelled",
        ],
        default: "pending",
        index: true,
    },
    shipping: {
        courierName: {
            type: String,
            trim: true,
        },
        trackingNumber: {
            type: String,
            trim: true,
        },
        trackingUrl: {
            type: String,
            trim: true,
        },
        dispatchedAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
}, {
    timestamps: true,
});
// One seller-order per seller for a parent order
sellerOrderSchema.index({ order: 1, seller: 1 }, { unique: true });
exports.default = mongoose_1.default.model("SellerOrder", sellerOrderSchema);
