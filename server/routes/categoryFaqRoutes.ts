import { Router } from "express";

import {
  createCategoryFaq,
  getCategoryFaqs,
  getAllCategoryFaqs,
  getCategoryFaqById,
  updateCategoryFaq,
  deleteCategoryFaq,
} from "../controllers/categoryFaqController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC ROUTE
// GET /api/category-faqs?category=categoryId
router.get("/", getCategoryFaqs);

// ADMIN ROUTES
// GET /api/category-faqs/admin/all
router.get("/admin/all", authenticateUser, getAllCategoryFaqs);

// GET /api/category-faqs/:id
router.get("/:id", authenticateUser, getCategoryFaqById);

// POST /api/category-faqs
router.post("/", authenticateUser, createCategoryFaq);

// PATCH /api/category-faqs/:id
router.patch("/:id", authenticateUser, updateCategoryFaq);

// DELETE /api/category-faqs/:id
router.delete("/:id", authenticateUser, deleteCategoryFaq);

export default router;
