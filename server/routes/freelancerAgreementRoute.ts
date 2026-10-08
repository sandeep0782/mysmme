import express from "express";

import {
  acceptFreelancerAgreement,
  getFreelancerAgreement,
} from "../controllers/freelancerAgreementController";
import { authenticateUser } from "../middleware/authMiddleware";

// IMPORTANT:
// Replace this import with your actual auth middleware.

const router = express.Router();

router.get("/agreement", authenticateUser, getFreelancerAgreement);

router.patch("/agreement", authenticateUser, acceptFreelancerAgreement);

export default router;
