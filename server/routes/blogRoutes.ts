import { Router } from "express";

import {
  createBlog,
  getPublishedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  updateBlog,
  publishBlog,
  unpublishBlog,
  archiveBlog,
  deleteBlog,
} from "../controllers/BlogController";

import { authenticateUser } from "../middleware/authMiddleware"; // Adjust import path
import { blogImageUploadMiddleware } from "../config/cloudnaryConfig";
const router = Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================

router.get("/", getPublishedBlogs);
router.get("/slug/:slug", getBlogBySlug);

// ============================================================
// PROTECTED ROUTES
// ============================================================

router.get("/admin/all", authenticateUser, getAllBlogsAdmin);

router.get("/admin/:id", authenticateUser, getBlogByIdAdmin);

router.post("/", authenticateUser, blogImageUploadMiddleware, createBlog);
router.put("/:id", authenticateUser, blogImageUploadMiddleware, updateBlog);
router.patch("/:id/publish", authenticateUser, publishBlog);

router.patch("/:id/unpublish", authenticateUser, unpublishBlog);

router.patch("/:id/archive", authenticateUser, archiveBlog);

router.delete("/:id", authenticateUser, deleteBlog);

export default router;
