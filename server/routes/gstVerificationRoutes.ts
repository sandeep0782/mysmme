import { Router } from "express";
import { verifyGstin } from "../controllers/gstVerificationController";

const router = Router();

router.get("/:gstin", verifyGstin);

export default router;
