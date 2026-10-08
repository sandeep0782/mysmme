import mongoose, { Schema, Document } from "mongoose";

export interface ISocialAccount extends Document {
  user: mongoose.Types.ObjectId;
  platform: "Instagram" | "Facebook" | "YouTube" | "TikTok" | "Pinterest";
  username: string;
  profileUrl: string;
  followers: number;
  views: number;
  engagement: number;
  growth: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  mediaCount: number;
  isVerified: boolean;
  creatorScore: number;
  creatorStatus: "Basic" | "Verified" | "In Review" | "Active" | "Inactive";
  instagramAccountId?: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
  lastSyncedAt?: Date;
  nextSyncAt?: Date;
  syncStatus: "idle" | "success" | "failed";
  syncError?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const socialAccountSchema = new Schema<ISocialAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    platform: {
      type: String,
      enum: ["Instagram", "Facebook", "YouTube", "TikTok", "Pinterest"],
      required: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    profileUrl: {
      type: String,
      required: true,
      trim: true,
    },

    /* ============================================================
         SOCIAL STATS
      ============================================================ */

    followers: {
      type: Number,
      default: 0,
      min: 0,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    engagement: {
      type: Number,
      default: 0,
      min: 0,
    },

    growth: {
      type: Number,
      default: 0,
    },

    reach: {
      type: Number,
      default: 0,
      min: 0,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    comments: {
      type: Number,
      default: 0,
      min: 0,
    },

    shares: {
      type: Number,
      default: 0,
      min: 0,
    },

    saves: {
      type: Number,
      default: 0,
      min: 0,
    },

    mediaCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ============================================================
         CREATOR RATING
      ============================================================ */

    creatorScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    creatorStatus: {
      type: String,
      enum: ["Basic", "Verified", "In Review", "Active", "Inactive"],
      default: "Basic",
    },

    /* ============================================================
         VERIFICATION
      ============================================================ */

    isVerified: {
      type: Boolean,
      default: false,
    },

    /* ============================================================
         INSTAGRAM / META CONNECTION
      ============================================================ */

    instagramAccountId: {
      type: String,
      trim: true,
      default: null,
    },

    accessToken: {
      type: String,
      default: null,

      // Never expose token in normal queries
      select: false,
    },

    tokenExpiresAt: {
      type: Date,
      default: null,
    },

    /* ============================================================
         SYNC TRACKING
      ============================================================ */

    lastSyncedAt: {
      type: Date,
      default: null,
    },

    nextSyncAt: {
      type: Date,
      default: null,
    },

    syncStatus: {
      type: String,
      enum: ["idle", "success", "failed"],
      default: "idle",
    },

    syncError: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/* ================================================================
   UNIQUE ACCOUNT
================================================================ */

socialAccountSchema.index(
  {
    user: 1,
    platform: 1,
    username: 1,
  },
  {
    unique: true,
  },
);

/* ================================================================
   USER + PLATFORM INDEX
================================================================ */

socialAccountSchema.index({
  user: 1,
  platform: 1,
});

/* ================================================================
   WEEKLY SYNC INDEX
================================================================ */

socialAccountSchema.index({
  platform: 1,
  nextSyncAt: 1,
});

/* ================================================================
   CREATOR SCORE INDEX
   Useful later for admin sorting/filtering
================================================================ */

socialAccountSchema.index({
  creatorScore: -1,
});

/* ================================================================
   CREATOR STATUS INDEX
================================================================ */

socialAccountSchema.index({
  creatorStatus: 1,
});

/* ================================================================
   MODEL
================================================================ */

const SocialAccount =
  mongoose.models.SocialAccount ||
  mongoose.model<ISocialAccount>("SocialAccount", socialAccountSchema);

export default SocialAccount;
