import express from "express";

import {
  getSocialAccounts,
  createSocialAccount,
  syncInstagramStats,
  deleteSocialAccount,
} from "../controllers/freelancerSocialController";

import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

/* ================================================================
   GET CONNECTED SOCIAL ACCOUNTS
================================================================ */

router.get("/social-account", authenticateUser, getSocialAccounts);

/* ================================================================
   CREATE SOCIAL ACCOUNT
================================================================ */

router.post("/social-account", authenticateUser, createSocialAccount);

/* ================================================================
   SYNC INSTAGRAM STATS
================================================================ */

router.post(
  "/social-account/:accountId/sync",
  authenticateUser,
  syncInstagramStats,
);

/* ================================================================
   DELETE / DISCONNECT SOCIAL ACCOUNT
================================================================ */

router.delete(
  "/social-account/:accountId",
  authenticateUser,
  deleteSocialAccount,
);

export default router;
