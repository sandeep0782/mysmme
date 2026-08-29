import { Router } from "express";

import {
  getAvailableCampaigns,
  getMyCampaigns,
  getCampaign,
  acceptCampaign,
  createCampaign,
} from "../controllers/campaignController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateUser, createCampaign);

router.get("/", authenticateUser, getAvailableCampaigns);

router.get("/my", authenticateUser, getMyCampaigns);

router.get("/:id", authenticateUser, getCampaign);

router.post("/:id/accept", authenticateUser, acceptCampaign);

export default router;
