import mongoose, { Schema, Document } from "mongoose";
export interface ICategory extends Document {
  name: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  seoDescription?: string;
  slug: string;
  image?: string;
  imagePublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    title: { type: String, default: "", trim: true, maxlength: 160 },
    shortDescription: { type: String, default: "", maxlength: 160 },
    description: { type: String, default: "" },
    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String },
    imagePublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);
CategorySchema.pre<ICategory>("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

export default mongoose.model<ICategory>("Category", CategorySchema);
