import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  name: string;
  description?: string;

  discountType: "percentage" | "fixed";
  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount?: number;

  startsAt: Date;
  expiresAt: Date;

  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser: number;

  firstOrderOnly: boolean;

  appliesTo: "all" | "products" | "categories" | "brands";

  productIds: mongoose.Types.ObjectId[];
  categoryIds: mongoose.Types.ObjectId[];
  brandIds: mongoose.Types.ObjectId[];
  assignedFreelancer?: mongoose.Types.ObjectId;
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },

    startsAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      min: 1,
    },

    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    usageLimitPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },

    firstOrderOnly: {
      type: Boolean,
      default: false,
    },

    appliesTo: {
      type: String,
      enum: ["all", "products", "categories", "brands"],
      default: "all",
    },

    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    brandIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Brand",
      },
    ],
    assignedFreelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    commissionType: {
      type: String,
      enum: ["percentage", "fixed"],
    },

    commissionValue: {
      type: Number,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

couponSchema.pre("validate", async function () {
  if (this.expiresAt <= this.startsAt) {
    throw new Error("Coupon expiry date must be after start date");
  }

  if (this.discountType === "percentage" && this.discountValue > 100) {
    throw new Error("Percentage discount cannot exceed 100%");
  }
});

export default mongoose.model<ICoupon>("Coupon", couponSchema);
