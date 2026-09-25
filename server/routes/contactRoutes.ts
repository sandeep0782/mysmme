import { Router } from "express";

import {
  createContactInquiry,
  getAdminContactInquiries,
  getAdminContactInquiryById,
  updateContactInquiryStatus,
} from "../controllers/contactController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

/* ================================================================
   PUBLIC CONTACT
================================================================ */

router.post("/", createContactInquiry);

router.get("/admin", authenticateUser, getAdminContactInquiries);

router.get("/admin/:id", authenticateUser, getAdminContactInquiryById);

router.patch("/admin/:id/status", authenticateUser, updateContactInquiryStatus);

export default router;
