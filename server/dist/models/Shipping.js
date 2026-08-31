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
const trackingEventSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
    },
    statusCode: {
        type: String,
    },
    activity: {
        type: String,
    },
    location: {
        type: String,
        trim: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    providerStatus: {
        type: String,
    },
    providerStatusCode: {
        type: String,
    },
}, {
    _id: true,
});
const shippingSchema = new mongoose_1.Schema({
    sellerOrder: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SellerOrder",
        required: true,
        index: true,
    },
    provider: {
        type: String,
        enum: ["shiprocket", "delhivery", "bluedart", "xpressbees", "other"],
        required: true,
        index: true,
    },
    providerOrderId: {
        type: String,
        trim: true,
        index: true,
    },
    providerShipmentId: {
        type: String,
        trim: true,
        index: true,
    },
    awb: {
        type: String,
        trim: true,
        index: true,
    },
    courierName: {
        type: String,
        trim: true,
    },
    courierCompanyId: {
        type: String,
        trim: true,
    },
    trackingUrl: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: [
            "pending",
            "created",
            "awb_assigned",
            "pickup_scheduled",
            "picked_up",
            "in_transit",
            "out_for_delivery",
            "delivered",
            "failed",
            "cancelled",
            "rto_initiated",
            "rto_in_transit",
            "rto_delivered",
        ],
        default: "pending",
        required: true,
        index: true,
    },
    providerStatus: {
        type: String,
        trim: true,
    },
    providerStatusCode: {
        type: String,
        trim: true,
    },
    etd: {
        type: Date,
    },
    pickupScheduledDate: {
        type: Date,
    },
    pickedUpAt: {
        type: Date,
    },
    dispatchedAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    isReturn: {
        type: Boolean,
        default: false,
        index: true,
    },
    returnAwb: {
        type: String,
        trim: true,
        index: true,
    },
    labelUrl: {
        type: String,
        trim: true,
    },
    manifestUrl: {
        type: String,
        trim: true,
    },
    invoiceUrl: {
        type: String,
        trim: true,
    },
    lastSyncedAt: {
        type: Date,
    },
    trackingEvents: {
        type: [trackingEventSchema],
        default: [],
    },
}, {
    timestamps: true,
});
/**
 * A seller order may have multiple shipping records.
 *
 * Example:
 * SellerOrder
 *   ├── Shiprocket shipment
 *   ├── Delhivery shipment
 *   └── Return shipment
 */
shippingSchema.index({
    sellerOrder: 1,
    provider: 1,
});
shippingSchema.index({
    provider: 1,
    providerShipmentId: 1,
});
shippingSchema.index({
    provider: 1,
    awb: 1,
});
exports.default = mongoose_1.default.model("Shipping", shippingSchema);
