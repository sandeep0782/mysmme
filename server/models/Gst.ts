import mongoose, { Document, Schema } from "mongoose";

export interface IGst extends Document {
  percentage: number;
  isActive: boolean;
}

const gstSchema = new Schema<IGst>(
  {
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Gst = mongoose.models.Gst || mongoose.model<IGst>("Gst", gstSchema);

export default Gst;
