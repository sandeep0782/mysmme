import { Request, Response } from "express";
import Blog from "../models/Blog";
import { response } from "../utils/responseHandler";
import { uploadBlogImage, deleteBlogImage } from "../utils/uploadBlogImage";

// ============================================================
// HELPERS
// ============================================================

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

type BlogFields = Record<string, unknown>;

type BlogImageData = {
  featuredImage?: string;
  featuredImagePublicId?: string;
};

const allowedFields = [
  "title",
  "excerpt",
  "content",
  "imageAlt",
  "category",
  "tags",
  "author",
  "readTime",
  "seoTitle",
  "seoDescription",
  "canonicalUrl",
  "isFeatured",
  "isActive",
] as const;

class InputError extends Error {}

const getAllowedUpdates = (body: BlogFields): Record<string, unknown> => {
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    const raw = body[field];
    if (raw === undefined) continue;
    if (field === "tags") {
      let value: unknown = raw;
      if (typeof raw === "string") {
        try {
          value = JSON.parse(raw);
        } catch {
          throw new InputError("Tags must be a JSON array");
        }
      }
      if (
        !Array.isArray(value) ||
        !value.every((tag) => typeof tag === "string")
      ) {
        throw new InputError("Tags must be an array of strings");
      }
      updates.tags = value.map((tag: string) => tag.trim()).filter(Boolean);
    } else if (field === "readTime") {
      const number = Number(raw);
      if (!Number.isFinite(number) || !Number.isInteger(number) || number < 1) {
        throw new InputError("Reading time must be a positive whole number");
      }
      updates.readTime = number;
    } else if (field === "isFeatured" || field === "isActive") {
      if (raw !== true && raw !== false && raw !== "true" && raw !== "false") {
        throw new InputError(`${field} must be true or false`);
      }
      updates[field] = raw === true || raw === "true";
    } else {
      if (typeof raw !== "string")
        throw new InputError(`${field} must be text`);
      updates[field] = field === "content" ? raw : raw.trim();
    }
  }
  return updates;
};

const handleBlogError = (res: Response, error: unknown, context: string) => {
  console.error(context, error);
  if (error instanceof InputError) return response(res, 400, error.message);
  const err = error as { name?: string; code?: number; message?: string };
  if (err?.name === "CastError") return response(res, 400, "Invalid blog ID");
  if (err?.code === 11000)
    return response(res, 409, "Blog slug already exists");
  if (err?.name === "ValidationError")
    return response(res, 400, err.message || "Invalid blog data");
  return response(res, 500, "Internal Server Error");
};

const cleanupImage = async (publicId?: string) => {
  if (!publicId) return;
  try {
    await deleteBlogImage(publicId);
  } catch (error) {
    console.error("Cloudinary cleanup failed:", error);
  }
};

// ============================================================
// CREATE BLOG - ADMIN
// POST /api/blogs
// ============================================================

export const createBlog = async (req: Request, res: Response) => {
  let newImagePublicId: string | undefined;
  try {
    const updates = getAllowedUpdates(req.body as BlogFields);
    const { title, excerpt, content, category } = updates;
    if (
      ![title, excerpt, content, category].every(
        (v) => typeof v === "string" && v.trim(),
      )
    ) {
      return response(
        res,
        400,
        "Title, excerpt, content and category are required",
      );
    }
    const slug = generateSlug(title as string);
    if (!slug) return response(res, 400, "Invalid blog title for URL slug");
    if (await Blog.exists({ slug }))
      return response(res, 409, "A blog with this title already exists");

    const imageData: BlogImageData = req.file
      ? await uploadBlogImage(req.file)
      : {};
    newImagePublicId = imageData.featuredImagePublicId;
    const blog = await Blog.create({
      ...updates,
      ...imageData,
      slug,
      status: "draft",
      publishedAt: null,
    });
    return response(res, 201, "Blog created successfully", blog);
  } catch (error: unknown) {
    await cleanupImage(newImagePublicId);
    return handleBlogError(res, error, "Create blog error:");
  }
};

// ============================================================
// GET PUBLISHED BLOGS - PUBLIC
// GET /api/blogs
// ============================================================

