import mongoose, { Document, Schema } from "mongoose";

export type ContactInquiryType =
  | "customer-support"
  | "order-support"
  | "seller-support"
  | "catalogue-support"
  | "business"
  | "technical"
  | "feedback"
  | "other";

export type ContactInquiryStatus =
  | "new"
  | "in-progress"
  | "resolved"
  | "closed";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;

  type: ContactInquiryType;

  reference?: string;
  subject: string;
  message: string;

  status: ContactInquiryStatus;

  consent: boolean;

  source: "website";

  createdAt: Date;
  updatedAt: Date;
}

const contactInquirySchema = new Schema<IContactInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    type: {
      type: String,
      required: true,
      enum: [
        "customer-support",
        "order-support",
        "seller-support",
        "catalogue-support",
        "business",
        "technical",
        "feedback",
        "other",
      ],
    },

    reference: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
      index: true,
    },

    consent: {
      type: Boolean,
      required: true,
    },

    source: {
      type: String,
      enum: ["website"],
      default: "website",
    },
  },
  {
    timestamps: true,
  },
);

contactInquirySchema.index({ createdAt: -1 });
contactInquirySchema.index({ email: 1 });
contactInquirySchema.index({ type: 1 });
contactInquirySchema.index({ status: 1, createdAt: -1 });

const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>("ContactInquiry", contactInquirySchema);

export default ContactInquiry;
