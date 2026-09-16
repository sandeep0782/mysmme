import mongoose, { Schema, Document } from "mongoose";

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;

  // Seller Information
  sellerName: string;
  businessName?: string;
  businessType?: string;

  // GST Information
  gstNumber?: string;
  gstStatus: "ACTIVE" | "REJECTED";
  gstVerifiedAt?: Date;

  // PAN Information
  panNumber?: string;

  // Contact Information
  email: string;
  phone?: string;

  // Address Information
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string;

  // Store Information
  storeName?: string;
  storeSlug?: string;

  // Platform Seller Status
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";

  // Commission
  commissionRate: number;

  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema: Schema<ISeller> = new Schema(
  {
    // ==========================================
    // USER
    // ==========================================
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ==========================================
    // SELLER INFORMATION
    // ==========================================
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

    // ==========================================
    // GST INFORMATION
    // ==========================================
    gstNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    /**
     * GST verification status.
     *
     * This is completely separate from seller status.
     *
     * ACTIVE   = GST API says GST is active
     * REJECTED = GST verification failed / GST is not active
     */
    gstStatus: {
      type: String,
      enum: ["ACTIVE", "REJECTED"],
      default: "REJECTED",
      index: true,
    },

    gstVerifiedAt: {
      type: Date,
    },

    // ==========================================
    // PAN INFORMATION
    // ==========================================
    panNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================
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

    // ==========================================
    // ADDRESS INFORMATION
    // ==========================================
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

    // ==========================================
    // STORE INFORMATION
    // ==========================================
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

    // ==========================================
    // SELLER PLATFORM STATUS
    // ==========================================
    /**
     * This is the status of the seller on YOUR platform.
     *
     * PENDING   = Seller registered but not approved
     * ACTIVE    = Seller approved and can operate
     * SUSPENDED = Seller temporarily disabled
     * REJECTED  = Seller rejected by admin
     *
     * This is independent of gstStatus.
     */
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    // ==========================================
    // COMMISSION
    // ==========================================
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

// ==========================================
// GENERATE STORE SLUG AUTOMATICALLY
// ==========================================
SellerSchema.pre<ISeller>("validate", function () {
  if (this.storeName && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

export default mongoose.model<ISeller>("Seller", SellerSchema);
