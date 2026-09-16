import mongoose, { Document, Schema } from "mongoose";

export interface ICounter extends Document {
  name: string;
  sequence: number;
}

const counterSchema = new Schema<ICounter>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    sequence: {
      type: Number,
      required: true,
      default: 30000000,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ICounter>("Counter", counterSchema);
