import { Router } from "express";

import {
  createProductAttribute,
  getProductAttributes,
  getProductAttributesByType,
  getProductAttributeById,
  updateProductAttribute,
  deleteProductAttribute,
  activateProductAttribute,
} from "../controllers/productAttributeController";

const router = Router();

router.post("/", createProductAttribute);
router.get("/", getProductAttributes);
router.get("/type/:type", getProductAttributesByType);
router.get("/:id", getProductAttributeById);
router.put("/:id", updateProductAttribute);
router.delete("/:id", deleteProductAttribute);
router.patch("/:id/activate", activateProductAttribute);

export default router;
