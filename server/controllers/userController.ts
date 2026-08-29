import { Request, Response, Router } from "express";
import { response } from "../utils/responseHandler";
import User from "../models/User";

const router = Router();

export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    if (!userId) {
      return response(res, 400, "User ID is required.");
    }
    const { name, email, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber },
      { returnDocument: "after", runValidators: true },
    ).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );
    if (!updatedUser) {
      return response(res, 404, "User not found.");
    }

    return response(
      res,
      200,
      "User profile updated successfully.",
      updatedUser,
    );
  } catch (error: any) {
    console.error("EDIT PROFILE ERROR:", error);
    return response(res, 500, error?.message || "Internal server error.");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return response(res, 200, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

// ============================================================
// ADD USER
// ============================================================

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, password, role, isActive, isVerified } =
      req.body;

    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (!name || !name.trim()) {
      return response(res, 400, "Name is required.");
    }

    if (!email || !email.trim()) {
      return response(res, 400, "Email is required.");
    }

    if (!password) {
      return response(res, 400, "Password is required.");
    }

    if (password.length < 6) {
      return response(res, 400, "Password must be at least 6 characters long.");
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ----------------------------------------------------------
    // CHECK EMAIL
    // ----------------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return response(res, 409, "Email is already registered.");
    }

    // ----------------------------------------------------------
    // CREATE USER
    // ----------------------------------------------------------

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber || undefined,
      password,
      role: role || "user",
      isVerified: isVerified !== undefined ? isVerified : false,
    });

    // ----------------------------------------------------------
    // REMOVE SENSITIVE DATA
    // ----------------------------------------------------------

    const createdUser = await User.findById(user._id).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );

    return response(res, 201, "User created successfully.", createdUser);
  } catch (error) {
    console.error("Add user error:", error);

    return response(res, 500, "Internal server error.", error);
  }
};

// ============================================================
// UPDATE USER
// ============================================================

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return response(res, 400, "User ID is required.");
    }

    const { name, email, phoneNumber, role, isActive, isVerified, password } =
      req.body;

    // ----------------------------------------------------------
    // FIND USER
    // ----------------------------------------------------------

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return response(res, 404, "User not found.");
    }

    // ----------------------------------------------------------
    // EMAIL CHECK
    // ----------------------------------------------------------

    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: userId },
      });

      if (emailExists) {
        return response(res, 409, "Email is already registered.");
      }
    }

    // ----------------------------------------------------------
    // UPDATE DATA
    // ----------------------------------------------------------

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      updateData.email = email.toLowerCase().trim();
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (isVerified !== undefined) {
      updateData.isVerified = isVerified;
    }

    if (password !== undefined && password !== "") {
      if (password.length < 6) {
        return response(
          res,
          400,
          "Password must be at least 6 characters long.",
        );
      }

      updateData.password = password;
    }

    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select(
      "-password -verificationToken -resetPasswordToken -resetPasswordExpires",
    );

    if (!updatedUser) {
      return response(res, 404, "User not found.");
    }

    return response(res, 200, "User updated successfully.", updatedUser);
  } catch (error: any) {
    console.error("Failed to save user:", error);

    if (error?.data) {
      console.error("API error data:", error.data);
    }

    if (error?.status) {
      console.error("API error status:", error.status);
    }

    const message =
      error?.data?.message ||
      error?.data?.error ||
      error?.error ||
      "Failed to save user. Please check the information and try again.";
  }
};

// ============================================================
// DELETE USER
// ============================================================

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return response(res, 400, "User ID is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, "User not found.");
    }

    await User.findByIdAndDelete(userId);

    return response(res, 200, "User deleted successfully.");
  } catch (error) {
    console.error("Delete user error:", error);

    return response(res, 500, "Internal server error.", error);
  }
};
