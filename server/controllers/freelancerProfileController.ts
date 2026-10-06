import { Request, Response } from "express";
import CreatorProfile from "../models/CreatorProfile";
import { response } from "../utils/responseHandler";

// ============================================================
// GET MY CREATOR PROFILE
// ============================================================

export const getMyCreatorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const profile = await CreatorProfile.findOne({
      user: userId,
    }).populate(
      "user",
      "name email phoneNumber profilePicture role isVerified",
    );

    if (!profile) {
      return response(res, 404, "Creator profile not found");
    }

    return response(res, 200, "Creator profile fetched successfully", profile);
  } catch (error) {
    console.error("GET CREATOR PROFILE ERROR:", error);

    return response(res, 500, "Unable to fetch creator profile");
  }
};

// ============================================================
// UPDATE MY CREATOR PROFILE
// ============================================================

export const updateMyCreatorProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const {
      bio,
      location,
      country,
      categories,
      languages,
      instagramUsername,
      expectedPrice,
    } = req.body;

    const profile = await CreatorProfile.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: {
          bio,
          location,
          country,
          categories,
          languages,
          instagramUsername,
          expectedPrice,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).populate("user", "name email phoneNumber profilePicture role isVerified");

    if (!profile) {
      return response(res, 404, "Creator profile not found");
    }

    return response(res, 200, "Creator profile updated successfully", profile);
  } catch (error) {
    console.error("UPDATE CREATOR PROFILE ERROR:", error);

    return response(res, 500, "Unable to update creator profile");
  }
};
