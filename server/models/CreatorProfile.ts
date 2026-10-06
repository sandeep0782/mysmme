import mongoose, { Document, Schema } from "mongoose";

export type CreatorTier = "Elite" | "A" | "B" | "C" | "Review";

export interface ICreatorProfile extends Document {
  user: mongoose.Types.ObjectId;

  // PROFILE
  bio?: string;

  location?: string;

  country?: string;

  categories: string[];

  languages: string[];

  expectedPrice?: number;

  // INSTAGRAM
  instagramUsername?: string;
  instagramUserId?: string;

  followersCount: number;
  mediaCount: number;

  avgReelViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;

  reelsLast30Days: number;

  // CREATOR RANKING
  creatorScore: number;
  creatorTier: CreatorTier;

  instagramConnected: boolean;

  isApproved: boolean;

  lastInstagramSyncAt?: Date | null;
}

const creatorProfileSchema = new Schema<ICreatorProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* ================================================
         CREATOR PROFILE
      ================================================= */

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    categories: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    expectedPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    /* ================================================
         INSTAGRAM
      ================================================= */

    instagramUsername: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    instagramUserId: {
      type: String,
      trim: true,
      default: null,
    },

    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    mediaCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    avgReelViews: {
      type: Number,
      default: 0,
      min: 0,
    },

    avgLikes: {
      type: Number,
      default: 0,
      min: 0,
    },

    avgComments: {
      type: Number,
      default: 0,
      min: 0,
    },

    engagementRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    reelsLast30Days: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ================================================
         CREATOR RANKING
      ================================================= */

    creatorScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },

    creatorTier: {
      type: String,
      enum: ["Elite", "A", "B", "C", "Review"],
      default: "Review",
      index: true,
    },

    instagramConnected: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastInstagramSyncAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

creatorProfileSchema.index({
  creatorScore: -1,
  followersCount: -1,
});

export default mongoose.model<ICreatorProfile>(
  "CreatorProfile",
  creatorProfileSchema,
);
