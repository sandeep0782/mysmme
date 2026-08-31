import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  productId: mongoose.Types.ObjectId;
  title: string;
  productName: string;
  productImage: string;
  category: string;
  description: string;
  payout: number;
  royaltyPercentage: number;
  reelsRequired: number;
  deadline: string;
  estimatedReach: string;
  applicants: number;
  platforms: string[];
  tags: string[];
  freelancerId: mongoose.Types.ObjectId;
  acceptedBy: mongoose.Types.ObjectId[];
}

const campaignSchema = new Schema<ICampaign>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    payout: {
      type: Number,
      required: true,
      min: 0,
    },

    royaltyPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    reelsRequired: {
      type: Number,
      default: 1,
      min: 1,
    },

    deadline: {
      type: String,
      required: true,
    },

    estimatedReach: {
      type: String,
      default: "0",
    },

    applicants: {
      type: Number,
      default: 0,
    },

    platforms: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    acceptedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICampaign>("Campaign", campaignSchema);
