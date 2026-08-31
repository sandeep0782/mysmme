"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productImportSchema = new mongoose_1.Schema({
    // ========================================================
    // IDENTIFICATION
    // ========================================================
    importGroupId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    retryOf: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
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
const ProductImport = mongoose_1.default.models.ProductImport ||
    mongoose_1.default.model("ProductImport", productImportSchema);
exports.default = ProductImport;
