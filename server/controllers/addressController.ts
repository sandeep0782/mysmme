import { Request, Response } from "express";
import Address from "../models/Address";
import { response } from "../utils/responseHandler";
import User from "../models/User";

export const getAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return response(res, 400, "User not found");
    }

    const user = await User.findById(userId).populate("addresses");

    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(
      res,
      200,
      "Addresses fetched successfully",
      user.addresses || [],
    );
  } catch (error) {
    console.error("Get address error:", error);
    return response(res, 500, "Error fetching addresses");
  }
};

export const createOrUpdateAddressByUserId = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.id;

    const {
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      addressId,
    } = req.body;

    if (!userId) {
      return response(res, 400, "User not found");
    }

    // Required fields based on your Address schema
    if (!addressLine1 || !city || !state || !pincode) {
      return response(
        res,
        400,
        "Address line, city, state and pincode are required",
      );
    }

    /* -------------------------------- */
    /* UPDATE EXISTING ADDRESS          */
    /* -------------------------------- */

    if (addressId) {
      const existingAddress = await Address.findOne({
        _id: addressId,
        user: userId,
      });

      if (!existingAddress) {
        return response(res, 404, "Address not found");
      }

      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2 || "";
      existingAddress.phoneNumber = phoneNumber || "";
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;
      existingAddress.country = country || "India";

      await existingAddress.save();

      return response(
        res,
        200,
        "Address updated successfully",
        existingAddress,
      );
    }

    /* -------------------------------- */
    /* CREATE NEW ADDRESS               */
    /* -------------------------------- */

    const newAddress = await Address.create({
      user: userId,
      addressLine1,
      addressLine2: addressLine2 || "",
      phoneNumber: phoneNumber || "",
      city,
      state,
      pincode,
      country: country || "India",
    });

    await User.findByIdAndUpdate(userId, {
      $push: {
        addresses: newAddress._id,
      },
    });

    return response(res, 201, "Address added successfully", newAddress);
  } catch (error) {
    console.error("Create/update address error:", error);

    return response(res, 500, "Error creating or updating address");
  }
};
