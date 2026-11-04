import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;

  featuredImage?: string;
  imageAlt?: string;

  category: string;
  tags: string[];

  author: string;
  readTime: number;
  featuredImagePublicId?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isActive: boolean;

  publishedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    // BASIC INFORMATION
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    content: {
      type: String,
      required: true,
    },

    // IMAGES
    featuredImage: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      trim: true,
      default: "",
    },

    // CATEGORIZATION
    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // AUTHOR AND READING TIME
    author: {
      type: String,
      default: "MYSMME Editorial Team",
      trim: true,
    },

    readTime: {
      type: Number,
      default: 5,
      min: 1,
    },
    featuredImagePublicId: {
      type: String,
      default: "",
    },

    // SEO
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
      default: "",
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },

    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // PUBLISHING
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// INDEXES
BlogSchema.index({ status: 1, isActive: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, status: 1 });
BlogSchema.index({ isFeatured: 1, status: 1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
