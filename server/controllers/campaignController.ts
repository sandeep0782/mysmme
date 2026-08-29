import { Request, Response } from "express";
import mongoose from "mongoose";
import Campaign from "../models/Campaign";
import { response } from "../utils/responseHandler";

const createCampaign = async (req: Request, res: Response) => {
  try {
    const {
      title,
      productName,
      productImage,
      category,
      description,
      payout,
      reelsRequired,
      deadline,
      estimatedReach,
      platforms,
      tags,
    } = req.body;

    if (
      !title ||
      !productName ||
      !productImage ||
      !category ||
      !description ||
      payout === undefined ||
      !deadline
    ) {
      return response(res, 400, "Please provide all required campaign fields");
    }

    const campaign = await Campaign.create({
      title,
      productName,
      productImage,
      category,
      description,
      payout,
      reelsRequired: reelsRequired ?? 1,
      deadline,
      estimatedReach: estimatedReach ?? "0",
      applicants: 0,
      platforms: platforms ?? [],
      tags: tags ?? [],
      acceptedBy: [],
    });

    return res.status(201).json(campaign);
  } catch (error) {
    console.error("createCampaign:", error);

    return response(res, 500, "Failed to create campaign");
  }
};

const getCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return response(res, 400, "Invalid campaign ID");
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return response(res, 404, "Campaign not found");
    }

    return res.status(200).json(campaign);
  } catch (error) {
    console.error("getCampaign:", error);

    return response(res, 500, "Failed to get campaign");
  }
};
const getAvailableCampaigns = async (req: Request, res: Response) => {
  try {
    const { search, category, sort = "recommended" } = req.query;

    const filter: any = {};

    // Exclude campaigns already accepted by the logged-in freelancer
    if (req.id) {
      filter.acceptedBy = {
        $ne: new mongoose.Types.ObjectId(req.id),
      };
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    let query = Campaign.find(filter);

    if (sort === "highest_payout") {
      query = query.sort({ payout: -1 });
    } else if (sort === "deadline") {
      query = query.sort({ deadline: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const campaigns = await query.lean();

    const formattedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      id: campaign._id.toString(),
    }));

    return res.status(200).json(formattedCampaigns);
  } catch (error) {
    console.error("getAvailableCampaigns:", error);

    return response(res, 500, "Failed to load campaigns");
  }
};

const getMyCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({
      acceptedBy: new mongoose.Types.ObjectId(req.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    const formattedCampaigns = campaigns.map((campaign) => ({
      ...campaign,
      id: campaign._id.toString(),
    }));

    return res.status(200).json(formattedCampaigns);
  } catch (error) {
    console.error("getMyCampaigns:", error);

    return response(res, 500, "Failed to load your campaigns");
  }
};

const acceptCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return response(res, 400, "Invalid campaign ID");
    }

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return response(res, 404, "Campaign not found");
    }

    const alreadyAccepted = campaign.acceptedBy.some(
      (userId) => userId.toString() === req.id,
    );

    if (alreadyAccepted) {
      return res.status(200).json({
        success: true,
        message: "Campaign already accepted",
        data: campaign,
      });
    }

    campaign.acceptedBy.push(new mongoose.Types.ObjectId(req.id));

    campaign.applicants += 1;

    await campaign.save();

    return res.status(200).json(campaign);
  } catch (error) {
    console.error("acceptCampaign:", error);

    return response(res, 500, "Failed to accept campaign");
  }
};

export {
  createCampaign,
  getCampaign,
  getAvailableCampaigns,
  getMyCampaigns,
  acceptCampaign,
};
