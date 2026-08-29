import { Router } from "express";
import {
  getGsts,
  getActiveGsts,
  getGstById,
  createGst,
  updateGst,
  deleteGst,
} from "../controllers/gstController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateUser, getGsts);
router.get("/active", authenticateUser, getActiveGsts);
router.get("/:id", authenticateUser, getGstById);
router.post("/", authenticateUser, createGst);
router.patch("/:id", authenticateUser, updateGst);
router.delete("/:id", authenticateUser, deleteGst);

export default router;
