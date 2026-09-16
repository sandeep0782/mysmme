import mongoose, { Document, Schema, Types } from "mongoose";

export type ProductImportStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "completed_with_errors"
  | "failed";

export type ProductImportProcessingStage =
  | "waiting"
  | "worker_claimed"
  | "reading_file"
  | "processing_rows"
  | "processing"
  | "finalizing"
  | "completed"
  | "failed";

export interface IProductImport extends Document {
  importGroupId: Types.ObjectId;

  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;

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

  workerScope: string;

  jobId?: string;
  attempts: number;

  startedAt?: Date;
  processingStartedAt?: Date;

  processingStage: ProductImportProcessingStage;

  processingRow: number;
  processingSku: string;
  processingProductName: string;

  status: ProductImportStatus;

  failureReason?: string | null;

  errorFileUrl?: string;
  errorFileName?: string;
  errorFileSize?: number;

  uploadedBy: Types.ObjectId;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const productImportSchema = new Schema<IProductImport>(
  {
    importGroupId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

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

    importErrors: {
      type: [
        {
          _id: false,

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

    workerScope: {
      type: String,
      required: true,
      trim: true,
      index: true,
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

    startedAt: {
      type: Date,
    },

    processingStartedAt: {
      type: Date,
    },

    processingStage: {
      type: String,
      enum: [
        "waiting",
        "worker_claimed",
        "reading_file",
        "processing_rows",
        "processing",
        "finalizing",
        "completed",
        "failed",
      ],
      default: "waiting",
    },

    processingRow: {
      type: Number,
      default: 0,
      min: 0,
    },

    processingSku: {
      type: String,
      default: "",
      trim: true,
    },

    processingProductName: {
      type: String,
      default: "",
      trim: true,
    },

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
      index: true,
    },

    failureReason: {
      type: String,
      trim: true,
      default: null,
    },

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

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

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

const ProductImport =
  mongoose.models.ProductImport ||
  mongoose.model<IProductImport>("ProductImport", productImportSchema);

export default ProductImport;
