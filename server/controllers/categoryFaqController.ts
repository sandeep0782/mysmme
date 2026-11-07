import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/Category";
import CategoryFaq from "../models/CategoryFaq";

// CREATE CATEGORY FAQ
export const createCategoryFaq = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, question, answer, sortOrder, isActive } = req.body;

    if (
      !mongoose.isValidObjectId(category) ||
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Valid category, question and answer are required",
      });
      return;
    }

    const categoryExists = await Category.exists({ _id: category });

    if (!categoryExists) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    const faq = await CategoryFaq.create({
      category,
      question: question.trim(),
      answer: answer.trim(),
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Category FAQ created successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category FAQ",
    });
  }
};

// GET CATEGORY FAQS
export const getCategoryFaqs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category } = req.query;

    if (typeof category !== "string" || !mongoose.isValidObjectId(category)) {
      res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
      return;
    }

    const faqs = await CategoryFaq.find({
      category,
      isActive: true,
    })
      .sort({ sortOrder: 1, _id: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category FAQs",
    });
  }
};

// GET ALL CATEGORY FAQS (ADMIN)
export const getAllCategoryFaqs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const faqs = await CategoryFaq.find()
      .populate("category", "name slug")
      .sort({ category: 1, sortOrder: 1, _id: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category FAQs",
    });
  }
};

// GET SINGLE CATEGORY FAQ
export const getCategoryFaqById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
      return;
    }

    const faq = await CategoryFaq.findById(id)
      .populate("category", "name slug")
      .lean();

    if (!faq) {
      res.status(404).json({
        success: false,
        message: "Category FAQ not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category FAQ",
    });
  }
};

// UPDATE CATEGORY FAQ
export const updateCategoryFaq = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
      return;
    }

    const allowedFields = [
      "category",
      "question",
      "answer",
      "sortOrder",
      "isActive",
    ] as const;

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if ("category" in updates) {
      const categoryId = updates.category;

      if (
        typeof categoryId !== "string" ||
        !mongoose.isValidObjectId(categoryId)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
        return;
      }

      const categoryExists = await Category.exists({
        _id: new mongoose.Types.ObjectId(categoryId),
      });

      if (!categoryExists) {
        res.status(404).json({
          success: false,
          message: "Category not found",
        });
        return;
      }

      updates.category = new mongoose.Types.ObjectId(categoryId);
    }

    for (const field of ["question", "answer"] as const) {
      if (field in updates) {
        if (
          typeof updates[field] !== "string" ||
          !(updates[field] as string).trim()
        ) {
          res.status(400).json({
            success: false,
            message: `${field} cannot be empty`,
          });
          return;
        }

        updates[field] = (updates[field] as string).trim();
      }
    }

    if (
      "sortOrder" in updates &&
      (typeof updates.sortOrder !== "number" ||
        !Number.isInteger(updates.sortOrder) ||
        updates.sortOrder < 0)
    ) {
      res.status(400).json({
        success: false,
        message: "sortOrder must be a non-negative integer",
      });
      return;
    }

    if ("isActive" in updates && typeof updates.isActive !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const faq = await CategoryFaq.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!faq) {
      res.status(404).json({
        success: false,
        message: "Category FAQ not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category FAQ",
    });
  }
};

// DELETE CATEGORY FAQ
export const deleteCategoryFaq = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid FAQ ID",
      });
      return;
    }

    const faq = await CategoryFaq.findByIdAndDelete(id);

    if (!faq) {
      res.status(404).json({
        success: false,
        message: "Category FAQ not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category FAQ",
    });
  }
};
