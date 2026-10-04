import mongoose, { Schema, Document } from "mongoose";

export interface ICouponRedemption extends Document {
  coupon: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  freelancer?: mongoose.Types.ObjectId;
  freelancerCommission?: number;

  couponCode: string;
  discountAmount: number;

  status: "reserved" | "redeemed" | "released";

  createdAt: Date;
  updatedAt: Date;
}

const couponRedemptionSchema = new Schema<ICouponRedemption>(
  {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    freelancerCommission: {
      type: Number,
      default: 0,
      min: 0,
    },

    couponCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["reserved", "redeemed", "released"],
      default: "reserved",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

couponRedemptionSchema.index({
  coupon: 1,
  user: 1,
  status: 1,
});

export default mongoose.model<ICouponRedemption>(
  "CouponRedemption",
  couponRedemptionSchema,
);
