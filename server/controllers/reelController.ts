import { Request, Response } from "express";
import mongoose from "mongoose";

import ReelSubmission, { ReelStatus } from "../models/ReelSubmission";

import Campaign from "../models/Campaign";
import User from "../models/User";

/* =========================================================
   HELPERS
========================================================= */

function getUserId(req: Request): string | null {
  if (!req.id) {
    return null;
  }

  return String(req.id);
}

/* =========================================================
   EXPRESS PARAM HELPER
========================================================= */

function getParam(value: string | string[] | undefined): string | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

/* =========================================================
   POPULATE REEL
========================================================= */

async function populateReel(reelId: mongoose.Types.ObjectId) {
  const reel = await ReelSubmission.findById(reelId)
    .populate("campaignId", "title brand productName productImage category")
    .populate("freelancerId", "name email profilePicture")
    .lean();

  if (!reel) {
    return null;
  }

  return {
    ...reel,

    // Frontend-friendly ID
    id: String(reel._id),

    campaign: reel.campaignId,

    freelancer: reel.freelancerId,

    campaignId: (reel.campaignId as any)?._id
      ? String((reel.campaignId as any)._id)
      : String(reel.campaignId),

    freelancerId: (reel.freelancerId as any)?._id
      ? String((reel.freelancerId as any)._id)
      : String(reel.freelancerId),
  };
}
/* =========================================================
   GET MY REELS
   GET /api/reels/my
========================================================= */

export const getMyReels = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({
        success: false,
        message: "Invalid user ID.",
      });
      return;
    }

    /* =====================================================
       USER
    ===================================================== */

    const user = await User.findById(userId).select("_id role");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    if (user.role !== "freelancer") {
      res.status(403).json({
        success: false,
        message: "Only freelancers can access their reel submissions.",
      });
      return;
    }

    /* =====================================================
       REELS
    ===================================================== */

    const reels = await ReelSubmission.find({
      freelancerId: user._id,
    })
      .populate(
        "campaignId",
        "title brand productName productImage category payout reelsRequired deadline platforms",
      )
      .populate("freelancerId", "name email profilePicture")
      .sort({
        createdAt: -1,
      })
      .lean();

    const result = reels.map((reel: any) => ({
      ...reel,

      id: String(reel._id),

      campaign: reel.campaignId,

      freelancer: reel.freelancerId,

      campaignId: reel.campaignId?._id
        ? String(reel.campaignId._id)
        : String(reel.campaignId),

      freelancerId: reel.freelancerId?._id
        ? String(reel.freelancerId._id)
        : String(reel.freelancerId),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("getMyReels error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load your reels.",
    });
  }
};

/* =========================================================
   GET SINGLE REEL
   GET /api/reels/:id
========================================================= */

export const getMyReel = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const id = getParam(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Reel ID is required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid reel ID.",
      });
      return;
    }

    const reel = await ReelSubmission.findOne({
      _id: id,
      freelancerId: userId,
    })
      .populate(
        "campaignId",
        "title brand productName productImage category payout reelsRequired deadline platforms",
      )
      .populate("freelancerId", "name email profilePicture")
      .lean();

    if (!reel) {
      res.status(404).json({
        success: false,
        message: "Reel submission not found.",
      });
      return;
    }

    const result = {
      ...reel,

      campaign: reel.campaignId,

      freelancer: reel.freelancerId,

      campaignId: (reel.campaignId as any)?._id ?? reel.campaignId,

      freelancerId: (reel.freelancerId as any)?._id ?? reel.freelancerId,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("getMyReel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load reel.",
    });
  }
};

/* =========================================================
   CREATE REEL
   POST /api/reels
========================================================= */

export const createReel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({
        success: false,
        message: "Invalid user ID.",
      });
      return;
    }

    const {
      campaignId,
      title,
      caption,
      videoUrl,
      thumbnailUrl,
      instagramUrl,
      youtubeUrl,
      status,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!campaignId) {
      res.status(400).json({
        success: false,
        message: "Campaign ID is required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(String(campaignId))) {
      res.status(400).json({
        success: false,
        message: "Invalid campaign ID.",
      });
      return;
    }

    if (!title || !String(title).trim()) {
      res.status(400).json({
        success: false,
        message: "Reel title is required.",
      });
      return;
    }

    /* =====================================================
       USER
    ===================================================== */

    const user = await User.findById(userId).select("_id role");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    if (user.role !== "freelancer") {
      res.status(403).json({
        success: false,
        message: "Only freelancers can submit reels.",
      });
      return;
    }

    /* =====================================================
       CAMPAIGN
    ===================================================== */

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
      return;
    }

    /* =====================================================
       ACCEPTANCE CHECK
    ===================================================== */

    const hasAcceptedCampaign = campaign.acceptedBy.some(
      (acceptedUserId) => String(acceptedUserId) === String(userId),
    );

    if (!hasAcceptedCampaign) {
      res.status(403).json({
        success: false,
        message: "You must accept this campaign before submitting content.",
      });
      return;
    }

    /* =====================================================
       REEL LIMIT
    ===================================================== */

    const existingReels = await ReelSubmission.find({
      campaignId,
      freelancerId: userId,
    }).select("_id title status createdAt");

    console.log("EXISTING REELS:", existingReels);
    console.log("CAMPAIGN REELS REQUIRED:", campaign.reelsRequired);

    const existingReelCount = await ReelSubmission.countDocuments({
      campaignId,
      freelancerId: userId,
      status: {
        $ne: "rejected",
      },
    });

    if (existingReelCount >= campaign.reelsRequired) {
      res.status(400).json({
        success: false,
        message: `You can submit a maximum of ${campaign.reelsRequired} reel${
          campaign.reelsRequired > 1 ? "s" : ""
        } for this campaign.`,
      });
      return;
    }

    /* =====================================================
       STATUS
    ===================================================== */

    const reelStatus: ReelStatus =
      status === "submitted" ? "submitted" : "draft";

    /* =====================================================
       CREATE
    ===================================================== */

    const reel = await ReelSubmission.create({
      campaignId,

      freelancerId: userId,

      title: String(title).trim(),

      caption: caption !== undefined ? String(caption).trim() : undefined,

      videoUrl: videoUrl !== undefined ? String(videoUrl).trim() : undefined,

      thumbnailUrl:
        thumbnailUrl !== undefined ? String(thumbnailUrl).trim() : undefined,

      instagramUrl:
        instagramUrl !== undefined ? String(instagramUrl).trim() : undefined,

      youtubeUrl:
        youtubeUrl !== undefined ? String(youtubeUrl).trim() : undefined,

      status: reelStatus,

      submittedAt: reelStatus === "submitted" ? new Date() : undefined,
    });

    const populatedReel = await populateReel(reel._id);

    res.status(201).json(populatedReel);
  } catch (error) {
    console.error("createReel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create reel submission.",
    });
  }
};

