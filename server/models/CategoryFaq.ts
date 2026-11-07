import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICategoryFaq extends Document {
  category: Types.ObjectId;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategoryFaqSchema: Schema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Efficient retrieval of active FAQs by category
CategoryFaqSchema.index({
  category: 1,
  isActive: 1,
  sortOrder: 1,
});

const CategoryFaq =
  (mongoose.models.CategoryFaq as mongoose.Model<ICategoryFaq>) ||
  mongoose.model<ICategoryFaq>("CategoryFaq", CategoryFaqSchema);

export default CategoryFaq;
