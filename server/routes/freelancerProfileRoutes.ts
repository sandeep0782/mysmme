import express from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { requireFreelancer } from "../middleware/freelancerMiddleware";

import {
  getMyCreatorProfile,
  updateMyCreatorProfile,
} from "../controllers/freelancerProfileController";

const router = express.Router();

router.get(
  "/profile",
  authenticateUser,
  requireFreelancer,
  getMyCreatorProfile,
);

router.patch(
  "/profile",
  authenticateUser,
  requireFreelancer,
  updateMyCreatorProfile,
);

export default router;
