import { Router } from "express";
import * as brandController from "../controllers/brandController";
import { authenticateUser } from "../middleware/authMiddleware";
import { logoUploadMiddleware } from "../config/cloudnaryConfig";

const router = Router();

// Public Route
router.get(
    "/",
    brandController.getAllBrands
);

// Create Brand
router.post(
    "/",
    authenticateUser,
    logoUploadMiddleware,
    brandController.createBrand
);

// Update Brand
router.put(
    "/:id",
    authenticateUser,
    logoUploadMiddleware,
    brandController.updateBrand
);

// Get Brand By ID
router.get(
    "/:id",
    authenticateUser,
    brandController.getBrandById
);

// Delete Brand
router.delete(
    "/:id",
    authenticateUser,
    brandController.deleteBrand
);

export default router;