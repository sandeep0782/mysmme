import { Router } from "express";

import {
  getMyReels,
  getMyReel,
  createReel,
  updateReel,
  submitReel,
} from "../controllers/reelController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

/* =========================================================
   FREELANCER REELS
========================================================= */

router.get("/my", authenticateUser, getMyReels);

router.get("/:id", authenticateUser, getMyReel);

router.post("/", authenticateUser, createReel);

router.patch("/:id", authenticateUser, updateReel);

router.post("/:id/submit", authenticateUser, submitReel);

export default router;
