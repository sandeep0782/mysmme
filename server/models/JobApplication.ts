import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  name: string;
  email: string;
  phone?: string;

  role: string;

  experience?: string;
  location?: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;

  coverLetter?: string;

  resumeUrl?: string;

  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";

  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["technology-developer", "marketing-manager", "freelancers"],
    },

    experience: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    github: {
      type: String,
      trim: true,
    },

    portfolio: {
      type: String,
      trim: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema,
);
