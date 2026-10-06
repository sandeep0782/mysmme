import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import CreatorProfile from "../models/CreatorProfile";
import { response } from "../utils/responseHandler";

// ============================================================
// SEARCH USERS
// ============================================================

export const searchUsers = async (req: Request, res: Response) => {
  console.log("SEARCH USERS CONTROLLER HIT");
  console.log("SEARCH USER ROLE:", req.role);

  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return response(res, 400, "Search value is required");
    }

    const conditions: any[] = [
      {
        name: {
          $regex: q,
          $options: "i",
        },
      },
      {
        email: {
          $regex: q,
          $options: "i",
        },
      },
    ];

    if (mongoose.Types.ObjectId.isValid(q)) {
      conditions.push({
        _id: q,
      });
    }

    const users = await User.find({
      $or: conditions,
    })
      .select(
        "name email phoneNumber profilePicture role isVerified isActive createdAt",
      )
      .sort({
        createdAt: -1,
      })
      .limit(50);

    return response(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);

    return response(res, 500, "Unable to search users");
  }
};

// ============================================================
// UPDATE USER ROLE
// ============================================================

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 400, "Invalid user ID");
    }

    const allowedRoles = ["user", "freelancer", "seller"];

    if (!allowedRoles.includes(role)) {
      return response(res, 400, "Invalid role");
    }

    const user = await User.findById(id);

    if (!user) {
      return response(res, 404, "User not found");
    }

    if (user.role === "admin" || user.role === "super-admin") {
      return response(
        res,
        403,
        "Admin roles cannot be modified from this endpoint",
      );
    }

    user.role = role;

    await user.save();

    if (role === "freelancer") {
      await CreatorProfile.findOneAndUpdate(
        {
          user: user._id,
        },
        {
          $setOnInsert: {
            user: user._id,
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );
    }

    return response(res, 200, "User role updated successfully", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);

    return response(res, 500, "Unable to update user role");
  }
};
