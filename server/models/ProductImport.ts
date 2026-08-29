import mongoose, { Document, Schema, Types } from "mongoose";

export type ProductImportStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "completed_with_errors"
  | "failed";

export interface IProductImport extends Document {
  // ============================================================
  // IDENTIFICATION
  // ============================================================

  importGroupId: Types.ObjectId;

  /**
   * If this import is a retry of another import,
   * this points to the previous import.
   */
  retryOf?: Types.ObjectId;

  // ============================================================
  // FILE INFORMATION
  // ============================================================

  fileName: string;

  fileUrl: string;

  fileSize?: number;

  mimeType?: string;

  // ============================================================
  // IMPORT STATISTICS
  // ============================================================

  totalRows: number;

  processedRows: number;

  successRows: number;

  failedRows: number;

  importErrors: Array<{
    rowNumber: number;
    sku?: string;
    productName?: string;
    error: string;
  }>;
  jobId?: string;

  attempts?: number;

  processingStartedAt?: Date;

  // ============================================================
  // STATUS
  // ============================================================

  status: ProductImportStatus;

  // ============================================================
  // ERROR FILE
  // ============================================================

  errorFileUrl?: string;

  errorFileName?: string;

  errorFileSize?: number;

  // ============================================================
  // USER
  // ============================================================

  uploadedBy: Types.ObjectId;

  // ============================================================
  // PROCESSING INFORMATION
  // ============================================================

  startedAt?: Date;

  completedAt?: Date;

  // ============================================================
  // TIMESTAMPS
  // ============================================================

  createdAt: Date;

  updatedAt: Date;
}

const productImportSchema = new Schema<IProductImport>(
  {
    // ========================================================
    // IDENTIFICATION
    // ========================================================

    importGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    retryOf: {
      type: Schema.Types.ObjectId,
      ref: "ProductImport",
      default: null,
    },

    // ========================================================
    // FILE INFORMATION
    // ========================================================

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      min: 0,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    // ========================================================
    // IMPORT STATISTICS
    // ========================================================

    totalRows: {
      type: Number,
      default: 0,
      min: 0,
    },

    processedRows: {
      type: Number,
      default: 0,
      min: 0,
    },

    successRows: {
      type: Number,
      default: 0,
      min: 0,
    },

    failedRows: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ========================================================
    // IMPORT ERRORS
    // ========================================================

    importErrors: {
      type: [
        {
          rowNumber: {
            type: Number,
            required: true,
          },

          sku: {
            type: String,
            default: "",
            trim: true,
          },

          productName: {
            type: String,
            default: "",
            trim: true,
          },

          error: {
            type: String,
            required: true,
            trim: true,
          },
        },
      ],

      default: [],
    },
    jobId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    processingStartedAt: {
      type: Date,
    },
    // ========================================================
    // STATUS
    // ========================================================

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "completed",
        "completed_with_errors",
        "failed",
      ],
      default: "uploaded",
    },

    // ========================================================
    // ERROR FILE
    // ========================================================

    errorFileUrl: {
      type: String,
      trim: true,
    },

    errorFileName: {
      type: String,
      trim: true,
    },

    errorFileSize: {
      type: Number,
      min: 0,
    },

    // ========================================================
    // USER
    // ========================================================

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================================
    // PROCESSING INFORMATION
    // ========================================================

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ================================================================
// INDEXES
// ================================================================

productImportSchema.index({
  importGroupId: 1,
  createdAt: -1,
});

productImportSchema.index({
  uploadedBy: 1,
  createdAt: -1,
});

productImportSchema.index({
  status: 1,
  createdAt: -1,
});

productImportSchema.index({
  retryOf: 1,
});

productImportSchema.index({
  fileName: 1,
});

// ================================================================
// MODEL
// ================================================================

const ProductImport =
  mongoose.models.ProductImport ||
  mongoose.model<IProductImport>("ProductImport", productImportSchema);

export default ProductImport;
