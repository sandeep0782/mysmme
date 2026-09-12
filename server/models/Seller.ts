import mongoose, { Schema, Document } from "mongoose";

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;

  sellerName: string;
  businessName?: string;
  businessType?: string;

  gstNumber?: string;
  gstVerified: boolean;
  gstVerifiedAt?: Date;

  panNumber?: string;

  email: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string;

  storeName?: string;
  storeSlug?: string;

  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";

  commissionRate: number;

  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // Seller information
    sellerName: {
      type: String,
      required: true,
      trim: true,
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    businessType: {
      type: String,
      trim: true,
      default: "",
    },

    // GST
    gstNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    gstVerified: {
      type: Boolean,
      default: false,
    },

    gstVerifiedAt: {
      type: Date,
    },

    // PAN
    panNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },

    // Contact
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // Address
    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    // Store
    storeName: {
      type: String,
      default: "",
      trim: true,
    },

    storeSlug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Seller status
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    // Commission
    commissionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

// Generate store slug automatically
SellerSchema.pre<ISeller>("validate", function (next) {
  if (this.storeName && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

export default mongoose.model<ISeller>("Seller", SellerSchema);
