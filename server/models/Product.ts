import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  // Basic Information
  title: string;
  slug: string;
  description: string;

  brand: Types.ObjectId;
  category: Types.ObjectId;
  color: Types.ObjectId;
  season: Types.ObjectId;

  gender: "Womens" | "Unisex";
  collectionName?: string;

  // Pricing
  price: number;
  finalPrice: number;
  mrp: number;

  // Tax / Product Information
  gstPercentage?: number;
  hsnId?: string;
  netWeight?: number;
  netQuantity: number;
  countryOfOrigin?: string;
  genericName?: string;

  // Inventory
  inventory: number;

  reservedInventory: number;

  // Manufacturer
  manufacturerName?: string;
  manufacturerAddress?: string;
  manufacturerPincode?: string;

  // Packer
  packerName?: string;
  packerAddress?: string;
  packerPincode?: string;

  // Importer
  importerName?: string;
  importerAddress?: string;
  importerPincode?: string;

  // Saree Details
  blouse?: string;
  blouseColor?: string;
  blouseFabric?: string;
  blousePattern?: string;
  blouseLengthSize?: number;

  border?: string;
  borderWidth?: number;

  colorRemarks?: string;

  printOrPatternType?: string;
  pattern?: string;

  sareeFabric?: string;
  sareeLengthSize?: number;

  transparency?: string;
  type?: string;

  loomType?: string;
  occasion?: string;
  ornamentation?: string;
  palluDetails?: string;

  // Product Identification
  productId?: string;
  styleId?: string;
  skuId?: string;
  groupId?: string;

  // Media
  images: string[];
  videos: string[];

  // Search
  tags: string[];

  // Status
  isActive: boolean;
  publishStatus: "draft" | "pending" | "approved" | "rejected";
  rejectionReason?: string;

  // Reviews
  rating: number;
  numReviews: number;

  // Seller
  seller: mongoose.Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================
// PRODUCT SCHEMA
// ============================================================

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    color: {
      type: Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },

    season: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Womens", "Unisex"],
      default: "Womens",
    },

    collectionName: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: any, value: number) {
          return value <= this.price;
        },
        message: "Final price cannot be greater than price",
      },
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: any, value: number) {
          return value >= this.price;
        },
        message: "MRP must be greater than or equal to price",
      },
    },

    gstPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    hsnId: {
      type: String,
      trim: true,
    },

    netWeight: {
      type: Number,
      min: 0,
    },

    netQuantity: {
      type: Number,
      min: 1,
      default: 1,
    },

    countryOfOrigin: {
      type: String,
      trim: true,
      default: "India",
    },

    genericName: {
      type: String,
      trim: true,
    },

    inventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    reservedInventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    manufacturerName: {
      type: String,
      trim: true,
    },

    manufacturerAddress: {
      type: String,
      trim: true,
    },

    manufacturerPincode: {
      type: String,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid manufacturer pincode"],
    },

    packerName: {
      type: String,
      trim: true,
    },

    packerAddress: {
      type: String,
      trim: true,
    },

    packerPincode: {
      type: String,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid packer pincode"],
    },

    importerName: {
      type: String,
      trim: true,
    },

    importerAddress: {
      type: String,
      trim: true,
    },

    importerPincode: {
      type: String,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid importer pincode"],
    },

    blouse: {
      type: String,
      trim: true,
    },

    blouseColor: {
      type: String,
      trim: true,
    },

    blouseFabric: {
      type: String,
      trim: true,
    },

    blousePattern: {
      type: String,
      trim: true,
    },

    blouseLengthSize: {
      type: Number,
      min: 0,
    },

    border: {
      type: String,
      trim: true,
    },

    borderWidth: {
      type: Number,
      min: 0,
    },

    colorRemarks: {
      type: String,
      trim: true,
    },

    printOrPatternType: {
      type: String,
      trim: true,
    },

    pattern: {
      type: String,
      trim: true,
    },

    sareeFabric: {
      type: String,
      trim: true,
    },

    sareeLengthSize: {
      type: Number,
      min: 0,
    },

    transparency: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      trim: true,
    },

    loomType: {
      type: String,
      trim: true,
    },

    occasion: {
      type: String,
      trim: true,
    },

    ornamentation: {
      type: String,
      trim: true,
    },

    palluDetails: {
      type: String,
      trim: true,
    },

    productId: {
      type: String,
      trim: true,
    },

    styleId: {
      type: String,
      trim: true,
    },

    skuId: {
      type: String,
      trim: true,
    },

    groupId: {
      type: String,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: "At least one product image is required",
      },
    },

    videos: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    publishStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// ============================================================
// INDEXES
// ============================================================

productSchema.index({ slug: 1 }, { unique: true });

productSchema.index({ category: 1, brand: 1 });

productSchema.index({ color: 1 });

productSchema.index({ sareeFabric: 1 });

productSchema.index({ occasion: 1 });

productSchema.index({ pattern: 1 });

productSchema.index({ publishStatus: 1 });

productSchema.index({ isActive: 1 });

productSchema.index({ groupId: 1 });

productSchema.index({ skuId: 1 });

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
