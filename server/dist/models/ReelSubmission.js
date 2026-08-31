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
/* =========================================================
   SCHEMA
========================================================= */
const reelSubmissionSchema = new mongoose_1.Schema({
    /* =====================================================
       CAMPAIGN
    ===================================================== */
    campaignId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
        index: true,
    },
    /* =====================================================
       FREELANCER
    ===================================================== */
    freelancerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    /* =====================================================
       CONTENT
    ===================================================== */
    title: {
        type: String,
        required: true,
        trim: true,
    },
    caption: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        trim: true,
    },
    thumbnailUrl: {
        type: String,
        trim: true,
    },
    /* =====================================================
       SOCIAL URLS
    ===================================================== */
    instagramUrl: {
        type: String,
        trim: true,
    },
    youtubeUrl: {
        type: String,
        trim: true,
    },
    /* =====================================================
       STATUS
    ===================================================== */
    status: {
        type: String,
        enum: [
            "draft",
            "submitted",
            "under_review",
            "changes_requested",
            "approved",
            "rejected",
            "published",
        ],
        default: "draft",
    },
    /* =====================================================
       ADMIN
    ===================================================== */
    featured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    adminNotes: {
        type: String,
        trim: true,
    },
    /* =====================================================
       DATES
    ===================================================== */
    submittedAt: {
        type: Date,
    },
    reviewedAt: {
        type: Date,
    },
    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
/* =========================================================
   INDEXES
========================================================= */
reelSubmissionSchema.index({
    freelancerId: 1,
    campaignId: 1,
});
reelSubmissionSchema.index({
    status: 1,
});
reelSubmissionSchema.index({
    featured: 1,
    status: 1,
});
/* =========================================================
   MODEL
========================================================= */
exports.default = mongoose_1.default.model("ReelSubmission", reelSubmissionSchema);
