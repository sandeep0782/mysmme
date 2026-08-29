import mongoose, { Schema, Document } from "mongoose";

export type EarningStatus = "pending" | "paid";

export interface IEarning extends Document {
  freelancerId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;

  saleAmount: number;
  royaltyPercentage: number;
  royaltyAmount: number;

  status: EarningStatus;

  paidAt?: Date;
}

const earningSchema = new Schema<IEarning>(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    saleAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    royaltyPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    royaltyAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      index: true,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IEarning>("Earning", earningSchema);
