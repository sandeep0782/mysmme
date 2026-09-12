import mongoose, { Document, Schema, Types } from "mongoose";

export interface IImageFingerprint extends Document {
  hash: string;
  product: Types.ObjectId;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const imageFingerprintSchema = new Schema<IImageFingerprint>(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ImageFingerprint =
  mongoose.models.ImageFingerprint ||
  mongoose.model<IImageFingerprint>("ImageFingerprint", imageFingerprintSchema);

export default ImageFingerprint;
