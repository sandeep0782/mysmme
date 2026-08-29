import mongoose, { Document, Schema } from "mongoose";

/* =========================================================
   TYPES
========================================================= */

export type ReelStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "published";

/* =========================================================
   INTERFACE
========================================================= */

export interface IReelSubmission extends Document {
  campaignId: mongoose.Types.ObjectId;
  freelancerId: mongoose.Types.ObjectId;

  title: string;
  caption?: string;

  videoUrl?: string;
  thumbnailUrl?: string;

  instagramUrl?: string;
  youtubeUrl?: string;

  status: ReelStatus;

  featured: boolean;
  isActive: boolean;

  adminNotes?: string;

  submittedAt?: Date;
  reviewedAt?: Date;
  publishedAt?: Date;
}

/* =========================================================
   SCHEMA
========================================================= */

const reelSubmissionSchema = new Schema<IReelSubmission>(
  {
    /* =====================================================
       CAMPAIGN
    ===================================================== */

    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },

    /* =====================================================
       FREELANCER
    ===================================================== */

    freelancerId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

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

export default mongoose.model<IReelSubmission>(
  "ReelSubmission",
  reelSubmissionSchema,
);
