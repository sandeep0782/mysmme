import mongoose, { Document, Schema } from "mongoose";

export interface IFreelancerAgreement extends Document {
  user: mongoose.Types.ObjectId;
  agreementVersion: string;
  accepted: boolean;
  acceptedAt: Date | null;
  acceptanceReference: string | null;
}

const freelancerAgreementSchema = new Schema<IFreelancerAgreement>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    agreementVersion: {
      type: String,
      required: true,
      default: "1.0",
    },

    accepted: {
      type: Boolean,
      default: false,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    acceptanceReference: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

freelancerAgreementSchema.index(
  {
    user: 1,
    agreementVersion: 1,
  },
  {
    unique: true,
  },
);

const FreelancerAgreement =
  mongoose.models.FreelancerAgreement ||
  mongoose.model<IFreelancerAgreement>(
    "FreelancerAgreement",
    freelancerAgreementSchema,
  );

export default FreelancerAgreement;