/* =========================================================
   UPDATE REEL
   PATCH /api/reels/:id
========================================================= */

export const updateReel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const id = getParam(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Reel ID is required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid reel ID.",
      });
      return;
    }

    const reel = await ReelSubmission.findOne({
      _id: id,
      freelancerId: userId,
    });

    if (!reel) {
      res.status(404).json({
        success: false,
        message: "Reel submission not found.",
      });
      return;
    }

    /* =====================================================
       EDITABILITY
    ===================================================== */

    if (
      reel.status === "under_review" ||
      reel.status === "approved" ||
      reel.status === "published"
    ) {
      res.status(400).json({
        success: false,
        message: `A reel with status "${reel.status}" cannot be edited.`,
      });
      return;
    }

    const { title, caption, videoUrl, thumbnailUrl, instagramUrl, youtubeUrl } =
      req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        res.status(400).json({
          success: false,
          message: "Reel title cannot be empty.",
        });
        return;
      }

      reel.title = String(title).trim();
    }

    if (caption !== undefined) {
      reel.caption = String(caption).trim();
    }

    if (videoUrl !== undefined) {
      reel.videoUrl = String(videoUrl).trim();
    }

    if (thumbnailUrl !== undefined) {
      reel.thumbnailUrl = String(thumbnailUrl).trim();
    }

    if (instagramUrl !== undefined) {
      reel.instagramUrl = String(instagramUrl).trim();
    }

    if (youtubeUrl !== undefined) {
      reel.youtubeUrl = String(youtubeUrl).trim();
    }

    /* =====================================================
       CHANGES REQUESTED -> DRAFT
    ===================================================== */

    if (reel.status === "changes_requested") {
      reel.status = "draft";
    }

    await reel.save();

    const populatedReel = await populateReel(reel._id);

    res.status(200).json(populatedReel);
  } catch (error) {
    console.error("updateReel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update reel.",
    });
  }
};

/* =========================================================
   SUBMIT REEL
   POST /api/reels/:id/submit
========================================================= */

export const submitReel = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const id = getParam(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Reel ID is required.",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid reel ID.",
      });
      return;
    }

    /* =====================================================
       FIND REEL
    ===================================================== */

    const reel = await ReelSubmission.findOne({
      _id: id,
      freelancerId: userId,
    });

    if (!reel) {
      res.status(404).json({
        success: false,
        message: "Reel submission not found.",
      });
      return;
    }

    /* =====================================================
       STATUS CHECK
    ===================================================== */

    if (
      reel.status === "under_review" ||
      reel.status === "approved" ||
      reel.status === "published"
    ) {
      res.status(400).json({
        success: false,
        message: `This reel is already ${reel.status.replace("_", " ")}.`,
      });
      return;
    }

    /* =====================================================
       REQUIRED CONTENT
    ===================================================== */

    if (!reel.title?.trim()) {
      res.status(400).json({
        success: false,
        message: "Reel title is required.",
      });
      return;
    }

    if (!reel.videoUrl?.trim()) {
      res.status(400).json({
        success: false,
        message: "Video URL is required before submission.",
      });
      return;
    }

    /* =====================================================
       CAMPAIGN
    ===================================================== */

    const campaign = await Campaign.findById(reel.campaignId);

    if (!campaign) {
      res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
      return;
    }

    /* =====================================================
       ACCEPTANCE CHECK
    ===================================================== */

    const hasAcceptedCampaign = campaign.acceptedBy.some(
      (acceptedUserId) => String(acceptedUserId) === String(userId),
    );

    if (!hasAcceptedCampaign) {
      res.status(403).json({
        success: false,
        message: "You are no longer an accepted freelancer for this campaign.",
      });
      return;
    }

    /* =====================================================
       SUBMIT
    ===================================================== */

    reel.status = "submitted";
    reel.submittedAt = new Date();

    await reel.save();

    const populatedReel = await populateReel(reel._id);

    res.status(200).json(populatedReel);
  } catch (error) {
    console.error("submitReel error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit reel.",
    });
  }
};
