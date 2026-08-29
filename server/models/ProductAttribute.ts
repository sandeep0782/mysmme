import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductAttribute extends Document {
  type: string;
  value: string;

  // Parent attribute for dependent dropdowns
  // Example:
  // Floral -> parent = Printed
  // Stripe -> parent = Striped
  parentId?: Types.ObjectId | null;

  isActive: boolean;
  sortOrder: number;
}

const ProductAttributeSchema = new Schema<IProductAttribute>(
  {
    // ==========================================================
    // ATTRIBUTE TYPE
    // ==========================================================

    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ==========================================================
    // ATTRIBUTE VALUE
    // ==========================================================

    value: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================================
    // PARENT ATTRIBUTE
    // ==========================================================

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "ProductAttribute",
      default: null,
      index: true,
    },

    // ==========================================================
    // ACTIVE
    // ==========================================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================================
    // SORT ORDER
    // ==========================================================

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ============================================================
// UNIQUE ATTRIBUTE VALUE
// ============================================================

ProductAttributeSchema.index({ type: 1, value: 1 }, { unique: true });

// ============================================================
// DEPENDENT ATTRIBUTE INDEX
// ============================================================

ProductAttributeSchema.index({
  type: 1,
  parentId: 1,
  isActive: 1,
  sortOrder: 1,
});

export default mongoose.model<IProductAttribute>(
  "ProductAttribute",
  ProductAttributeSchema,
);
