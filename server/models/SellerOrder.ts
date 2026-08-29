import mongoose, { Document, Schema } from "mongoose";

export interface ISellerOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  productName: string;
  productImage?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface ISellerOrder extends Document {
  order: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;

  items: ISellerOrderItem[];

  totalAmount: number;

  paymentStatus: "pending" | "completed" | "failed" | "refunded";

  status:
    | "pending"
    | "accepted"
    | "processing"
    | "ready_to_ship"
    | "shipped"
    | "delivered"
    | "cancelled";

  shipping?: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    dispatchedAt?: Date;
    deliveredAt?: Date;
  };
}

const sellerOrderSchema = new Schema<ISellerOrder>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
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
        validator: (items: unknown[]) => items.length > 0,
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
  },
  {
    timestamps: true,
  },
);

// One seller-order per seller for a parent order
sellerOrderSchema.index({ order: 1, seller: 1 }, { unique: true });

export default mongoose.model<ISellerOrder>("SellerOrder", sellerOrderSchema);