export const getPublishedBlogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9));

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {
      status: "published",
      isActive: true,
      publishedAt: { $lte: new Date() },
    };

    if (typeof req.query.category === "string") {
      filter.category = req.query.category;
    }

    if (typeof req.query.featured === "string") {
      if (req.query.featured === "true") {
        filter.isFeatured = true;
      }
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content")
        .sort({ publishedAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments(filter),
    ]);

    return response(res, 200, "Blogs fetched successfully", {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get published blogs error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// GET BLOG BY SLUG - PUBLIC
// GET /api/blogs/slug/:slug
// ============================================================

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      status: "published",
      isActive: true,
      publishedAt: { $lte: new Date() },
    }).lean();

    if (!blog) {
      return response(res, 404, "Blog not found");
    }

    return response(res, 200, "Blog fetched successfully", blog);
  } catch (error) {
    console.error("Get blog by slug error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// GET ALL BLOGS - ADMIN
// GET /api/blogs/admin/all
// ============================================================

export const getAllBlogsAdmin = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (
      typeof req.query.status === "string" &&
      ["draft", "published", "archived"].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments(filter),
    ]);

    return response(res, 200, "Admin blogs fetched successfully", {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin blogs error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// GET BLOG BY ID - ADMIN
// GET /api/blogs/admin/:id
// ============================================================

export const getBlogByIdAdmin = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return response(res, 404, "Blog not found");
    }

    return response(res, 200, "Blog fetched successfully", blog);
  } catch (error: any) {
    if (error.name === "CastError") {
      return response(res, 400, "Invalid blog ID");
    }

    console.error("Get blog by ID error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// UPDATE BLOG - ADMIN
// PUT /api/blogs/:id
// ============================================================

export const updateBlog = async (req: Request, res: Response) => {
  let newImagePublicId: string | undefined;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return response(res, 404, "Blog not found");

    const updates = getAllowedUpdates(req.body as BlogFields);
    if (updates.title !== undefined) {
      if (typeof updates.title !== "string" || !updates.title.trim()) {
        return response(res, 400, "Blog title cannot be empty");
      }
      const newSlug = generateSlug(updates.title);
      if (!newSlug) return response(res, 400, "Invalid blog title");
      if (newSlug !== blog.slug) {
        if (await Blog.exists({ slug: newSlug, _id: { $ne: blog._id } })) {
          return response(res, 409, "Blog slug already exists");
        }
        blog.slug = newSlug;
      }
    }
    for (const field of ["excerpt", "content", "category"] as const) {
      if (updates[field] !== undefined && !updates[field]) {
        return response(res, 400, `${field} cannot be empty`);
      }
    }

    const oldImagePublicId = blog.featuredImagePublicId;

    const imageData: BlogImageData = req.file
      ? await uploadBlogImage(req.file)
      : {};

    newImagePublicId = imageData.featuredImagePublicId;

    Object.assign(blog, updates, imageData);
    await blog.save();
    // The database now references the replacement image.
    newImagePublicId = undefined;
    if (
      imageData.featuredImagePublicId &&
      oldImagePublicId &&
      oldImagePublicId !== imageData.featuredImagePublicId
    ) {
      await cleanupImage(oldImagePublicId);
    }
    return response(res, 200, "Blog updated successfully", blog);
  } catch (error: unknown) {
    await cleanupImage(newImagePublicId);
    return handleBlogError(res, error, "Update blog error:");
  }
};

// ============================================================
// PUBLISH BLOG - ADMIN
// PATCH /api/blogs/:id/publish
// ============================================================

export const publishBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return response(res, 404, "Blog not found");
    }

    if (!blog.title || !blog.content || !blog.excerpt) {
      return response(
        res,
        400,
        "Complete blog title, content and excerpt before publishing",
      );
    }

    blog.status = "published";
    blog.isActive = true;
    blog.publishedAt = blog.publishedAt || new Date();

    await blog.save();

    return response(res, 200, "Blog published successfully", blog);
  } catch (error: any) {
    if (error.name === "CastError") {
      return response(res, 400, "Invalid blog ID");
    }

    console.error("Publish blog error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// UNPUBLISH BLOG - ADMIN
// PATCH /api/blogs/:id/unpublish
// ============================================================

export const unpublishBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return response(res, 404, "Blog not found");
    }

    blog.status = "draft";

    await blog.save();

    return response(res, 200, "Blog unpublished successfully", blog);
  } catch (error: any) {
    if (error.name === "CastError") {
      return response(res, 400, "Invalid blog ID");
    }

    console.error("Unpublish blog error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// ARCHIVE BLOG - ADMIN
// PATCH /api/blogs/:id/archive
// ============================================================

export const archiveBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return response(res, 404, "Blog not found");
    }

    blog.status = "archived";

    await blog.save();

    return response(res, 200, "Blog archived successfully", blog);
  } catch (error: any) {
    if (error.name === "CastError") {
      return response(res, 400, "Invalid blog ID");
    }

    console.error("Archive blog error:", error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// DELETE BLOG - ADMIN
// DELETE /api/blogs/:id
// ============================================================

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return response(res, 404, "Blog not found");
    await cleanupImage(blog.featuredImagePublicId);
    return response(res, 200, "Blog deleted successfully");
  } catch (error: unknown) {
    return handleBlogError(res, error, "Delete blog error:");
  }
};
